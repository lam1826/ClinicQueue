# Kiểm chứng tách Client/Server — 2026-11-10

## Phạm vi và môi trường

Hai project net10.0 trong ClinicQueue.slnx; SDK 10.0.403, Node và Playwright có sẵn trong runtime Codex, Edge headless trên Windows. Git master chưa có commit; kiểm tra trực tiếp mã làm việc, không có baseline commit để dùng git diff làm bằng chứng toàn bộ.

Build cuối: `dotnet build ClinicQueue.slnx --nologo` — PASS, 0 warning, 0 error.
`node --check src/ClinicQueue.Client/wwwroot/app.js` — PASS.

Kịch bản: [verify-client.cjs](../../../scripts/verify-client.cjs). Kịch bản chạy API và Web ở localhost:15100/15200, override cấu hình API/CORS bằng biến môi trường, chỉ dùng tên giả. Cổng học mặc định vẫn là 5100/5200. Hai tiến trình do kịch bản tạo được dừng trong finally; không tác động dịch vụ người dùng.

Lệnh đã chạy (sau build):

```powershell
$env:CLINICQUEUE_PLAYWRIGHT = 'C:\Program Files\WindowsApps\OpenAI.CodexPrimaryRuntime.v26-1104-2876-0_26.1104.2876.0_x64__3k8sg7r9htsxt\dependencies\node\node_modules\playwright'
node scripts/verify-client.cjs
```

Trên máy khác cần Playwright và Edge tương ứng; biến trên chọn module đã cài, không phải dependency runtime của sản phẩm.

## Kết quả giai đoạn tách client/server: 11 nhóm PASS

| Kiểm tra | Kết quả thực tế |
|---|---|
| Ranh giới | Hai PID/cổng riêng; Client /doctors trả 404; API /app.js trả 404 |
| CORS | OPTIONS POST JSON trả 204/origin đúng; origin lạ không có Allow-Origin |
| Lỗi form | Browser gửi tên toàn khoảng trắng, hiển thị HTTP 400 |
| Luồng chính | GET bác sĩ/slot → POST 201 → browser đọc Location → GET lịch; ghế 3→2 |
| Lỗi nghiệp vụ | 7 POST lỗi đúng status/code; 2 GET lịch lỗi 404; số chỗ giữ nguyên sau POST lỗi |
| Đổi bác sĩ | Slot cũ bị xóa; bác sĩ không có slot hiển thị trạng thái rỗng |
| GET sau POST lỗi mạng | Lịch đã tạo giữ ID, không tự POST lại; nút đọc lại phục hồi |
| Body POST lỗi | POST thật giữ 201/Location nhưng body đổi thành JSON hỏng; giữ Location, đọc lại được, không POST lặp; cập nhật slot hết chỗ |
| Giao diện | 1280x900 và 390x844 không tràn ngang, không pageerror; đã xem ảnh desktop/mobile |
| API dừng | Web vẫn tải trang, hiển thị lỗi kết nối |
| API restart | GET lịch cũ 404, slot mẫu về 3 chỗ; Web tải lại được |

Các body lỗi POST đã chạy: tên trắng / doctorId=0 / slotId=0 → 400 INVALID_APPOINTMENT; doctorId=999 → 404 DOCTOR_NOT_FOUND; slotId=999 → 404 SLOT_NOT_FOUND; doctorId=2 và slotId=1 → 400 SLOT_DOCTOR_MISMATCH; doctorId=1 và slotId=2 → 409 SLOT_FULL.

## Lỗi tìm thấy và sửa

Lần đầu, ca 201 với JSON hỏng thất bại (client chưa ghi nhận trạng thái đã tạo khi request ném lỗi parse). Đã giữ response/status/Location trên lỗi và phục hồi bằng GET. Lần chạy cuối đạt toàn bộ 11 nhóm, exit 0. Luồng đọc lại cũng cập nhật slot để bỏ lựa chọn đã hết chỗ.

Kết quả máy đọc và ảnh nằm trong artifacts/client-check (được gitignore): results.json, desktop.png, mobile.png. Không lưu log dài hoặc dữ liệu thật. Detector UI chạy một lần với regex fallback, không đánh giá computed contrast; không dùng kết quả rỗng để tuyên bố kiểm định accessibility đầy đủ.

## Giới hạn

Đã kiểm chứng phần kỹ thuật của thay đổi và một số yêu cầu TH02 bước 10–12. Không suy ra đã hoàn thành hiểu bài/bài nộp tuần 2. Chưa có PostgreSQL, RabbitMQ, cấp số, hủy lịch hoặc bảo đảm phân tán. Không kiểm HTTPS/publish/production. Không cài dependency sản phẩm mới.

## Hoàn thiện toàn bộ tuần 2 — 2026-11-10 (kết quả mới nhất)

Bổ sung GET /doctors/{id}, Web đọc chi tiết trướcPOST (GT02BT3), lọc keyword (TH02b13 mở rộng), client hiển thị code/message, và bác sĩ4 (GT02BT2).

- Build chuẩn bị bị MSB3027/MSB3021 vì API người dùng đang chạy giữ apphost.exe. Không dừng tiến trình người dùng; chuyển build sang thư mục artifacts riêng.
- Lệnh cuối: `dotnet build ClinicQueue.slnx --nologo --artifacts-path artifacts/week-02-build` — PASS, 0 warning/error.
- Baseline3bác sĩ:14nhómPASS. Chỉ sửa seed API thêm bác sĩ4; Client không đổi; lượt cuối4bác sĩ:14nhómPASS,31bản ghiHTTP.
- Hash Client trước/sau giống nhau, xác minh bằng assert; bằng chứng ở newFixtureProof trong JSON.
- Môi trường test API=Production để lỗi binding có body gọn; Web=Development. Cổng riêng15100/15200, tên giả; tự dừng tiến trình test. Hai profile dùng thật vẫn5100/5200.
- Đã xem ảnh desktop1280x900 và mobile390x844 sau bổ sung ô tìm kiếm; không tràn ngang.
- [Bảng request/response thực tế](../../weekly/evidence/week-02/README.md), [JSON](../../weekly/evidence/week-02/http-cases.json), [request thủ công](../../weekly/week-02.http).
- 31bản ghi gồm cácGET/query/detail/empty/404,POST201 vàGETDTO bằng nhau,7lỗi nghiệp vụ,400binding,so sánhchỗ2bác sĩ,cùngIDtrước/sau restart.14nhóm còn kiểm browser/CORS/recovery/offline/layout.

Biến thêm khi chạy script với bản build riêng:

```powershell
$env:CLINICQUEUE_BUILD_ROOT = 'D:\CODE\TREN_LOP\He_Thong_Phan_Tan\ClinicQueue\artifacts\week-02-build'
$env:CLINICQUEUE_EXPECTED_DOCTORS = '4'
node scripts/verify-client.cjs
```

Dùng cùng CLINICQUEUE_PLAYWRIGHT đã nêu ở trên. Script mặc định ghi kết quả vào artifacts/client-check. Lần tạo hồ sơ dùng CLINICQUEUE_CAPTURE_EVIDENCE=1 sau baseline3; điều kiện này kiểm hashbaseline để không giả tạo bằng chứng BT2. Chạy thông thường với4bác sĩ không cần baseline và không bật capture.

Phần triển khai/kiểm chứng/bài giải tuần2 đã hoàn thiện cho ClinicQueue. Đây là chuyển thể theo lựa chọn người học; không có xác nhận đã nộp hoặc thay bài Catalog/Console của lớp.
