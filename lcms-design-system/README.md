# LCMS Design System

Trích xuất từ https://cms-staging.hoc102.com (đăng nhập bằng tài khoản giáo viên, 31/10/2026). Site dùng Ant Design v5, mọi giá trị đo từ computed style. Tôi chỉ xem, không lưu thay đổi nào: script có chặn mọi API tạo/sửa/xoá, và nhật ký cho thấy không có lệnh ghi nào được gửi đi.

Bộ này **tách riêng** với TVET (`../design-system/`). Class dùng tiền tố `lc-`, TVET dùng `tv-`.

## Cấu trúc

```
lcms-design-system/
├── design-system.html      ← Trang tài liệu: token, icon, toàn bộ component, khung trang
├── lcms.css                ← Token (--lc-*) + class component lc-*
├── lcms.js                 ← Dropdown, modal, accordion chương, tab, đổi lưới/bảng, thu gọn sider
├── lcms-demo.js            ← Menu chung của mọi màn (trừ 01 đăng nhập, 09 menu theo vai trò; 06/08 dạng rail), toast, khung Toán 10
├── templates/
│   ├── 01-login.html               Đăng nhập
│   ├── 02-list-grid-table.html     Danh sách khoá học: tab, lưới ⇄ bảng, dropdown ⋮, footer action
│   ├── 03-data-table.html          Bảng quản trị (Combo, Sự kiện): tag trạng thái, sửa/xoá, phân trang
│   ├── 04-detail-chapters.html     Chi tiết khoá: accordion chương + timeline bài + panel phải. Có bài tập giao dưới từng bài giảng, tab "Bài tập giao", link sang 18
│   ├── 05-form-settings.html       Form cài đặt/tạo khoá + card xem trước + modal checklist
│   ├── 06-editor-split.html        Trình soạn: rail 64px, chia đôi, steps, form, thanh công cụ. Tab Tài liệu: thêm tài liệu vào bài từ máy, Kho học liệu (Kho Trường/Kho Sở, đọc dữ liệu 09; lọc môn, lớp, bài học, loại, định dạng, mức độ, "Đúng bài đang soạn", sắp xếp) hoặc Thư viện điện tử (lọc loại sách, môn, lớp); ẩn, xoá, khôi phục
│   ├── 07-cards-calendar.html      Card, lịch tuần, empty state, modal nhỏ (mẫu component; đã bỏ mục "Lộ trình học" khỏi menu)
│   ├── 08-video-script.html        Video tương tác: kịch bản theo mốc thời gian + bộ câu hỏi
│   ├── 09-content-approval.html    Gán nhãn + quy trình duyệt lên kho dùng chung + giao bài nhanh cho nhiều lớp ngay từ kho (demo Sở, mục 2, 7)
│   ├── 10-scan-import.html         Quét đề từ ảnh/PDF bằng Chrome Extension (demo Sở, mục 4)
│   ├── 11-curriculum.html          Khung chương trình: nhiều môn, số cấp tuỳ ý, bỏ qua cấp (mục 1). Chỉ vai trò cấp Sở được soạn; vai trò khác chỉ tra cứu
│   ├── 12-question-bank.html       Quản lý ngân hàng câu hỏi: ngân hàng cá nhân / tổ chuyên môn / kho Sở (chỉ xem); lọc loại, mức độ, bài, trạng thái; thêm, sửa câu (trắc nghiệm, Đúng/Sai 4 ý, trả lời ngắn, tự luận); sao chép, chuyển, gửi duyệt
│   ├── 13-exam-proctoring.html     Giám sát phòng thi, cảnh báo, nhật ký, bù giờ (mục 5)
│   ├── 14-assignment.html          Giao bài cho lớp của khoá học (chọn bài → thiết lập → báo giao thành công), dữ liệu mẫu Toán 10; bật/tắt tra từ điển chỉ hiện với bài ngoại ngữ (cờ `lang`) (mục 7, 10)
│   ├── 15-homeroom.html            GVCN: tổng quan, cảnh báo từ lớp bộ môn, phụ huynh, tài khoản (mục 8)
│   ├── 16-video-results.html       (Đang ẩn khỏi menu và trang cổng) Kết quả video tương tác (mục 6)
│   ├── 18-course-results.html     Tiến độ khoá học của GV bộ môn: tổng quan, theo bài giảng, theo bài tập (có điểm), theo học sinh; mở từ tab "Tiến độ học" và "Bài tập giao" của 04 (`#tasks`, `#lessons`, `#students` mở đúng tab)
│   └── 17-elibrary.html            Mẫu mô phỏng xác thực tự động LCMS → Thư viện điện tử (mục 9). Việc gắn sách vào bài làm ở tab Tài liệu của 06
├── assets/                 ← logo, favicon, ảnh khoá học mặc định, minh hoạ empty/upload
│   └── icons/              ← 22 icon SVG gốc của site (menu, sửa, xoá, ⋮, lưới/bảng…)
└── screenshots/            ← 18 màn hình gốc để đối chiếu
```

## Menu theo vai trò (lcms-demo.js)

Menu chung chia nhóm *Giảng dạy · Tổ chuyên môn/Học liệu · Chủ nhiệm · Coi thi · Quản lý nhà trường · Cấp Sở*, chỉ hiện nhóm của vai trò đang chọn (Giáo viên bộ môn, GVCN, Tổ trưởng, Hiệu trưởng, Cán bộ coi thi, Chuyên viên Sở). Khung chương trình chỉ vai trò Chuyên viên Sở được soạn; vai trò trường thấy mục "Tra cứu khung chương trình" ở chế độ chỉ xem. Thư viện điện tử không còn là mục menu riêng: thêm sách vào bài ở tab Tài liệu của màn soạn bài 06. Vai trò chọn ở màn 01, ở ô "Vai trò (bản mẫu)" trên header, hoặc qua `?role=`; lưu ở localStorage `bn-lcms-role`. Màn 09 ghép menu chung dưới menu riêng và đồng bộ vai trò Giáo viên / Tổ trưởng / Hiệu trưởng. 09 giữ dữ liệu trong sessionStorage của tab; `?reset=1` về dữ liệu mẫu. Header mọi màn có nút "← Cổng".

## Dựng màn hình mới

```html
<link rel="stylesheet" href="lcms.css">
...
<div class="lc-layout">
  <aside class="lc-sider">…menu…</aside>
  <div class="lc-main">
    <header class="lc-header">…</header>
    <main class="lc-content">…</main>
    <footer class="lc-footer">…nút hành động căn phải…</footer>
  </div>
