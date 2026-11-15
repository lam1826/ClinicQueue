# Sổ đọc đầy đủ giáo trình và thực hành

Ngày đọc và đối chiếu: **2026-11-10**. Phạm vi: **18 PDF, 259/259 trang**, gồm 10 PDF giáo trình/slide (226 trang) và 8 PDF thực hành (33 trang).

Sổ này hợp nhất ghi chú của ba lane `full_read_01_03`, `full_read_04_06`, `full_read_07_09` và root. Các lane đã đọc văn bản, listing/mã nguồn, bảng, chú thích, câu hỏi ôn tập và bài tập của từng trang; root đọc bộ slide. Ghi chú dưới đây là diễn giải ngắn để truy vết, không sao chép nguyên văn PDF và không thay thế nội dung gốc.

Kiểm tra trực quan được ghi riêng với việc đọc đầy đủ văn bản: lane chương 1–3 xem 15 hình nhúng; lane chương 4–6 xem 15 trang; lane chương 7–9 xem 21 trang; root xem cả 36 slide. Không tuyên bố đã render từng trang của toàn bộ 18 PDF. Việc đọc mã không đồng nghĩa đã build, chạy hoặc kiểm thử các listing.

Người dùng xác nhận chương N tương ứng tuần N. Các ghi chú dùng số trang vật lý trong PDF. Mỗi nguồn có đủ dải trang từ 1 đến trang cuối; số trang và SHA256 đã đối chiếu với tệp gốc khi hợp nhất. `reading-coverage.json` lưu danh mục để kiểm tra tự động.

Đính chính Catalog: hoạt động thứ 3 của Console mẫu là GET `/api/products/1` (GT02 tr.12; TH02 tr.2,4). Lấy URI từ `Location` rồi GET sản phẩm vừa tạo là phép thử riêng tại TH02 tr.3. Các ghi chú liên quan bên dưới đã phân biệt hai việc này.

## GT01 — chapter01.pdf

Nguồn: [chapter01.pdf](<D:/CODE/Giao_Trinh/Hệ thống phân tán/Giáo trình pdf/chapter01.pdf>). Đã đọc: **22/22 trang**. Người đọc: `full_read_01_03`.

SHA256: `6f64a8e6808a7fbe87179c3ab7cd16e32ce7771e8e1cbb49559b0103568e10da`.

- **Trang 1.** Định nghĩa các thành phần tự trị phối hợp thành hệ thống thống nhất; phân biệt lời gọi hàm trong monolith với giao tiếp qua mạng; mục tiêu là MEP, client/server và API đầu tiên.
- **Trang 2.** Hình 1.1 cho thấy Client/API/DB/Worker/Broker dưới góc nhìn người dùng; mạng tạo thêm độ trễ, lỗi, retry, định dạng và nhu cầu theo dõi, không chỉ chia mã thành nhiều thư mục.
- **Trang 3.** API và client chạy hai tiến trình trên cùng máy vẫn có ranh giới mạng; vai trò client/server tùy tương tác; hình 1.2 thể hiện client gửi request và API đọc/ghi database.
- **Trang 4.** MEP được chọn trước công nghệ; request–response phù hợp tác vụ ngắn, tác vụ dài nên nhận rồi xử lý sau; hình 1.3 phân biệt nội dung request và status/kết quả response.
- **Trang 5.** One-way không có nghĩa tác vụ nghiệp vụ đã hoàn thành; work queue giao công việc cho một worker trong pool; cần xem độ bền, retry, bản tin lỗi, xử lý lặp và thứ tự; hình 1.4 chỉ đường queue→worker.
- **Trang 6.** Publisher phát sự kiện không cần biết các subscriber; ví dụ SubmissionGraded cho bảng điểm/thông báo/thống kê; streaming/push là kết nối dài cần cân nhắc người nhận và lưu lượng; hình 1.5 mô tả nhiều subscriber.
- **Trang 7.** Hình 1.6 mô tả server chủ động cập nhật trên kết nối dài; bảng ánh xạ request–response, queue, pub/sub, streaming/push với REST/GraphQL/gRPC, RabbitMQ và SignalR/SSE.
- **Trang 8.** RabbitMQ có thể phục vụ queue và pub/sub, SignalR che bớt transport; luồng tổng hợp REST→job→event→push giải thích cách kết hợp; bài Minimal API đầu không cần thêm gói ngoài.
- **Trang 9.** Khung `.slnx` ở root và project trong `src`; `.csproj` dùng SDK Web/net10/nullable/implicit usings; lệnh `webapi --no-openapi`; tạo một API đầu tiên là bước hợp lệ.
- **Trang 10.** Solution là đơn vị quản lý/build, không tự chạy; dịch vụ đăng ký trước Build, endpoint trước Run; singleton GreetingService dùng Interlocked cấp ID trong ví dụ.
- **Trang 11.** Hình 1.7 có 5 bước CreateBuilder/Services/Build/Map/Run; mã GET root JSON, GET hello có route/query và POST greetings trả 400 hoặc Created; Minimal API vẫn dùng DI.
- **Trang 12.** Bảng binding phân biệt route, query, JSON body và DI; các record ApiError/StoredGreeting và GreetingService cho thấy dữ liệu vào/ra có hợp đồng, 201 trả Location.
- **Trang 13.** DTO không đồng nghĩa lưu bền; nguồn nêu SDK10.0.301 như môi trường ví dụ, không bắt buộc đúng bản patch; hướng dẫn build/run5081, GET/POST lỗi và kiểm tra cwd/cổng/framework.
- **Trang 14.** EduSubmit được xây từng lát cắt qua các chương, chưa đưa auth/DB/queue vào bài đầu; mục tiêu là quan sát API và client giao tiếp HTTP.
- **Trang 15.** Bảng tiến trình các chương và `dotnet new web` cho Submission.Api; API/client là các chương trình riêng; đây là căn cứ chọn template web cho ClinicQueue.
- **Trang 16.** Tạo console client dưới src và add solution; GET health/assignments, POST submissions là lát cắt máy chủ; hai tiến trình cùng host vẫn cần URL và HTTP.
- **Trang 17.** Hình 1.8 đi từ RAM data qua GET/POST đến status; mã POST kiểm tra trường, tạo GUID, trạng thái received và UTC rồi trả Created; record đặt cuối Program.cs.
- **Trang 18.** Dữ liệu RAM để tập trung giao tiếp, không phải cơ chế lưu bền; body JSON được bind DTO rồi validation; build/run API5000 và client thật xác nhận ranh giới HTTP.
- **Trang 19.** Hình 1.9 mô tả URL/HttpClient/GET/POST/kiểm tra response; client dùng GetFromJson/PostAsJson, EnsureSuccessStatusCode và các record cùng hình dạng hợp đồng.
- **Trang 20.** API URL nhận từ đối số; DTO client/server cùng hình dạng không có nghĩa client gọi trực tiếp mã server; chạy hai terminal, GUID thay đổi và chủ động thử API tắt.
- **Trang 21.** Khi lỗi cần kiểm tra URL, endpoint và hình dạng dữ liệu; phần tổng kết và câu hỏi 1–7 ôn ranh giới phân tán, MEP và client/server.
- **Trang 22.** Câu hỏi 8–10 và bài tập yêu cầu phân biệt queue/pubsub/push, chạy API+client, thêm dữ liệu, thử API offline/POST sai; thảo luận chọn MEP theo bài toán.

## GT02 — chapter02.pdf

Nguồn: [chapter02.pdf](<D:/CODE/Giao_Trinh/Hệ thống phân tán/Giáo trình pdf/chapter02.pdf>). Đã đọc: **21/21 trang**. Người đọc: `full_read_01_03`.

SHA256: `8671b630eebec842065c3e84d4ee4eb3d6aea7f4660e8cd144c234611606e3a6`.

