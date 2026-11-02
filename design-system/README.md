# TVET Design System

Trích xuất từ https://tvet.hoc102.com (đăng nhập bằng tài khoản học viên, 31/10/2026). Màu, font, radius, shadow đều lấy từ computed style của trang thật.

## Cấu trúc

```
design-system/
├── design-system.html     ← Trang tài liệu: token + toàn bộ component (mở file này trước)
├── tvet.css               ← Token (CSS variables, light/dark) + class component `tv-*`
├── tvet.js                ← Icon Lucide + chuyển theme + dropdown/accordion đơn giản
├── tvet-dict.js           ← Tra từ điển: nhấp đúp từ trong vùng [data-dict] → popover .tv-dict
├── templates/             ← Trang mẫu độc lập, copy ra để dựng trang mới
│   ├── 01-landing.html            Layout A: trang chủ public
│   ├── 02-app-sidebar-list.html   Layout B (header, không sidebar): Góc học tập của học sinh (bài đến hạn, thư viện, môn học)
│   ├── 03-detail-two-column.html  Layout C: chi tiết môn học Tiếng Anh 10 (Unit accordion + widget phải)
│   ├── 04-dashboard-report.html   Layout D: báo cáo học tập (profile + KPI + chart)
│   ├── 05-table-list.html         Layout B (header, không sidebar): bảng từ vựng + lọc chữ cái + phân trang
│   ├── 06-exam.html               Layout C + E: kết quả bài thi + xem lại câu hỏi
│   ├── 07-form-modal.html         Thông tin tài khoản học sinh + modal đăng nhập (07-form-modal.html#dang-nhap)
│   ├── 08-video-lesson.html       Học video tương tác: video thu nhỏ trái + câu hỏi/tài liệu lớn phải
│   ├── 09-reading-dictionary.html Bài đọc + câu hỏi song song, tra từ điển, từ đã tra, bình luận
│   ├── 10-true-false.html         Học sinh làm câu Đúng/Sai, điểm theo số ý đúng (demo mục 3)
│   ├── 11-exam-kiosk.html         Máy thi: quy chế, toàn màn hình, cảnh báo, mất mạng (mục 5)
│   ├── 12-my-tasks.html           Bài tập của tôi: mỗi loại bài mở đúng màn (kiểm tra → 10, thi phòng máy → 11, video → 08, đọc → 09, phiếu dạng file → trình xem trực tuyến, đã nộp → 06)
│   ├── 15-shared-materials.html   Kho học liệu của học sinh: chỉ học liệu đã duyệt Kho Trường/Kho Sở, không có câu hỏi; đọc dữ liệu LCMS 09 lưu ở localStorage `bn-shared-materials`
│   └── 14-elibrary.html           Thư viện điện tử của học sinh; mở từ 02/03 (`?from=lms`) sẽ chạy giả lập xác thực tự động LMS → Thư viện. Sách thư viện là file (PDF) xem trực tuyến bằng `TvViewer` (tvet.js): lật trang, phóng to/thu nhỏ, không tương tác, không tải về
└── assets/                ← Logo, avatar, ảnh khóa học, ảnh minh họa (tải từ site)
```

## Điều hướng

- Tài liệu dạng file (sách thư viện, phiếu bài tập, học liệu PDF/Word/PowerPoint ở 15) mở bằng `TvViewer.open({ title, pages, page, note })` trong `tvet.js`; không còn màn đọc sách điện tử (13 đã bỏ).

- Đăng nhập (07#dang-nhap) → 02 Góc học tập. Thẻ môn → 03 (môn khác Tiếng Anh 10 mở cùng bố cục kèm ghi chú `?mon=`).
- Nộp bài ở 10 có nút về Bài tập của tôi; nộp ở 11 có nút sang 06 xem lại bài.
- `tvet.js` tự chèn nút về cổng (`../index.html`) vào `.tv-header__actions`.

## Dựng trang mới

```html
<html lang="vi" data-theme="light">
<head>
  <link rel="stylesheet" href="tvet.css">
</head>
<body>
  ...
  <script src="https://unpkg.com/lucide@0.460.0/dist/umd/lucide.min.js"></script>
  <script src="tvet.js"></script>
</body>
```

1. Chọn layout gần nhất trong `templates/` rồi copy file.
2. Chỉ dùng biến `--tv-*` cho màu, không hard-code mã hex, như vậy dark mode tự hoạt động.
3. Icon: `<i data-lucide="tên-icon"></i>` (https://lucide.dev/icons).

## Tra từ điển (`tvet-dict.js`)

Thêm `<script src="tvet-dict.js"></script>` sau `tvet.js`, rồi gắn `data-dict` cho vùng chữ cần tra (bài đọc, câu hỏi, phụ đề…). Nhấp đúp hoặc bôi đen một từ thì hiện popover: phiên âm, từ loại, nghĩa, ví dụ kèm bản dịch, nút phát âm, "Thêm vào từ vựng", "Tra chi tiết".

- `TvDict.card(word)` trả về HTML thẻ tra từ để hiển thị ngay trong trang (vd. ô tìm từ).
- Bôi đen 2–4 từ để tra **cụm từ** (vd. “account for”, “gained traction” → “gain traction”).
- Vùng `data-dict-locked="lý do"` (bài kiểm tra, bài thi): nhấp đúp chỉ hiện thông báo “Tra từ điển đã bị tắt”, phát sự kiện `tvdict:locked`.
- `TvDict.saved`, `TvDict.history`: từ đã lưu / lịch sử tra. Sự kiện `tvdict:open` {word, host} và `tvdict:change` {type: 'saved' | 'history'}.
- Từ điển trong file là dữ liệu mẫu cho 2 template 08, 09; khi làm thật thay `TvDict.data`/`TvDict.card` bằng API.

## Token chính

| Nhóm | Giá trị |
|---|---|
| Primary | `#0B6CFC` · soft `#E8F6FF` |
| Heading (navy) | `#17426A` |
| Text muted | `#667989` |
| Nền app / card | `#F0F4F9` / `#FFFFFF` |
| Border | `#D9DDE3` |
| Success / Danger | `#039855` / `#D92D20` |
| Font | Inter (nội dung) · Be Vietnam Pro (hero 34/700) · SVN-Poppins→Poppins (tiêu đề widget 20/600) |
| Radius | chip 4 · widget 12 · card 16–18 · panel 20 · pill 999 · footer 64 |
| Header / Sidebar / Container | 80px / 305px / 1122px |
| Dark | nền `#191F3B` · card `#202642` · viền `#304164` |

## Lưu ý

- Site gốc dùng font **SVN-Poppins** (font riêng). Ở đây tạm thay bằng Poppins của Google Fonts. Nếu có file font gốc thì khai báo `@font-face` tên `SVN-Poppins`, biến `--tv-font-widget` sẽ tự dùng.
- Biểu đồ trong template 04 là SVG tĩnh minh họa. Khi làm thật nên dùng thư viện chart, màu line là `--tv-primary`.
- Màn hình **đang làm bài thi** chưa được chụp: thao tác đó tạo lượt làm bài mới trên tài khoản. Template 06 dựng theo màn hình *xem lại bài*, vốn dùng cùng khung giao diện.
- Trang `/tra-loi-comment` (Chatbox) dùng font Poppins và style khác, thuộc khu vực quản trị, nên không đưa vào hệ thống.
