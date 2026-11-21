# Minh chứng tuần 3 — SignalR

Chạy ngày 2026-11-21 trên Windows, .NET SDK 10.0.403. API ở http://localhost:15100, Web ở http://localhost:15200; cấu hình CORS và `Api:BaseUrl` được ghi đè bằng biến môi trường. Cổng học mặc định vẫn là 5100/5200. Chỉ dùng tên giả.

## 1. Tích hợp SignalR bằng Node — 12/12 PASS

Kịch bản: [scripts/verify-signalr.mjs](../../../../scripts/verify-signalr.mjs). Kết quả đầy đủ: [signalr-tests.json](signalr-tests.json).

| Ca | Nội dung | Thực tế |
|---|---|---|
| T1 | `GET /` vẫn chạy | 200 running |
| T2 | `POST /hubs/appointments/negotiate` | 200; WebSockets, ServerSentEvents, LongPolling; có connectionId |
| T3 | Preflight negotiate từ origin Web | 204; origin khớp; credentials=true; cho phép X-Requested-With, X-SignalR-User-Agent |
| T4 | Preflight từ origin lạ | Không có Access-Control-Allow-Origin |
| T5 | Ba client, mỗi client một kiểu truyền | Connected ×3 |
| T6 | POST lịch hẹn | 201, PendingNumber, queueNumber null, có Location |
| T7 | Client A theo dõi lịch A | Chỉ 1 tin của lịch A: Queued, số 1 |
| T8 | Client B theo dõi lịch B bằng mã viết hoa | Chỉ 1 tin của lịch B: Queued, số 1 |
| T9 | Client C không theo dõi lịch nào | 0 tin |
| T10 | GET lịch A sau thông báo | 200, Queued, số 1, updatedAt > createdAt |
| T11 | Lịch thứ hai của bác sĩ 1 (client Long Polling) | Queued, số 2 |
| T12 | `WatchAppointment("khong-phai-guid")` | Lời gọi bị lỗi phía máy chủ (từ chối) |

Nhật ký API cùng lần chạy (rút gọn):

```text
Ket noi SignalR moi rtBnCQgJ
Ket noi rtBnCQgJ theo doi lich 6a5c5c28-e25b-43c2-964b-fd7e397faca7
Cap so mo phong: lich 6a5c5c28-e25b-43c2-964b-fd7e397faca7 -> Queued, so 1
Cap so mo phong: lich bcae52dd-ee56-455d-bcf1-4f6666c7710e -> Queued, so 1
Cap so mo phong: lich d22d4e29-4766-4b36-80e1-7f7d2f3bacfc -> Queued, so 2
Ngat ket noi SignalR rtBnCQgJ (loi: khong)
```

Chạy lại:

```powershell
npm install @microsoft/signalr@10.0.11 --prefix $env:TEMP\cq-signalr
$env:ASPNETCORE_URLS = 'http://localhost:15100'; $env:Cors__AllowedOrigins__0 = 'http://localhost:15200'
dotnet run --no-launch-profile --project src/ClinicQueue.AppointmentApi
# terminal khác:
node scripts/verify-signalr.mjs $env:TEMP\cq-signalr http://localhost:15100 http://localhost:15200
```

Kịch bản giả định API vừa khởi động (dữ liệu RAM sạch), vì ca T7/T8/T11 kiểm tra số 1 và số 2.

## 2. Trình duyệt thật — 5/5 đạt

Pane trình duyệt của Claude desktop, cùng hai tiến trình 15100/15200.

| Ca | Thao tác | Kết quả quan sát |
|---|---|---|
| B1 | Mở trang | `hubConnection.state = Connected` qua CORS; không có lỗi console |
| B2 | Đặt lịch bác sĩ 1, slot 1 | Ngay sau POST: "Đang chờ cấp số", "Chưa được cấp". Sau 3 giây: "Đã có số, chờ đến lượt khám", số 3 (số 1–2 đã cấp ở phần 1), thông báo "Đã cấp số thứ tự 3…" |
| B3 | Tab 2 đặt lịch bác sĩ 2, slot 3 | Tab 2 nhận số 2 của bác sĩ 2. Tab 1 giữ nguyên lịch và số 3 |
| B4 | Dừng API | Tab 1: `Reconnecting`, "Mất kết nối cập nhật tự động, đang thử kết nối lại…". Bật lại API (trong khung thử lại 0/2/10/30 giây): lần kiểm tra kế tiếp đã `Connected`, trang vào lại nhóm, GET trả 404 và báo dữ liệu RAM đã mất |
| B5 | Tắt API rồi tải lại tab 2 | "Chưa kết nối được cập nhật tự động. Sẽ thử lại sau 5 giây." Bật API: tự `Connected`, không cần tải lại |

## 3. Hồi quy tuần 2 — 15/15 PASS

`scripts/verify-client.cjs` (Playwright, Edge headless) chạy với `Numbering__SimulatedDelaySeconds=3600`, để lịch hẹn giữ `PendingNumber` như kỳ vọng của tuần 2. Đã sửa một dòng chờ: câu thông báo sau đặt lịch đổi từ "…đọc lại thành công…" thành câu bắt đầu bằng "Đã đặt lịch".

Kết quả: 15 nhóm PASS, gồm CORS cho POST JSON, 7 nhánh lỗi POST, Location, 201 kèm lỗi đọc lại, API dừng, restart RAM, desktop/mobile không tràn ngang và không có lỗi JavaScript chưa xử lý.

## Kiểm tra thủ công bổ sung

- `GET http://localhost:15100/hubs/appointments` trả `400 Bad Request` với nội dung `Connection ID required`. URL hub không phải endpoint REST để mở bằng trình duyệt (TH03 bước 7.3).
- `node --check src/ClinicQueue.Client/wwwroot/app.js`: đạt. `dotnet build ClinicQueue.slnx`: 0 cảnh báo, 0 lỗi.
