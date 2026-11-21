// Kiểm chứng tích hợp bằng hai tiến trình riêng và trình duyệt thật.
// Chạy sau dotnet build. Cần playwright + Chromium/Edge ở máy kiểm thử.
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const { spawn } = require("node:child_process");
const { createHash } = require("node:crypto");
const { chromium } = require(process.env.CLINICQUEUE_PLAYWRIGHT || "playwright");

const root = path.resolve(__dirname, "..");
const apiDir = path.join(root, "src/ClinicQueue.AppointmentApi");
const clientDir = path.join(root, "src/ClinicQueue.Client");
const apiUrl = "http://localhost:15100";
const webUrl = "http://localhost:15200";
const output = path.join(root, "artifacts/client-check");
fs.mkdirSync(output, { recursive: true });
let api, client, browser;
const passed = [];
const cases = [];
const expectedDoctorCount = Number(process.env.CLINICQUEUE_EXPECTED_DOCTORS || 4);
const clientHash = createHash("sha256");
for (const file of ["Program.cs", "wwwroot/app.js", "wwwroot/index.html", "wwwroot/styles.css"]) {
    clientHash.update(file).update(fs.readFileSync(path.join(clientDir, file)));
}
const clientSourceHash = clientHash.digest("hex");
function recordCase(name, request, response, expectedStatus) {
    assert.equal(response.status, expectedStatus, name);
    cases.push({ name, expectedStatus, result: "PASS", request, response });
}
async function observe(name, endpoint, expectedStatus, options = {}) {
    const url = new URL(endpoint, apiUrl).href;
    const response = await fetch(url, options);
    const text = await response.text();
    let body;
    try { body = text ? JSON.parse(text) : ""; } catch { body = text; }
    recordCase(name, {
        method: options.method || "GET", url,
        ...(options.body ? { body: JSON.parse(options.body) } : {})
    }, {
        status: response.status,
        contentType: response.headers.get("content-type"),
        location: response.headers.get("location"), body
    }, expectedStatus);
    return body;
}
function pass(name) { passed.push(name); console.log("PASS " + name); }
const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

async function assertFree(url) {
    try {
        await fetch(url, { signal: AbortSignal.timeout(1000) });
    } catch { return; }
    throw new Error("Cổng kiểm thử đang có dịch vụ; không tác động: " + url);
}
function launch(dir, name, url, extraEnv) {
    const dll = process.env.CLINICQUEUE_BUILD_ROOT
        ? path.join(process.env.CLINICQUEUE_BUILD_ROOT, "bin", name, "debug", name + ".dll")
        : path.join(dir, "bin/Debug/net10.0", name + ".dll");
    const child = spawn("dotnet", [dll, "--urls", url], {
        cwd: dir, windowsHide: true, stdio: ["ignore", "pipe", "pipe"],
        env: { ...process.env, ASPNETCORE_ENVIRONMENT: "Development", ...extraEnv }
    });
    child.output = "";
    child.stdout.on("data", data => { child.output += data; });
    child.stderr.on("data", data => { child.output += data; });
    child.on("error", error => { child.launchError = error; });
    return child;
}
async function ready(child, url) {
    for (let i = 0; i < 100; i++) {
        if (child.launchError) throw child.launchError;
        if (child.exitCode !== null) throw new Error(child.output);
        try { if ((await fetch(url)).ok) return; } catch {}
        await delay(100);
    }
    throw new Error("Không khởi động được " + url + "\n" + child.output);
}
async function stop(child) {
    if (!child || child.exitCode !== null) return;
    const exited = new Promise(resolve => child.once("exit", resolve));
    child.kill();
    await exited;
}
function startApi() {
    return launch(apiDir, "ClinicQueue.AppointmentApi", apiUrl, {
        Cors__AllowedOrigins__0: webUrl, ASPNETCORE_ENVIRONMENT: "Production"
    });
}

