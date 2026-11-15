var builder = WebApplication.CreateBuilder(args);

// Cho phép Web client gọi HTTP từ origin được cấu hình.
var webOrigins = builder.Configuration.GetSection("Cors:AllowedOrigins").Get<string[]>()
    ?? throw new InvalidOperationException("Thieu cau hinh Cors:AllowedOrigins.");
builder.Services.AddCors(options =>
{
    options.AddPolicy("WebClient", policy => policy
        .WithOrigins(webOrigins)
        .WithMethods("GET", "POST")
        .WithHeaders("Content-Type")
        .WithExposedHeaders("Location"));
});

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

app.MapPost("/appointments", (CreateAppointmentRequest request) =>
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

        var appointment = new AppointmentDto(
            Id: Guid.NewGuid(),
            PatientName: request.PatientName.Trim(),
            DoctorId: request.DoctorId,
            SlotId: slot.Id,
            Status: "PendingNumber",
            QueueNumber: null);

        appointments.Add(appointment);

        slots[slotIndex] = slot with
        {
            RemainingSeats = slot.RemainingSeats - 1
        };

        return Results.Created(
            $"/appointments/{appointment.Id}",
            appointment);
    }
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

app.Run();

//DTO
record DoctorDto(int Id, string Name, string Specialty);
record SlotDto(int Id, int DoctorId, DateTimeOffset StartTime, DateTimeOffset EndTime, int RemainingSeats);
record ApiError(string Code, string Message);
record CreateAppointmentRequest(string? PatientName, int DoctorId, int SlotId);
record AppointmentDto(Guid Id, string PatientName, int DoctorId, int SlotId, string Status, int? QueueNumber);