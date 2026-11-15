# ClinicQueue — Đề tài 09

Hệ thống đặt lịch khám và quản lý hàng đợi cho học phần Phát triển ứng dụng phân tán.

**Trạng thái:** làm cá nhân, 9 tuần; **chương N = tuần N**. Đã chọn Web + PostgreSQL. Phần triển khai, kiểm chứng và tài liệu tuần2 của ClinicQueue đã hoàn thiện: hai ứng dụng độc lập, REST/RAM, Web, chi tiết bác sĩ trước đặt, query keyword mở rộng, lỗi và restart. Build riêng0warning/error;14nhóm kiểm chứng và31bản ghiHTTP. PostgreSQL/cấp số bất đồng bộ ở mốc sau.

- [Hướng dẫn tuần 2 — REST và vận dụng vào ClinicQueue](docs/weekly/week-02.md)
- [Kế hoạch tuần 2–9 theo từng chương](docs/sdlc/course-project/plan.md)
- [Báo cáo đọc đầy đủ và các điều chỉnh](docs/sdlc/course-project/reading-review.md)
- [Sổ đọc 259 trang giáo trình và thực hành](docs/sdlc/course-project/reading-notes.md)
- [Mục tiêu và phạm vi](docs/sdlc/course-project/intent.md)
- [Yêu cầu và tiêu chí nghiệm thu](docs/sdlc/course-project/requirements.md)
- [Danh mục nguồn](docs/sdlc/course-project/sources.md)

Nền tảng theo giao đề: C#/.NET 10, ASP.NET Core Minimal API, RabbitMQ, SignalR, cơ sở dữ liệu, các service chạy độc lập, Docker và Git/GitHub. Cách học: **giáo trình giải thích nguyên lý → thực hành hướng dẫn cách làm/kiểm tra → áp dụng vào ClinicQueue theo đề tài 09**. Chỉ rõ nguồn và phần điều chỉnh ở từng bước. GraphQL/gRPC được học theo tuần, tích hợp vào sản phẩm là lựa chọn riêng.

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

Trên trang chủ, chọn **Đặt lịch khám**, đặt một khung giờ và giữ mã trả về. Dùng **Tra cứu lịch hẹn** để mở lại lịch bằng mã đó. Bản tuần 2 hiển thị trạng thái chờ cấp số, còn phần theo dõi lượt trên phiếu mẫu là minh họa.

- [Giải thích tách client/server và từng phần mã](Giai_thich/Tach_Client_Server_Tuan2.md)
- [Triển khai](docs/sdlc/course-project/implementation.md)
- [Báo cáo kiểm chứng và lệnh chạy test](docs/sdlc/course-project/test-report.md)


## Bộ hoàn tất tuần2

- [Mở từ đây: tổng kết, chạy và giải thích luồng](docs/weekly/week-02.md)
- [Ôn tập và lời giải GT02/TH02](Giai_thich/On_tap_Tuan2.md)
- [31 ca HTTP thực tế và ảnh Web](docs/weekly/evidence/week-02/README.md)
- [Request mẫu để tự thử](docs/weekly/week-02.http)

Nếu đang chạy phiên cũ, Ctrl+C ở terminal API/Web rồi chạy lại hai lệnh phía trên. Danh sách hiện có4bác sĩ.
