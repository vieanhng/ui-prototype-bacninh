/* Báo cáo quản lý (LMS): khung trang dùng chung + biểu đồ SVG. Số liệu trong các trang là minh hoạ.
   Dùng: <link tvet.css>, <script lucide>, tvet.js, bao-cao.js, rồi BC.shell({ tab, title }) và render vào #view */
var $ = function (id) { return document.getElementById(id); };
var fmt = function (n, d) { return typeof n === 'number' ? n.toLocaleString('vi-VN', { maximumFractionDigits: d == null ? 1 : d }) : n; };
var esc = function (s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); };
var ic = function (n, st) { return '<i data-lucide="' + n + '"' + (st ? ' style="' + st + '"' : '') + '></i>'; };
var P = 'var(--tv-primary)', KQ = [['Tốt', '#0a4fb8'], ['Khá', '#0b6cfc'], ['Đạt', '#7fb0fd'], ['Chưa đạt', '#cfe2fe']];
var CAT = ['var(--tv-c4)', 'var(--tv-c6)', 'var(--tv-c1)'];

/* ---------- Biểu đồ SVG (màu theo token nên đổi theo theme) ---------- */
var tipHtml = function (rows) { return rows; };
function box(id, svg, tipFn) {
  var b = $(id); b.innerHTML = svg + '</svg><div class="tv-tip" hidden></div>';
  var tip = b.querySelector('.tv-tip');
  b.onmousemove = function (e) { var g = e.target.closest('[data-i]'); if (!g) { tip.hidden = true; return; } var r = b.getBoundingClientRect(); tip.innerHTML = tipFn(g.dataset.i); tip.hidden = false; tip.style.left = Math.max(0, Math.min(e.clientX - r.left + 14, r.width - 190)) + 'px'; tip.style.top = (e.clientY - r.top + 14) + 'px'; };
  b.onmouseleave = function () { tip.hidden = true; };
}
var trow = function (k, v, c) { return '<div><span>' + (c ? '<i style="background:' + c + '"></i>' : '') + k + '</span><span>' + v + '</span></div>'; };
function hbar(id, rows, unit) {
  var b = $(id), w = Math.max(b.clientWidth, 300), L = w < 480 ? 120 : 180, R = 70, rh = 34, bh = 18, max = Math.max.apply(null, rows.map(function (r) { return r[1]; })), H = rows.length * rh + 8;
  var x = function (v) { return L + v / max * (w - L - R); }, s = '<svg viewBox="0 0 ' + w + ' ' + H + '" role="img">';
  rows.forEach(function (r, i) { var y = 4 + i * rh + (rh - bh) / 2;
    s += '<g data-i="' + i + '"><rect x="0" y="' + (4 + i * rh) + '" width="' + w + '" height="' + rh + '" fill="transparent"/><text class="lbl" x="' + (L - 10) + '" y="' + (y + 13) + '" font-size="13" text-anchor="end">' + esc(r[0]) + '</text><rect x="' + L + '" y="' + y + '" width="' + Math.max(x(r[1]) - L, 1) + '" height="' + bh + '" rx="4" fill="' + P + '"/><text x="' + (x(r[1]) + 6) + '" y="' + (y + 13) + '" font-size="12">' + fmt(r[1]) + (unit || '') + '</text></g>'; });
  box(id, s, function (i) { return '<b>' + esc(rows[i][0]) + '</b>' + trow('Giá trị', fmt(rows[i][1]) + (unit || '')); });
}
function stack(id, rows, keys) {
  var b = $(id), w = Math.max(b.clientWidth, 300), L = w < 480 ? 80 : 110, R = 16, rh = 36, bh = 20, H = rows.length * rh + 28;
  var x = function (v) { return L + v / 100 * (w - L - R); }, s = '<svg viewBox="0 0 ' + w + ' ' + H + '" role="img">';
  [0, 25, 50, 75, 100].forEach(function (g) { s += '<line class="grid" x1="' + x(g) + '" x2="' + x(g) + '" y1="4" y2="' + (H - 22) + '"/><text x="' + x(g) + '" y="' + (H - 6) + '" font-size="11" text-anchor="middle">' + g + '%</text>'; });
  rows.forEach(function (r, i) { var y = 4 + i * rh + (rh - bh) / 2, acc = 0, n = r[1].length;
    s += '<g data-i="' + i + '"><rect x="0" y="' + (4 + i * rh) + '" width="' + w + '" height="' + rh + '" fill="transparent"/><text class="lbl" x="' + (L - 10) + '" y="' + (y + 14) + '" font-size="13" text-anchor="end">' + esc(r[0]) + '</text>';
    r[1].forEach(function (v, j) { var x0 = x(acc) + (j ? 1 : 0); acc += v; var x1 = x(acc) - (j < n - 1 ? 1 : 0); if (x1 > x0) s += '<rect x="' + x0 + '" y="' + y + '" width="' + (x1 - x0) + '" height="' + bh + '" fill="' + keys[j][1] + '"/>'; }); s += '</g>'; });
  box(id, s, function (i) { return '<b>' + esc(rows[i][0]) + '</b>' + keys.map(function (k, j) { return trow(k[0], fmt(rows[i][1][j]) + '%', k[1]); }).join(''); });
}
function line(id, labels, series, unit) {
  var b = $(id), w = Math.max(b.clientWidth, 300), L = 48, R = 20, T = 10, B = 26, H = 230, all = [];
  series.forEach(function (s) { all = all.concat(s.v); }); var max = Math.ceil(Math.max.apply(null, all) / 10) * 10;
  var x = function (i) { return L + i / (labels.length - 1) * (w - L - R); }, y = function (v) { return T + (1 - v / max) * (H - T - B); }, s = '<svg viewBox="0 0 ' + w + ' ' + H + '" role="img">';
  for (var g = 0; g <= 4; g++) { var gv = max * g / 4; s += '<line class="grid" x1="' + L + '" x2="' + (w - R) + '" y1="' + y(gv) + '" y2="' + y(gv) + '"/><text x="' + (L - 8) + '" y="' + (y(gv) + 4) + '" font-size="11" text-anchor="end">' + fmt(gv) + (unit || '') + '</text>'; }
  var step = Math.ceil(labels.length / (w < 600 ? 5 : 10));
  labels.forEach(function (l, i) { if (i % step === 0) s += '<text x="' + x(i) + '" y="' + (H - 6) + '" font-size="11" text-anchor="middle">' + l + '</text>'; });
  series.forEach(function (sr) { s += '<path d="' + sr.v.map(function (v, i) { return (i ? 'L' : 'M') + x(i) + ' ' + y(v); }).join('') + '" fill="none" stroke="' + sr.c + '" stroke-width="2" stroke-linejoin="round"/>'; });
  labels.forEach(function (l, i) { s += '<rect data-i="' + i + '" x="' + (x(i) - (w - L - R) / labels.length / 2) + '" y="' + T + '" width="' + (w - L - R) / labels.length + '" height="' + (H - T - B) + '" fill="transparent"/>'; });
  box(id, s, function (i) { return '<b>' + esc(labels[i]) + '</b>' + series.map(function (sr) { return trow(sr.n, fmt(sr.v[i]) + (unit || ''), sr.c); }).join(''); });
}
function vbar(id, labels, vals, mean) {
  var b = $(id), w = Math.max(b.clientWidth, 300), L = 44, R = 10, T = 16, B = 26, H = 230, n = vals.length, bw = (w - L - R) / n, max = Math.ceil(Math.max.apply(null, vals) / 100) * 100;
  var y = function (v) { return T + (1 - v / max) * (H - T - B); }, s = '<svg viewBox="0 0 ' + w + ' ' + H + '" role="img">';
  for (var g = 0; g <= 4; g++) s += '<line class="grid" x1="' + L + '" x2="' + (w - R) + '" y1="' + y(max * g / 4) + '" y2="' + y(max * g / 4) + '"/><text x="' + (L - 8) + '" y="' + (y(max * g / 4) + 4) + '" font-size="11" text-anchor="end">' + fmt(max * g / 4) + '</text>';
  vals.forEach(function (v, i) { s += '<g data-i="' + i + '"><rect x="' + (L + i * bw) + '" y="' + T + '" width="' + bw + '" height="' + (H - T - B) + '" fill="transparent"/><rect x="' + (L + i * bw + 1) + '" y="' + y(v) + '" width="' + (bw - 2) + '" height="' + (y(0) - y(v)) + '" rx="3" fill="' + (parseFloat(labels[i].replace(',', '.')) < 5 ? 'var(--tv-c6)' : P) + '"/></g>' + (i % 2 ? '' : '<text x="' + (L + i * bw + bw / 2) + '" y="' + (H - 8) + '" font-size="11" text-anchor="middle">' + labels[i] + '</text>'); });
  var mx = L + mean / 10 * (n - 1) / n * (w - L - R) + bw / 2;
  s += '<line x1="' + mx + '" x2="' + mx + '" y1="' + T + '" y2="' + (H - B) + '" stroke="var(--tv-text)" stroke-dasharray="4 3"/><text class="lbl" x="' + (mx + 6) + '" y="' + (T + 2) + '" font-size="11">TB ' + fmt(mean, 2) + '</text>';
  box(id, s, function (i) { return '<b>Điểm ' + labels[i] + '</b>' + trow('Thí sinh', fmt(vals[i])); });
}
var HEAT = ['#eaf1fb', '#c9d9f0', '#7fb0fd', '#0b6cfc', '#0a4fb8'];
function heat(id, rl, cl, m) {
  var b = $(id), w = Math.max(b.clientWidth, 300), L = 34, cw = (w - L - 4) / cl.length, ch = 26, H = rl.length * ch + 24, max = Math.max.apply(null, [].concat.apply([], m)), s = '<svg viewBox="0 0 ' + w + ' ' + H + '" role="img">';
  m.forEach(function (r, i) { s += '<text class="lbl" x="' + (L - 8) + '" y="' + (i * ch + 17) + '" font-size="12" text-anchor="end">' + rl[i] + '</text>'; r.forEach(function (v, j) { s += '<rect data-i="' + i + ',' + j + '" x="' + (L + j * cw + 1) + '" y="' + (i * ch + 1) + '" width="' + (cw - 2) + '" height="' + (ch - 2) + '" rx="2" fill="' + HEAT[Math.min(4, Math.floor(v / max * 5))] + '"/>'; }); });
  cl.forEach(function (c, j) { if (j % 2 === 0) s += '<text x="' + (L + j * cw + cw / 2) + '" y="' + (H - 6) + '" font-size="11" text-anchor="middle">' + c + '</text>'; });
  box(id, s, function (k) { var p = k.split(','); return '<b>' + rl[p[0]] + ', ' + cl[p[1]] + ' giờ</b>' + trow('Phiên TB', fmt(m[p[0]][p[1]]) + ' nghìn'); });
}

