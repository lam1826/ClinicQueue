# Nguồn và cách áp dụng

Ngày đối chiếu: 2026-11-10. Số trang là trang vật lý PDF, tính từ 1.

Đã đọc toàn bộ hai tài liệu giao đề, 10 PDF giáo trình (226 trang) và 8 PDF thực hành (33 trang): tổng 259 trang PDF, gồm lý thuyết, code, chú thích, ôn tập và bài tập. Phạm vi kiểm tra hình và các sửa đổi nằm trong [báo cáo đọc đầy đủ](reading-review.md); [sổ đọc từng trang](reading-notes.md) ghi chú và SHA-256 từng nguồn. Chưa chạy toàn bộ mã mẫu. Người dùng xác nhận chương N = tuần N.

Thư mục `Hoi_Them` chứa tài liệu bổ sung DOCX, không được dùng làm căn cứ trong đợt này; yêu cầu hiện tại tập trung `Du án`, `Hướng dẫn thực hành trên lớp`, `Giáo trình pdf`.

## Vai trò của ba nhóm nguồn — xác nhận của người dùng

| Nguồn | Quyết định nội dung nào | Cách dùng khi hướng dẫn ClinicQueue |
|---|---|---|
| Giáo trình chapter N | Nguyên lý, khái niệm, luồng xử lý và giới hạn | Giải thích vì sao một bước hoặc cơ chế của ClinicQueue cần được làm như vậy |
| Hướng dẫn thực hành tuần N | Các bước tự làm, cấu trúc, kỹ thuật, phép thử và bài nộp lớp | Bám sát rồi đối chiếu từng bước sang miền bác sĩ/lịch hẹn/hàng đợi; ghi rõ điều chỉnh Web + PostgreSQL |
| Du án: G + T09 | Bài toán, chức năng, sáu API, kiến trúc và sản phẩm phải nộp | Là chuẩn nghiệm thu ClinicQueue; ví dụ Catalog/EduSubmit không thay đổi miền nghiệp vụ |

Luồng hướng dẫn mặc định là **GT → TH → vận dụng ClinicQueue → kiểm chứng/giải thích**. Một minh chứng có thể phục vụ nhiều mục tiêu nếu khớp bảng đối chiếu. Nếu bài lớp phải nộp Catalog/Console theo PDF, ghi riêng yêu cầu đó; không tự tuyên bố Web ClinicQueue thay thế bài nộp gốc. Các lỗi in/mẫu có giới hạn được ghi rõ, không sao máy móc.

Thư mục thực hành hiện có TH01–TH08; tuần 9 dùng GT09 cùng G/T09 để tổng hợp, chưa có PDF TH09 trong thư mục đã kiểm tra.

## Tài liệu giao đề — chuẩn bài toán và nghiệm thu

- **G:** [HUONG-DAN-CHUNG.md](<D:/CODE/Giao_Trinh/Hệ thống phân tán/Du án/HUONG-DAN-CHUNG.md>): §1 nền tảng/service/Docker/cấu hình/log/phục hồi; §2 báo cáo/GitHub/README/bảo vệ; §3 mở rộng không bắt buộc.
- **T09:** [09-he-thong-dat-lich-kham-va-hang-doi.md](<D:/CODE/Giao_Trinh/Hệ thống phân tán/Du án/09-he-thong-dat-lich-kham-va-hang-doi.md>): §1 kiến trúc; §2 tám chức năng; §3 sáu API và dữ liệu tối thiểu.

## Bài thực hành