</div>
<script src="lcms.js"></script>
```

Copy template gần nhất trong `templates/`. Khung chung: sider 300px (thu gọn 64px), header 64px, content cuộn bên trong, footer action 65px.

## Token chính

| Nhóm | Giá trị |
|---|---|
| Primary | `#1579AD` · hover `#126794` · soft `#E6F4FF` · bg `#F4F7FB` |
| Icon / focus | Ant blue `#1677FF` · link `#0D6EFD` |
| Text | `rgba(0,0,0,.88)` · muted `#747C87` · secondary `#6B7280` |
| Viền | `#D9D9D9` (select) · `#EBEBEB` (input) · `#E8EDF3` (bảng) |
| Trạng thái | success `#0EC122` trên nền 8% · danger `#EF5350` / `#FFF3F3` |
| Accent | tên chương `#FF0000` · Tính năng `#A40980` · Xem thử `#FF5C00` |
| Font | font hệ thống (`-apple-system, Segoe UI, Roboto…`), cỡ cơ sở 14px |
| Radius | select 6 · input/modal 8 · chương 16 · card/tag 20 · button 50 |

## Video tương tác (template 08)

Luồng trên site: **Form bài giảng video → bảng video → "+ Soạn kịch bản video"** → modal *Tạo kịch bản video*.

| Khu vực | Nội dung |
|---|---|
| Cột trái | Tiêu đề video, Ngày phát hành*, URL Video*, Backup Links (thêm nhiều), Trạng thái* (Công khai / Riêng tư / Đang chờ / Miễn phí / Tham khảo / Testing), **Kịch bản** (Kịch bản video / Kịch bản chữa bài tập), **Khi mở kịch bản** (Video tiếp tục chạy / Video không chạy) |
| Danh sách kịch bản | Mỗi mục: tên + mốc `00:mm:ss` + nút xoá, "+ Thêm kịch bản" |
| Chi tiết kịch bản | 1. Tiêu đề · 2. Thời gian làm bài (phút : giây) · 3. **Thời gian xuất hiện** (phút : giây) · 4. **Dạng** |

Thao tác theo **Dạng**:

| Dạng | Thao tác |
|---|---|
| Bài tập, Song ngữ | "Chọn bộ câu hỏi" → modal chọn từ bài tập đã tạo, hoặc "+ Thêm câu hỏi mới" |
| Tài liệu, File Audio, Audio in live | Nút "Chọn" để upload file |
| Video | Ô "Link video" |
| Subtitle | "Upload file en" + "Upload file vn" |
| Shadowing | "Upload file vtt" + "Tool Upload" |

