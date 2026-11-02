/* QLĐT helpers (không phụ thuộc thư viện).
   <svg class="qd-i"><use href="#qd-ten"/></svg>  icon (sprite được chèn tự động, xem ICONS)
   .qd-nav__item                 menu con: rê chuột (CSS) hoặc bấm để mở (màn cảm ứng)
   .qd-role                      ô chuyển vai trò trên menu ngang
   [data-qd-toggle="id"]         bật/tắt #id (modal, pop chọn nhiều, danh sách cột)
   [data-qd-close]               đóng .qd-overlay / pop gần nhất
   .qd-tabs > a|button           chuyển tab; data-qd-panel="id" để hiện panel tương ứng
   .qd-section__head             mở/đóng mục "1. Thông tin chung" (chữ Hiện/Ẩn tự đổi)
   [data-qd-selectall]           checkbox "Select All" chọn mọi checkbox trong bảng gần nhất
   [data-qd-loading="ms"]        bấm để hiện lớp LOADING trong ms (mặc định 900)
   QD.toast(text, type?)         thông báo nổi dưới giữa màn (warning | success | danger | info)
   QD.loading(ms?)               hiện lớp LOADING, trả về hàm tắt */
(function () {
  // Cổng chọn hệ thống nằm ở thư mục gốc, cạnh thư mục qldt-design-system
  var PORTAL = document.currentScript ? new URL('../index.html', document.currentScript.src).href : '../../index.html';
  var ICONS = {
    grid: '<rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/>',
    calendar: '<rect x="3" y="4" width="18" height="18" rx="3"/><path d="M8 2v4M16 2v4M3 10h18M8 14h.01M12 14h.01M16 14h.01M8 18h.01M12 18h.01"/>',
    settings: '<path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/>',
    clipboard: '<rect x="8" y="2" width="8" height="4" rx="1"/><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><path d="m9 14 2 2 4-4"/>',
    bell: '<path class="qd-f" d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/>',
    'chevron-down': '<path d="m6 9 6 6 6-6"/>',
    'chevron-right': '<path d="m9 6 6 6-6 6"/>',
    funnel: '<path class="qd-f" d="M3 4h18l-7 8.5V19l-4 2v-8.5z"/>',
    refresh: '<path d="M21 12a9 9 0 0 1-15.5 6.2L3 16M3 12a9 9 0 0 1 15.5-6.2L21 8"/><path d="M21 3v5h-5M3 21v-5h5"/>',
    search: '<circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/>',
    x: '<path d="M18 6 6 18M6 6l12 12"/>',
    warning: '<path class="qd-f" d="M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0z"/><path d="M12 9v4M12 17h.01" stroke="#fcf8e3"/>',
    plus: '<circle class="qd-f" cx="12" cy="12" r="10"/><path d="M12 8v8M8 12h8" stroke="#fff"/>',
    mail: '<rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-10 6L2 7"/>',
    download: '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3"/>',
    upload: '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12"/>',
    edit: '<path d="M12 20h9M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z"/>',
    trash: '<path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6"/>',
    first: '<path class="qd-f" d="M18 5v14l-9-7zM6 5v14"/>',
    prev: '<path class="qd-f" d="M16 5v14l-9-7z"/>',
    next: '<path class="qd-f" d="M8 5v14l9-7z"/>',
    last: '<path class="qd-f" d="M6 5v14l9-7zM18 5v14"/>',
    office: '<path class="qd-f" d="M3 5.5 14 2l6 2v16l-6 2-11-3.5L14 20V5.5L7 7v10l-4 1.5z"/>',
    user: '<circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/>'
  };

  function injectSprite() {
    if (document.getElementById('qd-sprite')) return;
    var s = '<svg id="qd-sprite" xmlns="http://www.w3.org/2000/svg" style="display:none"><style>.qd-f{fill:currentColor;stroke:none}</style>';
    for (var k in ICONS) s += '<symbol id="qd-' + k + '" viewBox="0 0 24 24">' + ICONS[k] + '</symbol>';
    document.body.insertAdjacentHTML('afterbegin', s + '</svg>');
  }

  function closePops(except) {
    document.querySelectorAll('[data-qd-pop]').forEach(function (p) { if (p !== except && !p.contains(except)) p.hidden = true; });
    document.querySelectorAll('.qd-role.is-open, .qd-nav__item.is-open').forEach(function (r) { if (!r.contains(except)) r.classList.remove('is-open'); });
  }

  document.addEventListener('click', function (e) {
    var t = e.target;

    var tog = t.closest('[data-qd-toggle]');
    if (tog) {
      var el = document.getElementById(tog.getAttribute('data-qd-toggle'));
      if (el) { closePops(el); el.hidden = !el.hidden; }
      e.preventDefault();
      return;
    }

    if (t.closest('[data-qd-close]') || t.classList.contains('qd-overlay')) {
      var ov = t.closest('.qd-overlay, [data-qd-pop]');
      if (ov) ov.hidden = true;
      return;
    }

    var roleBtn = t.closest('.qd-role__btn');
    if (roleBtn) { var role = roleBtn.parentElement; closePops(role); role.classList.toggle('is-open'); return; }
    var roleItem = t.closest('.qd-role__menu a');
    if (roleItem) {
      e.preventDefault();
      var r = roleItem.closest('.qd-role');
      r.querySelectorAll('.is-selected').forEach(function (x) { x.classList.remove('is-selected'); });
      roleItem.classList.add('is-selected');
      r.querySelector('.qd-role__btn span').textContent = roleItem.getAttribute('data-short') || roleItem.textContent.trim();
      r.classList.remove('is-open');
      return;
    }

    // Màn cảm ứng: bấm mục menu có menu con để mở
    var navBtn = t.closest('button.qd-nav__link');
    if (navBtn) { var item = navBtn.parentElement; closePops(item); item.classList.toggle('is-open'); return; }

    if (!t.closest('[data-qd-pop]')) closePops();

    var tab = t.closest('.qd-tabs > a, .qd-tabs > button');
    if (tab && (!tab.hasAttribute("href") || tab.getAttribute("href") === "#")) {
      e.preventDefault();
      tab.parentElement.querySelectorAll(':scope > .is-active').forEach(function (x) { x.classList.remove('is-active'); });
      tab.classList.add('is-active');
      var target = tab.getAttribute('data-qd-panel');
      if (target) {
        var panel = document.getElementById(target);
        if (panel) {
          panel.parentElement.querySelectorAll(':scope > [data-qd-tabpanel]').forEach(function (p) { p.hidden = p !== panel; });
        }
      }
    }

    var head = t.closest('.qd-section__head');
    if (head) {
      e.preventDefault();
      var sec = head.parentElement;
      sec.classList.toggle('is-open');
      var lbl = head.querySelector('a');
      if (lbl) lbl.textContent = sec.classList.contains('is-open') ? 'Ẩn' : 'Hiện';
    }

    var ld = t.closest('[data-qd-loading]');
    if (ld) QD.loading(+ld.getAttribute('data-qd-loading') || 900);
  });

  document.addEventListener('change', function (e) {
    var all = e.target.closest('[data-qd-selectall]');
    if (!all) return;
    var scope = document.getElementById(all.getAttribute('data-qd-selectall')) || all.closest('section, main');
    scope.querySelectorAll('tbody input[type="checkbox"]').forEach(function (c) { c.checked = all.checked; });
    document.querySelectorAll('[data-qd-selectall="' + all.getAttribute('data-qd-selectall') + '"]').forEach(function (c) { c.checked = all.checked; });
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
      closePops();
      document.querySelectorAll('.qd-overlay').forEach(function (o) { o.hidden = true; });
    }
  });

  var QD = window.QD = {
    toast: function (text, type) {
      var box = document.querySelector('.qd-toasts');
      if (!box) { box = document.createElement('div'); box.className = 'qd-toasts'; document.body.appendChild(box); }
      var el = document.createElement('div');
      el.className = 'qd-toast' + (type && type !== 'warning' ? ' qd-toast--' + type : '');
      el.setAttribute('role', 'status');
      el.innerHTML = (type && type !== 'warning' ? '' : '<svg class="qd-i"><use href="#qd-warning"/></svg>') + '<span></span><button aria-label="Đóng">×</button>';
      el.querySelector('span').textContent = text;
      el.querySelector('button').onclick = function () { el.remove(); };
      box.appendChild(el);
      setTimeout(function () { el.remove(); }, 4000);
    },
    loading: function (ms) {
      var el = document.createElement('div');
      el.className = 'qd-loading';
      el.setAttribute('aria-label', 'Đang tải dữ liệu');
      el.innerHTML = '<div class="qd-loading__text">' + 'LOADING'.split('').map(function (c) { return '<span>' + c + '</span>'; }).join('') + '</div>';
      document.body.appendChild(el);
      var off = function () { el.remove(); };
      if (ms) setTimeout(off, ms);
      return off;
    }
  };

  function addPortalLink() {
    document.querySelectorAll('.qd-header__tools').forEach(function (box) {
      if (!box.querySelector('[data-qd-portal]')) box.insertAdjacentHTML('afterbegin', '<a class="qd-hicon" data-qd-portal href="' + PORTAL + '" title="Về cổng chọn hệ thống" aria-label="Về cổng chọn hệ thống"><svg class="qd-i"><use href="#qd-grid"/></svg></a>');
    });
  }
  function init() { injectSprite(); addPortalLink(); }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