| Mã / tuần | Tài liệu | Nội dung tiêu biểu sau khi đọc toàn bộ |
|---|---|---|
| TH01 / tuần 1 | [Thuc_hanh_1_2_BasicWebApi.pdf](<D:/CODE/Giao_Trinh/Hệ thống phân tán/Hướng dẫn thực hành trên lớp/Thuc_hanh_1_2_BasicWebApi.pdf>) | 1–3: .slnx, src, Minimal API, DI, kiểm tra dữ liệu RAM mất khi restart |
| TH02 / tuần 2 | [Thuc_hanh_2_2_Catalog_REST_API.pdf](<D:/CODE/Giao_Trinh/Hệ thống phân tán/Hướng dẫn thực hành trên lớp/Thuc_hanh_2_2_Catalog_REST_API.pdf>) | 1–5: API/client, DTO, HTTP status; tr. 4 giới hạn lưu trong RAM |
| TH03 / tuần 3 | [Thuc_hanh_3_2_SignalR.pdf](<D:/CODE/Giao_Trinh/Hệ thống phân tán/Hướng dẫn thực hành trên lớp/Thuc_hanh_3_2_SignalR.pdf>) | 2–4: Hub/Group; tr. 5 reconnect không tự replay/giữ nhóm |
| TH04 / tuần 4 | [Thuc_hanh_4_2_BookCatalog_GraphQL.pdf](<D:/CODE/Giao_Trinh/Hệ thống phân tán/Hướng dẫn thực hành trên lớp/Thuc_hanh_4_2_BookCatalog_GraphQL.pdf>) | 1–4: bài GraphQL riêng; mẫu mô phỏng không phải engine đầy đủ |
| TH05 / tuần 5 | [Thuc_hanh_5_2_CalcGrpc.pdf](<D:/CODE/Giao_Trinh/Hệ thống phân tán/Hướng dẫn thực hành trên lớp/Thuc_hanh_5_2_CalcGrpc.pdf>) | 1–4: bài RPC riêng, .proto, deadline/cancellation |
| TH06 / tuần 6 | [Thuc_hanh_6_2_RabbitMQ.pdf](<D:/CODE/Giao_Trinh/Hệ thống phân tán/Hướng dẫn thực hành trên lớp/Thuc_hanh_6_2_RabbitMQ.pdf>) | 1: Contracts và 7.x; 2–3: durable/persistent/manual ack; 4: chết trước ack, giao lại, phục hồi |
| TH07 / tuần 7 | [Thuc_hanh_7_2_EventDriven_PubSub.pdf](<D:/CODE/Giao_Trinh/Hệ thống phân tán/Hướng dẫn thực hành trên lớp/Thuc_hanh_7_2_EventDriven_PubSub.pdf>) | 1–4: exchange/queue/binding; tr. 3 queue tạm; tr. 4 cầu nối SignalR và giới hạn RAM |
| TH08 / tuần 8 | [Thuc_hanh_8_2_DotNet_Docker.pdf](<D:/CODE/Giao_Trinh/Hệ thống phân tán/Hướng dẫn thực hành trên lớp/Thuc_hanh_8_2_DotNet_Docker.pdf>) | 1: src/.slnx; 2: config, worker không tự có HTTP; 3: Dockerfile/network/readiness; 4: thử lỗi và minh chứng |

## Giáo trình

| Mã | Tài liệu / số trang | Nội dung tiêu biểu sau khi đọc toàn bộ |
|---|---|---|
| GT01 | [chapter01.pdf](<D:/CODE/Giao_Trinh/Hệ thống phân tán/Giáo trình pdf/chapter01.pdf>) — 22 | Tr. 9–10, 15–16: solution/project, .slnx/src; tr. 14–15 làm từng lát cắt |
| SL01 | [Chương 01 - Tổng quan hệ thống và các mô hình trao đổi thông điệp (MEP).pdf](<D:/CODE/Giao_Trinh/Hệ thống phân tán/Giáo trình pdf/Chương 01 - Tổng quan hệ thống và các mô hình trao đổi thông điệp (MEP).pdf>) — 36 | Tr. 14–17 queue/pub-sub; 20 chuỗi REST → queue → event → push; 23, 32 cấu trúc |
| GT02 | [chapter02.pdf](<D:/CODE/Giao_Trinh/Hệ thống phân tán/Giáo trình pdf/chapter02.pdf>) — 21 | Tr. 4 bất đồng bộ; 5–8 tài nguyên/HTTP/DTO; 11 lỗi/xung đột |
| GT03 | [chapter03.pdf](<D:/CODE/Giao_Trinh/Hệ thống phân tán/Giáo trình pdf/chapter03.pdf>) — 19 | Tr. 8 nhóm; 9 reconnect/REST; 14 IHubContext; 15–18 client |
| GT04 | [chapter04.pdf](<D:/CODE/Giao_Trinh/Hệ thống phân tán/Giáo trình pdf/chapter04.pdf>) — 25 | Tr. 4–5 lựa chọn GraphQL; 7–14 mô phỏng; 24–25 bài tập. Học tuần 4, không tự tích hợp vào T09 |
| GT05 | [chapter05.pdf](<D:/CODE/Giao_Trinh/Hệ thống phân tán/Giáo trình pdf/chapter05.pdf>) — 21 | Tr. 5–6 RPC và API công khai/nội bộ; 20–21 ôn tập/bài tập. Học tuần 5, không tự tích hợp vào T09 |
| GT06 | [chapter06.pdf](<D:/CODE/Giao_Trinh/Hệ thống phân tán/Giáo trình pdf/chapter06.pdf>) — 21 | Tr. 1–4 queue/worker; 7 durability; 9–10 ack/giao lại; 17–18 thử dừng worker |
| GT07 | [chapter07.pdf](<D:/CODE/Giao_Trinh/Hệ thống phân tán/Giáo trình pdf/chapter07.pdf>) — 27 | Tr. 7–8 contract/queue tạm; 12 khử trùng RAM; 14 năm project; 19 queue durable; 26 thử subscriber offline |
| GT08 | [chapter08.pdf](<D:/CODE/Giao_Trinh/Hệ thống phân tán/Giáo trình pdf/chapter08.pdf>) — 22 | Tr. 8–11 cấu hình/network; 14 Dockerfile; 16–17 service_healthy; 18–19 build/thử lỗi |
| GT09 | [chapter09.pdf](<D:/CODE/Giao_Trinh/Hệ thống phân tán/Giáo trình pdf/chapter09.pdf>) — 12 | Tr. 2 chọn công nghệ theo nghiệp vụ; tr. 3 chú thích DB chung cho học tập; 8–9 chú giải/thử lỗi |

