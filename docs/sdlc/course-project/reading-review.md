# Đọc toàn bộ giáo trình và rà lại kế hoạch ClinicQueue

Ngày 2026-11-10. Người dùng xác nhận **chương N tương ứng tuần N**; làm cá nhân, hiện tuần 2, đã chọn Web + PostgreSQL.

## Điều chỉnh cách áp dụng sau xác nhận của người dùng

Người dùng yêu cầu kết hợp GT và TH để phục vụ ClinicQueue. Kết quả đọc dưới đây giữ nguyên; cách hướng dẫn hiện hành được cập nhật thành GT → TH → áp dụng trực tiếp vào ClinicQueue. Các nhận xét về bài Catalog/Console riêng mô tả yêu cầu nộp của TH02, không còn là điều kiện mặc định phải dựng thêm bài mẫu trước khi học dự án. Tuần 2 bổ sung POST/GET lịch RAM để học đầy đủ kỹ thuật TH02 trên miền khám bệnh; chưa coi là lưu bền hoặc cấp số hoàn chỉnh.

## Kết quả và phạm vi

Đã đọc toàn bộ **18 PDF, 259 trang**: 9 chương (190 trang), bộ slide chương 1 (36 trang), 8 bài thực hành (33 trang); đồng thời đọc toàn bộ hướng dẫn chung và đề tài 09. Lượt rà trước chỉ đọc sâu phần liên quan; báo cáo này ghi nhận lượt đọc đầy đủ sau yêu cầu mới, không sửa lại lịch sử đó.

Việc đọc gồm lý thuyết, bảng, listing, chú thích, câu hỏi ôn tập, bài tập và phần ứng dụng EduSubmit. Ba nhóm đọc lần lượt chương 1–3, 4–6, 7–9 cùng bài thực hành tương ứng; root đọc 36 slide, tổng hợp và đối chiếu kế hoạch. Ngoài toàn văn, đã xem 15 hình nhúng chương 1–3, 15 trang có hình của chương 4–6, 21 trang của chương 7–9/TH07 và toàn bộ 36 slide. Không tuyên bố xem ảnh của mọi trang PDF.

[Sổ đọc từng trang](reading-notes.md) có đúng một ghi chú cho từng trang, đường dẫn và SHA-256 từng PDF. [Danh mục nguồn](sources.md) cung cấp mã GT/TH/G/T09. Đây là bằng chứng đọc và đối chiếu tĩnh; chưa chạy toàn bộ mã minh họa hoặc nghiệm thu ứng dụng.

| Tài liệu | Trang đã đọc | Tuần tương ứng |
|---|---:|---|
| GT01 / chapter01 | 22/22 | 1; ôn bù khi cần |
| SL01 / slide tổng quan MEP | 36/36 | Bổ trợ chương 1 |
| GT02 / chapter02 | 21/21 | 2 — hiện tại |
| GT03 / chapter03 | 19/19 | 3 |
| GT04 / chapter04 | 25/25 | 4 |
| GT05 / chapter05 | 21/21 | 5 |
| GT06 / chapter06 | 21/21 | 6 |
| GT07 / chapter07 | 27/27 | 7 |
| GT08 / chapter08 | 22/22 | 8 |
| GT09 / chapter09 | 12/12 | 9 |
| TH01 / BasicWebApi | 3/3 | 1 |
| TH02 / Catalog REST | 5/5 | 2 |
| TH03 / SignalR | 5/5 | 3 |
| TH04 / BookCatalog GraphQL | 4/4 | 4 |
| TH05 / CalcGrpc | 4/4 | 5 |
| TH06 / RabbitMQ | 4/4 | 6 |
| TH07 / EventDriven PubSub | 4/4 | 7 |
| TH08 / DotNet Docker | 4/4 | 8 |
| **Tổng PDF** | **259/259** | **Không thiếu trang trong phạm vi này** |

Hai Markdown G/T09 không tính vào 259 trang. Tài liệu DOCX bổ sung trong Hoi_Them và các đề tài khác không thuộc bộ giáo trình/bài thực hành dùng cho đợt rà này.

## Các điều chỉnh đã đưa vào hướng dẫn

