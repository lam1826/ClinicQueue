using Microsoft.AspNetCore.SignalR;

var builder = WebApplication.CreateBuilder(args);

// Cho phép Web client (origin khác cổng) gọi REST và kết nối SignalR.
// Tuần 3: trình duyệt gửi bước negotiate kèm cookie (withCredentials mặc định true)
// và hai header riêng của SignalR, nên CORS phải cho phép credentials và các header này.
// DELETE dùng cho kiểu truyền Long Polling khi dọn kết nối (tài liệu SignalR security).
var webOrigins = builder.Configuration.GetSection("Cors:AllowedOrigins").Get<string[]>()
    ?? throw new InvalidOperationException("Thieu cau hinh Cors:AllowedOrigins.");
builder.Services.AddCors(options =>
{
    options.AddPolicy("WebClient", policy => policy
        .WithOrigins(webOrigins)
        .WithMethods("GET", "POST", "DELETE")
        .WithHeaders("Content-Type", "X-Requested-With", "X-SignalR-User-Agent")
        .WithExposedHeaders("Location")
        .AllowCredentials());
});

// GT03 §3.2.1 bước 1: đăng ký dịch vụ SignalR vào container DI.
builder.Services.AddSignalR();

// Thời gian trễ của bước cấp số mô phỏng, đặt trong cấu hình thay vì viết cứng.
var numberingDelay = TimeSpan.FromSeconds(
    builder.Configuration.GetValue("Numbering:SimulatedDelaySeconds", 2.0));

var app = builder.Build();
app.UseRouting();
app.UseCors("WebClient");

var doctors = new List<DoctorDto>
{
    new(1, "Nguyen Van An", "Noi tong quat"),
    new(2, "Tran Thi Binh", "Nhi khoa"),
    new(3, "Le Minh Chau", "Da lieu"),
    new(4, "Pham Minh Duc", "Tai mui hong")
};

var slotStart = new DateTimeOffset(
    2026, 11, 11, 8, 0, 0,
    TimeSpan.FromHours(7));

var slots = new List<SlotDto>
{
    new(1, 1,
        slotStart,
        slotStart.AddMinutes(30),
        3
    ),

    new(2, 1,
        slotStart.AddMinutes(30),
        slotStart.AddMinutes(60),
        0
    ),

    new(3, 2,
        slotStart.AddMinutes(60),
        slotStart.AddMinutes(90),
        2
    )
};

var appointments = new List<AppointmentDto>();
var bookingLock = new object();

app.MapGet("/", () => Results.Ok(new
{
    service = "ClinicQueue.AppointmentApi",
    status = "running"
}));

// keyword là query tùy chọn; thiếu/rỗng vẫn trả toàn bộ danh sách.
app.MapGet("/doctors", (string? keyword) =>
{
    var term = keyword?.Trim();
    var result = string.IsNullOrEmpty(term)
        ? doctors
        : doctors.Where(d => d.Name.Contains(term, StringComparison.OrdinalIgnoreCase)).ToList();

    return Results.Ok(result);
});

app.MapGet("/doctors/{id:int}", (int id) =>
{
    var doctor = doctors.FirstOrDefault(d => d.Id == id);
    return doctor is null
        ? Results.NotFound(new ApiError("DOCTOR_NOT_FOUND", "Khong tim thay bac si."))
        : Results.Ok(doctor);
});

app.MapGet("/doctors/{id:int}/slots", (int id) =>
{
    var doctor = doctors.FirstOrDefault(d => d.Id == id);

    if (doctor is null){
        return Results.NotFound(
            new ApiError(
                "DOCTOR_NOT_FOUND",
                "Khong tim thay bac si."
            )
        );
    }

    lock (bookingLock){
        var availableSlots = slots
            .Where(s => s.DoctorId == id && s.RemainingSeats > 0)
            .ToList();

        return Results.Ok(availableSlots);
    }
});

