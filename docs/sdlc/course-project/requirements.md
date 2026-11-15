# Yêu cầu và nghiệm thu dự kiến

Trạng thái: bản nháp. Các ID dưới đây được tạo cho dự án; không phải mã yêu cầu có sẵn trong đề bài. Cột kiểm chứng là việc sẽ làm, chưa phải kết quả test.

## Nguồn và tác nhân

`G` = hướng dẫn chung; `T09` = đề tài 09; tên file và liên kết tại [sources.md](sources.md).

Bệnh nhân dùng client để xem/đặt/hủy/theo dõi lịch. Đề bài yêu cầu cập nhật lượt đang phục vụ nhưng chưa chỉ rõ tác nhân và endpoint; đề xuất một màn hình nhân viên phòng khám cho thao tác này. Phân quyền tài khoản là phần mở rộng, chưa nằm trong bản tối thiểu.

## Yêu cầu gốc

| ID | Yêu cầu | Nguồn | Tiêu chí nghiệm thu dự kiến | Kiểm chứng |
|---|---|---|---|---|
| F01 | Tra cứu bác sĩ/phòng khám và khung giờ còn chỗ | T09 §2.1, §3 | Hai API GET trả dữ liệu phù hợp bác sĩ và tình trạng khung giờ | Gọi API với bác sĩ hợp lệ/không tồn tại |
| F02 | Đặt lịch khám | T09 §2.2, §3 | Tạo lịch, lưu dữ liệu, nhận được ID để xem trạng thái; số được cấp về sau bởi worker | POST rồi GET; đối chiếu DB và log |
| F03 | Hủy lịch khám | T09 §2.2, §3 | Lịch chuyển sang trạng thái hủy theo quy tắc đã chốt | DELETE rồi GET, quan sát hàng đợi |
| F04 | Gửi yêu cầu cấp số qua RabbitMQ | T09 §2.3 | Công việc tồn tại trong queue khi worker đang dừng | Dừng worker, đặt lịch, quan sát Ready |
| F05 | Worker sinh số và cập nhật trạng thái hàng đợi | T09 §2.4 | Chạy lại worker; lịch nhận số và GET phản ánh dữ liệu đã lưu | Log worker, DB, API |
| F06 | Cập nhật lượt đang phục vụ theo bác sĩ/phòng khám | T09 §2.5 | Thao tác gọi lượt thay đổi đúng hàng đợi được chọn | Gọi lượt và đọc lại trạng thái |
| F07 | Phát sự kiện khi số thứ tự hoặc lượt phục vụ thay đổi | T09 §2.6, §3 | Cả hai loại thay đổi đi qua RabbitMQ tới subscriber | Log publisher/subscriber và broker |
| F08 | Notification Service gửi SignalR đến client liên quan | T09 §2.7 | Các client theo dõi cùng hàng đợi thấy cập nhật; nhóm khác không nhận nhầm | Mở ít nhất hai nhóm theo dõi |
| F09 | Tra cứu lịch hẹn và hàng đợi hiện tại | T09 §2.8, §3 | GET trả được trạng thái lưu bền sau xử lý/hủy | API và restart service |
| N01 | C#/.NET 10, Minimal API, client Console hoặc Web | G §1 | Các project đúng nền tảng và build được | Đọc csproj, build |
| N02 | Các service tổ chức/chạy độc lập theo kiến trúc | G §1, T09 §1 | API, worker, notification là các tiến trình riêng | Chạy/dừng từng thành phần |
| N03 | Dockerfile cho mỗi service .NET; Compose/network/service name | G §1 | Hệ thống chạy bằng `docker-compose.yml`; gọi nội bộ bằng service name | Config, build image, Compose và luồng demo |
| N04 | Cấu hình tách mã; logging; phục hồi hợp lý | G §1 | Đổi cấu hình không sửa code; theo dõi được luồng; có bảng trước/trong/sau gián đoạn | Thử ghi đè cấu hình, dừng/khởi động thành phần |
| N05 | Lưu dữ liệu tối thiểu | T09 §3 | Có bệnh nhân, bác sĩ/phòng khám, slot, số thứ tự, trạng thái lịch | Đối chiếu schema và dữ liệu demo |
| D01 | Git và GitHub có lịch sử làm bài | G §1–2 | Repository chứa nguồn/cấu hình, commit theo tiến độ thực | Kiểm tra lịch sử và bản nộp |
| D02 | Báo cáo, README, sơ đồ và demo trên máy cá nhân | G §2 | Tái chạy theo README; giải thích giao tiếp; bản máy khớp GitHub | Diễn tập bảo vệ cuối tuần 9 |