- **Trang 1.** Mục tiêu bao gồm HTTP message, URI/method/status, DTO và client xử lý lỗi; REST tổ chức tài nguyên cùng hợp đồng stateless, không đơn thuần là đặt URL.
- **Trang 2.** Hình 2.1 tách request method/URI/headers/body và response status/headers/body; ví dụ POST gửi JSON với Content-Type/Accept.
- **Trang 3.** Hình 2.2 minh họa cấu trúc HTTP; 201 Location chỉ tài nguyên vừa tạo; mạng có timeout/lặp request nên client không được coi mọi thất bại là cùng loại. Hình minh họa có GET/body, không nên sao máy móc thành hướng dẫn thiết kế GET có body.
- **Trang 4.** Công việc dài có thể dùng 202/job rồi xử lý nền; URI lấy danh từ tài nguyên và quan hệ cha–con; path xác định tài nguyên, query lọc hoặc chọn dữ liệu.
- **Trang 5.** GET/POST/PUT/PATCH/DELETE có ý nghĩa khác nhau; safe/idempotent nói về tác động, không bắt buộc response giống nhau; stateless không có nghĩa không dùng DB.
- **Trang 6.** Hợp đồng phải xét đầu vào route/query/header/body, đầu ra và retry; bảng status gồm 200/201/204/400/401/403/404; DTO tách entity và tránh lộ trường không thuộc hợp đồng.
- **Trang 7.** Client tiêu thụ API theo hợp đồng qua bốn bước xác định tài nguyên, đầu vào, công cụ và kiểm tra status/body; cú pháp curl JSON cần đúng shell.
- **Trang 8.** Lỗi mạng khác HTTP400/404; Catalog có 3 endpoint nghiệp vụ và root; `{id:int}` kiểm tra route trước handler, là tiền đề thử sai kiểu ID.
- **Trang 9.** Đọc đầy đủ listing Catalog RAM 3 sản phẩm: root, list, detail404, POST validation/Trim/Max+1/Created; mã minh họa không phải cơ chế cấp số cạnh tranh của dự án.
- **Trang 10.** ProductDto/CreateProductRequest/ApiError là hợp đồng riêng; server tự sinh ID, client không truyền ID khi tạo; binding route/query/JSON/DI cần được giải thích.
- **Trang 11.** Validation trước thay đổi dữ liệu; ApiError có code/message; Created trả Location lẫn DTO; status 200/201/400/404 gắn với hành vi, còn 204/401/409 mở rộng ngữ nghĩa.
- **Trang 12.** Listing 2.2 dùng Console HttpClient với base URL5100 và bốn hoạt động: GET danh sách, POST hợp lệ rồi kiểm tra Created, GET /api/products/1, POST sai để quan sát400; không deserialize thành công trước kiểm tra HTTP status.
- **Trang 13.** Phần cuối client đọc lỗi và record; HttpClient trực tiếp phù hợp chương trình nhỏ, app lớn cân nhắc factory; §2.3 giữ cùng domain EduSubmit để thấy hợp đồng tiến bộ.
- **Trang 14.** Cây solution/src/API/client và hình 2.3 tổ chức resource→DTO→GET→POST→errors; parent assignment được đưa vào đường dẫn POST; một chuỗi đường dẫn section02 lệch cây section03 cần đọc theo mục/solution thực.
- **Trang 15.** Listing EduSubmit REST kiểm tra assignment tồn tại, còn mở và trường request; POST tạo GUID/trạng thái received/UTC/Created; GET list/detail vẫn theo tài nguyên.
- **Trang 16.** GET submission với guid và 404, DTO đầy đủ; tác giả nói rõ RAM mất sau restart để tập trung thiết kế hợp đồng HTTP, không xem đó là kiến trúc lưu trữ cuối.
- **Trang 17.** Build/runAPI5000; chương1 tập giao tiếp, chương2 tập hợp đồng REST; hình 2.4 nhấn mạnh client GET→POST201→đọc lại→thử lỗi.
- **Trang 18.** Client đầy đủ chọn assignment, POST hợp lệ, đọc lại submission, POST sai; helper đọc lỗi sau nhánh status, thể hiện cách kiểm tra response theo hợp đồng.
- **Trang 19.** Record và phần giải thích client hoàn tất; chạy hai terminal, GUID mỗi lần khác; client phải phân biệt Created với các status thất bại thay vì cùng một nhánh.
- **Trang 20.** Sai route, body không hợp lệ và API chưa chạy là ba lỗi khác nhau; tổng kết HTTP/URI/DTO/stateless và câu hỏi1–9 phải nằm trong học chương2.
- **Trang 21.** Câu hỏi10 hỏi Created/Location; bài tập chạy ví dụ, thêm assignment không sửa client, đọc chi tiết được chọn, thử ID404; thảo luận parent–child và vì sao không trả entity DB trực tiếp.

## GT03 — chapter03.pdf

Nguồn: [chapter03.pdf](<D:/CODE/Giao_Trinh/Hệ thống phân tán/Giáo trình pdf/chapter03.pdf>). Đã đọc: **19/19 trang**. Người đọc: `full_read_01_03`.

SHA256: `2478014be1cd48ae723d65e4dfec72dae5d7ca22c475ac5a796e5cec7be1a43b`.

- **Trang 1.** Realtime ở đây là gần thời gian thực, không phải cam kết deadline cứng; polling tạo request lặp, push phù hợp thay đổi trạng thái; mục tiêu Hub/groups/reconnect kết hợp REST.
- **Trang 2.** Bảng phân biệt request–response, push và streaming; realtime không phải nguồn dữ liệu gốc; WebSocket là giao thức hai chiều, SignalR là lớp lập trình cao hơn.
- **Trang 3.** SignalR ưu tiên WebSocket rồi fallback SSE/long polling; phải quyết định trigger, người nhận, payload và khôi phục; không cần push dữ liệu tĩnh, có luồng REST→queue→event→SignalR.
- **Trang 4.** PingApi đăng ký AddSignalR trước Build, MapHub sau Build trước Run; hub route là nơi thiết lập kết nối, khác một GET REST trả tài nguyên.
- **Trang 5.** PingHub gồm Echo đến Caller, Broadcast đến All, JoinGroup/SendToGroup và lifecycle; ConnectionId rút gọn để quan sát kết nối, các tên message là hợp đồng với client.
- **Trang 6.** Hub public method có thể được gọi từ client; SendAsync event-name phải khớp On<T>, compiler không phát hiện mọi lỗi tên; tạo HubConnection và đăng ký handler trước Start.
- **Trang 7.** PingClient dùng cổng5200, bốn callback và Reconnecting/Closed; kết nối rồi Echo, JoinGroup, SendToGroup, có Task.Delay ngắn để quan sát.
- **Trang 8.** Client Broadcast và giữ tiến trình để nhận tin; InvokeAsync/SendAsync khác cách chờ; 4 phạm vi All/Caller/Group/Client phục vụ mục đích người nhận khác nhau.
- **Trang 9.** Server có OnConnected/Disconnected, client có Reconnecting/Closed và chính sách retry mẫu 0/2/10/30; khôi phục kết nối cần đọc lại trạng thái; mở §3.3 REST tạo/đọc, SignalR thông báo.
- **Trang 10.** Luồng connect→REST create→watch ID→state updates; root solution và src API/client; hình3.1 đi từ đăng ký SignalR qua REST/Hub/trạng thái mô phỏng đến push theo nhóm.
- **Trang 11.** Listing dùng AddSignalR, danh sách RAM và khóa đọc/ghi; giữ các GET REST, POST kiểm tra parent/closed/fields; endpoint nhận IHubContext qua DI để phát thông báo ngoài Hub.
- **Trang 12.** POST thêm dữ liệu dưới lock rồi khởi động tác vụ mô phỏng, trả Created; Task.Delay chuyển processing/graded; record with cập nhật dưới lock và xây message sau thay đổi dữ liệu.
- **Trang 13.** UpdateStatus gửi SubmissionStatusChanged vào group submission:id; Hub chỉ WatchSubmission và helper tên nhóm; record phân biệt trạng thái tài nguyên và thông điệp cập nhật.
- **Trang 14.** Giải thích IHubContext nối cập nhật REST với push; Hub không chứa toàn bộ nghiệp vụ; Task.Delay chỉ là mô phỏng, hệ thống thật thay bằng worker/queue; Console client cần package SignalR.Client10.0.0.
- **Trang 15.** Hình3.2 mô tả HttpClient/kết nối/handler/POST/watch/GET cuối; client đăng ký On trước Start, dùng TaskCompletionSource chờ graded, vẫn dùng REST để tạo tài nguyên.
- **Trang 16.** Sau POST Created client đọc ID rồi WatchSubmission; chờ graded tối đa10s và GET lại trạng thái cuối; DTO/ApiError giữ hợp đồng giữa hai phía.
- **Trang 17.** Chạy API/client hai terminal; kết quả received→processing→graded được push, GET cuối xác nhận; lỗi thường do cổng, hub route hoặc chưa watch đúng ID.
- **Trang 18.** Thứ tự connect/register/watch/publish quan trọng; tổng kết SignalR không thay REST, IHubContext/groups/fallback/reconnect và câu hỏi1–6 củng cố phạm vi trách nhiệm.
- **Trang 19.** Câu hỏi7–10 gồm miss message/reconnect; bài tập thêm failed, theo dõi hai lượt, khởi động client khi API tắt; thảo luận polling khi phù hợp và khó khăn scale-out với group memory.