| Nội dung | Căn cứ | Điều chỉnh |
|---|---|---|
| Chương = tuần | Xác nhận trực tiếp của người dùng | Giữ đúng tuần 2 REST, 3 SignalR, 4 GraphQL, 5 gRPC, 6 queue, 7 Pub/Sub, 8 Docker/vận hành, 9 tổng hợp; không chuyển tuần 4–5 thành chỉ làm DB |
| Tuần 2 rộng hơn Hello World | GT02 tr.1–21; TH02 tr.1–5 | Bổ sung HTTP/URI/method/safe/idempotent/stateless/DTO, cả Catalog và EduSubmit, câu hỏi/bài tập; GET/POST lịch ClinicQueue là phần vận dụng theo hướng dẫn đã điều chỉnh |
| Đủ thực hành REST | TH02 tr.3–5 | Ít nhất 6 ca, POST/validation/201/Location, client xử lý lỗi, GET lại và restart RAM; Console mẫu là GET list → POST valid → GET /api/products/1 → POST invalid |
| Sai kiểu ID khác ID không tồn tại | GT02 tr.8–11; TH02 tr.2,4 | Với `{id:int}`, /abc không match route nên 404; không nhầm với binding int trả 400 khi không có constraint. Không mặc định mọi lỗi có ApiError |
| Cấu trúc solution | GT01 tr.9,15–16; TH01 tr.1; GT07 tr.14 | Root .slnx, src/<Project>, tạo dần API/client/worker/notification/contracts; không buộc tạo sẵn các tầng hoặc project trống |
| Web là lựa chọn của dự án | G §1; TH02 dùng Console | Đối chiếu Console mẫu sang Web ClinicQueue: gọi HTTP, kiểm status/lỗi mạng/CORS; bài nộp Console gốc vẫn có yêu cầu riêng |
| SignalR cần học đúng giới hạn | GT03 tr.8–9,14–19; TH03 tr.3–5 | Caller/All/Group, thử client khác nhóm; StartAsync đầu tiên, reconnect/rejoin và REST snapshot; Task.Delay chưa phải RabbitMQ worker |
| GraphQL học đủ nhưng mẫu có giới hạn | GT04 tr.7–14; TH04 tr.1–3 | Tuần 4 học query/mutation trong lý thuyết; bài BookCatalog chỉ query A/B/C và lỗi, parser chưa hỗ trợ mutation. Không yêu cầu tích hợp GraphQL vào đề tài 09 |
| gRPC không chỉ chạy client mẫu | TH05 tr.3–4 | Tuần 5 đủ bốn phép tính, chia 0, HTTP/2, deadline/cancellation/lỗi mạng; phân biệt hủy trước gửi với hủy khi server đang xử lý |
| Queue không bảo đảm xử lý đúng một lần | GT06 tr.4,6,10,20; TH06 tr.3–4 | Đọc thống nhất theo at-least-once/redelivery; JSON lỗi cần catch JsonException. Worker chỉ log/ACK và API vẫn Processing chưa hoàn thành nghiệp vụ lưu bền |
| Notification queue có bản durable trong giáo trình | GT07 §7.2 tr.8–11; §7.3 tr.19,26 | Dùng bản durable cho ứng dụng; topology/binding phải có trước publish; dictionary RAM và publish trước ACK không thay giao dịch DB–message |
| Lỗi ký tự wildcard | TH07 tr.3–4 đối chiếu GT07 tr.9 | TH07 thực sự in `##`/`order.##`; dùng `#`/`order.#` theo phần định nghĩa GT07, không chép lỗi in |
| Docker readiness | GT08 tr.11,16–17; TH08 tr.2–3 | Phân biệt depends_on ngắn với condition: service_healthy; cả hai không xử lý recovery lúc chạy. Worker không tự có HTTP health; kiểm tra curl trong image |
| Tuần 9 phải giải thích được kiến trúc | GT09 tr.8–12 | Sơ đồ có hướng/giao thức/sync–async, ≥3 điểm lỗi, bảng MEP/lỗi/phục hồi, thuyết minh 300–500 từ; không suy CAP từ riêng HTTP 202 |

## Tổ chức thư mục đã chọn

Cấu trúc hiện có được kiểm tra: `ClinicQueue.slnx` ở root, project `src/ClinicQueue.AppointmentApi` dùng SDK Web/net10.0, Program.cs Hello World, entry project nằm trong solution. Chưa có bằng chứng build/run trong đợt đọc này.

`dotnet new web` có căn cứ GT01 §1.3/TH02; TH01 dùng biến thể `webapi --no-openapi`. TH02 có lệnh đặt project ở root; ClinicQueue chọn nhất quán src theo GT01. Dockerfile chọn trong từng project chạy như service theo TH08; GT08 còn có biến thể docker/ riêng. Tên docker-compose.yml ưu tiên theo G. docs/tests/.agent-memory là phần bổ sung của dự án, không gán là quy định nguyên văn của giáo trình.

Khung cuối vẫn theo T09: Appointment API → RabbitMQ job → Queue Worker → DB; Worker → RabbitMQ event → Notification Service → SignalR → Web. Contracts là thư viện; Notification là service độc lập dù GT09 có ví dụ gộp nó vào API. Sáu API và các F/N/D trong [requirements](requirements.md) được giữ nguyên. P01–P07 còn là quy tắc đề xuất; các cơ chế mở rộng ở G §3 không bị nâng thành yêu cầu chấm bắt buộc.

## Tiếp tục tuần 2

[Hướng dẫn tuần 2](../../weekly/week-02.md) đi từ API đã có: kiểm tra solution → người học build/run → quan sát HTTP → vận dụng TH02 qua GET bác sĩ/slot + POST/GET lịch RAM → Web client riêng → minh chứng. Không tạo lại project hiện có; chưa đánh dấu bài học hoàn thành từ việc mới có mã Hello World.

[Kế hoạch tuần 2–9](plan.md) nối kiến thức, bước thực hành và đầu ra ClinicQueue, gắn đúng chương từng tuần. Yêu cầu nộp mẫu riêng của lớp được ghi theo PDF. PostgreSQL được chuẩn bị và đưa vào lưu bền ở tuần 4–5; đây là phân kỳ xây sản phẩm, không thay nội dung GraphQL/gRPC của hai tuần đó.
