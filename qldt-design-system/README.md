# QLĐT Design System (trang quản trị)

Dựng từ 15 ảnh chụp màn hình https://qldt.bkademy.vn, chụp bằng tài khoản giảng viên với vai trò "Quản lý Trường CNTT" (09/2026). Site gốc chạy GWT + Bootstrap 3 + Font Awesome 4, font Poppins. Không truy cập lại được site bằng trình duyệt tự động, nên màu lấy từ pixel ảnh chụp 1600px, còn kích thước đo trên ảnh chứ không lấy từ computed style như hai bộ TVET và LCMS.

Dữ liệu mẫu trong template đã chuyển sang **cấp K12 của Sở GD&ĐT Bắc Ninh** (trường THPT/THCS, lớp 10A1, môn học theo GDPT 2018, giáo viên, học sinh). Bố cục và component giữ nguyên như site gốc. Hệ thống được tổ chức lại **chỉ dành cho cán bộ quản lý** (Sở, UBND xã/phường, hiệu trưởng) và **chỉ gồm các nhóm báo cáo điều hành** theo yêu cầu: menu Dashboard (template 08) · Tổng quan · Người dùng · Dạy và học · Tần suất · Kỳ thi chung · Học liệu · Hạ tầng · Xếp hạng, các mục còn lại trỏ vào template 09. `qldt.js` tự chèn nút về cổng vào `.qd-header__tools`. Ô vai trò không còn vai trò Giáo viên. Template 03–08 vẫn giữ làm mẫu component (bảng, bộ lọc, modal, dashboard) nhưng không còn trên menu.

Bộ này **tách riêng** với TVET (`../design-system/`, `tv-`) và LCMS (`../lcms-design-system/`, `lc-`). Class dùng tiền tố `qd-`.

## Cấu trúc

```
qldt-design-system/
├── design-system.html      ← Trang tài liệu: token, icon, toàn bộ component, khung trang
├── qldt.css                ← Token (--qd-*) + class component qd-*
├── qldt.js                 ← Sprite icon, menu con, ô vai trò, tab, mục Hiện/Ẩn, Select All, pop chọn nhiều,
│                              modal, QD.toast(), QD.loading()
├── templates/
│   ├── 01-login.html                Đăng nhập: SSO Office 365 / Gmail + tài khoản do Sở cấp
│   ├── 02-home-modules.html         Trang chủ quản lý, điều hành: menu con, ô vai trò, lưới thẻ chức năng, footer
│   ├── 03-plan-list.html            Kế hoạch giáo dục nhà trường: bộ lọc chọn nhiều, "Hiển thị" chọn cột,
│   │                                   cột Ngoại ngữ 1 tô vàng sửa trực tiếp
│   ├── 04-plan-detail.html          Chi tiết KHGD một trường: mục Hiện/Ẩn, thống kê kế hoạch dạy học,
│   │                                   khung môn học theo khối 10/11/12, modal thêm chuyên đề
│   ├── 05-class-list.html           Danh sách lớp học: tổ hợp môn, GVCN, cột "Sửa" mở modal form
│   ├── 06-task-dashboard.html       Nhiệm vụ / Công việc của Sở: KPI, biểu đồ theo phòng chuyên môn
│   ├── 07-student-filters.html      Hồ sơ học sinh: Bộ lọc + Bộ lọc trực tiếp, Tải dữ liệu → LOADING → toast
│   ├── 08-management-dashboard.html Dashboard các cấp quản lý: Sở → xã/phường → trường (màn mới)
│   └── 09-executive-report.html     Báo cáo điều hành 10 nhóm, gắn căn cứ QĐ 4725 (màn mới)
├── assets/                 ← logo_bn, favicon, avatar, cards/ (8 ảnh thẻ cắt từ ảnh chụp), previews/
└── screenshots/            ← 15 màn hình gốc để đối chiếu
```

## Dựng màn hình mới

```html
<link rel="stylesheet" href="qldt.css">
...
<header class="qd-header">…</header>
<nav class="qd-nav">…menu 4 mục + .qd-role…</nav>
<main class="qd-wrap">
  <div class="qd-tabs">…<div class="qd-tabs__right">Export · Thêm</div></div>
  <div class="qd-filterbar">.qd-filter-tag · .qd-select · .qd-dashed · .qd-search · .qd-kebab</div>
  <section id="tbl">
    <div class="qd-pagerbar">…</div>
    <div class="qd-table-wrap"><table class="qd-table">…</table></div>
  </section>
</main>
<footer class="qd-footer">…</footer>
<script src="qldt.js"></script>
```