## GT04 — chapter04.pdf

Nguồn: [chapter04.pdf](<D:/CODE/Giao_Trinh/Hệ thống phân tán/Giáo trình pdf/chapter04.pdf>). Đã đọc: **25/25 trang**. Người đọc: `full_read_04_06`.

SHA256: `7bb702828613a6bb071d2d34382484ab10016bacc4669cb91c7552759584665d`.

- **Trang 1.** Chương đặt mục tiêu phân tích over/under-fetching và endpoint proliferation, hiểu schema/query/resolver và lựa chọn API theo nhu cầu client.
- **Trang 2.** Under-fetching tăng round trips; endpoint proliferation tăng gánh bảo trì. Hình 4.1 đối chiếu nhiều REST request với GraphQL chọn dữ liệu.
- **Trang 3.** SDL ví dụ Assignment/Submission/Query, enum trạng thái; trình bày non-null và truy vấn chọn id/title.
- **Trang 4.** GraphQL vẫn là request-response qua HTTP; N+1 và DataLoader; REST GET có lợi thế cache HTTP còn POST GraphQL cần chiến lược khác.
- **Trang 5.** Bảng 4.1 so sánh điểm cuối, dữ liệu, quan hệ, version, cache, công cụ, học tập; lựa chọn REST khi hợp đồng/tài nguyên rõ.
- **Trang 6.** Giữ REST cho nghiệp vụ cốt lõi EduSubmit, GraphQL có thể phục vụ dashboard; cân nhắc độ sâu/độ phức tạp truy vấn và chi phí vận hành.
- **Trang 7.** BookCatalog SDL Book/Query và C# record; giới thiệu ShapeBook như resolver đơn giản, không phải engine chuẩn.
- **Trang 8.** ShapeBook ánh xạ từng field; parser regex chỉ trích selection list, mutation được giải thích nhưng chưa cài trong ví dụ.
- **Trang 9.** Parser bỏ trùng field; argument/variables được giải thích nhưng mẫu chưa hỗ trợ. Bắt đầu listing toàn Program.cs của API.
- **Trang 10.** Listing API POST /graphql nhận GraphqlRequest, Validate fields, trả 400 hoặc 200; data mẫu 5 sách trong RAM.
- **Trang 11.** Hoàn tất regex parser và ShapeBook; Book/GraphqlRequest/GraphqlResponse records với data/errors và helper factory.
- **Trang 12.** Giải thích bốn bước thực thi query và response có thể đồng thời data/errors trong hệ thống thật; mở đầu HttpClient gửi compact query.
- **Trang 13.** Client gửi compact/full/invalid queries; PostAsJsonAsync đọc GraphqlResponse, in lỗi hoặc Data JSON.
- **Trang 14.** Kết quả thay đổi shape theo field; ứng dụng EduSubmit dùng hai project API/client độc lập; cảnh báo subset regex chỉ dùng học tập.
- **Trang 15.** Hình 4.2 luồng query và Hình 4.3 các bước API; bắt đầu Listing 4.3 dữ liệu Assignment cho endpoint duy nhất.
- **Trang 16.** Dữ liệu EduSubmit 3 bài tập có submissions, dueDate, isOpen; tạo SimpleGraphqlExecutor và GET / + POST /graphql.
- **Trang 17.** Giải thích kho RAM, executor, endpoint; Hình 4.4 trình tự executor; khai báo SupportedAssignmentFields và constructor nhận IReadOnlyList.
- **Trang 18.** Execute kiểm tra rỗng/sai dạng/unsupported rồi ShapeAssignment; regex chọn field, DateOnly định dạng ISO và đếm submissions.
- **Trang 19.** Hoàn thành GraphqlResponse; nhấn mạnh server giới hạn trường và regex không dùng production; build solution và chạy API riêng.
- **Trang 20.** Client dùng hai truy vấn compact/dashboard; Hình 4.5 trình tự cấu hình HttpClient/gửi/đọc/in kết quả.
- **Trang 21.** Client SendGraphqlQueryAsync xử lý status/errors và serialize Data; chạy client trong terminal thứ hai, truyền base URL bằng args.
- **Trang 22.** JSON kết quả minh họa khác trường giữa compact/dashboard; thêm field hợp lệ hoặc field không hỗ trợ để kiểm tra; REST và GraphQL có thể song hành.
- **Trang 23.** Ôn tập tổng hợp ba hạn chế REST, schema/query/resolver, SDL, N+1, chọn công nghệ và cache; câu hỏi kiểm tra hiểu bản chất.
- **Trang 24.** Bài tập maxPoints, nested query, đo 10 request REST/GraphQL và SDL dashboard; thảo luận vận hành hỗn hợp và giới hạn query.
- **Trang 25.** Tiếp tục câu thảo luận chiến lược bảo vệ GraphQL khỏi query tốn kém; cần nêu ưu/nhược từng chiến lược.

## GT05 — chapter05.pdf

Nguồn: [chapter05.pdf](<D:/CODE/Giao_Trinh/Hệ thống phân tán/Giáo trình pdf/chapter05.pdf>). Đã đọc: **21/21 trang**. Người đọc: `full_read_04_06`.

SHA256: `a6e9cdf6a82562368258e513c15bd5dfb208c592c4e13f08733f4b78ce197f30`.

