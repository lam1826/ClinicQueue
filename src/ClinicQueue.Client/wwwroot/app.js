const searchForm = document.querySelector("#doctor-search-form");
const keywordInput = document.querySelector("#keyword");
const searchButton = document.querySelector("#search");
const doctorDetail = document.querySelector("#doctor-detail");
const form = document.querySelector("#booking-form");
const fields = document.querySelector("#booking-fields");
const doctorSelect = document.querySelector("#doctor");
const slotSelect = document.querySelector("#slot");
const patientName = document.querySelector("#patient-name");
const reloadButton = document.querySelector("#reload");
const readButton = document.querySelector("#read-appointment");
const notice = document.querySelector("#notice");
const lookupForm = document.querySelector("#lookup-form");
const lookupFields = document.querySelector("#lookup-fields");
const appointmentCode = document.querySelector("#appointment-code");
const lookupNotice = document.querySelector("#lookup-notice");
const appointmentResult = document.querySelector("#appointment");
const resultStatus = document.querySelector("#result-status");
const resultNumber = document.querySelector("#result-number");
const liveStatus = document.querySelector("#live-status");
const liveStatusText = document.querySelector("#live-status-text");
const guidPattern = /^[0-9a-f]{8}-(?:[0-9a-f]{4}-){3}[0-9a-f]{12}$/i;
const statusLabels = {
    PendingNumber: "Đang chờ cấp số",
    Queued: "Đã có số, chờ đến lượt khám"
};
let apiBaseUrl;
let appointmentUrl;
let bookingNeedsRefresh = false;

// Tuần 3: trạng thái của kênh SignalR.
let hubConnection;
let realtimeRetryTimer;
let currentAppointmentId;                  // lịch hẹn đang theo dõi (mã chữ thường)
let shown = { id: null, updatedAt: 0 };    // dữ liệu đang hiển thị, để bỏ qua bản cũ đến muộn
let pendingMessage = null;                 // bản tin đến trước khi GET kịp hiển thị lịch hẹn

function showNotice(message, isError = false) {
    notice.textContent = message;
    notice.dataset.error = String(isError);
}

function showLookupNotice(message, isError = false) {
    lookupNotice.textContent = message;
    lookupNotice.dataset.error = String(isError);
}

function setLiveStatus(message, state) {
    liveStatusText.textContent = message;
    liveStatus.dataset.state = state;
}

function setBusy(busy) {
    fields.disabled = busy || !apiBaseUrl;
    reloadButton.disabled = busy;
    keywordInput.disabled = busy;
    searchButton.disabled = busy;
    readButton.disabled = busy || !appointmentUrl;
    lookupFields.disabled = busy || !apiBaseUrl;
    form.setAttribute("aria-busy", String(busy));
    lookupForm.setAttribute("aria-busy", String(busy));
}

// fetch chỉ ném lỗi khi mất kết nối/timeout; HTTP 400/404/409 cần kiểm riêng.
async function request(url, options = {}) {
    let response;
    try {
        response = await fetch(url, { ...options, signal: AbortSignal.timeout(15000) });
    } catch {
        const error = new Error("Không kết nối được dịch vụ. Kiểm tra API rồi thử tải lại.");
        error.network = true;
        throw error;
    }
    // Giữ status/Location kể cả khi body bị gián đoạn hoặc JSON không hợp lệ.
    const responseError = message => Object.assign(new Error(message), { response });
    let data = null;
    try {
        const text = await response.text();
        data = text ? JSON.parse(text) : null;
    } catch {
        if (response.ok) throw responseError("Không đọc được nội dung phản hồi của dịch vụ.");
    }
    if (!response.ok) {
        throw responseError(data?.message
            ? `${data.message} (${data.code ?? "API_ERROR"}; HTTP ${response.status})`
            : `Dịch vụ trả HTTP ${response.status}. Hãy kiểm tra yêu cầu.`);
    }
    if (data === null) throw responseError("Dịch vụ chưa trả dữ liệu JSON hợp lệ.");
    return { response, data };
}

function apiUrl(path) {
    return new URL(path, apiBaseUrl);
}

function resetSlots(message) {
    slotSelect.replaceChildren(new Option(message, ""));
}