Copy template gần nhất trong `templates/`. Header và menu giống nhau ở mọi template, lấy nguyên khối từ một file bất kỳ rồi đổi `is-active` sang mục menu của trang mới.

| Menu | Mục trong template 09 |
|---|---|
| Tổng quan | `#tong-quan` |
| Người dùng | `#nguoi-dung`, `#khao-sat` |
| Dạy và học | `#day-hoc`, `#chat-luong` |
| Tần suất | `#tan-suat-hs`, `#tan-suat-gv` |
| Tần suất HS | Thiết lập yêu cầu theo môn × khối (lượt học/tuần, phút/tuần, % hoàn thành bài giao, bật/tắt từng môn); % hoàn thành của từng HS theo môn, HK I, HK II, năm học | — |
| Tần suất GV | Thiết lập 5 yêu cầu mỗi lớp mỗi tháng (đăng ký bài học online, số tiết, tạo bài, giao bài, % HS tham gia tối thiểu); % hoàn thành của từng GV theo từng lớp, theo tháng hoặc luỹ kế HK | — |
| Kỳ thi chung | `#ky-thi` |
| Học liệu | `#hoc-lieu` |
| Hạ tầng | `#ha-tang` |
| Xếp hạng | `#xep-hang` |

## Token chính

| Nhóm | Giá trị |
|---|---|
| Brand (theo logo Sở) | header, menu chọn, nút đăng nhập `#1B3A60` · menu mở `#284888` · accent vàng đồng `#B08848` (viền header, gạch dưới menu chọn) |
| Hành động | Bộ lọc / ⋮ `#2566BF` · link, tab `#337AB7` · success `#5CB85C` · info `#5BC0DE` · danger `#D9534F` |
| Trạng thái | "Đã duyệt" `#00879E` · KPI `#FF3823` / `#428BCA` / `#008B10` |
| Nhấn mạnh dữ liệu | cột sửa trực tiếp `#F3FF73` · ô thiếu `#F0F409` · số thiếu `#FF0000` · tiêu đề mục `#0000FF` · dòng nhóm `#FFDAB9` |
| Text | `#333` · tiêu đề cột `#262626` · heading `#393636` · placeholder `#999` (nghiêng) |
| Nền / viền | header bảng `#F0F0F0` · panel `#E6E6E6` · viền control `#CCC` · kẻ bảng `#DDD` |
| Font | Poppins 400/500/600/700, cỡ cơ sở 14px |
| Radius | ⋮ 3 · control 4 · input login 8 · thẻ 10 · card login 16 · Bộ lọc/Chi tiết pill |
| Khung | header 88px · menu 60px · khung menu 1462px · khung bảng 1427px |

## Những điểm riêng của site gốc

- **Hàng lọc**: mở đầu bằng nhãn xanh bo tròn "Bộ lọc". Select chọn nhiều cắt bớt chữ ("Chưa nộp, Đang chờ, Đ"). Khi chưa chọn thì hiện `[Tên trường]` màu xám. Nút "Hiển thị" viền nét đứt dùng để chọn cột. Hàng thứ hai "Bộ lọc trực tiếp" lọc trên dữ liệu đã tải về.
- **Pager GWT** lặp lại trên và dưới bảng: Select All · ⏮ ◀ `1-8 of 8` ▶ ⏭ · Số dòng.
- **Toast vàng** (alert-warning) báo số bản ghi mỗi lần tải: "Found 321 student classes", "668 courses loaded!".
- **Lớp LOADING** chữ to phủ toàn trang trong khi gọi máy chủ.
- **Ô chuyển vai trò** đổi phạm vi dữ liệu. Bản K12: Giáo viên · Hiệu trưởng · Chuyên viên Sở ("Quản lý Sở ▾").

## Dashboard các cấp quản lý (template 08)

Màn **thiết kế mới**, dùng các component sẵn có cộng thêm `.qd-seg`, `.qd-crumb`, `.qd-stat`, `.qd-progress`, `.qd-flag` (khai báo trong `qldt.css`, mục 12).