- **Trang 1.** Giới thiệu RPC request-response, client/server stub marshalling/unmarshalling; mục tiêu học protobuf, ranh giới client-facing/internal và triển khai gRPC.
- **Trang 2.** Hình 5.1 luồng stub; phân biệt async ACK trước xử lý, deferred callback và one-way không ACK; đặt nền so sánh độ tin cậy.
- **Trang 3.** Hình 5.2 các biến thể RPC; giới thiệu gRPC HTTP/2, protobuf và unary/server-streaming, tiếp nối lịch sử RPC.
- **Trang 4.** Client/bidirectional streaming hoàn tất bốn kiểu; hợp đồng IDL sinh stubs/message classes; Hình 5.3 quy trình codegen .proto.
- **Trang 5.** Các phần message/service/option, field number; lợi ích interoperability/portability/type safety; API hướng khách vs nội bộ có ưu tiên khác nhau.
- **Trang 6.** Hình 5.4 ranh giới microservices; bảng5.1 so sánh mục tiêu/giao thức/hợp đồng/streaming/bảo mật; internal cũng có queue và REST.
- **Trang 7.** Quy tắc chọn: gRPC cho gọi nhanh/chặt chẽ, queue cho bất đồng bộ và receiver có thể offline. CalcGrpc khai báo service unary trong .proto.
- **Trang 8.** CalcRequest/Reply double + field IDs, csharp_namespace; Grpc.Tools sinh mã vào obj, không sửa mã sinh; GrpcServices Server vs Client.
- **Trang 9.** Client include chung file proto từ server, các gói NuGet; lớp CalculatorService kế thừa base sinh mã và override phép toán.
- **Trang 10.** Divide trả InvalidArgument khi chia0; AddGrpc và MapGrpcService đăng ký service; endpoint GET / chỉ phục vụ kiểm tra phụ.
- **Trang 11.** GrpcChannel tái sử dụng nhiều calls; listing client gọi add/multiply/divide và thử deadline quá khứ với RpcException.
- **Trang 12.** Client cancellation token bị hủy trước call; giải thích async unary, RpcException/status/detail và xử lý lỗi.
- **Trang 13.** Deadline truyền qua server và cancellation điều kiện đến trước; khuyến nghị deadline/RequestAborted nhưng cần kiểm tra listing ứng dụng có áp dụng chưa.
- **Trang 14.** Ứng dụng EduSubmit giữ REST ở biên, gRPC nội bộ; slnx/src chứa API và Grading.GrpcService; GradeSubmission .proto.
- **Trang 15.** Hình5.5 hợp đồng request/reply; field numbers là định danh không đổi tùy tiện; codegen Server/Client từ chung contract.
- **Trang 16.** Hình5.6 service kế thừa base, tính điểm giả lập theo độ dài answer và trả GradeSubmissionReply.
- **Trang 17.** API và gRPC là ranh giới riêng; Hình5.7 pipeline REST DTO -> protobuf -> gRPC -> REST result; bắt đầu listing API.
- **Trang 18.** Listing API dùng singleton channel localhost5101, ID1001 cố định, await GradeSubmissionAsync; mẫu chưa có deadline/cancellation hoặc catch.
- **Trang 19.** Chạy hai tiến trình riêng và POST bằng PowerShell; dừng gRPC làm API thất bại; URL localhost hardcoded chỉ là ví dụ cần chuyển ra config.
- **Trang 20.** Ôn tập RPC variants, gRPC3trụ, codegen, contract và hybrid; câu hỏi gồm field ID, streaming và ranh giới định dạng.
- **Trang 21.** Bài tập history RPC, streaming, benchmark100calls và notification proto; thảo luận browser constraints, versioning và so sánh internal REST/gRPC/queue.

## GT06 — chapter06.pdf

Nguồn: [chapter06.pdf](<D:/CODE/Giao_Trinh/Hệ thống phân tán/Giáo trình pdf/chapter06.pdf>). Đã đọc: **21/21 trang**. Người đọc: `full_read_04_06`.

SHA256: `0f0a84554a72621c0f77367ec4d855f1443df2e1db4d1018d657bf57cdbff542`.

- **Trang 1.** Mục tiêu async queue, producer/consumer/worker, thử lỗi/nhiều worker; queue tách thời gian gửi/nhận khỏi REST/gRPC trực tiếp.
- **Trang 2.** Hình6.1 temporal buffer; bốn thao tác put/get/poll/notify và transient/persistent; mở đầu temporal coupling của synchronous request.
- **Trang 3.** Hình6.2 synchronous vs queued khi xử lý lỗi; ba hạn chế temporal coupling, spikes, tác vụ dài; chọn queue theo bài toán.
- **Trang 4.** Hình6.3 producer/worker; independent scaling/fault-tolerance/load-leveling. Câu mỗi message chỉ một worker cần đọc cùng phần at-least-once để tránh hiểu exactly-once.
- **Trang 5.** RabbitMQ AMQP định tuyến qua exchange; Hình6.4 producer-exchange-bindings-queues; direct/fanout/topic/headers.
- **Trang 6.** Manual ACK sau xử lý, at-least-once; durable queue/message; giới thiệu IConnection TCP và IChannel logic, CreateConnectionAsync/CreateChannelAsync.
- **Trang 7.** await using giải phóng; QueueDeclare idempotent nếu cùng config; durable/exclusive/autoDelete/arguments; chuẩn bị contract JSON/UTF8.
- **Trang 8.** Contracts QueueNames/TaskMessage, MessageId/Persistent, default exchange định tuyến tênqueue, BasicPublishAsync mandatory:false.
- **Trang 9.** AsyncEventingBasicConsumer callback giải mã, null-check, Nack khôngrequeue, manual ack. Nội dung nói JSON lỗi trảnull nhưng listing thiếu catch JsonException.
- **Trang 10.** Ack/Nack và multiple/deliveryTag, requeue vs dead-letter; redelivery có thể trùng; config env và connection singleton.
- **Trang 11.** DI singleton blocking startup sample và AutomaticRecoveryEnabled/10s; sơ đồsrc Contracts/Sender/Processor; bắt đầu chuyển gRPC sangqueue.
- **Trang 12.** Ứng dụng3project Contracts/API/Worker; hợp đồng gồm queue name, request/job/status; API kết thúc sau tiếp nhận, worker thực hiện riêng.
- **Trang 13.** Status response có StatusUrl; POST tạo Processing, job rồi await publish và Results.Accepted; không trả kết quả xử lý ngay.
- **Trang 14.** GET status và ConcurrentDictionary RAM/Interlocked ID; publisher đọc config, mỗi lần gửi mởconnection/channel và declaredurablequeue.
- **Trang 15.** BasicPublish mandatoryfalse/persistent; giải thích persistence chỉ tăng khả năng sống sót, RAM mất khi restart, mỗi lần mởconnection chỉ là mẫu đơn giản; bắt đầuworker.
- **Trang 16.** Worker parsejob, Grade giả lập/Delay2s/log rồi ack; autoAckfalse và chờ vô hạn; listing chưa ghiDB/kết quả vềAPI và chưa catch malformedJSON.
- **Trang 17.** Competing workers nhận chia việc; build/start brokerDocker/API/worker ở3terminal; POST trảID/Processing/statusURL.
- **Trang 18.** Processing trả trước khi worker xong; API vẫn Processing có chủý vì worker chỉ log; thử stop/startworker, không dùngqueue thay mọi truy vấn đọc.
- **Trang 19.** Ôn tập queueMEP, temporaldecoupling, ACK/durability, exchange types, producer-worker và tiêu chí chọn; câu hỏi5mục.
- **Trang 20.** Câu hỏi ACK/exactlyonce, HTTP202; bài tập Priority,3workers/10jobs,killbeforeack, khácconsumer chungqueue khôngbroadcast.
- **Trang 21.** Thảo luận directcallback vs pubsub, backlog/backpressure và so sánh REST/gRPC/queue theo độtrễ/khánglỗi/scaling/coupling/độphứctạp.

## GT07 — chapter07.pdf

Nguồn: [chapter07.pdf](<D:/CODE/Giao_Trinh/Hệ thống phân tán/Giáo trình pdf/chapter07.pdf>). Đã đọc: **27/27 trang**. Người đọc: `full_read_07_09`.

SHA256: `d859d204eb6b013d48aad102d05ad5f6ef232673f6866729e61349dabbcab101`.