## Sáu API tối thiểu phải giữ

```text
GET    /doctors
GET    /doctors/{id}/slots
POST   /appointments
DELETE /appointments/{id}
GET    /appointments/{id}
GET    /queues/{doctorId}
```

Đề xuất bổ sung `POST /queues/{doctorId}/next` để đáp ứng F06; đây là cách thiết kế, không phải endpoint được đề bài liệt kê. Hợp đồng request cần xác định ngày khám và ID thao tác để xử lý gửi lại an toàn. Hợp đồng phản hồi đặt lịch dự kiến có ID, trạng thái và URI xem lịch. Lát cắt tuần 2 vận dụng TH02: tạo resource lịch trong RAM, trả `201 Created` + `Location`, trạng thái dự kiến `PendingNumber`, chưa có số. 201 chỉ xác nhận đã tạo resource, chưa xác nhận gửi job hay cấp số. Khi tích hợp broker, chốt hợp đồng 201/202 theo hành vi thực tế; đề bài không bắt buộc mã 202.

## Phân kỳ thực hành — không thay tiêu chí nghiệm thu cuối

Tuần 2 kết hợp GT02/TH02 trên chính bốn API tra cứu bác sĩ/slot, tạo lịch và đọc lịch. Dữ liệu RAM chỉ phục vụ học HTTP/DTO/validation/status/client; chưa đáp ứng lưu bền N05, luồng F04/F05 hoặc sức chứa/cạnh tranh P01. Trước khi viết POST, chốt trường bệnh nhân giả, kiểu ID, quan hệ slot–bác sĩ và giới hạn giữ chỗ. Tuần 4–5 chuyển dữ liệu sang PostgreSQL; tuần 6 nối cấp số qua RabbitMQ. Các yêu cầu gốc và sáu đường dẫn giữ nguyên.

## Quy tắc nghiệp vụ đề xuất, cần chốt

| ID | Đề xuất | Tình huống kiểm chứng dự kiến |
|---|---|---|
| P01 | Khung giờ có sức chứa, không nhận quá số chỗ | Hai yêu cầu cạnh tranh chỗ cuối; chỉ số lượng còn trống được chấp nhận |
| P02 | Số thứ tự tăng theo bác sĩ + ngày khám; một lịch chỉ có một số | Giao lại cùng yêu cầu và restart worker; không tạo số thứ hai |
| P03 | Cho hủy trước khi bắt đầu khám; không tái sử dụng số đã hủy | Hủy trước/sau cấp số; gọi lượt bỏ qua số bị hủy |
| P04 | Hủy và cấp số đồng thời không đưa lịch đã hủy trở lại hàng chờ | Cho hai thao tác cạnh tranh và kiểm tra trạng thái cuối |
| P05 | Lượt khám theo số đã cấp; không hứa FIFO tuyệt đối khi có nhiều worker | Ghi rõ phạm vi một worker ban đầu và kiểm tra gọi lượt |
| P06 | Client reconnect đăng ký lại nhóm, đọc REST snapshot; xử lý cập nhật cũ | Ngắt kết nối, đổi lượt, kết nối lại; trạng thái hội tụ đúng |
| P07 | Yêu cầu đã tiếp nhận có thể được khôi phục nếu gửi broker thất bại | Mô phỏng lưu DB xong nhưng publish lỗi; phát lại có kiểm soát và không cấp trùng |

Các Pxx là tiêu chí chất lượng đề xuất cho bài này, không trình bày thành yêu cầu nguyên văn của giảng viên. Chi tiết trạng thái, sức chứa, múi giờ/ngày khám và quyền hủy chốt trong tuần 2–4.

## Phần mở rộng theo G §3

Retry/DLQ nâng cao, consumer idempotent dùng chung, correlation ID, health check, structured logging, authentication/authorization, audit/thống kê. Chỉ chọn khi phần bắt buộc đã chạy và còn thời gian. Biện pháp chống cấp trùng tối thiểu của P02 được thiết kế riêng theo nghiệp vụ; không kéo theo một framework mở rộng.
