/* TVET Dictionary: nhấp đúp / bôi đen một từ trong vùng [data-dict] để tra nghĩa (popover .tv-dict).
   Dùng: <script src="tvet-dict.js"></script> sau lucide + tvet.js.
   API:   TvDict.lemma(word) · TvDict.card(word) → HTML thẻ tra từ (để hiển thị inline) · TvDict.close()
          TvDict.saved {lemma: true} · TvDict.history [lemma, ...] · TvDict.detailUrl
   Sự kiện trên document: 'tvdict:open' {word, host} · 'tvdict:change' {type: 'saved' | 'history'}
   Cụm từ: bôi đen 2–4 từ (vd. “account for”). Khoá: vùng [data-dict-locked="lý do"] (bài kiểm tra/bài thi) chỉ hiện thông báo bị tắt.
   Nút dùng được ở mọi nơi: [data-tvdict-say="word"] phát âm · [data-tvdict-save="word"] lưu/bỏ lưu */
(function () {
  // Dữ liệu mẫu — khi làm thật thay bằng API từ điển.
  // word: [phiên âm, [[từ loại, [[nghĩa, [[ví dụ, dịch], ...]], ...]], ...]]
  var DATA = {
    // Bài đọc: Hanoi bans petrol motorbikes
    announce: ['əˈnaʊns', [['ngoại động từ', [['thông báo, công bố', [['Vietnam has announced a ban on petrol motorbikes.', 'Việt Nam đã công bố lệnh cấm xe máy chạy xăng.'], ['They announced their engagement to their family.', 'Họ báo cho gia đình biết họ đã hứa hôn.']]], ['thông báo sự có mặt hoặc đến của ai/cái gì', [['Would you announce the guests as they come in?', 'Ông có thể thông tên các vị khách khi họ đến không?']]]]]]],
    sweeping: ['ˈswiːpɪŋ', [['tính từ', [['sâu rộng, toàn diện', [['a sweeping prohibition on petrol motorbikes', 'một lệnh cấm sâu rộng đối với xe máy chạy xăng']]]]]]],
    prohibition: ['ˌprəʊɪˈbɪʃn', [['danh từ', [['sự cấm; lệnh cấm', [['a prohibition on smoking in public places', 'lệnh cấm hút thuốc nơi công cộng']]]]]]],
    ban: ['bæn', [['danh từ', [['lệnh cấm', [['The ban aligns with Vietnam’s transition to EVs.', 'Lệnh cấm phù hợp với quá trình chuyển đổi sang xe điện của Việt Nam.']]]]], ['ngoại động từ', [['cấm', [['Hanoi will ban petrol motorbikes in the city centre.', 'Hà Nội sẽ cấm xe máy chạy xăng ở trung tâm.']]]]]]],
    effective: ['ɪˈfektɪv', [['tính từ', [['có hiệu lực (từ thời điểm nào)', [['The ban is effective July 2026.', 'Lệnh cấm có hiệu lực từ tháng 7/2026.']]], ['có hiệu quả', [['an effective solution to air pollution', 'giải pháp hiệu quả cho ô nhiễm không khí']]]]]]],
    initially: ['ɪˈnɪʃəli', [['phó từ', [['ban đầu, lúc đầu', [['The ban will initially cover the city centre.', 'Ban đầu lệnh cấm sẽ áp dụng ở trung tâm thành phố.']]]]]]],
    'phase-out': ['ˈfeɪz aʊt', [['danh từ', [['sự loại bỏ dần', [['the gradual phase-out of petrol motorbikes', 'việc loại bỏ dần xe máy chạy xăng']]]]]]],
    dominant: ['ˈdɒmɪnənt', [['tính từ', [['chiếm ưu thế, chủ đạo', [['Motorcycles are the dominant mode of transport.', 'Xe máy là phương tiện giao thông chủ đạo.']]]]]]],
    account: ['əˈkaʊnt', [['nội động từ', [['account for: chiếm (một tỉ lệ)', [['Motorcycles account for nearly 7 million vehicles.', 'Xe máy chiếm gần 7 triệu phương tiện.']]]]], ['danh từ', [['tài khoản', [['a bank account', 'tài khoản ngân hàng']]]]]]],
    vehicle: ['ˈviːəkl', [['danh từ', [['xe cộ, phương tiện giao thông', [['8.5 million registered vehicles', '8,5 triệu phương tiện đã đăng ký']]]]]]],
    motorcycle: ['ˈməʊtəsaɪkl', [['danh từ', [['xe máy, mô tô', [['Most families in Hanoi own a motorcycle.', 'Hầu hết gia đình ở Hà Nội có xe máy.']]]]]]],
    emission: ['iˈmɪʃn', [['danh từ', [['khí thải; sự phát thải', [['Traffic emissions have worsened the smog.', 'Khí thải giao thông làm khói bụi tệ hơn.']]]]]]],
    exacerbate: ['ɪɡˈzæsəbeɪt', [['ngoại động từ', [['làm trầm trọng thêm', [['Emissions have exacerbated the city’s smog.', 'Khí thải đã làm khói bụi của thành phố trầm trọng thêm.']]]]]]],
    smog: ['smɒɡ', [['danh từ', [['khói bụi, sương khói ô nhiễm', [['hazardous smog', 'khói bụi nguy hại']]]]]]],
    polluted: ['pəˈluːtɪd', [['tính từ', [['bị ô nhiễm', [['one of the world’s most polluted cities', 'một trong những thành phố ô nhiễm nhất thế giới']]]]]]],
    pollution: ['pəˈluːʃn', [['danh từ', [['sự ô nhiễm', [['air pollution', 'ô nhiễm không khí']]]]]]],
    align: ['əˈlaɪn', [['nội động từ', [['align with: phù hợp với, cùng hướng với', [['The ban aligns with the national EV strategy.', 'Lệnh cấm phù hợp với chiến lược xe điện quốc gia.']]]]]]],
    transition: ['trænˈzɪʃn', [['danh từ', [['sự chuyển đổi, quá trình chuyển tiếp', [['a transition toward electric vehicles', 'quá trình chuyển đổi sang xe điện']]]]]]],
    mitigate: ['ˈmɪtɪɡeɪt', [['ngoại động từ', [['giảm nhẹ, làm dịu bớt', [['to mitigate climate change impacts', 'để giảm nhẹ tác động của biến đổi khí hậu']]]]]]],
    degradation: ['ˌdeɡrəˈdeɪʃn', [['danh từ', [['sự suy thoái, xuống cấp', [['environmental degradation', 'suy thoái môi trường']]]]]]],
    traction: ['ˈtrækʃn', [['danh từ', [['gain traction: được ưa chuộng, có chỗ đứng', [['VinFast has gained traction in the market.', 'VinFast đã có chỗ đứng trên thị trường.']]]]]]],
    niche: ['niːʃ', [['danh từ', [['thị trường ngách', [['Electric two-wheelers remain a niche.', 'Xe điện hai bánh vẫn là thị trường ngách.']]]]], ['tính từ', [['ngách, nhỏ lẻ', [['a niche segment', 'một phân khúc nhỏ']]]]]]],
    feasibility: ['ˌfiːzəˈbɪləti', [['danh từ', [['tính khả thi', [['concerns over feasibility', 'lo ngại về tính khả thi']]]]]]],
    critic: ['ˈkrɪtɪk', [['danh từ', [['người chỉ trích; nhà phê bình', [['Critics argue the policy is unfair.', 'Những người chỉ trích cho rằng chính sách không công bằng.']]]]]]],
    disproportionately: ['ˌdɪsprəˈpɔːʃənətli', [['phó từ', [['một cách không cân xứng', [['The policy disproportionately burdens the poor.', 'Chính sách đè nặng không cân xứng lên người nghèo.']]]]]]],
    burden: ['ˈbɜːdn', [['ngoại động từ', [['đè nặng, gây gánh nặng cho', [['The ban burdens low-income earners.', 'Lệnh cấm gây gánh nặng cho người thu nhập thấp.']]]]], ['danh từ', [['gánh nặng', [['a financial burden', 'gánh nặng tài chính']]]]]]],
    devastate: ['ˈdevəsteɪt', [['ngoại động từ', [['tàn phá; gây thiệt hại nặng nề', [['The measure will devastate gig workers.', 'Biện pháp sẽ gây thiệt hại nặng cho lao động tự do.']]]]]]],
    commuter: ['kəˈmjuːtə(r)', [['danh từ', [['người đi làm hằng ngày (bằng phương tiện)', [['commuters reliant on affordable transport', 'người đi làm phụ thuộc vào phương tiện giá rẻ']]]]]]],
    reliant: ['rɪˈlaɪənt', [['tính từ', [['reliant on: phụ thuộc vào', [['Many workers are reliant on motorbikes.', 'Nhiều người lao động phụ thuộc vào xe máy.']]]]]]],
    affordable: ['əˈfɔːdəbl', [['tính từ', [['giá cả phải chăng', [['affordable transport', 'phương tiện đi lại giá phải chăng']]]]]]],
    livelihood: ['ˈlaɪvlihʊd', [['danh từ', [['sinh kế, kế sinh nhai', [['their primary livelihood tools', 'công cụ kiếm sống chính của họ']]]]]]],
    impractical: ['ɪmˈpræktɪkl', [['tính từ', [['không thực tế, khó thực hiện', [['The plan is impractical without alternatives.', 'Kế hoạch không thực tế nếu thiếu phương án thay thế.']]]]]]],
    scepticism: ['ˈskeptɪsɪzəm', [['danh từ', [['sự hoài nghi', [['Scepticism surrounds the timeline.', 'Có nhiều hoài nghi quanh lộ trình.']]]]]]],
    aggressive: ['əˈɡresɪv', [['tính từ', [['(kế hoạch) gấp gáp, quyết liệt', [['an aggressive timeline', 'lộ trình gấp gáp']]], ['hung hăng', [['aggressive behaviour', 'hành vi hung hăng']]]]]]],
    infrastructure: ['ˈɪnfrəstrʌktʃə(r)', [['danh từ', [['cơ sở hạ tầng', [['public transit infrastructure', 'hạ tầng giao thông công cộng']]]]]]],
    compliance: ['kəmˈplaɪəns', [['danh từ', [['sự tuân thủ', [['Compliance may be unrealistic.', 'Việc tuân thủ có thể không thực tế.']]]]]]],
    equitable: ['ˈekwɪtəbl', [['tính từ', [['công bằng, hợp lý', [['Execution must be equitable.', 'Việc thực hiện phải công bằng.']]]]]]],
    contend: ['kənˈtend', [['ngoại động từ', [['cho rằng, khẳng định', [['“Progress is necessary,” he contends.', '“Tiến bộ là cần thiết,” anh ấy khẳng định.']]]]]]],
    subsidy: ['ˈsʌbsədi', [['danh từ', [['khoản trợ cấp', [['subsidies for electric motorbikes', 'trợ cấp mua xe máy điện']]]]]]],
    // Cụm từ
    'account for': ['əˈkaʊnt fɔː(r)', [['cụm động từ', [['chiếm (bao nhiêu phần trong tổng số)', [['Motorcycles account for nearly 7 million vehicles.', 'Xe máy chiếm gần 7 triệu phương tiện.']]], ['giải thích cho', [['How do you account for the rise in pollution?', 'Bạn giải thích thế nào về việc ô nhiễm tăng?']]]]]]],
    'gain traction': ['ɡeɪn ˈtrækʃn', [['cụm động từ', [['được ưa chuộng, dần có chỗ đứng', [['VinFast has gained traction in the market.', 'VinFast đã dần có chỗ đứng trên thị trường.']]]]]]],
    'climate change': ['ˈklaɪmət tʃeɪndʒ', [['danh từ', [['biến đổi khí hậu', [['climate change impacts', 'tác động của biến đổi khí hậu']]]]]]],
    'pass on': ['pɑːs ɒn', [['cụm động từ', [['chuyển (lời nhắn, thông tin) cho ai', [['I’ll pass on the message.', 'Tôi sẽ chuyển lời nhắn.']]]]]]],
    'hold on': ['həʊld ɒn', [['cụm động từ', [['chờ máy, đợi một chút', [['Hold on a moment, please.', 'Xin vui lòng giữ máy.']]]]]]],
    'call back': ['kɔːl bæk', [['cụm động từ', [['gọi lại', [['Please ask him to call me back.', 'Làm ơn nhờ anh ấy gọi lại cho tôi.']]]]]]],
    'take a message': ['teɪk ə ˈmesɪdʒ', [['cụm động từ', [['ghi lại lời nhắn', [['Can I take a message?', 'Tôi ghi lại lời nhắn được không?']]]]]]],
    // Bài giảng video: A phone call at the hotel
    receptionist: ['rɪˈsepʃənɪst', [['danh từ', [['nhân viên lễ tân', [['The receptionist answered the phone.', 'Nhân viên lễ tân đã nhấc máy.']]]]]]],
    answer: ['ˈɑːnsə(r)', [['ngoại động từ', [['trả lời, đáp lại', [['She didn’t answer my question.', 'Cô ấy không trả lời câu hỏi của tôi.']]], ['nghe, nhấc máy (điện thoại)', [['Could you answer the phone, please?', 'Bạn nghe điện thoại giúp tôi được không?']]]]], ['danh từ', [['câu trả lời', [['Choose the correct answer.', 'Chọn câu trả lời đúng.']]]]]]],
    speak: ['spiːk', [['nội động từ', [['nói, nói chuyện (với ai)', [['Could I speak to Mr Brown, please?', 'Cho tôi nói chuyện với ông Brown được không?']]], ['nói (một ngôn ngữ)', [['She speaks English very well.', 'Cô ấy nói tiếng Anh rất giỏi.']]]]]]],
    say: ['seɪ', [['ngoại động từ', [['nói, nói rằng', [['What does the receptionist say first?', 'Lễ tân nói gì đầu tiên?']]]]]]],
    tell: ['tel', [['ngoại động từ', [['nói với, bảo (ai)', [['Please tell him I called.', 'Làm ơn nói với anh ấy là tôi đã gọi.']]]]]]],
    call: ['kɔːl', [['ngoại động từ', [['gọi điện cho (ai)', [['Please ask him to call me back.', 'Làm ơn nhờ anh ấy gọi lại cho tôi.']]]]], ['danh từ', [['cuộc gọi', [['I’ll return your call this afternoon.', 'Chiều nay tôi sẽ gọi lại cho bạn.']]]]]]],
    caller: ['ˈkɔːlə(r)', [['danh từ', [['người gọi điện', [['The caller’s name is David Lee.', 'Người gọi tên là David Lee.']]]]]]],
    message: ['ˈmesɪdʒ', [['danh từ', [['lời nhắn, tin nhắn', [['Can I take a message?', 'Tôi ghi lại lời nhắn được không?']]]]]]],
    leave: ['liːv', [['ngoại động từ', [['để lại', [['Would you like to leave a message?', 'Anh/chị có muốn để lại lời nhắn không?']]], ['rời đi', [['He left the office at five.', 'Anh ấy rời văn phòng lúc 5 giờ.']]]]]]],
    office: ['ˈɒfɪs', [['danh từ', [['văn phòng', [['Mr Brown is out of the office.', 'Ông Brown không có ở văn phòng.']]]]]]],
    spell: ['spel', [['ngoại động từ', [['đánh vần', [['Could you spell your name, please?', 'Anh/chị đánh vần tên giúp tôi được không?']]]]]]],
    surname: ['ˈsɜːneɪm', [['danh từ', [['họ (của một người)', [['Could you spell your surname?', 'Anh/chị đánh vần họ giúp tôi?']]]]]]],
    pass: ['pɑːs', [['ngoại động từ', [['pass on: chuyển (lời nhắn)', [['I’ll pass on the message.', 'Tôi sẽ chuyển lời nhắn.']]]]]]],
    available: ['əˈveɪləbl', [['tính từ', [['rảnh, có thể gặp', [['Is Ms Lan available?', 'Cô Lan có rảnh không ạ?']]], ['có sẵn', [['Rooms are available from Monday.', 'Có phòng trống từ thứ Hai.']]]]]]],
    hold: ['həʊld', [['ngoại động từ', [['cầm, giữ', [['Hold on a moment, please.', 'Xin vui lòng giữ máy một chút.']]]]]]],
    moment: ['ˈməʊmənt', [['danh từ', [['chốc lát', [['Wait a moment, please.', 'Vui lòng đợi một chút.']]]]]]],
    meeting: ['ˈmiːtɪŋ', [['danh từ', [['cuộc họp', [['Mr Brown is in a meeting.', 'Ông Brown đang họp.']]]]]]],
    hotel: ['həʊˈtel', [['danh từ', [['khách sạn', [['Good morning, Grand Hotel.', 'Chào buổi sáng, khách sạn Grand xin nghe.']]]]]]],
    help: ['help', [['ngoại động từ', [['giúp đỡ', [['How can I help you?', 'Tôi có thể giúp gì cho anh/chị?']]]]]]],
    phone: ['fəʊn', [['danh từ', [['điện thoại', [['She answers the phone.', 'Cô ấy nghe điện thoại.']]]]]]],
    wait: ['weɪt', [['nội động từ', [['chờ, đợi', [['Wait a minute, please.', 'Vui lòng đợi một phút.']]]]]]],
    afternoon: ['ˌɑːftəˈnuːn', [['danh từ', [['buổi chiều', [['Please call me back this afternoon.', 'Chiều nay làm ơn gọi lại cho tôi.']]]]]]],
    certainly: ['ˈsɜːtnli', [['phó từ', [['chắc chắn rồi, tất nhiên', [['Certainly. I’ll tell him.', 'Vâng, tất nhiên. Tôi sẽ báo anh ấy.']]]]]]],
    phrase: ['freɪz', [['danh từ', [['cụm từ, mẫu câu', [['useful telephone phrases', 'mẫu câu điện thoại hữu ích']]]]]]]
  };
  var IRREG = { left: 'leave', spoke: 'speak', spoken: 'speak', said: 'say', told: 'tell', held: 'hold' };

  var D = window.TvDict = { data: DATA, saved: {}, history: [], detailUrl: '05-table-list.html' };
  var pop = null, current = '';

  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function icons() { if (window.lucide) window.lucide.createIcons(); }
  function emit(name, detail) { document.dispatchEvent(new CustomEvent(name, { detail: detail })); }

  function lemmaWord(w) {
    w = w.replace(/[’']s$/, '');
    if (DATA[w]) return w;
    if (IRREG[w]) return IRREG[w];
    var c = [w.replace(/ies$/, 'y'), w.replace(/es$/, ''), w.replace(/s$/, ''), w.replace(/ied$/, 'y'), w.replace(/ed$/, ''), w.replace(/d$/, ''), w.replace(/ing$/, ''), w.replace(/ing$/, 'e')];
    return c.find(function (x) { return DATA[x]; }) || null;
  }
  // Từ đơn: bỏ đuôi biến đổi. Cụm từ: đưa từ đầu về dạng gốc (accounts for → account for, gained traction → gain traction)
  var VERB_BASE = { gained: 'gain', gains: 'gain', gaining: 'gain', passed: 'pass', passes: 'pass', calls: 'call', called: 'call', holds: 'hold', took: 'take', takes: 'take', accounts: 'account', accounted: 'account' };
  D.lemma = function (w) {
    w = String(w).toLowerCase().trim().replace(/\s+/g, ' ').replace(/[’']s$/, '');
    if (DATA[w]) return w;
    if (w.indexOf(' ') > 0) {
      var parts = w.split(' '), first = IRREG[parts[0]] || VERB_BASE[parts[0]] || parts[0];
      var cand = [first].concat(parts.slice(1)).join(' ');
      return DATA[cand] ? cand : null;
    }
    return lemmaWord(w);
  };

  // Thẻ tra từ: dùng trong popover và hiển thị inline (vd. tab "Từ đã tra")
  D.card = function (raw, opts) {
    opts = opts || {};
    var key = D.lemma(raw), d = DATA[key], word = key || String(raw).toLowerCase().trim();
    var body = d ? '<div class="tv-dict__ipa"><i data-lucide="audio-lines"></i>[' + d[0] + ']</div>' + d[1].map(function (p) {
      return '<div class="tv-dict__pos"><i data-lucide="sparkle"></i>' + p[0] + '</div><ul class="tv-dict__mean">' + p[1].map(function (m) {
        return '<li>' + esc(m[0]) + m[1].map(function (x) { return '<div class="tv-dict__ex"><i data-lucide="star"></i>' + esc(x[0]) + '<span>' + esc(x[1]) + '</span></div>'; }).join('') + '</li>';
      }).join('') + '</ul>';
    }).join('') : '<p class="tv-small tv-muted" style="margin-top:10px">Không tìm thấy “' + esc(word) + '” trong từ điển của bài học. Bạn có thể tra đầy đủ ở trang Tra từ.</p>';
    var on = D.saved[word];
    return '<div class="tv-dict__head"><div class="tv-dict__word">' + esc(word) + '</div><button class="tv-icon-btn" data-tvdict-say="' + esc(word) + '" title="Nghe phát âm"><i data-lucide="volume-2"></i></button>' +
      (opts.closable ? '<button class="tv-icon-btn" data-tvdict-close title="Đóng"><i data-lucide="x"></i></button>' : '') + '</div>' + body +
      '<div class="tv-dict__foot">' + (d ? '<button class="tv-btn tv-btn--sm ' + (on ? 'tv-btn--soft' : 'tv-btn--sky') + '" data-tvdict-save="' + esc(word) + '"><i data-lucide="' + (on ? 'check' : 'plus') + '"></i>' + (on ? 'Đã lưu vào từ vựng' : 'Thêm vào từ vựng') + '</button>' : '') +
      '<a class="tv-link" href="' + D.detailUrl + '">Tra chi tiết<i data-lucide="arrow-up-right"></i></a></div>';
  };

  D.remember = function (raw) {
    var key = D.lemma(raw);
    if (!key) return;
    D.history = [key].concat(D.history.filter(function (w) { return w !== key; })).slice(0, 30);
    emit('tvdict:change', { type: 'history' });
  };

  D.open = function (raw, rect) {
    if (!pop) {
      pop = document.createElement('div');
      pop.className = 'tv-dict';
      pop.setAttribute('role', 'dialog');
      pop.setAttribute('aria-label', 'Tra từ điển');
      document.body.appendChild(pop);
    }
    current = raw;
    pop.innerHTML = D.card(raw, { closable: true });
    pop.hidden = false;
    pop.scrollTop = 0;
    icons();
    if (rect) {
      var w = pop.offsetWidth, h = pop.offsetHeight, y = rect.bottom + 8;
      if (y + h > innerHeight - 12) y = rect.top - h - 8;
      pop.style.top = Math.max(12, Math.min(y, innerHeight - h - 12)) + 'px';
      pop.style.left = Math.min(Math.max(12, rect.left), innerWidth - w - 12) + 'px';
    }
  };
  // Bài kiểm tra / bài thi: giáo viên tắt tra từ → chỉ hiện thông báo
  D.openLocked = function (reason, rect) {
    D.open('', rect);
    pop.innerHTML = '<div class="tv-dict__head"><div class="tv-dict__word" style="font-size:18px">Tra từ điển đã bị tắt</div><button class="tv-icon-btn" data-tvdict-close title="Đóng"><i data-lucide="x"></i></button></div>' +
      '<p style="display:flex;gap:10px;margin-top:10px;font-size:14px;color:var(--tv-text-muted)"><i data-lucide="lock" style="width:20px;height:20px;flex:none;color:var(--tv-danger)"></i><span>' + esc(reason || 'Giáo viên đã tắt chức năng tra từ điển cho bài này.') + '</span></p>';
    icons();
    emit('tvdict:locked', { reason: reason });
  };
  D.close = function () { if (pop) pop.hidden = true; };
  function isOpen() { return pop && !pop.hidden; }

  D.say = function (word) {
    try { var u = new SpeechSynthesisUtterance(word); u.lang = 'en-US'; u.rate = 0.9; speechSynthesis.speak(u); } catch (err) { /* trình duyệt không hỗ trợ đọc */ }
  };

  function lookupSelection() {
    var sel = window.getSelection();
    if (sel.isCollapsed) return;
    var txt = sel.toString().trim();
    txt = txt.replace(/^[^A-Za-z]+|[^A-Za-z]+$/g, '').replace(/\s+/g, ' ');
    if (!/^[A-Za-z][A-Za-z’'-]*( [A-Za-z][A-Za-z’'-]*){0,3}$/.test(txt) || txt.length > 40) return;
    var node = sel.anchorNode, host = (node.nodeType === 1 ? node : node.parentElement).closest('[data-dict], [data-dict-locked]');
    if (!host) return;
    var lock = host.closest('[data-dict-locked]');
    if (lock) return D.openLocked(lock.getAttribute('data-dict-locked'), sel.getRangeAt(0).getBoundingClientRect());
    D.open(txt, sel.getRangeAt(0).getBoundingClientRect());
    D.remember(txt);
    emit('tvdict:open', { word: txt, host: host });
  }

  ['mouseup', 'touchend'].forEach(function (ev) {
    document.addEventListener(ev, function (e) { if (!e.target.closest('.tv-dict')) setTimeout(lookupSelection, 10); });
  });
  document.addEventListener('mousedown', function (e) { if (isOpen() && !e.target.closest('.tv-dict')) D.close(); });
  window.addEventListener('scroll', function (e) { if (isOpen() && !(e.target.nodeType === 1 && e.target.closest('.tv-dict'))) D.close(); }, true);
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && isOpen()) { D.close(); e.stopImmediatePropagation(); } }, true);
  document.addEventListener('click', function (e) {
    var el = e.target.closest('[data-tvdict-say], [data-tvdict-save], [data-tvdict-close]');
    if (!el) return;
    if (el.hasAttribute('data-tvdict-close')) return D.close();
    if (el.hasAttribute('data-tvdict-say')) return D.say(el.getAttribute('data-tvdict-say'));
    var w = el.getAttribute('data-tvdict-save');
    D.saved[w] = !D.saved[w];
    if (!D.saved[w]) delete D.saved[w];
    if (isOpen()) { pop.innerHTML = D.card(current, { closable: true }); icons(); }
    emit('tvdict:change', { type: 'saved' });
  });
})();