- **Trang 1.** Giới thiệu Pub/Sub một-nhiều so với Point-to-Point; mục tiêu học gồm phối hợp theo thời gian và theo tham chiếu, thiết kế event và cầu nối SignalR.
- **Trang 2.** Hình 7.1 cho thấy một publisher qua bus đến Notification và Analytics; bảng phối hợp phân biệt temporal/reference coupling, giúp giải thích vì sao thêm subscriber không sửa publisher.
- **Trang 3.** Phân biệt subscription theo topic và theo nội dung; request/command yêu cầu thực hiện hành động còn event diễn tả sự kiện đã xảy ra; Hình 7.2 minh họa bộ lọc subscription.
- **Trang 4.** Bảng 7.2 so sánh request và event; ví dụ SubmissionReceived minh họa EDA thay chuỗi lời gọi trực tiếp bằng công bố sự kiện để bên quan tâm tự phản ứng.
- **Trang 5.** Hình 7.3 ghép Submission.Api, hàng đợi chấm, worker, sự kiện kết quả và nhiều subscriber; thêm subscriber không yêu cầu publisher biết địa chỉ người nhận.
- **Trang 6.** Hình 7.4 đặt REST/gRPC, queue và event bus trên dải mức coupling; trang cũng nêu đổi lại là khó tracing, dữ liệu nhất quán sau cùng và vận hành phức tạp hơn.
- **Trang 7.** Khởi đầu demo topic exchange dùng Contracts chung; DemoEvent mang EventId, EventType, Message, Version, giúp publisher và subscriber thống nhất định dạng.
- **Trang 8.** Hoàn tất hợp đồng Timestamp, quy tắc EventId/Version và tên routing key; exchange durable nhưng queue demo có durable=false, exclusive=true, autoDelete=true.
- **Trang 9.** Binding dùng order.*; văn bản định nghĩa * khớp đúng một phân đoạn và # khớp không hoặc nhiều phân đoạn; publisher đặt JSON metadata, persistent và mandatory=false.
- **Trang 10.** Subscriber nhận broker host và pattern từ cấu hình/đối số, tự khai báo exchange, queue và binding; ConcurrentDictionary được tạo để minh họa lưu EventId trong tiến trình.
- **Trang 11.** Callback deserialize, TryAdd EventId, mô phỏng xử lý 500 ms rồi manual ACK; ghi chú nhấn mạnh pattern quyết định routing, dictionary chỉ khử trùng trong RAM và queue là transient.
- **Trang 12.** Quản lý phiên bản bằng trường bổ sung, Version hoặc event type mới; trang thừa nhận RAM dedupe mất khi restart và đề xuất lưu bền ngoài tiến trình nếu cần.
- **Trang 13.** Bridge dùng IHubContext gửi cho group theo SubmissionId; RabbitMQ phục vụ giao tiếp server-server, SignalR đưa cập nhật từ server đến client.
- **Trang 14.** Ứng dụng mục 7.3 ghép jobs queue với events exchange và Notification.Api; Hình 7.5 cùng cây solution năm project cho thấy Notification là tiến trình riêng.
- **Trang 15.** Hình 7.6 nối tên kênh, job, event và DTO theo từng chặng; contracts chứa payload bài nộp/định danh dùng xuyên luồng API-worker-notification-client.
- **Trang 16.** Định nghĩa event kết quả và response DTO; Worker khai báo durable jobs queue cùng topic exchange rồi đăng ký consumer xử lý công việc.
- **Trang 17.** Worker chấm, publish SubmissionGradedEvent rồi ACK job, dùng MessageId và JSON metadata; BasicPublish có mandatory=false nên không tự bảo đảm tồn tại đích nhận.
- **Trang 18.** Giải thích publish trước ACK và nói rõ chưa triển khai đầy đủ transactional outbox; listing Grade bị cắt ngang trước phần host Notification đăng ký SignalR, store và hosted service.
- **Trang 19.** Notification map Hub và endpoint tra cứu trạng thái; NotificationStore trong RAM chỉ để học; subscriber mục 7.3 khai báo queue durable=true, exclusive=false, autoDelete=false và binding.
- **Trang 20.** Consumer cập nhật store, gửi SignalR tới group rồi ACK; listing truyền CancellationToken vào xử lý và tạo DTO thông báo từ sự kiện kết quả.
- **Trang 21.** Mỗi subscriber nghiệp vụ cần queue riêng, ví dụ Analytics để có bản sao độc lập; listing Hub/store rời đoạn, client phân biệt địa chỉ HTTP API với địa chỉ Hub.
- **Trang 22.** Hình 7.7 mô tả client kết nối Hub, POST và theo dõi group; listing đăng ký callback, WithAutomaticReconnect rồi StartAsync trước khi gửi bài.
- **Trang 23.** Client đọc response Accepted, gọi WatchSubmission và chờ tối đa 15 giây; phần chạy demo bắt đầu từ build và khởi động RabbitMQ/API.
- **Trang 24.** Lệnh chạy tiếp Notification, Worker, Client và kết quả kỳ vọng; ghi chú sản xuất yêu cầu xem xét lưu bền, retry, idempotency, xử lý lỗi và tracing.
- **Trang 25.** Tóm tắt event/request, coupling và tám điểm chính; câu hỏi ôn tập đầu tiên kiểm tra bản chất pub/sub, bốn kiểu phối hợp và lựa chọn topic/content filtering.
- **Trang 26.** Câu hỏi phân tích ACK order, queue riêng và tradeoff; bài tập thêm Analytics, dừng rồi bật Notification nhận backlog, lưu JSON file và so sánh mức coupling với REST.
- **Trang 27.** Thảo luận mở rộng retry/DLQ, Saga/Event Sourcing, broker và Kafka; yêu cầu chọn MEP phù hợp từng ranh giới chứ không áp dụng pub/sub cho mọi tương tác.

## GT08 — chapter08.pdf

Nguồn: [chapter08.pdf](<D:/CODE/Giao_Trinh/Hệ thống phân tán/Giáo trình pdf/chapter08.pdf>). Đã đọc: **22/22 trang**. Người đọc: `full_read_07_09`.

SHA256: `b8c51f44d8b568f2000f8ffc2329a897a1d140ea7dff1825913c3c25171a6bb9`.

- **Trang 1.** Mục tiêu phân biệt đơn khối/phân tán, IPC, image/container và năm mô hình lỗi; phần thực hành dùng timeout/retry/idempotency, Compose và thử sự cố.
- **Trang 2.** Hình 8.1 minh họa tiến trình độc lập và ranh giới mạng; độ trễ, lỗi từng phần và đồng hồ không đồng bộ làm lời gọi từ xa khác lời gọi nội bộ.
- **Trang 3.** Phân loại IPC request-response và messaging; Bảng 8.1 cùng Hình 8.2 so sánh truy cập bộ nhớ cục bộ với trao đổi qua mạng.
- **Trang 4.** Image là mẫu đóng gói, container là instance chạy; Hình 8.3 mô tả build/registry/run và mỗi thành phần có thể được container hóa riêng.
- **Trang 5.** Liệt kê crash, omission, timing, response và Byzantine; tình huống send omission/không biết kết quả giải thích vì sao thử lại có thể tạo xử lý trùng.
- **Trang 6.** Hình 8.4 tổng hợp mô hình lỗi, Hình 8.5 minh họa exponential backoff và jitter; timeout giới hạn chờ nhưng không xác nhận bên kia chưa thực hiện tác vụ.
- **Trang 7.** Thảo luận at-most-once, at-least-once, exactly-once và Idempotency-Key cho POST; chuyển sang demo .NET/Docker để quan sát lỗi tiến trình độc lập.
- **Trang 8.** API và worker chạy ở các tiến trình/port khác nhau, worker thuần nền không tự có HTTP endpoint; ví dụ bổ sung EnvironmentVariables với prefix cần kiểm tra thứ tự provider thực tế.
- **Trang 9.** Liệt kê ưu tiên cấu hình mặc định; Dockerfile nhiều giai đoạn dùng .NET 10 và chiseled runtime nhưng HEALTHCHECK gọi curl; giới thiệu DNS nội bộ Compose.
- **Trang 10.** Compose hai service đặt build context ở root, ports/env và depends_on dạng ngắn; lệnh build/up/logs dùng để chạy và quan sát tiến trình.
- **Trang 11.** Nhấn mạnh depends_on dạng ngắn chỉ sắp thứ tự startup, không đợi ứng dụng sẵn sàng; phân biệt health container và health ứng dụng, dùng ILogger có cấu trúc.
- **Trang 12.** Ví dụ HTTP resilience giới hạn retry/backoff/timeout, StopAsync và graceful shutdown; cần kiểm tra timeout host/container thực tế khi triển khai thay vì coi các thời hạn minh họa là bảo đảm.
- **Trang 13.** Quan sát sức khỏe ở ba mức container/ứng dụng/toàn hệ thống; mục 8.3 giữ luồng chương 7 và chuyển sang triển khai container.
- **Trang 14.** Hình 8.6 nối mã nguồn, images, network và thử sự cố; cây solution năm project nằm trong section03, mỗi dịch vụ có Dockerfile, dựng mã trước khi dựng image.
- **Trang 15.** Lệnh build ghi section02 dù cây trước đó là section03; server chạy bốn container và client dùng profile, các thành phần có image riêng.
- **Trang 16.** Dockerfile mẫu dùng build/publish nhiều giai đoạn và UseAppHost=false; Compose khai báo RabbitMQ healthcheck cùng biến môi trường kết nối.
- **Trang 17.** Compose dùng depends_on.condition=service_healthy để chờ RabbitMQ tại startup; client có profile, service dùng DNS nội bộ; cơ chế này không thay recovery khi broker chết lúc đang chạy.
- **Trang 18.** Phân biệt build mã với build image; tắt worker làm client chờ hết hạn, bật lại xử lý backlog; tắt broker ảnh hưởng các thành phần giao tiếp qua RabbitMQ.
- **Trang 19.** Bảng 8.2 tổng hợp kết quả quan sát khi từng service down; phần tổng kết nhắc rằng phân tán có lỗi từng phần và cần chọn mô hình xử lý lỗi phù hợp.
- **Trang 20.** Tóm tắt timeout, retry, delivery semantics, idempotency, Compose và quan sát hệ thống; câu hỏi đầu kiểm tra container/process và các mô hình lỗi.
- **Trang 21.** Câu hỏi còn lại yêu cầu giải thích health, retry, idempotency và shutdown; bài tập dựng/chạy/thử lỗi và thêm subscriber, có lệnh section02 và chỉ dẫn copy cần đối chiếu lab tự viết.
- **Trang 22.** Thảo luận retry POST có thể tạo tác dụng phụ trùng, Byzantine cần biện pháp bổ sung; so sánh Compose với Kubernetes là mở rộng vận hành, không mặc nhiên bắt buộc cho đồ án.

