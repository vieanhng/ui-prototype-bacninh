/* LCMS · tiện ích dùng chung cho các màn hình bản mẫu (menu chung của mọi màn trừ 01; màn 09 ghép thêm menu này dưới menu riêng).
   Chỉ dùng cho bản mẫu, không thuộc design system lõi.
   - <nav class="lc-menu" data-demo-menu="khung"></nav>  → vẽ menu chung theo nhóm, chỉ hiện nhóm của vai trò đang chọn
   - <nav class="lc-rail" data-demo-rail="khoahoc"></nav> → menu dạng rail (chỉ icon)
   - Ô "Vai trò (bản mẫu)" + nút về cổng được chèn vào .lc-header__actions; vai trò lưu chung cho mọi màn
   - LcDemo.role() / setRole(k) / menuHTML(role, active, skipActive) → dùng ở màn 09; đổi vai trò phát sự kiện `lcdemo:role`
   - LcDemo.toast('Đã lưu')                               → thông báo nhanh (.lc-toast)
   - LcDemo.KHUNG                                          → khung chương trình Toán 10 (giống template 09)
   - LcDemo.esc / pad / icons()                            → escape HTML, thêm số 0, vẽ icon Lucide */
(function () {
  var PORTAL = document.currentScript ? new URL('../index.html', document.currentScript.src).href : '../../index.html';
  var QLDT = '../../qldt-design-system/templates/';

  // Vai trò trong trường. Một người có thể kiêm nhiều vai, bản mẫu chọn một vai để thấy rõ menu của vai đó.
  var ROLES = [['gv', 'Giáo viên bộ môn'], ['gvcn', 'Giáo viên chủ nhiệm'], ['tt', 'Tổ trưởng chuyên môn'], ['ht', 'Hiệu trưởng'], ['ct', 'Cán bộ coi thi'], ['so', 'Chuyên viên Sở (quản trị khung)']];
  // Nhóm menu: [key, nhãn, vai trò thấy nhóm]
  var GROUPS = [
    ['day', 'Giảng dạy', ['gv', 'gvcn', 'tt']],
    ['kho', 'Tổ chuyên môn · Học liệu', ['gv', 'gvcn', 'tt', 'ht']],
    ['cn', 'Chủ nhiệm', ['gvcn', 'ht']],
    ['thi', 'Coi thi', ['ct', 'ht']],
    ['ql', 'Quản lý nhà trường', ['ht']],
    ['so', 'Cấp Sở', ['so']]
  ];
  // Menu chung: [key, nhãn, trang, icon, nhóm]
  var MENU = [
    // Giao bài tập (14) không có mục riêng: giao từ trong khoá học (04) hoặc từ kho học liệu (09)
    ['khoahoc', 'Khoá học', '02-list-grid-table.html', 'my-course.svg', 'day'],
    ['khung', 'Tra cứu khung chương trình', '11-curriculum.html', 'category.svg', 'day'],
    // Quét đề ảnh/PDF (10) không có mục riêng: mở từ nút "Nhập từ ảnh/PDF" trong Ngân hàng câu hỏi, sidebar sáng mục này
    ['nganhang', 'Ngân hàng câu hỏi', '12-question-bank.html', 'icon-pen-tool.svg', 'day'],
    ['hoclieu', 'Học liệu & duyệt kho', '09-content-approval.html', 'documentIcon.svg', 'kho'],
    ['chunhiem', 'Lớp chủ nhiệm', '15-homeroom.html', 'student.svg', 'cn'],
    ['phongthi', 'Giám sát phòng thi', '13-exam-proctoring.html', 'timeTable.svg', 'thi'],
    ['baocao', 'Báo cáo điều hành (QLĐT)', QLDT + '09-executive-report.html', 'arrow-open-link.svg', 'ql'],
    // Chỉ cấp Sở được soạn khung chương trình; trường chỉ tra cứu (cùng màn 11, ẩn thao tác sửa)
    ['khung', 'Soạn khung chương trình', '11-curriculum.html', 'category.svg', 'so'],
    ['hoclieu', 'Thẩm định & quy trình duyệt', '09-content-approval.html', 'documentIcon.svg', 'so']
  ];

  var role = 'gv';
  try { role = localStorage.getItem('bn-lcms-role') || 'gv'; } catch (e) {}
  if (!ROLES.some(function (r) { return r[0] === role; })) role = 'gv';
  // Link kịch bản demo có thể chỉ định vai trò: …html?role=tt
  var urlRole = new URLSearchParams(location.search).get('role');
  if (ROLES.some(function (r) { return r[0] === urlRole; })) { role = urlRole; try { localStorage.setItem('bn-lcms-role', role); } catch (e) {} }
  function setRole(k) { role = k; try { localStorage.setItem('bn-lcms-role', k); } catch (e) {} }
  function visible(m) { return GROUPS.some(function (g) { return g[0] === m[4] && g[2].indexOf(role) >= 0; }); }

  var KHUNG = [
    { mach: 'Đại số và Một số yếu tố Giải tích', chude: 'Mệnh đề toán học. Tập hợp', bai: 'Mệnh đề toán học', yccd: [
      ['T10.MĐ.1', 'Thiết lập và phát biểu được các mệnh đề toán học: mệnh đề phủ định, mệnh đề đảo, mệnh đề tương đương, mệnh đề chứa kí hiệu ∀, ∃; điều kiện cần, điều kiện đủ, điều kiện cần và đủ.'],
      ['T10.MĐ.2', 'Xác định được tính đúng/sai của một mệnh đề toán học trong những trường hợp đơn giản.']] },
    { mach: 'Đại số và Một số yếu tố Giải tích', chude: 'Mệnh đề toán học. Tập hợp', bai: 'Tập hợp. Các phép toán trên tập hợp', yccd: [
      ['T10.TH.1', 'Nhận biết được các khái niệm cơ bản về tập hợp (tập con, hai tập hợp bằng nhau, tập rỗng) và sử dụng được các kí hiệu ⊂, ⊃, ∅.'],
      ['T10.TH.2', 'Thực hiện được phép toán trên các tập hợp (hợp, giao, hiệu, phần bù) và dùng biểu đồ Ven để biểu diễn chúng.']] },
    { mach: 'Đại số và Một số yếu tố Giải tích', chude: 'Hàm số, đồ thị và ứng dụng', bai: 'Hàm số bậc hai, đồ thị và ứng dụng', yccd: [
      ['T10.HS.1', 'Thiết lập được bảng giá trị của hàm số bậc hai.'],
      ['T10.HS.2', 'Vẽ được parabol là đồ thị hàm số bậc hai.'],
      ['T10.HS.3', 'Nhận biết được các tính chất cơ bản của parabol như đỉnh, trục đối xứng.']] },
    { mach: 'Hình học và Đo lường', chude: 'Hệ thức lượng trong tam giác. Vectơ', bai: 'Hệ thức lượng trong tam giác', yccd: [
      ['T10.GT.1', 'Giải thích được các hệ thức lượng cơ bản trong tam giác: định lí côsin, định lí sin, công thức tính diện tích tam giác.'],
      ['T10.GT.2', 'Mô tả được cách giải tam giác và vận dụng vào một số bài toán có nội dung thực tiễn.']] },
    { mach: 'Hình học và Đo lường', chude: 'Hệ thức lượng trong tam giác. Vectơ', bai: 'Vectơ', yccd: [
      ['T10.VT.1', 'Nhận biết được khái niệm vectơ, vectơ bằng nhau, vectơ-không.'],
      ['T10.VT.2', 'Thực hiện được các phép toán trên vectơ (tổng, hiệu, tích với một số, tích vô hướng) và mô tả được tính chất hình học bằng vectơ.']] }
  ];

  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function pad(n) { return (n < 10 ? '0' : '') + n; }
  function icons() { if (window.lucide) window.lucide.createIcons(); }

  var toastTimer;
  function toast(msg) {
    var el = document.getElementById('lcDemoToast');
    if (!el) { el = document.createElement('div'); el.id = 'lcDemoToast'; el.className = 'lc-toast'; document.body.appendChild(el); }
    el.innerHTML = '<span class="ok">✓</span>' + msg;
    el.hidden = false;
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { el.hidden = true; }, 2600);
  }

  function menuHTML(r, active, skipActive) {
    var out = GROUPS.filter(function (g) { return g[2].indexOf(r) >= 0; }).map(function (g) {
      var items = MENU.filter(function (m) { return m[4] === g[0] && !(skipActive && m[0] === active); });
      if (!items.length) return '';
      return '<div class="lc-menu__group">' + g[1] + '</div>' + items.map(function (m) {
        return '<a class="lc-menu__item' + (m[0] === active ? ' is-active' : '') + '" href="' + m[2] + '"><img src="../assets/icons/' + m[3] + '" alt=""><span>' + m[1] + '</span></a>';
      }).join('');
    }).join('');
    return out;
  }

  function renderMenu() {
    document.querySelectorAll('[data-demo-menu]').forEach(function (nav) {
      var active = nav.getAttribute('data-demo-menu');
      nav.classList.add('lc-menu--grouped');
      nav.innerHTML = menuHTML(role, active) + (MENU.some(function (m) { return m[0] === active && !visible(m); })
        ? '<p class="lc-menu__note">Màn đang mở không thuộc vai trò này.</p>' : '');
    });
    // Dạng rail (sider thu gọn của trình soạn)
    document.querySelectorAll('[data-demo-rail]').forEach(function (nav) {
      var active = nav.getAttribute('data-demo-rail');
      nav.innerHTML = '<img class="logo" src="../assets/favicon_bn.png" alt="Giáo dục và Đào tạo Bắc Ninh">' + MENU.filter(visible).map(function (m) {
        return '<a href="' + m[2] + '"' + (m[0] === active ? ' class="is-active"' : '') + ' title="' + m[1] + '"><img src="../assets/icons/' + m[3] + '" alt=""></a>';
      }).join('');
    });
  }

  // Nút về cổng + ô vai trò trên header (màn 09 đã có ô vai trò riêng)
  function renderHeader() {
    document.querySelectorAll('.lc-header__actions').forEach(function (box) {
      if (!box.querySelector('[data-demo-portal]')) {
        box.insertAdjacentHTML('afterbegin', '<a class="lc-btn lc-btn--text lc-btn--sm" data-demo-portal href="' + PORTAL + '" title="Về cổng chọn hệ thống">← Cổng</a>');
      }
      if (document.querySelector('[data-demo-menu], [data-demo-rail]') && !document.getElementById('roleSel') && !box.querySelector('[data-demo-role]')) {
        box.querySelector('[data-demo-portal]').insertAdjacentHTML('afterend', '<label class="lc-role-switch" title="Chỉ có trong bản mẫu: menu đổi theo vai trò"><span>Vai trò (bản mẫu)</span><select data-demo-role>' +
          ROLES.map(function (r) { return '<option value="' + r[0] + '"' + (r[0] === role ? ' selected' : '') + '>' + r[1] + '</option>'; }).join('') + '</select></label>');
      }
    });
  }
  document.addEventListener('change', function (e) {
    if (!e.target.matches('[data-demo-role]')) return;
    setRole(e.target.value); renderMenu();
    document.dispatchEvent(new CustomEvent('lcdemo:role', { detail: role }));
    toast('Đã chuyển vai trò: ' + e.target.options[e.target.selectedIndex].text);
  });

  function init() { renderMenu(); renderHeader(); }

  window.LcDemo = { KHUNG: KHUNG, MENU: MENU, ROLES: ROLES, esc: esc, pad: pad, icons: icons, toast: toast, menuHTML: menuHTML, role: function () { return role; }, setRole: setRole };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