| Cấp | Phạm vi | Bảng "cần chú ý" | Bấm dòng → |
|---|---|---|---|
| Sở | Toàn tỉnh, mọi cấp học | Xã/phường | Cấp xã/phường |
| Xã/phường | MN, TH, THCS trên địa bàn (UBND cấp xã quản lý, mô hình chính quyền 2 cấp) | Trường | Cấp trường |
| Trường | Theo khối, theo lớp | Lớp | — |

Mỗi cấp có: 6 ô số liệu, "Học sinh theo cấp học / trường / khối" (cột ngang), "Kết quả học tập" (cột chồng 100%, thang Tốt → Chưa đạt dùng một sắc xanh đậm → nhạt), bảng đơn vị cần chú ý, tiến độ nộp báo cáo. Biểu đồ có tooltip và nút "Xem dạng bảng". Ô vượt ngưỡng có icon ⚠ kèm số.

Ngưỡng cảnh báo trong bản mẫu: nộp KHGD < 90%, chuyên cần < 96%, HS chưa đạt > 2%, thiếu GV > 5. Ở cấp trường: sổ điểm < 80%, HS chưa đạt > 1, vắng > 3. Thanh tiến độ chuyển đỏ khi dưới 70%. Mọi ngưỡng cần Sở xác nhận.

**Toàn bộ số liệu trong template 08 là minh hoạ**, không lấy từ CSDL ngành. Tên trường, xã/phường là địa danh thật của Bắc Ninh, mã trường là giả định. Xã/phường và trường chưa có bộ số riêng dùng chung số liệu của Phường Kinh Bắc / THCS Nguyễn Đăng Đạo.

## Báo cáo điều hành (template 09)

Màn mới, chỉ gồm các mục trong danh sách yêu cầu báo cáo điều hành. Đây là **báo cáo tổng hợp định kỳ, không realtime**: chọn kỳ báo cáo (tháng / học kỳ / năm học), mọi số liệu chốt tại ngày cuối kỳ và so sánh với kỳ trước; có Xuất PDF, Xuất Excel. Menu ngang chuyển nhóm theo hash URL. Mỗi nhóm có nhãn `.qd-basis` ghi căn cứ. Không có phần dự báo, cảnh báo và phân tích độ khó / độ phân biệt câu hỏi. Component mới: `.qd-report`, `.qd-rhead`, `.qd-meter`, `.qd-reqtbl`, `.qd-basis`, `.qd-weights`, `.qd-rank`, `.qd-level--1|2|3`.

| Nhóm | Nội dung chính | Căn cứ QĐ 4725/QĐ-BGDĐT |
|---|---|---|
| Tổng quan | 6 chỉ số chính, tỉ lệ sử dụng và mức hoàn thành khoá học theo cấp học, kỳ thi chung trong kỳ, đơn vị dẫn đầu | Nhóm 1 |
| Người dùng | Tỉ lệ hoạt động hằng ngày theo vai trò, bản đồ nhiệt thứ × giờ, tỉ lệ sử dụng theo tổ chức | 1.6a (GV có tài khoản bồi dưỡng), 1.3 |
| Dạy và học | Khoá học, tài nguyên tạo mới, lượt xem bài giảng / làm câu hỏi / bài KT, HS tham gia, chế độ AI, hoàn thành theo tiến độ, bảng 4 chức năng LMS | 1.3 (LMS 24 điểm: giao bài tự học, giải đáp, KTĐG thường xuyên, phụ huynh tham gia; mỗi chức năng 6 điểm), 1.6 |
| Chất lượng | Kết quả học tập, mức đáp ứng YCCĐ theo môn (Chưa đạt · Đạt · Vượt) và theo khối | CT GDPT 2018, TT 22/2021 |
| Khảo sát | Các đợt khảo sát, tỉ lệ phản hồi, mức hài lòng | — |
| Tần suất HS | Thiết lập yêu cầu theo môn × khối (lượt học/tuần, phút/tuần, % hoàn thành bài giao, bật/tắt từng môn); % hoàn thành của từng HS theo môn, HK I, HK II, năm học | — |
| Tần suất GV | Thiết lập 5 yêu cầu mỗi lớp mỗi tháng (đăng ký bài học online, số tiết, tạo bài, giao bài, % HS tham gia tối thiểu); % hoàn thành của từng GV theo từng lớp, theo tháng hoặc luỹ kế HK | — |
| Kỳ thi chung | Báo cáo sau kỳ thi: tổ chức thi theo điểm thi (dự thi, vắng, vi phạm, sự cố), phổ điểm, thống kê kết quả (không phân tích độ khó / độ phân biệt câu hỏi) | 1.5 (thi, kiểm tra trên phòng máy) |
| Học liệu, thư viện | Bộ lọc lưu được, số lượng theo loại, tình trạng phê duyệt, hiệu quả sử dụng theo môn | 1.4 (học liệu được tổ CM thông qua, hiệu trưởng phê duyệt), 1.6c |
| Hạ tầng | Đồng thời cao nhất mỗi ngày trong kỳ so với năng lực, CPU/RAM trung bình và cao nhất, sự cố, thời gian gián đoạn theo dịch vụ, hạ tầng tại trường | 1.7 (phòng học có trình chiếu + Internet, HS/máy Tin học, studio) |
| Xếp hạng | Chọn tiêu chí, kéo trọng số, xếp hạng trường THPT hoặc xã/phường, đề xuất khen thưởng / cần hỗ trợ | Nhóm 1, Nhóm 2 |