async function loadDoctors() {
    const url = apiUrl("/doctors");
    const keyword = keywordInput.value.trim();
    if (keyword) url.searchParams.set("keyword", keyword);
    doctorSelect.replaceChildren(new Option("Đang tải bác sĩ…", ""));
    resetSlots("Chọn bác sĩ trước");
    doctorDetail.textContent = "Chọn bác sĩ để xem chuyên khoa.";
    const { data } = await request(url);
    doctorSelect.replaceChildren(new Option("Chọn bác sĩ", ""));
    for (const doctor of data) {
        doctorSelect.add(new Option(`${doctor.name} · ${doctor.specialty}`, doctor.id));
    }
    resetSlots("Chọn bác sĩ trước");
    showNotice(data.length ? "Đã tải danh sách bác sĩ." : "Không tìm thấy bác sĩ phù hợp.");
}

async function loadSlots() {
    resetSlots("Chọn khung giờ");
    if (!doctorSelect.value) {
        resetSlots("Chọn bác sĩ trước");
        return;
    }
    const { data } = await request(apiUrl(`/doctors/${doctorSelect.value}/slots`));
    if (!data.length) {
        resetSlots("Bác sĩ hiện chưa có khung giờ còn chỗ");
        return;
    }
    const dateFormat = new Intl.DateTimeFormat("vi-VN", {
        dateStyle: "short", timeStyle: "short", timeZone: "Asia/Ho_Chi_Minh"
    });
    const timeFormat = new Intl.DateTimeFormat("vi-VN", {
        timeStyle: "short", timeZone: "Asia/Ho_Chi_Minh"
    });
    for (const slot of data) {
        const label = `${dateFormat.format(new Date(slot.startTime))}–${timeFormat.format(new Date(slot.endTime))} · Còn ${slot.remainingSeats} chỗ`;
        slotSelect.add(new Option(label, slot.id));
    }
}

function statusLabel(status) {
    return statusLabels[status] ?? status;
}

function renderAppointment(appointment) {
    // GET và SignalR là hai đường độc lập nên có thể về không theo thứ tự.
    // Bỏ qua bản cũ hơn bản đang hiển thị của cùng lịch hẹn.
    const updatedAt = Date.parse(appointment.updatedAt ?? "") || 0;
    if (appointment.id === shown.id && updatedAt < shown.updatedAt) return;
    shown = { id: appointment.id, updatedAt };

    document.querySelector("#empty-result").hidden = true;
    appointmentResult.hidden = false;
    document.querySelector("#result-name").textContent = appointment.patientName;
    document.querySelector("#result-id").textContent = appointment.id;
    resultStatus.textContent = statusLabel(appointment.status);
    resultNumber.textContent = appointment.queueNumber ?? "Chưa được cấp";
    resultNumber.dataset.fresh = "false";

    // Bản tin SignalR đã đến trong lúc chờ GET: áp dụng ngay nếu nó mới hơn.
    if (pendingMessage?.appointmentId === appointment.id) {
        const message = pendingMessage;
        pendingMessage = null;
        applyStatusMessage(message);
    }
}

// GT03 §3.3.2: hàm xử lý bản tin "AppointmentStatusChanged" do máy chủ đẩy về.
function applyStatusMessage(message) {
    if (message.appointmentId !== currentAppointmentId) return; // tin của lịch đã xem trước đó
    if (message.appointmentId !== shown.id) {
        pendingMessage = message; // lịch hẹn chưa hiển thị xong, giữ lại để áp dụng sau
        return;
    }
    const updatedAt = Date.parse(message.updatedAt) || 0;
    if (updatedAt < shown.updatedAt) return;
    shown = { id: message.appointmentId, updatedAt };

    resultStatus.textContent = statusLabel(message.status);
    resultNumber.textContent = message.queueNumber ?? "Chưa được cấp";
    resultNumber.dataset.fresh = String(message.queueNumber != null);
    if (message.queueNumber != null) {
        showLookupNotice(`Đã cấp số thứ tự ${message.queueNumber}. Trang tự cập nhật, không cần tải lại.`);
    }
}

// Vào nhóm SignalR của một lịch hẹn. Nếu chưa có kết nối thì chỉ ghi nhớ mã;
// khi kết nối xong, resyncWatchedAppointment sẽ vào nhóm và đọc lại trạng thái.
async function watchAppointment(id) {
    const nextId = id.toLowerCase();
    if (nextId !== currentAppointmentId) pendingMessage = null;
    currentAppointmentId = nextId;
    if (!window.signalR || hubConnection?.state !== signalR.HubConnectionState.Connected) return false;
    try {
        await hubConnection.invoke("WatchAppointment", currentAppointmentId);
        setLiveStatus("Đang tự cập nhật trạng thái lịch hẹn này.", "live");
        return true;
    } catch {
        setLiveStatus("Chưa đăng ký được cập nhật tự động. Dùng “Đọc lại lịch hẹn”.", "error");
        return false;
    }
}