"+ Thêm câu hỏi mới" mở 4 lựa chọn (Tạo trực tiếp trên hệ thống / Tạo từ file có sẵn / Tải file Tag / Tải file + bảng câu). "Tạo trực tiếp" mở **trình soạn bộ câu hỏi**: thêm Câu đơn / Câu hỏi 2 cấp / Câu hỏi 3 cấp. Cột trái hiển thị câu hỏi (tag Loại / Dạng bài / Độ khó / Kiến thức, đoạn văn, Dịch bài, đáp án A–D với đáp án đúng viền xanh, giải thích). Cột phải là thẻ từng câu con (Loại game, Đáp án đúng, Kỹ năng) có Sửa/Xoá, khi sửa hiện Huỷ/Lưu.

**Phần đề xuất** (viền tím nét đứt trong template, không có trên site gốc): vạch đánh dấu mốc kịch bản trên thanh tiến độ của player, và nút "Lấy thời điểm hiện tại" để điền mốc từ vị trí đang phát. Player trong template là giả lập (chạy ×4), khi tới mốc sẽ hiện thẻ kịch bản để minh hoạ hành vi "Video không chạy".

**Chưa xác minh:** danh sách tuỳ chọn của *Loại game*, *Kỹ năng*, *Loại* trong template chỉ là ví dụ. Site gốc gọi API tạo câu hỏi ngay khi bấm "Câu đơn", nên form trống của câu hỏi mới chưa được chụp. Template dựng theo form sửa câu hỏi có sẵn ("Đề THPT 1"). Biến thể "Kịch bản chữa bài tập" cũng chưa xem chi tiết.

## Gán nhãn và duyệt kho dùng chung (template 09)

Màn hình **thiết kế mới**, không có trên LCMS hiện tại. Dựng bằng design system này cho mục 2 của kịch bản demo với Sở GD&ĐT (use case 23, 24, 18, 25–29, 103, 55). Ô **"Vai trò (bản mẫu)"** trên header thay cho việc mở 4 cửa sổ trình duyệt khi demo. Mọi vai trò dùng chung một bộ dữ liệu, nên thao tác ở vai này hiện ngay ở vai khác.

| Vai trò | Màn hình |
|---|---|
| Giáo viên | *Học liệu của tôi* (tab Học liệu / Câu hỏi, lọc trạng thái): tải lên và gán nhãn, gửi duyệt, xem lý do bị từ chối, lịch sử |
| Tổ trưởng chuyên môn | *Hàng chờ duyệt* Kho Trường bước 1: màn duyệt (xem trước, nhãn, đối chiếu, sơ đồ quy trình, ý kiến), Duyệt / Từ chối kèm lý do |
| Hiệu trưởng | *Hàng chờ phê duyệt* Kho Trường bước 2 (QĐ 4725 mục 1.4: tổ CM thông qua, hiệu trưởng phê duyệt). Người duyệt mỗi bước lấy theo cấu hình quy trình |
| Thẩm định viên Sở | *Hàng chờ duyệt* Kho Sở, duyệt lần lượt 2 bước |
| Quản trị cấp Sở | *Cấu hình quy trình*: số bước, người duyệt, thời hạn theo từng cấp, các quy tắc |
| Mọi vai trò | *Kho dùng chung*: tìm kiếm nâng cao theo nguồn (Kho Sở / Kho Trường), môn, lớp, mạch, chủ đề, bài, yêu cầu cần đạt, mức độ |

**Trạng thái:** Nháp → Chờ duyệt · Kho Trường (bước x/n) → Đã duyệt · Kho Trường → Chờ duyệt · Kho Sở (bước x/n) → Đã duyệt · Kho Sở. Bị từ chối ở bất kỳ bước nào sẽ quay về giáo viên kèm lý do; giáo viên sửa rồi gửi lại.

**Nhãn bắt buộc:** Môn, Lớp, Mạch › Chủ đề › Bài theo khung CTGDPT 2018, và ít nhất một yêu cầu cần đạt. Mức độ, từ khoá, mô tả là tuỳ chọn.

