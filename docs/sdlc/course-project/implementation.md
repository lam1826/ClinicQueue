# Triển khai tách Client/Server — tuần 2

Trước thay đổi: người học đã tạo Client trong solution, nhưng Client chỉ trả Hello World. API chứa dữ liệu RAM và các endpoint nghiệp vụ.

Sau thay đổi: Client phục vụ HTML/CSS/JavaScript và cấu hình API công khai; browser gọi API trực tiếp bằng HTTP. API vẫn giữ các route, DTO, validation và giữ chỗ; chỉ thêm CORS. Hai project không có ProjectReference/PackageReference mới.

| Tiêu chí | Điểm triển khai | Kiểm chứng |
|---|---|---|
| Hai ứng dụng độc lập | Hai csproj/Program.cs, profile http 5100/5200 | Build/solution list; hai PID trong test |
| Giao diện gọi HTTP | Client wwwroot/app.js, /client-config | Browser GET/POST/GET Location |
| Browser đọc Location | API CORS origin/method/header/exposed header | Preflight và luồng browser |
| Phục hồi lỗi | Status/body/network phân biệt; không tự POST lại | 400/404/409, API tắt, 201+body/GET lỗi |
| Giới hạn RAM rõ | Giao diện chú thích demo, trạng thái chờ cấp số | Restart lịch mất, seats về seed |

Phạm vi giữ nguyên business endpoint và dữ liệu mẫu, không di chuyển DTO/server sang Client. Không thêm package ứng dụng. Chỉ cấu hình profile http; HTTPS mẫu giữ nguyên. Thay đổi có thể đảo bằng khôi phục Client Hello World, bỏ CORS và các cấu hình thêm; không có migration dữ liệu.

Giải thích từng phần: [Tách client/server](../../../Giai_thich/Tach_Client_Server_Tuan2.md).
Bằng chứng lệnh/kết quả: [test-report.md](test-report.md).
Nguồn: GT01 tr15, GT02 tr11–13, TH02 bước1/6/11; Web là chuyển thể của Console theo lựa chọn người học.


## Hoàn thiện tuần2

Bổ sung GET chi tiết bác sĩ trước POST, query keyword tùy chọn, fixturebác sĩ4 và Code/Message ở Web. Giữ luồngHTTP/RAM; không thêm package/backend khác. Đã kiểm14nhóm và ghi31request/response; chứngminh3→4bác sĩ khôngđổiClient. Xem week02, test-report mục mới nhất và Giai_thich/On_tap_Tuan2.md.