// GT03 §3.2.5, TH03 bước 13.4: kết nối mới không còn nhóm cũ và có thể đã lỡ bản tin,
// nên vào lại nhóm rồi đọc trạng thái gốc bằng REST.
async function resyncWatchedAppointment() {
    if (!currentAppointmentId || !guidPattern.test(currentAppointmentId)) {
        setLiveStatus("Đã kết nối cập nhật tự động.", "live");
        return;
    }
    await watchAppointment(currentAppointmentId);
    try {
        const { data } = await request(apiUrl(`/appointments/${currentAppointmentId}`));
        renderAppointment(data);
    } catch (error) {
        showLookupNotice(error.response?.status === 404
            ? "Dịch vụ không còn lịch hẹn này. Bản thực hành lưu dữ liệu trong RAM nên mất khi API khởi động lại."
            : error.message, true);
    }
}

// GT03 §3.2.3: xây kết nối, đăng ký hàm xử lý và sự kiện vòng đời trước khi mở kết nối.
function createRealtimeConnection() {
    const connection = new signalR.HubConnectionBuilder()
        .withUrl(apiUrl("/hubs/appointments").href) // URL tuyệt đối vì hub ở origin khác
        .withAutomaticReconnect()                    // thử lại sau 0, 2, 10, 30 giây
        .build();

    // Tên phải khớp chính xác tên máy chủ dùng trong SendAsync.
    connection.on("AppointmentStatusChanged", applyStatusMessage);
    connection.onreconnecting(() =>
        setLiveStatus("Mất kết nối cập nhật tự động, đang thử kết nối lại…", "error"));
    connection.onreconnected(() => resyncWatchedAppointment());
    connection.onclose(() => {
        setLiveStatus("Đã ngừng cập nhật tự động. Sẽ thử kết nối lại; trong lúc chờ hãy dùng “Đọc lại lịch hẹn”.", "error");
        scheduleRealtimeStart();
    });
    return connection;
}

async function startRealtime() {
    clearTimeout(realtimeRetryTimer);
    if (!window.signalR) {
        setLiveStatus("Không tải được thư viện cập nhật tự động. Dùng “Đọc lại lịch hẹn”.", "error");
        return;
    }
    hubConnection ??= createRealtimeConnection();
    if (hubConnection.state !== signalR.HubConnectionState.Disconnected) return;
    try {
        await hubConnection.start();
        await resyncWatchedAppointment();
    } catch {
        // withAutomaticReconnect không xử lý lần start() đầu tiên thất bại (TH03 bước 10.3),
        // nên client tự hẹn thử lại.
        setLiveStatus("Chưa kết nối được cập nhật tự động. Sẽ thử lại sau 5 giây.", "error");
        scheduleRealtimeStart();
    }
}

function scheduleRealtimeStart() {
    clearTimeout(realtimeRetryTimer);
    realtimeRetryTimer = setTimeout(startRealtime, 5000);
}

async function start() {
    setBusy(true);
    showNotice("Đang tải danh sách bác sĩ…");
    try {
        const { data } = await request("/client-config");
        apiBaseUrl = data.apiBaseUrl;
        startRealtime(); // chạy song song, không chặn việc tải bác sĩ
        await loadDoctors();
    } catch (error) {
        showNotice(error.message, true);
    } finally {
        setBusy(false);
    }
}

doctorSelect.addEventListener("change", async () => {
    setBusy(true); // Khóa lựa chọn trong lúc tải để phản hồi cũ không ghi đè lựa chọn mới.
    showNotice("Đang tải thông tin bác sĩ và khung giờ…");
    resetSlots("Chọn khung giờ");
    doctorDetail.textContent = "Chọn bác sĩ để xem chuyên khoa.";
    try {
        if (doctorSelect.value) {
            // GT02 bài tập 3: đọc chi tiết tài nguyên được chọn trước POST.
            const { data: doctor } = await request(apiUrl(`/doctors/${doctorSelect.value}`));
            doctorDetail.textContent = `${doctor.name} — ${doctor.specialty}`;
        }
        await loadSlots();
        showNotice(doctorSelect.value ? "Chọn khung giờ còn chỗ để tiếp tục." : "Hãy chọn bác sĩ.");
    } catch (error) {
        showNotice(error.message, true);
    } finally {
        setBusy(false);
    }
});