**Chạy thử đúng kịch bản demo:**
1. Giáo viên gán nhãn «Bài giảng Mệnh đề và tập hợp» rồi bấm *Lưu & gửi duyệt* → Kho Trường.
2. Chuyển sang Tổ trưởng → chuông thông báo → duyệt bước 1/2, rồi Hiệu trưởng → duyệt bước 2/2.
3. Quay lại Giáo viên → *Gửi lên Kho Sở*.
4. Chuyển sang Thẩm định viên Sở → duyệt bước 1/2, rồi bước 2/2.
5. Giáo viên gán nhãn video, gửi duyệt → Tổ trưởng *Từ chối* kèm lý do → Giáo viên thấy lý do trong danh sách và chi tiết.
6. Kho dùng chung → bỏ chọn "Kho Trường", lọc Toán 10 → học liệu vừa duyệt xuất hiện.
7. Mở LMS › Học liệu (`design-system/templates/15-shared-materials.html`) → thấy học liệu vừa duyệt (09 ghi vào localStorage `bn-shared-materials`).
8. Làm lại ngắn với câu hỏi (tab *Câu hỏi*, gồm câu Đúng/Sai 4 mệnh đề).

**Lưu ý:** khung chương trình chỉ có **Toán 10** (trích mô phỏng 5 bài; câu chữ của yêu cầu cần đạt cần đối chiếu lại với văn bản CTGDPT 2018 chính thức trước khi demo). Tên trường, giáo viên và học sinh đều là dữ liệu mô phỏng. Hai tuỳ chọn "Áp dụng cho học liệu / câu hỏi" và "Gửi kèm email" trong cấu hình chỉ minh hoạ, chưa có tác dụng. Các bước cấp Trường đều do vai Tổ trưởng xử lý, các bước cấp Sở đều do vai Thẩm định viên xử lý.

## Quét đề từ ảnh/PDF (template 10)

Màn hình **thiết kế mới** cho mục 4 kịch bản demo (UC 105, 100). Thanh **"Trình duyệt mô phỏng"** ở trên cùng chỉ dùng để trình diễn: bấm biểu tượng logo bên phải để mở popup Chrome Extension.

| Phần | Nội dung |
|---|---|
| Ngân hàng câu hỏi | Danh sách theo dạng (Trắc nghiệm / Đúng-Sai / Trả lời ngắn), cột Nguồn (Soạn trực tiếp / Quét đề · trang / Nhập Word-Excel), nút **Nhập câu hỏi ▾** (Từ ảnh/PDF · Từ Word/Excel) |
| Popup extension | Tab *Quét đề*: kéo thả ảnh/PDF, chụp vùng màn hình, dán ảnh, chọn ngân hàng đích, tuỳ chọn nhận dạng công thức / tìm bảng đáp án / căn thẳng ảnh, cảnh báo không dùng cho đề thi còn mật. Tab *Lịch sử*, tab *Cài đặt* (đổi dịch vụ nhận dạng, trạng thái kết nối, hạn mức trang) |
| Xử lý | 4 bước có tiến trình. Có thể đóng popup, biểu tượng tiện ích hiện **…** khi đang chạy và **✓** khi xong. Mặc định tự mở kết quả trong LCMS |
| Kết quả quét | Trái: tệp gốc (chuyển trang, phóng to, xem ảnh gốc hoặc đã căn thẳng), vùng từng câu được đánh số. Phải: thẻ từng câu kèm mức tin cậy (*Nhận dạng tốt / Cần kiểm tra / Đã kiểm tra*), gợi ý sửa một chạm, chọn nhanh đáp án, sửa nội dung có xem trước công thức (KaTeX), gán nhãn hàng loạt theo khung chương trình, chọn hoặc bỏ từng câu |
| Nhập | Chặn nếu còn câu chưa có đáp án (tự nhảy tới câu đó). Câu mới hiện tag **Mới nhập** trong ngân hàng, xem chi tiết có nguồn "Quét từ tệp …, trang …" |
| Word/Excel (UC100) | Modal 3 bước (tải tệp mẫu → chọn tệp → kiểm tra trước khi nhập) kèm ghi chú so sánh với quét đề |

**3 tệp mẫu**, đúng như checklist:
1. *Ảnh chụp đề có công thức*: có lỗi `V89` → `√89` để demo bước "sửa nhanh chỗ nhận dạng sai".
2. *PDF 2 trang có phần Đúng/Sai*: đáp án lấy từ bảng đáp án ở trang 2.
3. *Ảnh chụp điện thoại nghiêng 5°*: có bước căn thẳng ảnh; đề không có đáp án (giáo viên chọn); một lỗi do ảnh mờ (`l` → `1`).

**Lưu ý:**
- Bản mẫu **không có nhận dạng thật**. Tiến trình xử lý được rút ngắn còn khoảng 3 giây; thời gian ghi trên giao diện (14–21 giây) là số giả định. Nếu chọn tệp riêng, popup báo rõ là bản mẫu chưa kết nối dịch vụ nhận dạng.
- Ảnh "tệp gốc" được vẽ lại bằng HTML từ dữ liệu mẫu, không phải ảnh quét thật.
- Công thức hiển thị bằng KaTeX tải từ jsDelivr, nên cần có mạng. Khi mất mạng sẽ hiện mã LaTeX thay cho công thức.
- Câu trả lời của Sở về an toàn dữ liệu cần được thống nhất trước buổi demo. Popup hiện chỉ ghi khuyến nghị: không dùng cho đề thi chính thức còn trong thời gian bảo mật.