/* ---------- Khối giao diện ---------- */
var flag = function (v, bad, suf) { var t = fmt(v) + (suf || ''); return bad ? '<span class="tv-flag">' + ic('triangle-alert') + t + '</span>' : t; };
var meter = function (p, low) { low = low || 70; var bad = p < low; return '<span class="tv-meter' + (bad ? ' is-low' : '') + '"><i><b style="width:' + p + '%"></b></i>' + (bad ? ic('triangle-alert', 'width:12px;height:12px') : '') + p + '%</span>'; };
var rank = function (i) { return '<span class="tv-rank' + (i < 3 ? ' is-top' : '') + '">' + (i + 1) + '</span>'; };
function kpis(list) { return '<div class="tv-grid-auto">' + list.map(function (s) { return '<div class="tv-kpi"><div class="tv-kpi__label">' + s[0] + '</div><div class="tv-kpi__value" style="font-size:24px">' + fmt(s[1]) + '</div><div class="tv-kpi__foot"><span class="' + (s[3] || '') + '">' + s[2] + '</span></div></div>'; }).join('') + '</div>'; }
function head(title, basis, p) { return '<div class="tv-panel"><h2 style="font-size:20px;font-weight:600;color:var(--tv-heading)">' + title + '</h2>' + (basis ? '<div class="tv-basis" style="margin-top:8px">Căn cứ: ' + basis.map(function (x) { return '<span>' + x + '</span>'; }).join('') + '</div>' : '') + '<p class="tv-small tv-muted" style="margin-top:8px">' + p + '</p></div>'; }
var uid = 0;
function chartPanel(title, id, wide, legend) { return '<div class="tv-panel' + (wide ? ' wide' : '') + '"><div class="tv-panel__head"><div class="tv-panel__title" style="font-size:16px">' + title + '</div><button class="tv-btn tv-btn--ghost tv-btn--sm" data-table="' + id + '">Xem dạng bảng</button></div>' + (legend ? '<div class="tv-legend" id="' + id + '-lg">' + legend.map(function (k) { return '<span style="--c:' + k[1] + '">' + k[0] + '</span>'; }).join('') + '</div>' : '') + '<div class="tv-chart" id="' + id + '"></div><div id="' + id + '-t" hidden></div></div>'; }
function tablePanel(title, id, hint, wide) { return '<div class="tv-panel' + (wide === false ? '' : ' wide') + '"><div class="tv-panel__head"><div class="tv-panel__title" style="font-size:16px">' + title + '</div><span class="tv-small tv-muted">' + (hint || '') + '</span></div><div class="tv-table-wrap"><table class="tv-table" id="' + id + '"></table></div></div>'; }
function fillTable(id, headRow, rows, numFrom) {
  numFrom = numFrom == null ? 1 : numFrom;
  $(id).innerHTML = '<thead><tr>' + headRow.map(function (h, i) { return '<th' + (i >= numFrom ? ' class="num"' : '') + '>' + h + '</th>'; }).join('') + '</tr></thead><tbody>' + rows.map(function (r) { return '<tr' + (r.attrs ? ' ' + r.attrs : '') + '>' + (r.cells || r).map(function (c, i) { return '<td' + (i >= numFrom ? ' class="num"' : '') + '>' + (typeof c === 'number' ? fmt(c) : c) + '</td>'; }).join('') + '</tr>'; }).join('') + '</tbody>';
}
function altTable(id, h, rows) { $(id + '-t').innerHTML = '<div class="tv-table-wrap"><table class="tv-table"><thead><tr>' + h.map(function (x, i) { return '<th' + (i ? ' class="num"' : '') + '>' + x + '</th>'; }).join('') + '</tr></thead><tbody>' + rows.map(function (r) { return '<tr>' + r.map(function (c, i) { return '<td' + (i ? ' class="num"' : '') + '>' + esc(fmt(c)) + '</td>'; }).join('') + '</tr>'; }).join('') + '</tbody></table></div>'; }
var grid = function (inner) { return '<div class="tv-grid tv-grid-2" style="gap:16px">' + inner + '</div>'; };

