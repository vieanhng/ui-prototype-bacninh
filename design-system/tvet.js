/* TVET helpers: icon Lucide + chuyển theme sáng/tối.
   Dùng: <script src="https://unpkg.com/lucide@0.460.0/dist/umd/lucide.min.js"></script>
         <script src="tvet.js"></script>
   Icon: <i data-lucide="book-open"></i>   Nút theme: [data-tv-theme-toggle]
   Xem file trực tuyến (sách thư viện, học liệu PDF): TvViewer.open({ title, pages, page, note }) */
(function () {
  var root = document.documentElement;
  // Cổng chọn hệ thống nằm ở thư mục gốc, cạnh thư mục design-system
  var PORTAL = document.currentScript ? new URL('../index.html', document.currentScript.src).href : '../../index.html';
  var saved = null;
  try { saved = localStorage.getItem('tv-theme'); } catch (e) {}
  if (saved) root.setAttribute('data-theme', saved);

  function syncToggle() {
    var dark = root.getAttribute('data-theme') === 'dark';
    document.querySelectorAll('[data-tv-theme-toggle]').forEach(function (b) {
      b.innerHTML = '<i data-lucide="' + (dark ? 'moon' : 'sun') + '"></i>';
      b.title = dark ? 'Chế độ sáng' : 'Chế độ tối';
    });
    if (window.lucide) window.lucide.createIcons();
  }

  document.addEventListener('click', function (e) {
    var t = e.target.closest('[data-tv-theme-toggle]');
    if (t) {
      var next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
      root.setAttribute('data-theme', next);
      try { localStorage.setItem('tv-theme', next); } catch (err) {}
      syncToggle();
    }
    var m = e.target.closest('[data-tv-menu]');
    document.querySelectorAll('[data-tv-menu-panel]').forEach(function (p) {
      if (m && p.id === m.getAttribute('data-tv-menu')) p.hidden = !p.hidden;
      else if (!e.target.closest('[data-tv-menu-panel]')) p.hidden = true;
    });
    var acc = e.target.closest('[data-tv-accordion]');
    if (acc) { var body = acc.nextElementSibling; if (body) body.hidden = !body.hidden; }
  });

  function addPortalLink() {
    document.querySelectorAll('.tv-header__actions').forEach(function (box) {
      if (box.querySelector('[data-tv-portal]')) return;
      box.insertAdjacentHTML('afterbegin', '<a class="tv-icon-btn" data-tv-portal href="' + PORTAL + '" title="Về cổng hệ thống" aria-label="Về cổng hệ thống"><i data-lucide="layout-grid"></i></a>');
    });
  }

  // Trình xem file trực tuyến: chỉ lật trang và phóng to/thu nhỏ, không tương tác, không tải về
  var viewer = null;
  function vEsc(t) { return String(t).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function vRender() {
    var v = viewer, el = document.getElementById('tvViewer');
    var lines = ''; for (var i = 0; i < 18; i++) lines += '<span style="width:' + (60 + ((v.page * 7 + i * 13) % 38)) + '%"></span>';
    el.querySelector('.tv-viewer__pg').textContent = v.page + ' / ' + v.pages;
    el.querySelector('.tv-viewer__zoom').textContent = Math.round(v.zoom * 100) + '%';
    el.querySelector('[data-v="prev"]').disabled = v.page <= 1;
    el.querySelector('[data-v="next"]').disabled = v.page >= v.pages;
    el.querySelector('.tv-viewer__body').innerHTML = '<div class="tv-viewer__page" style="width:' + Math.round(620 * v.zoom) + 'px"><small>' + vEsc(v.title) + '</small><b>' + (v.page === 1 ? vEsc(v.title) : 'Trang ' + v.page) + '</b><div class="tv-viewer__lines">' + lines + '</div><small class="n">' + v.page + '</small></div>';
  }
  function vClose() { var el = document.getElementById('tvViewer'); if (el) el.remove(); viewer = null; document.removeEventListener('keydown', vKey); }
  function vKey(e) {
    if (!viewer) return;
    if (e.key === 'Escape') vClose();
    else if (e.key === 'ArrowRight' && viewer.page < viewer.pages) { viewer.page++; vRender(); }
    else if (e.key === 'ArrowLeft' && viewer.page > 1) { viewer.page--; vRender(); }
  }
  window.TvViewer = {
    open: function (o) {
      vClose();
      viewer = { title: o.title || 'Tài liệu', pages: o.pages || 1, page: Math.min(Math.max(o.page || 1, 1), o.pages || 1), zoom: 1 };
      document.body.insertAdjacentHTML('beforeend', '<div class="tv-viewer" id="tvViewer" role="dialog" aria-label="Xem tài liệu"><div class="tv-viewer__bar">' +
        '<div class="tv-viewer__t"><b>' + vEsc(viewer.title) + '</b><small>' + vEsc(o.note || 'Xem trực tuyến · không tải về') + '</small></div>' +
        '<div class="tv-viewer__ctl"><button data-v="prev" aria-label="Trang trước"><i data-lucide="chevron-left"></i></button><span class="tv-viewer__pg"></span><button data-v="next" aria-label="Trang sau"><i data-lucide="chevron-right"></i></button></div>' +
        '<div class="tv-viewer__ctl"><button data-v="out" aria-label="Thu nhỏ"><i data-lucide="minus"></i></button><span class="tv-viewer__zoom"></span><button data-v="in" aria-label="Phóng to"><i data-lucide="plus"></i></button></div>' +
        '<button data-v="close" class="tv-viewer__x" aria-label="Đóng"><i data-lucide="x"></i></button></div><div class="tv-viewer__body"></div></div>');
      document.getElementById('tvViewer').addEventListener('click', function (e) {
        var b = e.target.closest('[data-v]'); if (!b || b.disabled) return;
        var a = b.getAttribute('data-v');
        if (a === 'close') return vClose();
        if (a === 'prev') viewer.page--; if (a === 'next') viewer.page++;
        if (a === 'in') viewer.zoom = Math.min(2, viewer.zoom + 0.25); if (a === 'out') viewer.zoom = Math.max(0.5, viewer.zoom - 0.25);
        vRender();
      });
      document.addEventListener('keydown', vKey);
      vRender();
      if (window.lucide) window.lucide.createIcons();
    },
    close: vClose
  };

  document.addEventListener('DOMContentLoaded', function () { addPortalLink(); syncToggle(); });
})();
