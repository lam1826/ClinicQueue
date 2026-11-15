# Mục tiêu dự án

Ngày lập: 2026-11-10. Trạng thái: đã chọn Web + PostgreSQL và bắt đầu hướng dẫn tuần 2; chi tiết nghiệp vụ còn cần chốt.

## Bài toán và kết quả mong muốn

Xây dựng hệ thống cho phép tra cứu bác sĩ và khung giờ, đặt/hủy lịch, nhận số thứ tự do worker xử lý bất đồng bộ, xem lượt đang phục vụ và nhận cập nhật thời gian thực. Người làm phải tự chạy, kiểm tra và giải thích được đường đi của dữ liệu/thông điệp khi bảo vệ.

## Thông tin đã xác nhận

- Người dùng làm cá nhân; học phần kéo dài 9 tuần, hiện là tuần 2. Người dùng xác nhận chương N = tuần N. Kế hoạch bao phủ tuần 2–9; chưa có hạn nộp cụ thể theo ngày.
- Người dùng yêu cầu đọc tài liệu, đổi tên thư mục phù hợp và phác thảo kế hoạch trước khi quyết định triển khai.
- Người dùng yêu cầu kết hợp giáo trình và thực hành từng tuần để phục vụ ClinicQueue. Giáo trình giải thích nguyên lý; TH hướng dẫn cách làm/kiểm tra; G/T09 trong `Du án` quyết định bài toán và nghiệm thu. Mỗi bước phải có đối chiếu nguồn và phần vận dụng.
- Hiện có .git, .gitignore, ClinicQueue.slnx và src/ClinicQueue.AppointmentApi net10.0 trả Hello World; chưa xác nhận build/run trong đợt rà này. Máy có SDK .NET `10.0.403`; Docker/PostgreSQL server chưa xác nhận sẵn sàng.
- Đã đọc đầy đủ 259 trang PDF giáo trình/thực hành cùng hai giao đề; xem [báo cáo đọc](reading-review.md).

## Tiêu chí thành công

- Đáp ứng 8 chức năng, 6 API tối thiểu và kiến trúc của đề tài 09.
- Chứng minh được hai vai trò của RabbitMQ: phân phối công việc cấp số và phát sự kiện thay đổi hàng đợi.
- Client nhận đúng cập nhật qua SignalR và đọc được trạng thái đã lưu.
- Các service chạy độc lập; toàn bộ hệ thống khởi động lại được theo README và Docker Compose.
- Có báo cáo, sơ đồ, minh chứng thử lỗi, mã nguồn trên GitHub và lịch sử thực hiện từng tuần.
- Người học giải thích được các quyết định thiết kế, giới hạn của mẫu và kết quả thử nghiệm thực tế.

## Ràng buộc và phạm vi

C#/.NET 10, ASP.NET Core Minimal API, RabbitMQ, SignalR, lưu dữ liệu, Dockerfile từng service .NET, `docker-compose.yml`, cấu hình ngoài mã nguồn, logging và phục hồi hợp lý. Client được chọn Console hoặc Web; database do sinh viên chọn. Không mặc định mọi công nghệ có trong giáo trình đều phải có trong đề tài.

Phạm vi ban đầu dùng dữ liệu mô phỏng bác sĩ/bệnh nhân; tập trung đặt lịch và điều phối hàng đợi. Thanh toán, hồ sơ bệnh án, tích hợp bệnh viện, ứng dụng di động và triển khai công khai không thuộc bản kế hoạch này.

## Rủi ro và câu hỏi còn mở

- Đã chốt Web + PostgreSQL ngày 2026-11-10. Cần chốt thời gian học mỗi tuần và quy tắc cấp số/hủy lịch.
- Tuần 2 cần kiểm tra/ôn bù phần tuần 1 chưa có minh chứng; không suy việc hoàn thành từ bộ khung API. Tuần 4 học GraphQL, tuần 5 học gRPC dù không buộc tích hợp vào ClinicQueue.
- Đặt lịch đồng thời, gửi thông điệp thất bại sau khi lưu DB, giao lại message và client mất kết nối là các tình huống cần thiết kế/kiểm tra.
- Đây là kế hoạch học và xây dựng, chưa phải bằng chứng hệ thống đã chạy.

## Tham chiếu

[Danh mục nguồn](sources.md), [yêu cầu](requirements.md), [lộ trình và phương án](plan.md).