## GT09 — chapter09.pdf

Nguồn: [chapter09.pdf](<D:/CODE/Giao_Trinh/Hệ thống phân tán/Giáo trình pdf/chapter09.pdf>). Đã đọc: **12/12 trang**. Người đọc: `full_read_07_09`.

SHA256: `e64c04eb2b0f4286aff025dbfd5e7c8f8fb0fa06381ba2b5b3e8c5cdd63b427b`.

- **Trang 1.** Mục tiêu tổng hợp bốn MEP, sáu vai trò thành phần và bốn nguyên tắc thiết kế; chương cuối hướng tới giải thích lựa chọn kiến trúc và đánh đổi.
- **Trang 2.** Hình 9.1 ghép các lát cắt đã học; văn bản cho phép dùng một phần công nghệ theo miền bài toán, và kiến trúc minh họa gộp bridge SignalR vào Submission.Api.
- **Trang 3.** Luồng mẫu đi qua gRPC orchestration, jobs, worker, events và Hub; chú thích cho phép dùng chung DB để thuận tiện học, không quy định mọi dự án phải có DB riêng mỗi service.
- **Trang 4.** Bảng liên hệ MEP-chương-vai trò và Hình 9.2 giúp gắn request-response, stream, queue, pub/sub vào đúng chặng; client gửi yêu cầu và nhận cập nhật bất đồng bộ.
- **Trang 5.** Hình 9.3 thể hiện ranh giới công cộng/nội bộ, gateway, internal service, broker, worker và storage; giải thích tách rời và scale thành phần độc lập.
- **Trang 6.** Design for Failure đề cập timeout, retry, circuit breaker và DLQ; Hình 9.4 dùng tam giác CAP với mô tả nhập môn đơn giản hóa, không đủ để kết luận AP/CP chỉ từ mã HTTP.
- **Trang 7.** Ví dụ so sánh 202 với chờ hoàn tất dùng để minh họa đánh đổi responsiveness/consistency; phân tích CAP thực tế cần mô tả phân vùng mạng và hành vi đọc/ghi cụ thể.
- **Trang 8.** Bài phân tích kiến trúc yêu cầu sơ đồ chú giải protocol, sync/async, ít nhất ba điểm lỗi và phần giải thích 300–500 từ; có kịch bản tải tăng và worker bị dừng.
- **Trang 9.** Client reconnect cần lấy trạng thái chuẩn qua REST từ storage; bảng kịch bản gồm thêm subscriber và các lỗi, tiêu chí đánh giá phân biệt mức tối thiểu với phương án xử lý tốt hơn.
- **Trang 10.** Ba câu hỏi phản tư gồm RabbitMQ mất 10 phút và khôi phục; tổng kết các thành phần, MEP và bốn nguyên tắc thiết kế.
- **Trang 11.** Tóm tắt và mười câu hỏi ôn tập kiểm tra sơ đồ/luồng, hợp đồng, CAP, mở rộng và thêm email notification; yêu cầu giải thích lý do thay vì chỉ liệt kê công nghệ.
- **Trang 12.** Bài tập nộp sơ đồ có chú giải + 300–500 từ, bảng nguồn-đích/protocol/MEP/lỗi/phục hồi, biến thể Leaderboard và phân tích CAP 200–300 từ; thảo luận bottleneck/hybrid workload.

## SL01 — Chương 01 - Tổng quan hệ thống và các mô hình trao đổi thông điệp (MEP).pdf

Nguồn: [Chương 01 - Tổng quan hệ thống và các mô hình trao đổi thông điệp (MEP).pdf](<D:/CODE/Giao_Trinh/Hệ thống phân tán/Giáo trình pdf/Chương 01 - Tổng quan hệ thống và các mô hình trao đổi thông điệp (MEP).pdf>). Đã đọc: **36/36 trang**. Người đọc: `root`.

SHA256: `eb24172257160cc471a5d2e486fa89bc269114c96777f91e2dca989e4670517c`.