form.addEventListener("submit", async (event) => {
    event.preventDefault();
    if (!form.reportValidity()) return;
    setBusy(true);
    showLookupNotice("");
    showNotice("Đang gửi yêu cầu đặt lịch…");
    let created = false;
    try {
        // REST tạo tài nguyên (GT03 §3.3): SignalR không dùng để đặt lịch.
        const { response, data } = await request(apiUrl("/appointments"), {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                patientName: patientName.value,
                doctorId: Number(doctorSelect.value),
                slotId: Number(slotSelect.value)
            })
        });
        created = true;
        // Vào nhóm trước khi đọc lại: thay đổi xảy ra trước lúc vào nhóm sẽ thấy qua GET,
        // thay đổi xảy ra sau đó sẽ được đẩy qua SignalR.
        await watchAppointment(data.id);
        renderAppointment(data); // Giữ ID ngay sau POST, kể cả khi bước đọc lại lỗi.
        const location = response.headers.get("Location");
        appointmentUrl = apiUrl(location ?? `/appointments/${data.id}`);
        if (!location) throw new Error("Chưa đọc được Location; kiểm tra cấu hình CORS của API.");
        const { data: saved } = await request(appointmentUrl);
        renderAppointment(saved);
        await loadSlots();
        bookingNeedsRefresh = false;
        showNotice(saved.queueNumber != null
            ? "Đã đặt lịch và đã có số thứ tự."
            : "Đã đặt lịch. Số thứ tự sẽ tự hiện khi được cấp.");
        appointmentResult.focus();
    } catch (error) {
        if (error.response?.status === 201) {
            created = true;
            const location = error.response.headers.get("Location");
            appointmentUrl = location ? apiUrl(location) : undefined;
            renderAppointment({
                patientName: patientName.value.trim(),
                id: "Chưa đọc được",
                status: "Đã tạo; cần đọc lại",
                queueNumber: "Chưa đọc được"
            });
        }
        if (created) {
            bookingNeedsRefresh = true;
            resetSlots("Đọc lại lịch hẹn hoặc tải lại danh sách để cập nhật chỗ");
        }
        showNotice(created
            ? `Lịch đã được tạo. ${error.message} ${appointmentUrl ? "Dùng “Đọc lại lịch hẹn”, không cần đặt lại." : "Chưa có địa chỉ để đọc lại; hãy kiểm tra dịch vụ trước khi tiếp tục."}`
            : error.network
                ? "Chưa xác nhận được kết quả đặt lịch. Kiểm tra dịch vụ trước khi gửi lại yêu cầu."
                : error.message, true);
    } finally {
        setBusy(false);
    }
});

lookupForm.addEventListener("submit", async event => {
    event.preventDefault();
    const code = appointmentCode.value.trim().toLowerCase();
    if (!guidPattern.test(code)) {
        showLookupNotice("Mã lịch hẹn chưa đúng định dạng. Hãy sao chép cả mã từ phiếu hẹn.", true);
        return;
    }
    setBusy(true);
    showLookupNotice("Đang tra cứu lịch hẹn…");
    const url = apiUrl(`/appointments/${code}`);
    const previousId = currentAppointmentId;
    try {
        await watchAppointment(code); // cùng thứ tự với đặt lịch: vào nhóm rồi mới GET
        const { data } = await request(url);
        appointmentUrl = url;
        renderAppointment(data);
        showLookupNotice("Đã tìm thấy lịch hẹn.");
    } catch (error) {
        currentAppointmentId = previousId; // không tìm thấy: tiếp tục theo dõi lịch đang hiển thị
        const message = error.response?.status === 404
            ? "Không tìm thấy lịch hẹn. Hãy kiểm tra lại mã."
            : error.message;
        showLookupNotice(message, true);
    } finally {
        setBusy(false);
    }
});

readButton.addEventListener("click", async () => {
    if (!appointmentUrl) return;
    setBusy(true);
    showLookupNotice("Đang cập nhật lịch hẹn…");
    try {
        const { data } = await request(appointmentUrl);
        renderAppointment(data);
        if (bookingNeedsRefresh) {
            await loadSlots();
            bookingNeedsRefresh = false;
            showNotice("Đã cập nhật thông tin đặt lịch.");
        }
        showLookupNotice("Đã đọc lại lịch hẹn từ dịch vụ.");
    } catch (error) {
        showLookupNotice(error.message, true);
    } finally {
        setBusy(false);
    }
});

searchForm.addEventListener("submit", event => {
    event.preventDefault();
    start();
});
reloadButton.addEventListener("click", () => {
    keywordInput.value = "";
    start();
});
start();
