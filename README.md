# ClinicQueue — Đề tài 09

Hệ thống đặt lịch khám và quản lý hàng đợi cho học phần Phát triển ứng dụng phân tán.

**Trạng thái:** làm cá nhân, 9 tuần; **chương N = tuần N**. Đã chọn Web + PostgreSQL. Tuần 2 hoàn thiện REST/RAM và Web tách riêng. **Tuần 3 (SignalR) đã xong:** API có hub `/hubs/appointments`, đặt lịch trả `PendingNumber` rồi tác vụ nền cấp số mô phỏng và đẩy `AppointmentStatusChanged` tới đúng nhóm của lịch hẹn; Web tự hiện số, tự kết nối lại và đọc lại bằng REST. Cấp số thật (gRPC/RabbitMQ) và PostgreSQL ở các tuần sau.

- [Tuần 3 — SignalR: đẩy số thứ tự về trình duyệt](docs/weekly/week-03.md)
- [Hướng dẫn tuần 2 — REST và vận dụng vào ClinicQueue](docs/weekly/week-02.md)
- [Kế hoạch tuần 2–9 theo từng chương](docs/sdlc/course-project/plan.md)
- [Báo cáo đọc đầy đủ và các điều chỉnh](docs/sdlc/course-project/reading-review.md)
- [Sổ đọc 259 trang giáo trình và thực hành](docs/sdlc/course-project/reading-notes.md)
- [Mục tiêu và phạm vi](docs/sdlc/course-project/intent.md)
- [Yêu cầu và tiêu chí nghiệm thu](docs/sdlc/course-project/requirements.md)
- [Danh mục nguồn](docs/sdlc/course-project/sources.md)

Nền tảng theo giao đề: C#/.NET 10, ASP.NET Core Minimal API, RabbitMQ, SignalR, cơ sở dữ liệu, các service chạy độc lập, Docker và Git/GitHub. Cách học: **giáo trình giải thích nguyên lý → thực hành hướng dẫn cách làm/kiểm tra → áp dụng vào ClinicQueue theo đề tài 09**. Chỉ rõ nguồn và phần điều chỉnh ở từng bước. Dự án được xây xuyên suốt 9 tuần theo giáo trình: tuần 3 SignalR, tuần 4 GraphQL cho màn hình tổng quan, tuần 5 gRPC nội bộ để cấp số, tuần 6 chuyển sang RabbitMQ, tuần 7 sự kiện và Notification Service, tuần 8 Docker. GraphQL/gRPC là phần vận dụng theo giáo trình, không phải yêu cầu bắt buộc của đề tài 09.

Thư mục dự án: `ClinicQueue`. Solution ở root; các project dưới `src/`. API đã tồn tại nên bỏ qua bước tạo lại. Những project còn lại trong kế hoạch được tạo khi đến tuần tương ứng. Người học tự thực hiện từng bước, ghi kết quả và giải thích; tài liệu không đánh dấu hoàn thành thay cho minh chứng thực tế.


## Chạy API và Web riêng

Mở hai terminal tại thư mục dự án ClinicQueue. Terminal 1:

```powershell
dotnet run --project src/ClinicQueue.AppointmentApi --launch-profile http
```

Terminal 2:

```powershell
dotnet run --project src/ClinicQueue.Client --launch-profile http
```

Mở http://localhost:5200; API ở http://localhost:5100. Cấu hình địa chỉ nằm trong Client appsettings (Api:BaseUrl), API appsettings (Cors:AllowedOrigins) và profile http của từng project.

Trên trang chủ, chọn **Đặt lịch khám**, đặt một khung giờ và giữ mã trả về. Khoảng 2 giây sau, số thứ tự tự hiện qua SignalR (cấp số mô phỏng, chỉnh bằng `Numbering:SimulatedDelaySeconds` trong appsettings của API). Dùng **Tra cứu lịch hẹn** để mở lại lịch bằng mã đó; trang cũng tự theo dõi lịch vừa tra cứu. Phần theo dõi lượt khám trên phiếu mẫu vẫn là minh họa.

- [Giải thích tách client/server và từng phần mã](Giai_thich/Tach_Client_Server_Tuan2.md)
- [Triển khai](docs/sdlc/course-project/implementation.md)
- [Báo cáo kiểm chứng và lệnh chạy test](docs/sdlc/course-project/test-report.md)


## Bộ hoàn tất tuần 3

- [Tổng kết, đối chiếu GT03, chạy và quan sát](docs/weekly/week-03.md)
- [Minh chứng: 12 ca SignalR, 5 ca trình duyệt, hồi quy tuần 2](docs/weekly/evidence/week-03/README.md)
- [Request mẫu negotiate/đặt lịch/đọc lại](docs/weekly/week-03.http)
- [Giải thích từng phần và ôn tập GT03](Giai_thich/On_tap_Tuan3.md) (chỉ có trên máy)

## Bộ hoàn tất tuần2

- [Mở từ đây: tổng kết, chạy và giải thích luồng](docs/weekly/week-02.md)
- [Ôn tập và lời giải GT02/TH02](Giai_thich/On_tap_Tuan2.md)
- [31 ca HTTP thực tế và ảnh Web](docs/weekly/evidence/week-02/README.md)
- [Request mẫu để tự thử](docs/weekly/week-02.http)

Nếu đang chạy phiên cũ, Ctrl+C ở terminal API/Web rồi chạy lại hai lệnh phía trên. Danh sách hiện có4bác sĩ.