## Các khác biệt cần ghi nhớ

1. T09 tách Notification Service; GT07 tr. 14 cũng tách. GT09 tr. 2–3 có biến thể gom subscriber/SignalR vào API: ưu tiên kiến trúc T09.
2. TH08 dùng `compose.yaml`; G yêu cầu `docker-compose.yml`: chọn tên trong G.
3. TH07/GT07 §7.2 có queue tạm; GT07 §7.3 tr.19 đã dùng queue durable và tr.26 thử nhận backlog. Áp dụng bản durable cho Notification; tạo queue/binding trước publish, không chờ exchange tự giữ sự kiện chưa có nơi nhận.
4. GT06 có lát cắt worker chỉ in kết quả, API giữ trạng thái chờ. T09 cần số/trạng thái thật lưu DB và đọc được qua REST.
5. Mẫu lưu ID đã xử lý trong RAM chỉ minh họa; không chứng minh chống cấp số trùng qua restart.
6. Các phiên bản package trong bài thực hành là phiên bản của tài liệu, chưa phải kết quả xác minh phiên bản sẽ cài. Chốt và kiểm chứng khi triển khai; không cài thêm trong bước lập kế hoạch.
7. Ba backend độc lập + Contracts + Client bám cách tổ chức GT07 tr.14. Tên ClinicQueue và tests/docs là lựa chọn tổ chức; Web + PostgreSQL đã được người dùng chọn.

8. GT01 tr. 9/TH01 tr. 1 dùng `dotnet new webapi --no-openapi`; GT01 tr. 15/TH02 tr. 1 dùng `dotnet new web`. Hướng dẫn ClinicQueue chọn cách thứ hai cho lát cắt ứng dụng, không tuyên bố sao nguyên bài 1.2.
9. TH02 tr. 1 tạo project ngay dưới root; đường dẫn tham khảo lại dùng src. ClinicQueue thống nhất theo khung src của GT01 tr. 9, 15–16. GT08 tr. 14 dùng docker/ riêng, TH08 tr. 3 đặt Dockerfile trong project; cả hai cách đều có trong bộ tài liệu.

10. TH07 tr.3–4 in `##`/`order.##`; đối chiếu GT07 tr.9 dùng `#`/`order.#`. Đây là lỗi in đã kiểm bằng ảnh, cần ghi chú khi làm tuần 7.
11. TH04 chưa hỗ trợ mutation; không coi chạy query trong parser mẫu là đã có GraphQL engine đầy đủ. TH05 cần thử cả Subtract, HTTP/2 và phân biệt deadline quá khứ/hủy trước gửi với xử lý bị hủy giữa chừng.
12. GT08 tr.11 dùng depends_on dạng ngắn; tr.16–17 dùng service_healthy. Chỉ dạng thứ hai chờ healthcheck khi startup; không dạng nào thay recovery sau đó.

## Nguồn kỹ thuật bổ sung

Các nguồn chính thức sau dùng để đối chiếu giới hạn hoặc phần chuyển sang Web, không thay giao đề:

- [Microsoft: CORS trong ASP.NET Core](https://learn.microsoft.com/en-us/aspnet/core/security/cors?view=aspnetcore-10.0): origin, policy cho Web khác cổng.
- [Docker: thứ tự startup trong Compose](https://docs.docker.com/compose/how-tos/startup-order/): depends_on/service_healthy.
- [RabbitMQ: acknowledgements và confirms](https://www.rabbitmq.com/docs/confirms#publisher-confirms-and-guaranteed-delivery): consumer ACK khác publisher confirm; giới hạn persistence.
- [RabbitMQ: queue properties](https://www.rabbitmq.com/docs/queues#queue-properties): exclusive gắn với connection.
- [RabbitMQ: .NET recovery](https://www.rabbitmq.com/client-libraries/dotnet-api-guide#automatic-recovery-from-network-failures): không tự giải quyết kết nối lần đầu và mọi publish trong lúc mất mạng.

## Skill đã áp dụng

`shared-memory` cho bối cảnh/bàn giao; `prompt-master` đã được mở theo yêu cầu ban đầu; lượt này không tạo prompt vì công việc là đọc/đối chiếu tài liệu; `sdlc-workflow`, `sdlc-intent`, `sdlc-requirements`, `sdlc-plan-artifact` cho phân kỳ/phạm vi/nghiệm thu; `pdf` cho đọc nguồn; `verification-before-completion` cho kiểm tra tài liệu và thao tác đổi tên. Không tạo mã sản phẩm trong lượt lập kế hoạch.