var seed = 7; function rnd() { seed = (seed * 16807) % 2147483647; return (seed - 1) / 2147483646; }
var DAYS = []; for (var i = 1; i <= 31; i++) DAYS.push(i + '/10');
function series(base, amp) { return DAYS.map(function (d, i) { var dow = new Date(2026, 9, i + 1).getDay(), v = base + Math.sin(i / 3) * amp + (rnd() - .5) * amp; return Math.round((dow === 0 || dow === 6 ? v * .6 : v) * 10) / 10; }); }

var BC = {
  pages: [['dashboard', 'Dashboard', '16-bao-cao.html'], ['trien-khai', 'Mức độ triển khai', '16-bao-cao-trien-khai.html'], ['khai-thac', 'Hiệu quả khai thác', '16-bao-cao-khai-thac.html'], ['chat-luong', 'Chất lượng dạy và học', '16-bao-cao-chat-luong.html'], ['tieu-chi', 'Đánh giá theo tiêu chí', '16-bao-cao-tieu-chi.html']],
  // o: { tab, title, role (HTML ô vai trò), extra (HTML thêm vào thanh lọc), crumb (bool), range (false để ẩn kỳ báo cáo) }
  shell: function (o) {
    var tabs = BC.pages.map(function (p) { return '<a href="' + p[2] + '"' + (p[0] === o.tab ? ' class="is-active"' : '') + '>' + p[1] + '</a>'; }).join('');
    document.body.insertAdjacentHTML('afterbegin',
      '<header class="tv-header" style="height:72px"><div class="tv-header__inner" style="padding:0 24px"><a class="tv-icon-btn" href="02-app-sidebar-list.html" aria-label="Góc học tập" style="width:38px;height:38px"><i data-lucide="house"></i></a>' +
      '<h1 style="font-size:24px;font-weight:600;color:var(--tv-heading)">' + o.title + '</h1><div class="tv-header__actions" style="margin-left:auto">' + (o.role || '') + '<button class="tv-icon-btn" data-tv-theme-toggle></button><span class="tv-icon-btn tv-icon-btn--warn"><i data-lucide="bell"></i></span><img class="tv-avatar" src="../assets/default-avatar.jpg" alt=""></div></div>' +
      '<nav class="tv-htabs" style="position:absolute;left:0;right:0;top:72px;z-index:1">' + tabs + '</nav></header>' +
      '<main style="padding:64px 24px 0"><div class="tv-filterbar" style="margin:16px 0">' + (o.extra || '') +
      (o.range === false ? '' : '<select class="tv-select" id="range" aria-label="Kỳ báo cáo"><optgroup label="Tháng"><option data-cmp="tháng 9/2026" data-end="31/10/2026">Tháng 10/2026</option><option data-cmp="tháng 8/2026" data-end="30/09/2026">Tháng 9/2026</option></optgroup><optgroup label="Học kỳ"><option data-cmp="HK II 2025-2026" data-end="02/11/2026">HK I 2026-2027 (đến tuần 9)</option></optgroup><optgroup label="Năm học"><option data-cmp="năm học 2024-2025" data-end="31/05/2026">Năm học 2025-2026</option></optgroup></select><span class="tv-small tv-muted" id="meta"></span>') +
      '<span style="margin-left:auto" class="tv-row"><button class="tv-btn tv-btn--outline tv-btn--sm" data-toast="Đang tạo file PDF báo cáo…"><i data-lucide="file-text"></i>Xuất PDF</button><button class="tv-btn tv-btn--outline tv-btn--sm" data-toast="Đang tạo file Excel báo cáo…"><i data-lucide="sheet"></i>Xuất Excel</button></span></div>' +
      (o.crumb ? '<nav class="tv-breadcrumb" id="crumb" style="padding:0 0 12px"></nav>' : '') + '<section id="view" class="tv-stack"></section></main>' +
      '<footer class="tv-footer"><div class="tv-container tv-footer__grid"><div><a class="tv-logo" href="#"><img src="../assets/logo_bn.png" alt="Giáo dục và Đào tạo Bắc Ninh"></a><p>Nền tảng số ngành Giáo dục tỉnh Bắc Ninh, tích hợp trí tuệ nhân tạo cho dạy, học và quản lý.</p></div><div><h3>Liên kết nhanh</h3><a href="02-app-sidebar-list.html">Học tập</a></div><div><h3>Chính sách</h3></div><div><h3>Kết nối với chúng tôi</h3></div></div></footer>' +
      '<div id="toast" class="tv-fab__label" style="position:fixed;left:50%;bottom:32px;transform:translateX(-50%);z-index:300" hidden></div>');
    var r = $('range');
    function meta() { var x = r.selectedOptions[0]; $('meta').textContent = 'Số liệu chốt ngày ' + x.dataset.end + ' · so sánh với ' + x.dataset.cmp; }
    if (r) { meta(); r.addEventListener('change', function () { meta(); BC.toast('Đang tải số liệu kỳ mới…'); if (BC.render) BC.render(); }); }
    document.addEventListener('click', function (e) {
      var tb = e.target.closest('[data-table]'); if (tb) { var id = tb.dataset.table, t = $(id + '-t'), on = t.hidden, lg = $(id + '-lg'); t.hidden = !on; $(id).hidden = on; if (lg) lg.hidden = on; tb.textContent = on ? 'Xem dạng biểu đồ' : 'Xem dạng bảng'; return; }
      var ts = e.target.closest('[data-toast]'); if (ts) BC.toast(ts.dataset.toast);
    });
    var rt; window.addEventListener('resize', function () { clearTimeout(rt); rt = setTimeout(function () { if (BC.render) BC.render(); }, 150); });
  },
  toast: function (t) { var e = $('toast'); e.textContent = t; e.hidden = false; clearTimeout(BC.tt); BC.tt = setTimeout(function () { e.hidden = true; }, 2200); },
  // v = { html, after }: vẽ vào #view
  draw: function (v) { $('view').innerHTML = v.html; v.after(); if (window.lucide) lucide.createIcons(); }
};