// REST vẫn chịu trách nhiệm tạo tài nguyên (GT03 §3.3). IHubContext được DI đưa vào
// để mã ngoài lớp hub có thể đẩy thông báo SignalR.
app.MapPost("/appointments", (CreateAppointmentRequest request, IHubContext<AppointmentHub> hubContext) =>
{
    if (string.IsNullOrWhiteSpace(request.PatientName)
        || request.DoctorId <= 0
        || request.SlotId <= 0)
    {
        return Results.BadRequest(new ApiError(
            "INVALID_APPOINTMENT",
            "Ten benh nhan va cac ma bac si, khung gio phai hop le."));
    }

    var doctor = doctors.FirstOrDefault(d => d.Id == request.DoctorId);

    if (doctor is null)
    {
        return Results.NotFound(new ApiError(
            "DOCTOR_NOT_FOUND",
            "Khong tim thay bac si."));
    }

    AppointmentDto appointment;

    lock (bookingLock)
    {
        var slotIndex = slots.FindIndex(s => s.Id == request.SlotId);

        if (slotIndex == -1)
        {
            return Results.NotFound(new ApiError(
                "SLOT_NOT_FOUND",
                "Khong tim thay khung gio."));
        }

        var slot = slots[slotIndex];

        if (slot.DoctorId != request.DoctorId)
        {
            return Results.BadRequest(new ApiError(
                "SLOT_DOCTOR_MISMATCH",
                "Khung gio khong thuoc bac si da chon."));
        }

        if (slot.RemainingSeats <= 0)
        {
            return Results.Conflict(new ApiError(
                "SLOT_FULL",
                "Khung gio da het cho."));
        }

        var now = DateTimeOffset.UtcNow;
        appointment = new AppointmentDto(
            Id: Guid.NewGuid(),
            PatientName: request.PatientName.Trim(),
            DoctorId: request.DoctorId,
            SlotId: slot.Id,
            Status: AppointmentStatuses.PendingNumber,
            QueueNumber: null,
            CreatedAt: now,
            UpdatedAt: now);

        appointments.Add(appointment);

        slots[slotIndex] = slot with
        {
            RemainingSeats = slot.RemainingSeats - 1
        };
    }

    // Khởi động tác vụ nền rồi trả 201 ngay, không chờ cấp số (giống SimulateGradingAsync, GT03 §3.3.1).
    _ = SimulateNumberingAsync(
        appointment.Id, appointments, bookingLock, hubContext, numberingDelay, app.Logger);

    return Results.Created(
        $"/appointments/{appointment.Id}",
        appointment);
});

app.MapGet("/appointments/{id:guid}", (Guid id) =>
{
    lock (bookingLock)
    {
        var appointment = appointments.FirstOrDefault(a => a.Id == id);

        return appointment is null
            ? Results.NotFound(new ApiError(
                "APPOINTMENT_NOT_FOUND",
                "Khong tim thay lich hen."))
            : Results.Ok(appointment);
    }
});

// GT03 §3.2.1 bước 2: ánh xạ hub vào một tuyến. Đặt sau UseCors để hub dùng chính sách WebClient.
app.MapHub<AppointmentHub>("/hubs/appointments");

app.Run();

// Mô phỏng bước cấp số chạy nền: chờ một khoảng, gán số, rồi đẩy trạng thái mới qua SignalR.
// Tuần 5 thay phần gán số bằng NumberingService (gRPC); tuần 6 chuyển sang QueueWorker qua RabbitMQ.
static async Task SimulateNumberingAsync(
    Guid appointmentId,
    List<AppointmentDto> appointments,
    object bookingLock,
    IHubContext<AppointmentHub> hubContext,
    TimeSpan delay,
    ILogger logger)
{
    // Tác vụ chạy kiểu "bắn rồi quên" (_ =): nếu không bắt lỗi ở đây, lỗi sẽ mất mà không ai thấy.
    try
    {
        await Task.Delay(delay);

        var updated = AssignSimulatedQueueNumber(appointmentId, appointments, bookingLock);
        if (updated is null)
        {
            return;
        }

        logger.LogInformation(
            "Cap so mo phong: lich {AppointmentId} -> {Status}, so {QueueNumber}",
            updated.Id, updated.Status, updated.QueueNumber);

        await NotifyStatusChangedAsync(updated, hubContext);
    }
    catch (Exception exception)
    {
        logger.LogError(exception, "Cap so mo phong that bai cho lich {AppointmentId}", appointmentId);
    }
}

