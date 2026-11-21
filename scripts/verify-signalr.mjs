// Kiểm thử tích hợp tuần 3 (SignalR): REST + hub + nhóm + CORS + cấp số mô phỏng.
// Cần API đang chạy và một thư mục đã cài @microsoft/signalr (Node), ví dụ:
//   npm install @microsoft/signalr@10.0.11 --prefix <thư-mục-tạm>
//   node scripts/verify-signalr.mjs <thư-mục-tạm> http://localhost:15100 http://localhost:15200
// Tham số: <thư mục chứa node_modules/@microsoft/signalr> <apiBase> <webOrigin được CORS cho phép>
import { createRequire } from "node:module";
import path from "node:path";

const [pkgDir, apiBase = "http://localhost:15100", webOrigin = "http://localhost:15200"] = process.argv.slice(2);
const require = createRequire(path.join(pkgDir, "package.json"));
const signalR = require("@microsoft/signalr");

const results = [];
const check = (id, name, expected, actual, pass) => {
    results.push({ id, name, expected, actual, pass: Boolean(pass) });
};
const sleep = ms => new Promise(r => setTimeout(r, ms));

async function post(body) {
    const res = await fetch(`${apiBase}/appointments`, {
        method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body)
    });
    return { status: res.status, location: res.headers.get("location"), data: await res.json() };
}

function connect(transport) {
    const conn = new signalR.HubConnectionBuilder()
        .withUrl(`${apiBase}/hubs/appointments`, transport ? { transport } : {})
        .configureLogging(signalR.LogLevel.None)
        .build();
    const received = [];
    conn.on("AppointmentStatusChanged", m => received.push(m));
    return { conn, received };
}

// T1 health
{
    const res = await fetch(`${apiBase}/`);
    const data = await res.json();
    check("T1", "GET / vẫn chạy", "200 running", `${res.status} ${data.status}`, res.status === 200 && data.status === "running");
}

// T2 negotiate
{
    const res = await fetch(`${apiBase}/hubs/appointments/negotiate?negotiateVersion=1`, { method: "POST" });
    const data = await res.json();
    const transports = (data.availableTransports ?? []).map(t => t.transport);
    check("T2", "POST negotiate trả connectionId và 3 kiểu truyền", "200; WebSockets, ServerSentEvents, LongPolling",
        `${res.status}; ${transports.join(", ")}; connectionId=${data.connectionId ? "có" : "không"}`,
        res.status === 200 && data.connectionId && transports.length === 3);
}

// T3/T4 CORS preflight
for (const [id, origin, shouldAllow] of [["T3", webOrigin, true], ["T4", "http://evil.localhost:9999", false]]) {
    const res = await fetch(`${apiBase}/hubs/appointments/negotiate?negotiateVersion=1`, {
        method: "OPTIONS",
        headers: {
            Origin: origin,
            "Access-Control-Request-Method": "POST",
            "Access-Control-Request-Headers": "x-requested-with,x-signalr-user-agent"
        }
    });
    const allowOrigin = res.headers.get("access-control-allow-origin");
    const allowCred = res.headers.get("access-control-allow-credentials");
    const allowHeaders = res.headers.get("access-control-allow-headers");
    const actual = `${res.status}; origin=${allowOrigin}; credentials=${allowCred}; headers=${allowHeaders}`;
    check(id, shouldAllow ? "Preflight negotiate từ Web origin được phép" : "Preflight từ origin lạ bị từ chối",
        shouldAllow ? "204; origin khớp; credentials=true; có 2 header SignalR" : "không có Access-Control-Allow-Origin",
        actual,
        shouldAllow
            ? res.status === 204 && allowOrigin === origin && allowCred === "true"
              && /x-requested-with/i.test(allowHeaders ?? "") && /x-signalr-user-agent/i.test(allowHeaders ?? "")
            : allowOrigin === null);
}