- **Trang 1.** Bìa xác định học phần Phát triển ứng dụng phân tán, tác giả Nguyễn Toàn Thắng, bản 2026; slide chương 1 về MEP.
- **Trang 2.** Mục tiêu gồm ranh giới giao tiếp, vai trò client/server, lựa chọn MEP và xây API/client HTTP; nội dung gồm bốn phần.
- **Trang 3.** Trang phân phần 1: khái niệm hệ thống phân tán, ranh giới mạng và vai trò máy khách–máy chủ.
- **Trang 4.** Hệ thống gồm phần tử tính toán tự trị phối hợp qua mạng; hình nối Client/API/Database/Worker/Broker và thể hiện góc nhìn thống nhất bên ngoài.
- **Trang 5.** Phân biệt đơn khối/phân tán theo tiến trình và giao thức; số lượng máy không phải tiêu chí duy nhất.
- **Trang 6.** Ranh giới mạng phát sinh độ trễ, timeout, lỗi đích, gửi lại/lũy đẳng và hợp đồng dữ liệu; tránh coi nhiều máy đồng nghĩa thiết kế tốt.
- **Trang 7.** Bốn ví dụ gọi xe/đồ ăn, thương mại điện tử, học trực tuyến, nhắn tin cho thấy một nghiệp vụ phối hợp nhiều thành phần.
- **Trang 8.** Client khởi tạo request, server xử lý/response; hình server đọc/ghi datastore; vai trò có thể đổi theo chiều lời gọi.
- **Trang 9.** Bốn bước tạo yêu cầu, truyền mạng, xử lý, trả phản hồi; câu hỏi lựa MEP dựa kết quả ngay/chạy nền/nhiều bên nhận/luồng liên tục.
- **Trang 10.** Trang phân phần 2 liệt kê request–response, queue, publish–subscribe, streaming và push.
- **Trang 11.** MEP mô tả cách gửi/nhận/phản hồi, không ánh xạ cứng một công nghệ; chọn kiểu tương tác trước giao thức/framework.
- **Trang 12.** Request–response cần kết quả trực tiếp, thích hợp thao tác ngắn; hình chỉ client chờ phản hồi và sự phụ thuộc tại lúc gọi.
- **Trang 13.** Thông điệp một chiều không chờ kết quả nghiệp vụ nhưng vẫn cần biết tiếp nhận; cần quan sát trạng thái vì lỗi có thể bị che.
- **Trang 14.** Queue giữ công việc API enqueue, worker pull/process; hình có nhiều worker cho thấy điều tiết tải chứ không là broadcast.
- **Trang 15.** Checklist queue gồm độ bền, giới hạn retry, lỗi/cách ly, lũy đẳng và thứ tự; API EduSubmit phản hồi processing trước khi chấm xong.
- **Trang 16.** Bảng phân biệt queue một worker xử lý công việc với pub/sub nhiều subscriber độc lập phản ứng trước sự kiện đã xảy ra.
- **Trang 17.** Hình publisher/topic-broker/ba subscriber; publisher không cần biết số lượng subscriber, ví dụ SubmissionGraded cho điểm/thống kê/thông báo.
- **Trang 18.** Push/streaming có kết nối dài và thay đổi liên tục, cần quản lý mất kết nối/quyền; hình không yêu cầu request mới cho mỗi update.
- **Trang 19.** Bảng ánh xạ nhiều công nghệ cho từng MEP, bao gồm REST/GraphQL/gRPC, queue, pub/sub, push; nhấn mạnh ánh xạ không tuyệt đối.
- **Trang 20.** Một luồng dùng REST rồi queue rồi event rồi push; chọn theo số bên nhận, thời gian phản hồi, tần suất và vị trí xử lý lỗi.
- **Trang 21.** Trang phân phần 3 giới thiệu project, pipeline, endpoint và HTTP response trong ASP.NET Core.
- **Trang 22.** HTTP quy định request/response; ASP.NET Core cung cấp hosting/routing/binding; Minimal API dùng shared framework .NET10, không cần gói ngoài ở ví dụ đầu.
- **Trang 23.** Bảng tách solution quản lý project, project là đơn vị build và tiến trình là chương trình đang chạy; cùng solution không đồng nghĩa cùng tiến trình.
- **Trang 24.** Thứ tự CreateBuilder, đăng ký Services, Build, MapGet/MapPost, Run; hai pha chuẩn bị dịch vụ và phục vụ request.
- **Trang 25.** Method+route chọn endpoint, binding đưa dữ liệu vào handler; hình tuần tự 5 bước builder/services/build/map/run.
- **Trang 26.** Bảng nguồn binding: route, query string, JSON body và DI container; cần dạy đủ các nguồn dữ liệu trước kết luận xong phần cơ bản.
- **Trang 27.** Results.Ok=200, Created=201, BadRequest=400; status code thuộc hợp đồng client/server, không chỉ nội dung JSON.
- **Trang 28.** Khởi chạy dotnet run, mẫu port5081; kiểm tra địa chỉ/method/route/request/log; thay endpoint minh họa bằng nghiệp vụ sau khi hiểu HTTP.
- **Trang 29.** Trang phân phần 4: ghép API và máy khách thành lát cắt EduSubmit đầu tiên.
- **Trang 30.** Bảng chương1 API+CLI, chương2 REST, chương3 SignalR, chương4 GraphQL; đây là thứ tự chương, không cung cấp lịch học theo ngày/tuần.
- **Trang 31.** API kiểm tra request và trả dữ liệu/lỗi; Client riêng gọi API, đọc và gửi bài; chưa cần login/DB/chấm bài tự động ở lát cắt đầu.
- **Trang 32.** Các lệnh dùng .slnx, dotnet new web API và new console Client ở src; thêm từng csproj vào solution, chạy thành hai tiến trình.
- **Trang 33.** Ba endpoint GET /, GET /api/assignments, POST /api/submissions; cần có bài tập request body và kết quả tạo tài nguyên ngoài HelloWorld.
- **Trang 34.** Dữ liệu mẫu trong RAM; MapGet đọc, MapPost validation; 201 Created và received cho yêu cầu hợp lệ, hình chỉ nhánh400 khi dữ liệu sai.
- **Trang 35.** Client lấy API URL từ args, GetFromJsonAsync/PostAsJsonAsync; kiểm tra lỗi trước dùng dữ liệu; hai terminal độc lập; kiểm tra địa chỉ/endpoint/contract.
- **Trang 36.** Tổng kết nhấn mạnh thành phần độc lập, lỗi mạng/timeout, lựa MEP trước công nghệ và khởi đầu bằng API+Client qua HTTP.

## TH01 — Thuc_hanh_1_2_BasicWebApi.pdf

Nguồn: [Thuc_hanh_1_2_BasicWebApi.pdf](<D:/CODE/Giao_Trinh/Hệ thống phân tán/Hướng dẫn thực hành trên lớp/Thuc_hanh_1_2_BasicWebApi.pdf>). Đã đọc: **3/3 trang**. Người đọc: `full_read_01_03`.

SHA256: `ac059257c23104c5efb7c98a19761768fd898ee6c65848e2f287f19efb493904`.

- **Trang 1.** Sinh viên tự tạo solution và tự viết code, không nộp nguyên mẫu; template `webapi --no-openapi` dưới src, SDKWeb/net10, build khung trước; Services phải đăng ký trước Build.
- **Trang 2.** Tự viết GreetingService dùng Interlocked, singleton DI, DTO request/response/error; GET root/hello route+query và POST body/name validation→400 hoặc 201/Location; bài này không bắt buộc GET theo greeting ID.
- **Trang 3.** Build/run5081, kiểm tra GET/POST bằng curl.exe/Postman; quan sát ID tăng rồi reset sau restart; lập bảng mong đợi/thực tế, giải thích Build/Run/binding/DI; rubric20/45/25/10.

## TH02 — Thuc_hanh_2_2_Catalog_REST_API.pdf

Nguồn: [Thuc_hanh_2_2_Catalog_REST_API.pdf](<D:/CODE/Giao_Trinh/Hệ thống phân tán/Hướng dẫn thực hành trên lớp/Thuc_hanh_2_2_Catalog_REST_API.pdf>). Đã đọc: **5/5 trang**. Người đọc: `full_read_01_03`.

SHA256: `e94e9e8e3fab671ab5e8ed52b2d67dc7f861cfcda71d70afe829fa7fadc902c8`.

- **Trang 1.** Tự tạo Catalog API và Console client riêng, `dotnet new web`, solution .slnx; một biến thể lệnh tạo project ngay root trong khi nguồn ví dụ có src; DTO đặt cuối Program và server sinh ID.
- **Trang 2.** Tự viết GET danh sách/chi tiết với route {id:int}, 404 khi thiếu ID và POST kiểm tra tên/giá, Trim rồi201+Location; Console nhận URL và dùng DTO đúng schema, thực hiện GET danh sách → POST hợp lệ → GET /api/products/1 → POST sai.
- **Trang 3.** Build, chạy API5100, GET danh sách/1/999; POST JSON không có ID, kiểm tra201+Location, lấy URI trong Location để GET sản phẩm vừa tạo rồi GET danh sách thấy phần tử mới; đây là phép kiểm tra riêng, không phải GET /1 trong chương trình Console.
- **Trang 4.** GET /api/products/abc không khớp {id:int}, không vào handler và có thể khác body ApiError của999; dùng curl.exe -i. Chạy Console với bốn hoạt động, trong đó GET chi tiết là /api/products/1; restart API chứng minh RAM mất dữ liệu. Lọc keyword là phần mở rộng, có sao lưu trước khi tự sửa.
- **Trang 5.** Bảng kết quả bắt buộc ít nhất6ca gồm list/detail/notfound/wrongtype/POSTvalid/POSTinvalid; nộp minh chứng Location/client4bước/restart, giải thíchDTO201/int/error; rubric30/25/25/20.

## TH03 — Thuc_hanh_3_2_SignalR.pdf

Nguồn: [Thuc_hanh_3_2_SignalR.pdf](<D:/CODE/Giao_Trinh/Hệ thống phân tán/Hướng dẫn thực hành trên lớp/Thuc_hanh_3_2_SignalR.pdf>). Đã đọc: **5/5 trang**. Người đọc: `full_read_01_03`.

SHA256: `a4bfd7c39ce57418175e71268f1c62d0b65fe01bcf2880e741c1e5c72cb1f3a1`.