## Bản mẫu cho kịch bản demo với Sở (template 11–17)

Đối chiếu với *Checklist kịch bản demo 311026 v3*. Màn của học sinh/thí sinh nằm ở TVET (`../design-system/templates/`). Menu bên trái của các màn 11–17 (vẽ bởi `lcms-demo.js`) liên kết sẵn các màn để chuyển nhanh khi demo. Mọi dữ liệu là mô phỏng.

| Mục | Nội dung | LCMS | TVET |
|---|---|---|---|
| 1 | Khung chương trình | 11 | – |
| 2 | Gán nhãn & duyệt kho | 09 | – |
| 3 | Câu hỏi Đúng/Sai (QĐ 764) | 12 | 10-true-false |
| 4 | Quét đề ảnh/PDF | 10 (mở từ nút *Nhập từ ảnh/PDF* trong 12, không có mục riêng ở menu) | – |
| 5 | Thi tại phòng máy | 13 | 11-exam-kiosk |
| 6 | Video bài giảng tương tác | 08, 16 | 08-video-lesson |
| 7 | Giao bài tập | 14 (mở từ khoá học 04 hoặc nút *Giao bài* trong kho học liệu 09, không có mục riêng ở menu) | 12-my-tasks |
| 8 | GVCN theo dõi lớp | 15 | – |
| 9 | Thư viện điện tử | 06 (tab Tài liệu), 17 | 14-elibrary (xem file trực tuyến) |
| 10 | Tra từ điển | 14 (bật/tắt theo bài, chỉ với bài ngoại ngữ; dữ liệu mẫu hiện là Toán nên không hiện) | 09-reading-dictionary, 12-my-tasks, 11-exam-kiosk (bị khoá) |
| 11 | Báo cáo điều hành | chưa làm | – |

**Lưu ý từng màn:**
- *11 Khung chương trình*: mỗi môn có bộ cấp riêng (Toán 6 cấp, Tiếng Anh 5 cấp…), “Cấu hình cấp” cho đổi tên, chèn, xoá cấp trống, không giới hạn số cấp; nút có thể bỏ qua cấp. Thống kê đếm theo cấp **có mã** sâu nhất (thường là YCCĐ).
- *12/10 Đúng/Sai*: thang điểm 0 / 0,1 / 0,25 / 0,5 / 1 theo đề minh hoạ 2025 – **cần đối chiếu quy định hiện hành trước buổi demo**.
- *13/11 Thi*: không ghi hình hay chụp màn hình thí sinh. Bảng giám sát chạy giả lập ×10 bằng thanh “Kịch bản demo”. Máy thi bắt sự kiện thật của trình duyệt (`visibilitychange`, `fullscreenchange`, `online/offline`) và có nút giả lập khi không thể thoát toàn màn hình lúc trình chiếu.
- *16*: dữ liệu học sinh cố định theo công thức (không ngẫu nhiên), nút “Xuất Excel” tải tệp CSV.
- *17*: thanh “Trình duyệt mô phỏng” minh hoạ việc đổi tên miền; luồng xác thực tự động được mô tả bằng 3 bước. Không phải SSO toàn tỉnh hay VNeID.

## So với TVET

| | TVET (học viên) | LCMS (giáo viên/quản trị) |
|---|---|---|
| Thư viện gốc | MUI | Ant Design |
| Primary | `#0B6CFC` | `#1579AD` |
| Font | Inter / Be Vietnam Pro | Font hệ thống |
| Dark mode | Có | Không |
| Mật độ | Thoáng, card lớn | Dày, bảng + form |

## Lưu ý

- **Warning** và **Neutral** (`lc-tag--warning`, `lc-tag--neutral`) không xuất hiện trên site, được thêm để có đủ trạng thái Đang chờ / Riêng tư.
- Màn hình **soạn câu hỏi** (bước 2 của bài thi) và form **tạo sự kiện / lộ trình** chưa chụp sâu. Muốn xem các bước đó phải đi tiếp vào luồng chỉnh sửa, tôi dừng ở mức xem form.
- Link chia sẻ trong template 06 đã thay bằng domain ví dụ.
- Font `SVN-Poppins` có khai báo nhưng gần như không dùng (chỉ chữ 10px), nên bộ này dùng font hệ thống.