// T5..T9 nhóm và cấp số
const a = connect();                                        // WebSockets (mặc định)
const b = connect(signalR.HttpTransportType.ServerSentEvents);
const c = connect(signalR.HttpTransportType.LongPolling);    // không theo dõi lịch nào
await Promise.all([a.conn.start(), b.conn.start(), c.conn.start()]);
check("T5", "Ba client kết nối bằng 3 kiểu truyền khác nhau", "Connected x3",
    [a, b, c].map(x => x.conn.state).join(", "), [a, b, c].every(x => x.conn.state === "Connected"));

const p1 = await post({ patientName: "Benh nhan A", doctorId: 1, slotId: 1 });
const p2 = await post({ patientName: "Benh nhan B", doctorId: 2, slotId: 3 });
check("T6", "POST trả 201 ngay, trạng thái PendingNumber, chưa có số", "201; PendingNumber; null; có Location",
    `${p1.status}; ${p1.data.status}; ${p1.data.queueNumber}; Location=${p1.location}`,
    p1.status === 201 && p1.data.status === "PendingNumber" && p1.data.queueNumber === null && p1.location);

await a.conn.invoke("WatchAppointment", p1.data.id);
await b.conn.invoke("WatchAppointment", p2.data.id.toUpperCase()); // chữ hoa vẫn vào đúng nhóm nhờ tham số Guid
await sleep(4000);

const aIds = a.received.map(m => m.appointmentId);
const bIds = b.received.map(m => m.appointmentId);
check("T7", "Client A chỉ nhận bản tin của lịch A", `1 tin, ${p1.data.id.slice(0, 8)}…, Queued, số 1`,
    `${a.received.length} tin: ${a.received.map(m => `${m.appointmentId.slice(0, 8)}… ${m.status} số ${m.queueNumber}`).join("; ")}`,
    a.received.length === 1 && aIds[0] === p1.data.id && a.received[0].status === "Queued" && a.received[0].queueNumber === 1);
check("T8", "Client B (theo dõi bằng mã chữ hoa) chỉ nhận bản tin của lịch B", `1 tin, ${p2.data.id.slice(0, 8)}…, Queued, số 1`,
    `${b.received.length} tin: ${b.received.map(m => `${m.appointmentId.slice(0, 8)}… ${m.status} số ${m.queueNumber}`).join("; ")}`,
    b.received.length === 1 && bIds[0] === p2.data.id && b.received[0].queueNumber === 1);
check("T9", "Client C không theo dõi lịch nào thì không nhận gì", "0 tin", `${c.received.length} tin`, c.received.length === 0);

// T10 REST là nguồn trạng thái gốc
{
    const res = await fetch(`${apiBase}/appointments/${p1.data.id}`);
    const data = await res.json();
    check("T10", "GET lại lịch A sau thông báo", "200; Queued; số 1; updatedAt > createdAt",
        `${res.status}; ${data.status}; số ${data.queueNumber}; ${data.updatedAt > data.createdAt}`,
        res.status === 200 && data.status === "Queued" && data.queueNumber === 1 && data.updatedAt > data.createdAt);
}

// T11 số tăng theo bác sĩ
{
    const p3 = await post({ patientName: "Benh nhan C", doctorId: 1, slotId: 1 });
    await c.conn.invoke("WatchAppointment", p3.data.id);
    await sleep(4000);
    const m = c.received.at(-1);
    check("T11", "Lịch thứ hai của bác sĩ 1 nhận số 2 (Long Polling)", "Queued số 2",
        m ? `${m.status} số ${m.queueNumber}` : "không nhận", m?.status === "Queued" && m?.queueNumber === 2);
}

// T12 mã sai định dạng
{
    let error = "";
    try { await a.conn.invoke("WatchAppointment", "khong-phai-guid"); } catch (e) { error = e.message; }
    check("T12", "WatchAppointment với mã sai định dạng bị từ chối", "invoke lỗi", error || "không lỗi", Boolean(error));
}

await Promise.all([a.conn.stop(), b.conn.stop(), c.conn.stop()]);
console.log(JSON.stringify(results, null, 2));
const failed = results.filter(r => !r.pass);
console.log(`\n${results.length - failed.length}/${results.length} PASS`);
process.exit(failed.length ? 1 : 0);