(async () => {
    await assertFree(apiUrl);
    await assertFree(webUrl);
    api = startApi();
    client = launch(clientDir, "ClinicQueue.Client", webUrl, { Api__BaseUrl: apiUrl });
    await Promise.all([ready(api, apiUrl), ready(client, webUrl)]);
    assert.notEqual(api.pid, client.pid);
    assert.equal((await fetch(apiUrl).then(r => r.json())).service, "ClinicQueue.AppointmentApi");
    assert.equal((await fetch(webUrl + "/doctors")).status, 404);
    assert.equal((await fetch(apiUrl + "/app.js")).status, 404);
    pass("Hai PID/cổng riêng; Client không chứa route nghiệp vụ, API không phục vụ giao diện");

    const preflight = await fetch(apiUrl + "/appointments", {
        method: "OPTIONS", headers: {
            Origin: webUrl, "Access-Control-Request-Method": "POST",
            "Access-Control-Request-Headers": "content-type"
        }
    });
    assert.equal(preflight.status, 204);
    assert.equal(preflight.headers.get("access-control-allow-origin"), webUrl);
    assert.match(preflight.headers.get("access-control-allow-methods"), /POST/);
    const denied = await fetch(apiUrl + "/doctors", { headers: { Origin: "http://localhost:15999" } });
    assert.equal(denied.headers.get("access-control-allow-origin"), null);
    pass("CORS cho phép Web đã cấu hình và POST JSON; không cho origin lạ đọc dữ liệu");

    await observe("GET gốc JSON service/status", "/", 200);
    const doctors = await observe("GET toàn bộ bác sĩ", "/doctors", 200);
    assert.equal(doctors.length, expectedDoctorCount);
    const detail = await observe("GET chi tiết bác sĩ", "/doctors/1", 200);
    assert.deepEqual(detail, doctors.find(d => d.id === 1));
    assert.equal((await observe("GET keyword không phân biệt hoa/thường", "/doctors?keyword=%20nGuYeN%20", 200)).length, 1);
    assert.deepEqual(await observe("GET keyword rỗng giữ danh sách", "/doctors?keyword=%20%20", 200), doctors);
    assert.deepEqual(await observe("GET keyword không khớp", "/doctors?keyword=zzzz", 200), []);
    await observe("GET bác sĩ không tồn tại", "/doctors/999", 404);
    await observe("GET bác sĩ sai định dạng", "/doctors/abc", 404);
    const initialSlots = await observe("GET slot trước đặt lịch", "/doctors/1/slots", 200);
    assert.deepEqual(initialSlots.map(s => [s.id, s.doctorId, s.remainingSeats]), [[1, 1, 3]]);
    assert.deepEqual(await observe("GET bác sĩ có thật nhưng không có slot", "/doctors/3/slots", 200), []);
    await observe("GET slot bác sĩ không tồn tại", "/doctors/999/slots", 404);
    await observe("GET slot bác sĩ sai định dạng", "/doctors/abc/slots", 404);
    pass("GET chi tiết, query keyword và phân biệt 200[] với 404");

    browser = await chromium.launch({ channel: "msedge", headless: true });
    const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
    const pageErrors = [];
    page.on("pageerror", error => pageErrors.push(error.message));
    await page.goto(webUrl);
    await page.waitForFunction(count => document.querySelector("#doctor").options.length === count + 1, expectedDoctorCount);
    await page.screenshot({ path: path.join(output, "landing-desktop.png"), fullPage: true });
    await page.locator(".hero a[href='#dat-lich']").click();
    assert.equal(new URL(page.url()).hash, "#dat-lich");
    await page.fill("#keyword", "nGuYeN");
    await page.click("#search");
    await page.waitForFunction(() => document.querySelector("#doctor").options.length === 2);
    assert.match(await page.locator("#doctor").innerText(), /Nguyen Van An/);
    await page.fill("#keyword", "zzzz");
    await page.click("#search");
    await page.waitForFunction(() => document.querySelector("#notice").textContent.includes("Không tìm thấy"));
    await page.click("#reload");
    await page.waitForFunction(count => document.querySelector("#doctor").options.length === count + 1, expectedDoctorCount);
    pass("Web tìm theo keyword, xử lý danh sách rỗng và tải lại toàn bộ");

    // GT02 BT4: mô phỏng chọn ID không tồn tại từ client, không gửi POST.
    await page.evaluate(() => document.querySelector("#doctor").add(new Option("Doctor missing", "999")));
    await page.selectOption("#doctor", "999");
    await page.waitForFunction(() => document.querySelector("#notice").textContent.includes("HTTP 404"));
    assert.match(await page.locator("#notice").innerText(), /DOCTOR_NOT_FOUND/);
    assert.equal(await page.locator("#slot").inputValue(), "");
    await page.click("#reload");
    await page.waitForFunction(count => document.querySelector("#doctor").options.length === count + 1, expectedDoctorCount);
    pass("Client GET bác sĩ không tồn tại hiển thị Code/Message/404, không tiếp tục đặt");

    await page.selectOption("#doctor", "1");
    await page.waitForFunction(() => document.querySelector("#slot").options.length === 2);
    assert.match(await page.locator("#slot").innerText(), /Còn 3 chỗ/);
    assert.match(await page.locator("#doctor-detail").innerText(), /Nguyen Van An.*Noi tong quat/);
    await page.selectOption("#slot", "1");
    await page.fill("#patient-name", "   ");
    await page.click("#book");
    await page.waitForFunction(() => document.querySelector("#notice").textContent.includes("HTTP 400"));
    pass("Web hiển thị lỗi 400 từ server khi tên chỉ có khoảng trắng");

    await page.fill("#patient-name", "Nguoi Hoc Demo");
    const postResponse = page.waitForResponse(r => r.url() === apiUrl + "/appointments" && r.request().method() === "POST");
    await page.click("#book");
    const created = await postResponse;
    assert.equal(created.status(), 201);
    const createdDto = await created.json();
    const createdLocation = created.headers()["location"];
    recordCase("Browser POST lịch hợp lệ", {
        method: "POST", url: created.url(), body: created.request().postDataJSON()
    }, { status: created.status(), location: createdLocation, body: createdDto }, 201);
    assert.equal(createdLocation, "/appointments/" + createdDto.id);
    const readBack = await observe("GET theo Location đúng DTO vừa tạo", createdLocation, 200);
    assert.deepEqual(readBack, createdDto);
    assert.deepEqual([readBack.patientName, readBack.doctorId, readBack.slotId, readBack.status, readBack.queueNumber],
        ["Nguoi Hoc Demo", 1, 1, "PendingNumber", null]);
    // Tuần 3 đổi câu thông báo sau đặt lịch; chạy với Numbering__SimulatedDelaySeconds lớn để giữ PendingNumber.
    await page.waitForFunction(() => document.querySelector("#notice").textContent.startsWith("Đã đặt lịch"));
    const appointmentId = await page.locator("#result-id").innerText();
    assert.match(appointmentId, /^[0-9a-f-]{36}$/);
    assert.match(await page.locator("#slot").innerText(), /Còn 2 chỗ/);
    assert.equal(await page.locator("#result-number").innerText(), "Chưa được cấp");
    assert.equal(await page.locator("#result-status").innerText(), "Đang chờ cấp số");
    pass("Browser GET bác sĩ/slot → POST 201 → đọc Location qua CORS → GET lịch; ghế 3→2");

    const mobile = await browser.newPage({ viewport: { width: 390, height: 844 } });
    mobile.on("pageerror", error => pageErrors.push(error.message));
    await mobile.goto(webUrl);
    await mobile.waitForFunction(() => !document.querySelector("#lookup-fields").disabled);
    await mobile.screenshot({ path: path.join(output, "landing-mobile.png"), fullPage: true });
    await mobile.locator(".hero a[href='#tra-cuu']").click();
    assert.equal(new URL(mobile.url()).hash, "#tra-cuu");
    const lookup = mobile.locator("#lookup-form");
    const lookupNotice = mobile.locator("#lookup-notice");
    const submitCode = async code => {
        await lookup.locator("#appointment-code").fill(code);
        await lookup.getByRole("button", { name: "Tra cứu", exact: true }).click();
    };
    await submitCode("sai-dinh-dang");
    assert.match(await lookupNotice.innerText(), /chưa đúng định dạng/);
    await submitCode("00000000-0000-0000-0000-000000000000");
    await mobile.waitForFunction(() => document.querySelector("#lookup-notice").textContent.startsWith("Không tìm thấy"));
    await submitCode(" " + appointmentId + " ");
    await mobile.waitForFunction(() => !document.querySelector("#appointment").hidden);
    assert.equal(await mobile.locator("#result-id").innerText(), appointmentId);
    assert.equal(await mobile.locator("#result-status").innerText(), "Đang chờ cấp số");
    assert.equal(await mobile.locator("#result-number").innerText(), "Chưa được cấp");
    await mobile.close();
    pass("CTA điều hướng đúng; tra cứu mã từ trình duyệt mới, phân biệt sai định dạng và lịch không tồn tại");

    // Các yêu cầu sai đi qua fetch thật từ origin Web.
    const invalid = [
        [{ patientName: " ", doctorId: 1, slotId: 1 }, 400, "INVALID_APPOINTMENT"],
        [{ patientName: "Demo", doctorId: 0, slotId: 1 }, 400, "INVALID_APPOINTMENT"],
        [{ patientName: "Demo", doctorId: 1, slotId: 0 }, 400, "INVALID_APPOINTMENT"],
        [{ patientName: "Demo", doctorId: 999, slotId: 1 }, 404, "DOCTOR_NOT_FOUND"],
        [{ patientName: "Demo", doctorId: 1, slotId: 999 }, 404, "SLOT_NOT_FOUND"],
        [{ patientName: "Demo", doctorId: 2, slotId: 1 }, 400, "SLOT_DOCTOR_MISMATCH"],
        [{ patientName: "Demo", doctorId: 1, slotId: 2 }, 409, "SLOT_FULL"]
    ];
    const beforeSlots = await observe("GET chỗ sau đặt, trước các POST lỗi", "/doctors/1/slots", 200);
    const beforeDoctor2 = await observe("GET chỗ bác sĩ 2 trước lỗi", "/doctors/2/slots", 200);
    for (const [body, status, code] of invalid) {
        const actual = await page.evaluate(async ({ url, body }) => {
            const r = await fetch(url, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
            return { status: r.status, data: await r.json() };
        }, { url: apiUrl + "/appointments", body });
        assert.equal(actual.status, status);
        assert.equal(actual.data.code, code);
        recordCase("POST lỗi " + code + " " + JSON.stringify(body), {
            method: "POST", url: apiUrl + "/appointments", body
        }, { status: actual.status, body: actual.data }, status);
    }
    assert.deepEqual(await observe("GET chỗ bác sĩ1 sau lỗi", "/doctors/1/slots", 200), beforeSlots);
    assert.deepEqual(await observe("GET chỗ bác sĩ2 sau lỗi", "/doctors/2/slots", 200), beforeDoctor2);
    await observe("POST JSON sai kiểu doctorId: binding chặn trước handler", "/appointments", 400, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ patientName: "Demo", doctorId: "abc", slotId: 1 })
    });
    const missing = await observe("GET GUID đúng dạng nhưng lịch không có", "/appointments/00000000-0000-0000-0000-000000000000", 404);
    assert.equal(missing.code, "APPOINTMENT_NOT_FOUND");
    assert.equal(await observe("GET ID lịch sai dạng: routing không vào handler", "/appointments/abc", 404), "");
    pass("7 nhánh lỗi POST 400/404/409 và 2 GET lỗi; lỗi không làm giảm chỗ");

    await page.selectOption("#doctor", "3");
    await page.waitForFunction(() => !document.querySelector("#booking-fields").disabled);
    assert.match(await page.locator("#slot").innerText(), /chưa có khung giờ/);
    pass("Đổi bác sĩ xóa slot cũ; trạng thái không còn chỗ hiển thị rõ");

    // 201 vẫn phải giữ ID nếu GET lại mất kết nối; không POST tự động lần hai.
    await page.selectOption("#doctor", "1");
    await page.waitForFunction(() => document.querySelector("#slot").options.length === 2);
    await page.selectOption("#slot", "1");
    let postCount = 0;
    page.on("request", req => { if (req.method() === "POST" && req.url() === apiUrl + "/appointments") postCount++; });
    await page.route(apiUrl + "/appointments/*", route => route.abort());
    await page.click("#book");
    await page.waitForFunction(() => document.querySelector("#notice").textContent.startsWith("Lịch đã được tạo."));
    assert.equal(postCount, 1);
    const savedId = await page.locator("#result-id").innerText();
    assert.notEqual(savedId, appointmentId);
    await page.unroute(apiUrl + "/appointments/*");
    await page.click("#read-appointment");
    await page.waitForFunction(() => document.querySelector("#lookup-notice").textContent.startsWith("Đã đọc lại lịch hẹn"));
    pass("POST 201 + GET lại lỗi vẫn giữ ID, không gửi POST lại; nút đọc lại khôi phục được");

    await page.selectOption("#slot", "1");
    await page.fill("#patient-name", "Body Recovery");
    await page.route(apiUrl + "/appointments", async route => {
        const response = await route.fetch();
        await route.fulfill({ response, body: "{" });
    });
    await page.click("#book");
    await page.waitForFunction(() => document.querySelector("#notice").textContent.startsWith("Lịch đã được tạo."), null, { timeout: 5000 });
    assert.equal(postCount, 2);
    await page.unroute(apiUrl + "/appointments");
    await page.click("#read-appointment");
    await page.waitForFunction(() => document.querySelector("#result-name").textContent === "Body Recovery");
    assert.equal(postCount, 2);
    await page.waitForFunction(() => !document.querySelector("#booking-fields").disabled);
    assert.match(await page.locator("#slot").innerText(), /chưa có khung giờ/);
    pass("POST 201 với JSON hỏng vẫn giữ Location và đọc lại được, không tự POST lần hai");

    await page.screenshot({ path: path.join(output, "desktop.png"), fullPage: true });
    await page.setViewportSize({ width: 390, height: 844 });
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth), true);
    await page.screenshot({ path: path.join(output, "mobile.png"), fullPage: true });
    assert.deepEqual(pageErrors, []);
    pass("Desktop/mobile không tràn ngang; không có lỗi JavaScript chưa xử lý");

    const beforeRestart = await observe("GET lịch tồn tại ngay trước restart", "/appointments/" + savedId, 200);
    assert.equal(beforeRestart.id, savedId);
    await stop(api);
    await page.reload();
    await page.waitForFunction(() => document.querySelector("#notice").dataset.error === "true");
    assert.equal(await page.locator(".hero a[href='#dat-lich']").isVisible(), true);
    assert.match(await page.locator("#notice").innerText(), /Không kết nối/);
    pass("API dừng: Web vẫn phục vụ trang và báo lỗi kết nối");

    api = startApi();
    await ready(api, apiUrl);
    await observe("GET cùng ID sau restart: lịch RAM đã mất", "/appointments/" + savedId, 404);
    const resetSlots = await observe("GET slot sau restart: seed phục hồi", "/doctors/1/slots", 200);
    assert.equal(resetSlots[0].remainingSeats, 3);
    await page.click("#reload");
    await page.waitForFunction(count => document.querySelector("#doctor").options.length === count + 1, expectedDoctorCount);
    pass("Restart API: lịch RAM mất, ghế về 3; Web tải lại và kết nối được");
    const results = {
        time: new Date().toISOString(), apiUrl, webUrl, environment: "API Production / Web Development",
        doctorCount: expectedDoctorCount, clientSourceHash, passed, checks: passed.length, cases
    };
    fs.writeFileSync(path.join(output, "results.json"), JSON.stringify(results, null, 2));
    if (expectedDoctorCount === 3) {
        fs.writeFileSync(path.join(output, "baseline-three-doctors.json"), JSON.stringify({
            time: results.time, doctorCount: expectedDoctorCount, clientSourceHash, checks: passed.length
        }, null, 2));
    }
    if (process.env.CLINICQUEUE_CAPTURE_EVIDENCE === "1") {
        const baseline = JSON.parse(fs.readFileSync(path.join(output, "baseline-three-doctors.json"), "utf8"));
        assert.equal(baseline.clientSourceHash, clientSourceHash);
        assert.equal(expectedDoctorCount, 4);
        results.newFixtureProof = { before: baseline, after: { doctorCount: expectedDoctorCount, clientSourceHash },
            conclusion: "3→4 bác sĩ chỉ đổi seed API; mã Client giữ cùng SHA256" };
        const evidenceDir = path.join(root, "docs/weekly/evidence/week-02");
        fs.mkdirSync(evidenceDir, { recursive: true });
        fs.writeFileSync(path.join(evidenceDir, "http-cases.json"), JSON.stringify(results, null, 2));
        for (const name of ["desktop.png", "mobile.png"]) {
            fs.copyFileSync(path.join(output, name), path.join(evidenceDir, name));
        }
        const lines = ["# Minh chứng HTTP tuần 2", "", "Sinh từ verify-client.cjs; dữ liệu giả, yêu cầu HTTP thực tế.",
            "", "Lần chạy: " + results.time, "", "API test: " + apiUrl + "; Web test: " + webUrl + ".", "",
            "| Ca | Yêu cầu | Mong đợi / thực tế | Kết quả |", "|---|---|---|---|"];
        cases.forEach((item, index) => lines.push("| " + (index + 1) + " | " + item.request.method + " " +
            new URL(item.request.url).pathname + new URL(item.request.url).search + " | " +
            item.expectedStatus + " / " + item.response.status + " | PASS |"));
        lines.push("", "## Chi tiết request/response", "");
        cases.forEach((item, index) => {
            lines.push("### " + (index + 1) + ". " + item.name, "",
                "```http", item.request.method + " " + item.request.url,
                ...(item.request.body ? ["Content-Type: application/json", "", JSON.stringify(item.request.body, null, 2)] : []),
                "```", "", "```http", "HTTP " + item.response.status,
                ...(item.response.location ? ["Location: " + item.response.location] : []), "",
                typeof item.response.body === "string" ? (item.response.body || "(body rỗng)") : JSON.stringify(item.response.body, null, 2),
                "```", "");
        });
        lines.push("## Bài tập 2: dữ liệu mới, client không sửa", "",
            "Trước: 3 bác sĩ; sau: 4 bác sĩ. Hai lượt chạy cùng hash Client: `" + clientSourceHash + "`.",
            "Đối chiếu thời gian/hash trong http-cases.json. Các kiểm tra browser dùng số lượng dữ liệu trả về; không hardcode option bác sĩ trong app.js.",
            "", "## Minh chứng client", "", "![Desktop](desktop.png)", "", "![Mobile](mobile.png)", "",
            "Lịch RAM mất sau restart được chứng minh bằng cùng ID ở các ca cuối. Đây là kết quả agent chạy; không giả làm bài tự thực hiện của người học.");
        fs.writeFileSync(path.join(evidenceDir, "README.md"), lines.join("\n"));
    }
    console.log("Completed " + passed.length + " integration checks.");
})().catch(error => {
    console.error(error);
    process.exitCode = 1;
}).finally(async () => {
    if (browser) await browser.close();
    await Promise.all([stop(api), stop(client)]);
});