// Gán số trong cùng khóa với đặt lịch để hai lịch không nhận trùng số.
// Quy tắc tạm: mỗi bác sĩ một dãy số tăng dần (mọi slot hiện cùng một ngày).
static AppointmentDto? AssignSimulatedQueueNumber(
    Guid appointmentId,
    List<AppointmentDto> appointments,
    object bookingLock)
{
    lock (bookingLock)
    {
        var index = appointments.FindIndex(a => a.Id == appointmentId);
        if (index < 0 || appointments[index].Status != AppointmentStatuses.PendingNumber)
        {
            return null;
        }

        var current = appointments[index];
        var nextNumber = appointments
            .Where(a => a.DoctorId == current.DoctorId && a.QueueNumber is not null)
            .Select(a => a.QueueNumber!.Value)
            .DefaultIfEmpty(0)
            .Max() + 1;

        var updated = current with
        {
            Status = AppointmentStatuses.Queued,
            QueueNumber = nextNumber,
            UpdatedAt = DateTimeOffset.UtcNow
        };
        appointments[index] = updated;
        return updated;
    }
}

// Cầu nối giữa dữ liệu và kênh thời gian thực (vai trò của UpdateStatusAsync trong GT03 §3.3.1):
// chỉ gửi tới nhóm của đúng lịch hẹn, không gửi Clients.All.
static Task NotifyStatusChangedAsync(AppointmentDto appointment, IHubContext<AppointmentHub> hubContext)
{
    var message = new AppointmentStatusMessage(
        appointment.Id,
        appointment.Status,
        appointment.QueueNumber,
        appointment.UpdatedAt);

    return hubContext.Clients
        .Group(AppointmentGroups.ForAppointment(appointment.Id))
        .SendAsync(AppointmentEvents.StatusChanged, message);
}

// Hub chỉ quản lý việc client đăng ký theo dõi; nghiệp vụ đặt lịch nằm ở REST (GT03 §3.3.1).
sealed class AppointmentHub(ILogger<AppointmentHub> logger) : Hub
{
    // Tham số Guid: mã sai định dạng bị từ chối ngay, mã hợp lệ luôn được chuẩn hóa
    // nên tên nhóm khớp với tên nhóm phía gửi.
    public async Task WatchAppointment(Guid appointmentId)
    {
        await Groups.AddToGroupAsync(Context.ConnectionId, AppointmentGroups.ForAppointment(appointmentId));
        logger.LogInformation(
            "Ket noi {ConnectionId} theo doi lich {AppointmentId}",
            Context.ConnectionId[..8], appointmentId);
    }

    // GT03 §3.2.5: vòng đời kết nối phía máy chủ; ở đây chỉ ghi nhật ký.
    public override Task OnConnectedAsync()
    {
        logger.LogInformation("Ket noi SignalR moi {ConnectionId}", Context.ConnectionId[..8]);
        return base.OnConnectedAsync();
    }

    public override Task OnDisconnectedAsync(Exception? exception)
    {
        logger.LogInformation(
            "Ngat ket noi SignalR {ConnectionId} (loi: {Error})",
            Context.ConnectionId[..8], exception?.Message ?? "khong");
        return base.OnDisconnectedAsync(exception);
    }
}

// Tạo tên nhóm ở một chỗ để phía tham gia nhóm và phía gửi không bao giờ lệch nhau.
static class AppointmentGroups
{
    public static string ForAppointment(Guid appointmentId) => $"appointment:{appointmentId}";
}

// Tên sự kiện phải khớp chính xác với tên client đăng ký bằng connection.on(...) (GT03 §3.2.2).
static class AppointmentEvents
{
    public const string StatusChanged = "AppointmentStatusChanged";
}

static class AppointmentStatuses
{
    public const string PendingNumber = "PendingNumber";
    public const string Queued = "Queued";
}

//DTO
record DoctorDto(int Id, string Name, string Specialty);
record SlotDto(int Id, int DoctorId, DateTimeOffset StartTime, DateTimeOffset EndTime, int RemainingSeats);
record ApiError(string Code, string Message);
record CreateAppointmentRequest(string? PatientName, int DoctorId, int SlotId);
record AppointmentDto(
    Guid Id,
    string PatientName,
    int DoctorId,
    int SlotId,
    string Status,
    int? QueueNumber,
    DateTimeOffset CreatedAt,
    DateTimeOffset UpdatedAt);

// Bản tin SignalR chỉ chứa dữ liệu tối thiểu để client cập nhật giao diện.
record AppointmentStatusMessage(
    Guid AppointmentId,
    string Status,
    int? QueueNumber,
    DateTimeOffset UpdatedAt);