- Mốc điểm của QĐ 4725 lấy từ bản tóm lược trên luatvietnam.vn, **chưa đối chiếu với bản PDF gốc**. Bản tóm lược có chỗ lệch: tiêu chí 2.3 ghi tối đa 70 điểm nhưng các thành phần cộng lại 60.
- **Hướng dẫn 04/HD-BGDĐT chưa tìm được văn bản** nên chưa gắn căn cứ này vào từng chỉ số. Khi có file, bổ sung nhãn `.qd-basis` tương ứng.
- Công thức xếp hạng (trọng số mặc định 30/20/20/15/15, điểm thi × 10) và quy tắc đề xuất khen thưởng (top 3, cả 2 nhóm Mức 3) là đề xuất, cần Sở quyết định.
- Cách tính % tần suất (trung bình các tiêu chí, mỗi tiêu chí = thực tế / yêu cầu, tối đa 100%) và giá trị yêu cầu mặc định là đề xuất. Ngưỡng tô đỏ 70%.
- Toàn bộ số liệu là minh hoạ.

## Thay đổi so với site gốc

- Màu brand đổi từ đỏ `#CE1628` của site gốc sang navy `#1B3A60` + vàng đồng `#B08848` lấy từ logo Sở; nền màn đăng nhập đổi sang gradient navy. Badge thông báo dùng đỏ danger.
- Logo và tên đơn vị ở header, footer đã đổi sang Sở GD&ĐT Bắc Ninh (`assets/logo_bn.png`), giống hai bộ còn lại. Dữ liệu mẫu đã chuyển từ đại học (CTĐT, học phần, sinh viên) sang K12 (kế hoạch giáo dục, môn học, lớp, học sinh). Ảnh trong `screenshots/` vẫn là màn hình gốc dữ liệu đại học.
- Footer bỏ ảnh hình thành phố, thay bằng nền xám vẽ bằng CSS. Nút cửa hàng ứng dụng là bản giả lập.
- Icon Font Awesome thay bằng sprite SVG trong `qldt.js`.

**Chưa xác minh / tự dựng thêm** (không có trong ảnh chụp):
- Form trong modal (Sửa lớp, Thêm chuyên đề), nội dung mục 1–2 của trang chi tiết, tab "Các năm học".
- Danh sách tuỳ chọn trong pop chọn nhiều và pop "Hiển thị".
- Biểu đồ ở template 06: ảnh gốc chỉ có khung trống (0 công việc). Dữ liệu và dạng cột chồng ngang là đề xuất.
- Menu con của BÁO CÁO trống trong ảnh chụp nên để là link thường.
- Danh sách học sinh ở template 07: ảnh gốc mới chụp được lúc đang LOADING, cột bảng là đề xuất.
- Toàn bộ dữ liệu K12 (trường, lớp, tổ hợp, số liệu thống kê) là mẫu minh hoạ.
