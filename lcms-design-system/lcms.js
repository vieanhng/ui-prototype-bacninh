/* LCMS helpers (không phụ thuộc thư viện).
   [data-lc-toggle="id"]    bật/tắt phần tử #id (dropdown, modal, panel)
   [data-lc-close]          đóng .lc-overlay / dropdown gần nhất
   .lc-chapter__head        mở/đóng chương
   .lc-tabs / .lc-pills / .lc-view-toggle   chuyển trạng thái active
   [data-lc-collapse]       thu gọn sidebar (.lc-layout.is-collapsed)
   [data-lc-view="grid|table"] + [data-lc-view-panel="grid|table"]  đổi dạng xem */
(function () {
  function closePops(except) {
    document.querySelectorAll('[data-lc-pop]').forEach(function (p) { if (p !== except) p.hidden = true; });
  }

  document.addEventListener('click', function (e) {
    var t = e.target;

    var tog = t.closest('[data-lc-toggle]');
    if (tog) {
      var el = document.getElementById(tog.getAttribute('data-lc-toggle'));
      if (el) { closePops(el); el.hidden = !el.hidden; }
      e.preventDefault();
      return;
    }

    if (t.closest('[data-lc-close]') || t.classList.contains('lc-overlay')) {
      var ov = t.closest('.lc-overlay, [data-lc-pop]');
      if (ov) ov.hidden = true;
      return;
    }

    if (!t.closest('[data-lc-pop]')) closePops();

    var head = t.closest('.lc-chapter__head');
    if (head && !t.closest('.lc-icon-btn, [data-lc-pop]')) head.parentElement.classList.toggle('is-open');

    var tab = t.closest('.lc-tabs > a, .lc-tabs > button, .lc-pills > button');
    if (tab) {
      tab.parentElement.querySelectorAll('.is-active').forEach(function (x) { x.classList.remove('is-active'); });
      tab.classList.add('is-active');
      var target = tab.getAttribute('data-lc-panel');
      if (target) {
        document.querySelectorAll('[data-lc-panel-group="' + tab.parentElement.id + '"]').forEach(function (p) {
          p.hidden = p.id !== target;
        });
      }
      if (tab.tagName === 'A' && tab.getAttribute('href') === '#') e.preventDefault();
    }

    var view = t.closest('[data-lc-view]');
    if (view) {
      var v = view.getAttribute('data-lc-view');
      view.parentElement.querySelectorAll('button').forEach(function (b) { b.classList.toggle('is-active', b === view); });
      document.querySelectorAll('[data-lc-view-panel]').forEach(function (p) { p.hidden = p.getAttribute('data-lc-view-panel') !== v; });
    }

    if (t.closest('[data-lc-collapse]')) {
      var layout = document.querySelector('.lc-layout');
      if (layout) layout.classList.toggle('is-collapsed');
    }

    var menu = t.closest('.lc-menu__item[data-lc-sub]');
    if (menu) {
      menu.classList.toggle('is-open');
      var sub = document.getElementById(menu.getAttribute('data-lc-sub'));
      if (sub) sub.hidden = !menu.classList.contains('is-open');
    }
  });

  document.addEventListener('keydown', function (e) {
    if (e.key !== 'Escape') return;
    var open = [].filter.call(document.querySelectorAll('[data-lc-pop]'), function (p) { return !p.hidden; });
    if (open.length) { closePops(); return; }
    // Modal lồng nhau: chỉ đóng lớp trên cùng (z-index cao nhất)
    var top = null;
    document.querySelectorAll('.lc-overlay').forEach(function (o) {
      if (!o.hidden && (!top || +getComputedStyle(o).zIndex >= +getComputedStyle(top).zIndex)) top = o;
    });
    if (top) top.hidden = true;
  });
})();