- **Trang 1.** Tự tạo PingApi/PingClient, không nộp nguyên mẫu; phạm vi §3.2, chưa gồm EduSubmit§3.3; SDK10/.slnx/src, build khung; console cần NuGet SignalR.Client10.0.0, server dùng shared framework.
- **Trang 2.** AddSignalR/MapHub/MapGet/Run có vai trò riêng; Hub có EchoCaller/BroadcastAll/JoinGroup/SendToGroup; có thể đặt lớp sau Run; hub URL không phải REST để nhập vào browser kiểm tra.
- **Trang 3.** Lifecycle gửi SystemMessage đến client đang online; ConnectionId không là user identity; client đăng ký4callback và reconnect events trước Start, sau đó Invoke Echo/Join/Send đúng signature.
- **Trang 4.** Giữ hai client cùng chạy; kiểm tra Caller/All/Group bằng client thứ2 không join, không kết luận từ hai client cùng nhóm; StartAsync đầu tiên lỗi không được WithAutomaticReconnect tự giải quyết.
- **Trang 5.** Thử ngắt client, dừng/chạy lại API, quan sát Reconnecting/Closed theo retry0/2/10/30; sau reconnect không giả định còn nhóm, Reconnected→JoinGroup là mở rộng; không replay mọi message mất; nộp ảnh build/hai client và bảng tối thiểu6 nhóm hành vi; rubric20/30/25/25.

## TH04 — Thuc_hanh_4_2_BookCatalog_GraphQL.pdf

Nguồn: [Thuc_hanh_4_2_BookCatalog_GraphQL.pdf](<D:/CODE/Giao_Trinh/Hệ thống phân tán/Hướng dẫn thực hành trên lớp/Thuc_hanh_4_2_BookCatalog_GraphQL.pdf>). Đã đọc: **4/4 trang**. Người đọc: `full_read_04_06`.

SHA256: `8286c87728b83d43cfe58af2d336e0d9b587086e44d2acaa601fea98e72f7e69`.

- **Trang 1.** Tự tạo solution slnx và hai project trong src; không sao chép project mẫu; regex chỉ mô phỏng phần nhỏ GraphQL, đọc SDL và record Book.
- **Trang 2.** Tự viết GET /, dữ liệu năm sách, request/response, ParseBookFields, ShapeBook và ExecuteQuery với whitelist; chỉ query phẳng, không alias/fragment/argument/variable.
- **Trang 3.** Tự viết POST /graphql và HttpClient; thử query A hai trường, B đủ trường, C price không hợp lệ; 200/400 là quy ước của ví dụ và phải lập bảng kết quả.
- **Trang 4.** Thử query rỗng, cấu trúc sai, trường trùng/viết hoa, API dừng; nộp source tự viết, ảnh build/hai terminal/bảng lỗi, giải thích giới hạn; rubric 20/40/20/20%.

## TH05 — Thuc_hanh_5_2_CalcGrpc.pdf

Nguồn: [Thuc_hanh_5_2_CalcGrpc.pdf](<D:/CODE/Giao_Trinh/Hệ thống phân tán/Hướng dẫn thực hành trên lớp/Thuc_hanh_5_2_CalcGrpc.pdf>). Đã đọc: **4/4 trang**. Người đọc: `full_read_04_06`.

SHA256: `f202eb832db713d03f480eb994485b7bc9fa96935ffc7f968b481f4cd698d502`.

- **Trang 1.** Tự tạo solution slnx/server/client trong src và calculator.proto; bốn unary RPC, field numbers, phân biệt proto/generated code/service tự viết.
- **Trang 2.** Cài các gói gRPC, cấu hình sinh Server/Client từ cùng proto; không sửa obj; tự viết bốn phép toán, InvalidArgument chia0, AddGrpc và MapGrpcService.
- **Trang 3.** Xác minh HTTP/2 h2c hoặc HTTPS; tái dùng channel; phải thử Subtract dù client mẫu thiếu; thử chia0/deadline quá khứ và phân biệt lỗi với server chậm.
- **Trang 4.** Thử token hủy trước gửi và giới hạn thử nghiệm, mất kết nối/khởi động lại; bảng bốn phép tính+ba lỗi; nộp source/proto/csproj không bin/obj, rubric25/30/20/25%.

## TH06 — Thuc_hanh_6_2_RabbitMQ.pdf

Nguồn: [Thuc_hanh_6_2_RabbitMQ.pdf](<D:/CODE/Giao_Trinh/Hệ thống phân tán/Hướng dẫn thực hành trên lớp/Thuc_hanh_6_2_RabbitMQ.pdf>). Đã đọc: **4/4 trang**. Người đọc: `full_read_04_06`.

SHA256: `88504653c5565c8276519d9b8450f4039be910be5a052b32878e3a1055064ffb`.

- **Trang 1.** Tự tạo broker và ba project Contracts/Sender/TaskProcessor trong src, hai project reference; .NET10/RabbitMQ.Client7.x; demo broker --rm không volume.
- **Trang 2.** Tự viết TaskMessage/QueueNames, connection/channel/durable queue, JSON UTF8, Persistent/MessageId; publish khi worker chưa chạy và theo dõi Ready.
- **Trang 3.** Phân biệt persistence với bảo đảm không mất dữ liệu; worker manual ack sau xử lý; bắt JsonException, nack false loại bỏ nếu không DLX, requeue true thử có giới hạn.
- **Trang 4.** Kill worker trước ack để thấy redelivery/at-least-once, đề xuất khử trùng; cấu hình env, connection reuse, thử recovery và ghi kết quả thực tế; đủ bảng/log/ảnh, rubric25/20/35/20%.

## TH07 — Thuc_hanh_7_2_EventDriven_PubSub.pdf

Nguồn: [Thuc_hanh_7_2_EventDriven_PubSub.pdf](<D:/CODE/Giao_Trinh/Hệ thống phân tán/Hướng dẫn thực hành trên lớp/Thuc_hanh_7_2_EventDriven_PubSub.pdf>). Đã đọc: **4/4 trang**. Người đọc: `full_read_07_09`.

SHA256: `a71df38fa06bc3d7dd4f32787f5c9bb13c3a349ee47aa58c23307fc1a1bdc17c`.

- **Trang 1.** Yêu cầu tự tạo solution ba project Publisher, Subscriber, Contracts thay vì sao chép; kiểm tra RabbitMQ và sơ đồ topic exchange trước khi thiết lập project references.
- **Trang 2.** Dùng RabbitMQ.Client 7.x, ví dụ 7.1.2; tự viết contract và năm sự kiện, publish metadata; bài yêu cầu quan sát mandatory=false khi chưa có binding khiến event không được lưu vào queue.
- **Trang 3.** Tự viết queue transient/exclusive, callback deserialize, nack invalid JSON và manual ACK; trang in literal ##/order.## trái với #/order.# ở GT07 tr9; thử routing ba subscriber và khử trùng EventId trong RAM.
- **Trang 4.** Thử Version=2 với trường thêm bằng System.Text.Json; phân biệt durable queue, persistent message và binding tồn tại, phân tích bridge SignalR (không bắt buộc chạy trong lab), nộp mã tự viết/sơ đồ/log/binding và tự chấm 20/20/30/30.

## TH08 — Thuc_hanh_8_2_DotNet_Docker.pdf

Nguồn: [Thuc_hanh_8_2_DotNet_Docker.pdf](<D:/CODE/Giao_Trinh/Hệ thống phân tán/Hướng dẫn thực hành trên lớp/Thuc_hanh_8_2_DotNet_Docker.pdf>). Đã đọc: **4/4 trang**. Người đọc: `full_read_07_09`.

SHA256: `f82c71f21edf55ef286fbc111674ea6d3e4c640141fbafc7d66d7822b68ef1ab`.

- **Trang 1.** Yêu cầu tự viết .NET 10, kiểm tra Docker Engine, vẽ sơ đồ và bảng thử lỗi; solution gồm API/worker, API có health/config/status và IHttpClientFactory.
- **Trang 2.** Worker dùng BackgroundService, CancellationToken, log và StopAsync; thực nghiệm ưu tiên env có prefix, retry có giới hạn; worker không có HTTP endpoint thì gọi HTTP thất bại không tự chứng minh worker chết.
- **Trang 3.** Mỗi project có Dockerfile nhiều giai đoạn, Compose build context root và DNS service; depends_on dạng ngắn chưa đợi readiness; lab cảnh báo chiseled có thể thiếu curl gây healthcheck sai.
- **Trang 4.** Thử stop/restart và thu log trước-trong-sau sự cố, kiểm tra graceful stop; nộp README, source, Dockerfiles, Compose, ảnh/log cùng năm phần giải thích cơ chế.
