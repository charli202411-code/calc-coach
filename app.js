/* ============================================================
   算一算 · 交互层
   视图 / 状态 / 播放器 / 复习状态机
   ============================================================ */
(function () {
  'use strict';

  var DB = window.DB;
  var TYPES = window.TYPES;

  /* ---------------- 图标（Lucide 线条，内联 SVG，离线可用） ---------------- */
  var ICONS = {
    home: '<path d="M3 9.5 12 3l9 6.5V20a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z"/>',
    camera: '<path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3z"/><circle cx="12" cy="13" r="3"/>',
    image: '<rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-4.35-4.35a1 1 0 0 0-1.42 0L5 21"/>',
    book: '<path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>',
    users: '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>',
    chevronLeft: '<path d="m15 18-6-6 6-6"/>',
    chevronRight: '<path d="m9 18 6-6-6-6"/>',
    chevronDown: '<path d="m6 9 6 6 6-6"/>',
    play: '<polygon points="7 4 20 12 7 20 7 4"/>',
    pause: '<rect x="14" y="4" width="4" height="16" rx="1"/><rect x="6" y="4" width="4" height="16" rx="1"/>',
    volume: '<polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M15.5 8.5a5 5 0 0 1 0 7"/><path d="M19 5a10 10 0 0 1 0 14"/>',
    volumeX: '<polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="m22 9-6 6"/><path d="m16 9 6 6"/>',
    captions: '<rect x="2" y="4" width="20" height="16" rx="3"/><path d="M7 12h3"/><path d="M14 12h3"/><path d="M7 16h8"/>',
    check: '<path d="M20 6 9 17l-5-5"/>',
    checkCircle: '<circle cx="12" cy="12" r="9"/><path d="m8.5 12 2.5 2.5 4.5-5"/>',
    x: '<path d="M18 6 6 18"/><path d="m6 6 12 12"/>',
    alert: '<path d="M12 3 2 20h20z"/><path d="M12 9v5"/><path d="M12 17.5h.01"/>',
    sparkles: '<path d="m12 3 1.9 5.1L19 10l-5.1 1.9L12 17l-1.9-5.1L5 10l5.1-1.9z"/><path d="M19 15.5l.7 1.8L21.5 18l-1.8.7L19 20.5l-.7-1.8L16.5 18l1.8-.7z"/>',
    trend: '<path d="M22 7 13.5 15.5 8.5 10.5 2 17"/><path d="M16 7h6v6"/>',
    clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3.5 2"/>',
    award: '<circle cx="12" cy="8" r="6"/><path d="m8.2 13.4-2 7.6 5.8-3 5.8 3-2-7.6"/>',
    target: '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1.4"/>',
    arrowRight: '<path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>',
    bulb: '<path d="M9 18h6"/><path d="M10 22h4"/><path d="M12 2a7 7 0 0 0-4 12.7V18h8v-3.3A7 7 0 0 0 12 2z"/>',
    scan: '<path d="M3 7V5a2 2 0 0 1 2-2h2"/><path d="M17 3h2a2 2 0 0 1 2 2v2"/><path d="M21 17v2a2 2 0 0 1-2 2h-2"/><path d="M7 21H5a2 2 0 0 1-2-2v-2"/><path d="M3 12h18"/>',
    refresh: '<path d="M21 12a9 9 0 1 1-2.6-6.4"/><path d="M21 3v6h-6"/>',
    bars: '<path d="M3 21h18"/><path d="M6 17v-5"/><path d="M12 17V8"/><path d="M18 17V4"/>',
    star: '<path d="m12 3 2.6 5.6 6.1.8-4.5 4.2 1.2 6-5.4-3-5.4 3 1.2-6L3.3 9.4l6.1-.8z"/>',
    flame: '<path d="M12 2c1 3 3 4 3 7a3 3 0 0 1-6 0c0-1 .3-1.8.8-2.6C8 8 6 10.4 6 13a6 6 0 0 0 12 0c0-4.6-3.5-8.4-6-11z"/>',
    trash: '<path d="M3 6h18"/><path d="M8 6V4h8v2"/><path d="M6 6l1 14h10l1-14"/>',
    target2: '<circle cx="12" cy="12" r="9"/><path d="M12 8v8"/><path d="M8 12h8"/>',
    chart: '<path d="M3 3v18h18"/><path d="m7 14 4-4 3 3 5-6"/>',
    lock: '<rect x="4" y="11" width="16" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/>',
    grid: '<rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/>'
  };

  function icon(name, size) {
    var s = size || 20;
    return '<svg class="ic" width="' + s + '" height="' + s + '" viewBox="0 0 24 24" fill="none" ' +
      'stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">' +
      (ICONS[name] || '') + '</svg>';
  }

  /* ---------------- 工具 ---------------- */
  function esc(v) {
    return String(v == null ? '' : v)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  }
  function wait(ms) { return new Promise(function (r) { setTimeout(r, ms); }); }
  function fmtTime(sec) {
    var m = Math.floor(sec / 60);
    var s = Math.floor(sec % 60);
    return m + ':' + String(s).padStart(2, '0');
  }
  function typeMeta(id) {
    return TYPES[id] || { name: '其他', short: '其他', color: '#97A0A6', bg: '#F1E9DC', hint: '' };
  }
  function problemById(id) {
    return DB.problems.filter(function (p) { return p.id === id; })[0];
  }
  function todayLabel() { return '10月23日 星期五'; }

  /* ---------------- 状态 ---------------- */
  var State = {
    review: null,
    bookFilter: 'all',
    parentTab: 'overview',
    toastTimer: null
  };

  /* ---------------- 竖式渲染 ---------------- */
  function renderVertical(p, opts) {
    opts = opts || {};
    if (!p.layout) return '';
    var cells = (opts.wrongCells != null ? opts.wrongCells : p.wrongCells) || [];
    var wrongSet = {};
    cells.forEach(function (c) { wrongSet[c.r + '-' + c.c] = true; });

    var hlSet = {};
    var hl = opts.highlight;
    if (hl) hl.rows.forEach(function (r) { hl.cols.forEach(function (c) { hlSet[r + '-' + c] = true; }); });

    var rows = p.layout.rows.map(function (row, ri) {
      if (row.line) return '<div class="vline"></div>';
      var inner = row.cells.map(function (ch, ci) {
        var key = ri + '-' + ci;
        var cls = 'vcell';
        if (ci === 0 && String(ch).trim() !== '') cls += ' sign';
        if (row.partial) cls += ' partial';
        if (hlSet[key]) cls += ' hl' + (hl && hl.wrong ? ' wrong' : '');
        if (wrongSet[key]) cls += ' wrong-static';
        return '<div class="' + cls + '" data-r="' + ri + '" data-c="' + ci + '">' +
          (String(ch).trim() === '' ? '' : esc(ch)) + '</div>';
      }).join('');
      return '<div class="vrow" style="--cols:' + p.layout.cols + '">' + inner + '</div>';
    }).join('');

    return '<div class="vmath"' + (opts.id ? ' id="' + opts.id + '"' : '') + '>' + rows + '</div>';
  }

  /* ---------------- 外壳 ---------------- */
  var NAV = [
    { key: 'home', label: '今日', icon: 'home', href: '#/home' },
    { key: 'scan', label: '批改', icon: 'camera', href: '#/scan' },
    { key: 'book', label: '错题本', icon: 'book', href: '#/book' }
  ];

  function topbarHTML(meta) {
    if (meta.topbar === 'brand') {
      return '<div class="topbar-inner">' +
        '<a class="brand" href="#/home">' +
          '<span class="brand-mark">算</span>' +
          '<span class="brand-text"><span class="brand-name">算一算</span>' +
          '<span class="brand-sub">计算题批改 · 步骤讲解</span></span>' +
        '</a>' +
        '<button class="role-chip" data-go="#/parent">' + icon('users', 14) + '家长端</button>' +
      '</div>';
    }
    if (meta.topbar === 'parent') {
      return '<div class="topbar-inner">' +
        '<div class="topbar-left">' +
          '<button class="back-btn" data-go="#/home" aria-label="返回学生端">' + icon('chevronLeft', 18) + '</button>' +
          '<span class="topbar-title">家长端</span>' +
        '</div>' +
        '<span class="chip chip-ghost">小满 · 三年级</span>' +
      '</div>';
    }
    return '<div class="topbar-inner">' +
      '<div class="topbar-left">' +
        '<button class="back-btn" data-back aria-label="返回">' + icon('chevronLeft', 18) + '</button>' +
        '<span class="topbar-title">' + esc(meta.title || '') + '</span>' +
      '</div>' +
      (meta.badge ? '<span class="chip chip-ghost">' + esc(meta.badge) + '</span>' : '') +
    '</div>';
  }

  function tabbarHTML(active) {
    return NAV.map(function (n) {
      return '<a class="tab' + (active === n.key ? ' active' : '') + '" href="' + n.href + '">' +
        icon(n.icon, 20) + '<span class="tab-label">' + n.label + '</span></a>';
    }).join('');
  }

  /* ---------------- 首页 ---------------- */
  var HomeView = {
    render: function () {
      var s = DB.student;
      var b = DB.batches[0];
      var probs = b.problemIds.map(problemById);
      var right = probs.filter(function (p) { return p.correct; }).length;
      var wrong = probs.length - right;
      var plan = DB.reviewPlan;
      var masteredCount = Object.keys(DB.mastery).filter(function (k) { return DB.mastery[k] >= 3; }).length;

      var metaTags = plan.sessions.map(function (se) {
        var t = typeMeta(se.typeId);
        return '<span class="tag" style="background:' + t.bg + ';color:' + t.color + '">' +
          t.name + ' ×1</span>';
      }).join('');

      var masteryRows = ['carry-add', 'borrow-sub', 'times-table', 'basic-add'].map(function (k) {
        var t = typeMeta(k);
        var m = DB.mastery[k] || 0;
        var dots = [0, 1, 2].map(function (i) {
          return '<span class="dot' + (i < m ? ' on' : '') + '"></span>';
        }).join('');
        return '<div class="mastery-item">' +
          '<span class="mastery-name">' + t.name + '</span>' +
          '<span class="muted">' + (m >= 3 ? '已掌握' : m + '/3 连对') + '</span>' +
          '<span class="dots">' + dots + '</span>' +
        '</div>';
      }).join('');

      return '<div class="page">' +
        '<section class="hero">' +
          '<p class="hero-eyebrow">' + todayLabel() + '</p>' +
          '<h1 class="hero-title">小满，今天也要<br><em>算得又快又准</em></h1>' +
          '<div class="streak">' + icon('flame', 13) + '<span>连续 ' + s.streakDays + ' 天</span></div>' +
        '</section>' +

        '<div class="home-grid">' +
          '<div>' +
            '<section class="card review-card">' +
              '<div class="card-head">' +
                '<span class="chip chip-accent">今日复习</span>' +
                '<span class="muted">' + esc(plan.label) + '</span>' +
              '</div>' +
              '<h2><span>' + plan.sessions.length + '</span> 道错题 · ' + plan.sessions.length + ' 个类型</h2>' +
              '<div class="review-meta">' + metaTags + '</div>' +
              '<button class="btn btn-primary btn-block" data-go="#/review">开始复习' + icon('arrowRight', 18) + '</button>' +
            '</section>' +

            '<div class="stat-row" style="margin-top:14px">' +
              '<div class="stat"><b>' + masteredCount + '</b><span>已掌握类型</span></div>' +
              '<div class="stat"><b>' + plan.sessions.length + '</b><span>待复习错题</span></div>' +
              '<div class="stat"><b>' + s.streakDays + '</b><span>连续打卡</span></div>' +
            '</div>' +
          '</div>' +

          '<div>' +
            '<section class="card">' +
              '<div class="card-head">' +
                '<h3 class="card-title">最近批改</h3>' +
                '<span class="link" data-go="#/result?batch=b1">查看全部' + icon('chevronRight', 14) + '</span>' +
              '</div>' +
              '<div class="batch-row" data-go="#/result?batch=b1">' +
                '<span class="batch-thumb">' + icon('scan', 20) + '</span>' +
                '<div class="batch-info"><b>' + esc(b.title) + '</b><span>' + esc(b.date) + ' · 共 ' + probs.length + ' 题</span></div>' +
                '<div class="batch-score">' + right + ' 对 · <span class="bad">' + wrong + ' 错</span></div>' +
              '</div>' +
            '</section>' +

            '<section class="card" style="margin-top:14px">' +
              '<div class="card-head"><h3 class="card-title">掌握进度</h3><span class="muted">连对 3 道算学会</span></div>' +
              '<div class="mastery-list">' + masteryRows + '</div>' +
            '</section>' +
          '</div>' +
        '</div>' +
      '</div>';
    }
  };

  /* ---------------- 摄像头 ---------------- */
  var Cam = {
    stream: null,
    stop: function () {
      if (this.stream) {
        this.stream.getTracks().forEach(function (t) { t.stop(); });
        this.stream = null;
      }
    }
  };

  function camSupported() {
    return !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia);
  }

  function startCamera() {
    return new Promise(function (resolve) {
      if (!camSupported()) return resolve(false);
      navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment', width: { ideal: 1280 }, height: { ideal: 1280 } },
        audio: false
      }).then(function (stream) {
        var v = document.getElementById('camView');
        if (!v) {
          stream.getTracks().forEach(function (t) { t.stop(); });
          return resolve(false);
        }
        Cam.stream = stream;
        v.srcObject = stream;
        v.play().catch(function () {});
        var stage = document.getElementById('scanStage');
        if (stage) { stage.classList.add('live'); stage.classList.remove('snapped'); }
        var tip = document.getElementById('scanTip');
        if (tip) tip.textContent = '摄像头已开启 · 点白色快门拍照识别';
        var toggle = document.getElementById('camToggle');
        if (toggle) toggle.innerHTML = icon('x', 18);
        resolve(true);
      }).catch(function () { resolve(false); });
    });
  }

  function stopCameraUI() {
    Cam.stop();
    var v = document.getElementById('camView');
    if (v) v.srcObject = null;
    var stage = document.getElementById('scanStage');
    if (stage) stage.classList.remove('live');
    var tip = document.getElementById('scanTip');
    if (tip) tip.textContent = '把作业放平，四个角对准框内';
    var toggle = document.getElementById('camToggle');
    if (toggle) toggle.innerHTML = icon('camera', 18);
  }

  function captureFrame() {
    var v = document.getElementById('camView');
    if (!v || !v.videoWidth) return false;
    var side = Math.min(v.videoWidth, v.videoHeight);
    var c = document.createElement('canvas');
    c.width = 900; c.height = 900;
    var ctx = c.getContext('2d');
    ctx.drawImage(v, (v.videoWidth - side) / 2, (v.videoHeight - side) / 2, side, side, 0, 0, 900, 900);
    var img = document.getElementById('snapView');
    if (img) img.src = c.toDataURL('image/jpeg', 0.86);
    var stage = document.getElementById('scanStage');
    if (stage) stage.classList.add('snapped');
    stopCameraUI();
    return true;
  }

  function showPhoto(url) {
    var img = document.getElementById('snapView');
    if (img) img.src = url;
    var stage = document.getElementById('scanStage');
    if (stage) stage.classList.add('snapped');
  }

  /* ---------------- 拍照 ---------------- */
  var ScanView = {
    render: function () {
      var rows = [
        { n: 1, t: '246 + 378 = 614', bad: true },
        { n: 2, t: '47 × 26 = 1212', bad: true },
        { n: 3, t: '503 - 268 = 245', bad: true },
        { n: 4, t: '6 × 7 = 42', bad: false },
        { n: 5, t: '8 + 7 = 14', bad: true }
      ].map(function (r) {
        return '<div class="paper-row"><span class="pn">' + r.n + '</span><span>' + esc(r.t) + '</span>' +
          '<span class="pmark' + (r.bad ? ' bad' : '') + '">' + (r.bad ? icon('x', 13) : icon('check', 13)) + '</span></div>';
      }).join('');

      return '<div class="page scan-page">' +
        '<div class="scan-stage">' +
          '<div class="paper">' +
            '<div class="paper-head"><span>数学作业 · 第 3 页</span><span>10 / 23</span></div>' +
            rows +
          '</div>' +
          '<video id="camView" playsinline muted></video>' +
          '<img id="snapView" alt="">' +
          '<div class="scan-frame"><span></span><span></span><span></span><span></span></div>' +
          '<div class="scan-line"></div>' +
          '<div class="scan-tip" id="scanTip">把作业放平，四个角对准框内</div>' +
        '</div>' +
        '<div class="scan-controls">' +
          '<div class="scan-btn-row">' +
            '<button class="side-btn" id="albumBtn" aria-label="从相册选择">' + icon('image', 18) + '</button>' +
            '<button class="shutter" id="shutter" aria-label="拍照识别"></button>' +
            '<button class="side-btn" id="camToggle" aria-label="开启摄像头">' + icon('camera', 18) + '</button>' +
          '</div>' +
          '<p class="muted">支持手写竖式 · 自动切分计算步骤</p>' +
        '</div>' +
        '<input type="file" id="albumInput" accept="image/*" hidden>' +
        '<div class="scan-overlay" id="scanOverlay">' +
          '<div class="scan-box">' +
            '<div class="spinner"></div>' +
            '<h3 style="margin-top:14px;font-size:15px">正在识别这张作业</h3>' +
            '<div class="scan-steps" id="scanSteps">' +
              '<div class="scan-step" data-i="0"><span class="sdot">' + icon('scan', 11) + '</span>识别手写算式</div>' +
              '<div class="scan-step" data-i="1"><span class="sdot">' + icon('grid', 11) + '</span>切分计算步骤</div>' +
              '<div class="scan-step" data-i="2"><span class="sdot">' + icon('target', 11) + '</span>逐步批改并定位错因</div>' +
            '</div>' +
          '</div>' +
        '</div>' +
      '</div>';
    },
    mount: function () {
      var btn = document.getElementById('shutter');
      if (btn) btn.addEventListener('click', onShutter);
      var albumBtn = document.getElementById('albumBtn');
      var albumInput = document.getElementById('albumInput');
      if (albumBtn && albumInput) {
        albumBtn.addEventListener('click', function () { albumInput.click(); });
        albumInput.addEventListener('change', function () {
          var f = albumInput.files && albumInput.files[0];
          if (!f) return;
          showPhoto(URL.createObjectURL(f));
          albumInput.value = '';
          setTimeout(runScan, 420);
        });
      }
      var toggle = document.getElementById('camToggle');
      if (toggle) toggle.addEventListener('click', function () {
        if (Cam.stream) {
          stopCameraUI();
          toast('已关闭摄像头');
        } else {
          startCamera().then(function (ok) {
            if (!ok) toast('无法调用摄像头（需 HTTPS 或 localhost 环境）');
          });
        }
      });
      startCamera();
    }
  };

  async function onShutter() {
    if (Cam.stream) {
      if (!captureFrame()) { toast('摄像头还没准备好，再试一次'); return; }
      await wait(420);
      runScan();
      return;
    }
    var ok = await startCamera();
    if (ok) return;
    toast('无法调用摄像头，播放演示流程');
    runScan();
  }

  async function runScan() {
    var ov = document.getElementById('scanOverlay');
    if (!ov) return;
    ov.classList.add('on');
    var steps = Array.prototype.slice.call(ov.querySelectorAll('.scan-step'));
    await API.recognize();
    for (var i = 0; i < steps.length; i++) {
      if (!document.body.contains(ov)) return;
      steps[i].classList.add('on');
      await wait(560);
    }
    await API.grade('task_1023_01');
    if (!document.body.contains(ov)) return;
    location.hash = '#/result?batch=b1';
  }

  /* ---------------- 批改结果 ---------------- */
  var ResultView = {
    render: function (query) {
      var b = DB.batches.filter(function (x) { return x.id === (query.batch || 'b1'); })[0] || DB.batches[0];
      var probs = b.problemIds.map(problemById);
      var right = probs.filter(function (p) { return p.correct; }).length;
      var wrong = probs.length - right;
      var pct = Math.round(right / probs.length * 100);

      var list = probs.map(function (p) {
        var t = p.typeId ? typeMeta(p.typeId) : null;
        return '<div class="problem-item ' + (p.correct ? 'right' : 'wrong') + '" data-go="#/problem?id=' + p.id + '">' +
          '<div class="p-main">' +
            '<div class="p-expr">' + esc(p.expr) + ' = ' + esc(p.studentAnswer) + '</div>' +
            '<div class="p-ans">' +
              (p.correct
                ? '<span class="ok">' + icon('check', 12) + ' 全对</span>'
                : '<span class="mine">你的答案 ' + esc(p.studentAnswer) + '</span>' +
                  '<span class="right-ans">正确 ' + esc(p.correctAnswer) + '</span>' +
                  (t ? '<span class="tag" style="background:' + t.bg + ';color:' + t.color + '">' + t.name + '</span>' : '')
              ) +
            '</div>' +
          '</div>' +
          '<span class="p-go">' + icon('chevronRight', 18) + '</span>' +
        '</div>';
      }).join('');

      return '<div class="page">' +
        '<div class="result-hero">' +
          '<div class="ring" style="--pct:' + pct + '">' +
            '<div class="ring-in"><b>' + pct + '%</b><span>正确率</span></div>' +
          '</div>' +
          '<div class="result-copy">' +
            '<h2>' + (wrong > 0 ? '找到 ' + wrong + ' 道需要讲解的题' : '这次全对') + '</h2>' +
            '<p>' + esc(b.title) + ' · 共 ' + probs.length + ' 题，' + right + ' 题正确。' +
            (wrong > 0 ? '每道错题都已定位到具体步骤。' : '继续保持。') + '</p>' +
          '</div>' +
        '</div>' +
        '<div class="problem-list">' + list + '</div>' +
        (wrong > 0
          ? '<div style="margin-top:16px"><button class="btn btn-primary btn-block btn-lg" data-go="#/problem?id=' +
            probs.filter(function (p) { return !p.correct; })[0].id + '">' + icon('sparkles', 18) + '看第一道错题的讲解</button></div>'
          : '') +
      '</div>';
    }
  };

  /* ---------------- 错因详情 ---------------- */
  var ProblemView = {
    render: function (query) {
      var p = problemById(query.id) || DB.problems[0];
      var t = p.typeId ? typeMeta(p.typeId) : null;
      var badStep = p.steps.filter(function (s) { return !s.ok; })[0];

      var visual = p.layout
        ? '<div class="vmath-wrap">' + renderVertical(p, { wrongCells: p.wrongCells }) + '</div>'
        : '<div style="text-align:center;padding:18px 0;font-family:var(--font-num);font-size:38px;font-weight:700;letter-spacing:2px">' +
          esc(p.expr) + '</div>';

      var steps = p.steps.map(function (s) {
        return '<div class="step ' + (s.ok ? 'ok' : 'bad') + '">' +
          '<span class="step-no">' + s.no + '</span>' +
          '<div class="step-body">' +
            '<div class="step-title">' + esc(s.title) + '</div>' +
            '<div class="step-desc">' + esc(s.desc) + '</div>' +
          '</div>' +
          (s.ok ? '' : '<span class="step-flag">错在这里</span>') +
        '</div>';
      }).join('');

      if (p.correct) {
        return '<div class="page">' +
          '<div class="detail-head"><span class="chip chip-teal">全部正确</span></div>' +
          '<section class="card">' +
            '<div style="text-align:center;padding:14px 0 6px">' +
              '<div style="font-family:var(--font-num);font-size:34px;font-weight:700;letter-spacing:1.5px">' + esc(p.expr) + ' = ' + esc(p.correctAnswer) + '</div>' +
              '<p class="muted" style="margin-top:10px">这道题的每一步都对，没有需要讲解的地方。</p>' +
            '</div>' +
            '<div class="step-list" style="margin-top:12px">' + steps + '</div>' +
          '</section>' +
          '<div class="action-row"><button class="btn btn-ghost btn-block" data-go="#/result?batch=b1">' + icon('chevronLeft', 18) + '回到批改结果</button></div>' +
        '</div>';
      }

      return '<div class="page">' +
        '<div class="detail-head">' +
          '<span class="tag" style="background:' + t.bg + ';color:' + t.color + '">' + t.name + '</span>' +
        '</div>' +

        '<section class="card">' +
          visual +
          '<div class="answer-compare">' +
            '<div class="ans-box bad"><span>你的答案</span><b>' + esc(p.studentAnswer) + '</b></div>' +
            '<div class="ans-box good"><span>正确答案</span><b>' + esc(p.correctAnswer) + '</b></div>' +
          '</div>' +
        '</section>' +

        '<section class="card">' +
          '<div class="card-head"><h3 class="card-title">步骤拆解</h3><span class="muted">第 ' + (badStep ? badStep.no : '—') + ' 步出错</span></div>' +
          '<div class="step-list">' + steps + '</div>' +
        '</section>' +

        '<section class="card" style="margin-top:14px">' +
          '<div class="cause-card">' +
            '<div class="cause-title">' + icon('bulb', 17) + t.name + '</div>' +
            '<p class="cause-hint">' + esc(t.hint) + '。这道题里，' + esc(badStep ? badStep.desc : '') + '。</p>' +
          '</div>' +
        '</section>' +

        '<div class="action-row">' +
          '<button class="btn btn-ghost" id="btnPractice">同类题再练</button>' +
          '<button class="btn btn-primary" data-go="#/player?id=' + p.id + '">' + icon('play', 18) + '看动画讲解</button>' +
        '</div>' +
      '</div>';
    },
    mount: function () {
      var b = document.getElementById('btnPractice');
      if (b) b.addEventListener('click', function () { toast('已加入同类题练习，下次批改后推送'); });
    }
  };

  /* ---------------- 播放器 ---------------- */
  var Player = {
    p: null, t: 0, duration: 30, playing: false, timer: null, subs: true, muted: false,
    init: function (p) {
      this.stop();
      this.p = p; this.t = 0; this.duration = p.duration || 30;
      this.playing = false; this.subs = true; this.muted = false;
    },
    stop: function () {
      if (this.timer) { clearInterval(this.timer); this.timer = null; }
      this.playing = false;
    },
    play: function () {
      if (!this.p) return;
      if (this.t >= this.duration - 0.1) this.t = 0;
      this.stop();
      this.playing = true;
      var self = this;
      this.timer = setInterval(function () {
        self.t += 0.1;
        if (self.t >= self.duration) { self.t = self.duration; self.playing = false; clearInterval(self.timer); self.timer = null; }
        self.update();
      }, 100);
      this.update();
    },
    pause: function () {
      this.stop();
      this.update();
    },
    toggle: function () { this.playing ? this.pause() : this.play(); },
    seek: function (t) {
      if (!this.p) return;
      this.t = Math.max(0, Math.min(this.duration, t));
      this.update();
    },
    jump: function (dir) {
      if (!this.p) return;
      var idx = this.currentIndex();
      var next = Math.max(0, Math.min(this.p.chapters.length - 1, idx + dir));
      this.seek(this.p.chapters[next].at);
    },
    currentIndex: function () {
      var idx = 0;
      var t = this.t;
      this.p.chapters.forEach(function (c, i) { if (t >= c.at) idx = i; });
      return idx;
    },
    update: function () {
      var p = this.p;
      if (!p) return;
      var i = this.currentIndex();
      var ch = p.chapters[i];

      var fill = document.getElementById('tlFill');
      if (fill) fill.style.width = (this.t / this.duration * 100) + '%';
      var now = document.getElementById('tNow');
      if (now) now.textContent = fmtTime(this.t);
      var chip = document.getElementById('stageChip');
      if (chip) chip.textContent = ch.title;
      var sub = document.getElementById('subText');
      if (sub) sub.innerHTML = this.subs ? esc(ch.text) : '<span style="opacity:.45">字幕已关闭</span>';
      var wave = document.getElementById('wave');
      if (wave) wave.classList.toggle('on', this.playing && !this.muted);
      var playBtn = document.getElementById('btnPlay');
      if (playBtn) playBtn.innerHTML = this.playing ? icon('pause', 20) : icon('play', 20);

      var items = document.querySelectorAll('.chapter');
      Array.prototype.forEach.call(items, function (el, ci) {
        el.classList.toggle('active', ci === i);
      });
      applyHighlight(ch);
    }
  };

  function applyHighlight(ch) {
    var cells = document.querySelectorAll('#stageMath .vcell');
    Array.prototype.forEach.call(cells, function (c) { c.classList.remove('hl', 'wrong'); });
    if (!ch || !ch.hl) return;
    ch.hl.rows.forEach(function (r) {
      ch.hl.cols.forEach(function (c) {
        var el = document.querySelector('#stageMath .vcell[data-r="' + r + '"][data-c="' + c + '"]');
        if (el) {
          el.classList.add('hl');
          if (ch.hl.wrong) el.classList.add('wrong');
        }
      });
    });
  }

  var PlayerView = {
    render: function (query) {
      var p = problemById(query.id) || DB.problems.filter(function (x) { return !x.correct; })[0];
      var marks = p.chapters.map(function (c) {
        return '<span class="tl-mark" style="left:' + (c.at / p.duration * 100).toFixed(2) + '%"></span>';
      }).join('');
      var chapters = p.chapters.map(function (c, i) {
        return '<div class="chapter" data-seek="' + c.at + '" data-i="' + i + '">' +
          '<span class="chapter-at">' + fmtTime(c.at) + '</span>' +
          '<div class="chapter-body"><div class="chapter-title">' + esc(c.title) + '</div>' +
          '<div class="chapter-text">' + esc(c.text) + '</div></div>' +
        '</div>';
      }).join('');
      var stage = p.layout
        ? renderVertical(p, { id: 'vm', wrongCells: [] })
        : '<div style="font-family:var(--font-num);font-size:38px;font-weight:700;letter-spacing:2px">' + esc(p.expr) + '</div>';
      var t = p.typeId ? typeMeta(p.typeId) : null;

      return '<div class="page">' +
        '<div class="player-stage">' +
          '<div class="stage-top">' +
            '<span class="stage-badge"><span class="live"></span>动画讲解 · ' + esc(p.expr) + '</span>' +
            '<span class="stage-chip" id="stageChip">' + esc(p.chapters[0].title) + '</span>' +
          '</div>' +
          '<div class="stage-body" id="stageMath">' + stage + '</div>' +
          '<div class="subtitle">' +
            '<div class="mascot"><span class="smile"></span></div>' +
            '<div class="subtitle-text" id="subText">' + esc(p.chapters[0].text) + '</div>' +
          '</div>' +
          '<div class="wave" id="wave">' + new Array(26).join('<i></i>') + '</div>' +
          '<div class="controls">' +
            '<button class="ctrl" id="btnPrev" aria-label="上一段">' + icon('chevronLeft', 18) + '</button>' +
            '<button class="ctrl ctrl-play" id="btnPlay" aria-label="播放">' + icon('play', 20) + '</button>' +
            '<button class="ctrl" id="btnNext" aria-label="下一段">' + icon('chevronRight', 18) + '</button>' +
            '<div class="timeline">' +
              '<div class="tl-track" id="tlTrack"><div class="tl-fill" id="tlFill"></div>' + marks + '</div>' +
              '<div class="tl-time"><span id="tNow">0:00</span><span>' + fmtTime(p.duration) + '</span></div>' +
            '</div>' +
            '<button class="ctrl on" id="btnSub" aria-label="字幕">' + icon('captions', 18) + '</button>' +
            '<button class="ctrl" id="btnMute" aria-label="配音">' + icon('volume', 18) + '</button>' +
          '</div>' +
        '</div>' +

        '<div class="pipeline">' +
          '<span>大模型生成讲解脚本</span><span>TTS 配音</span><span>竖式动画模板渲染</span>' +
          (t ? '<span style="color:' + t.color + ';border-color:' + t.bg + ';background:' + t.bg + '">' + t.name + '</span>' : '') +
        '</div>' +

        '<section class="card" style="margin-top:14px">' +
          '<div class="card-head"><h3 class="card-title">讲解分镜</h3><span class="muted">点任意一段跳转</span></div>' +
          '<div class="chapter-list">' + chapters + '</div>' +
          '<div class="script-note">脚本由大模型按「错误步骤 + 错因类型」生成，套用竖式动画模板后合成 TTS 配音。单条视频生成约 40 秒，同一错因的模板可复用。</div>' +
        '</section>' +

        '<div class="action-row">' +
          '<button class="btn btn-ghost" data-go="#/problem?id=' + p.id + '">' + icon('chevronLeft', 18) + '回到题目</button>' +
          '<button class="btn btn-soft" id="btnRetry">同类题再练</button>' +
        '</div>' +
      '</div>';
    },
    mount: function (query) {
      var p = problemById(query.id) || DB.problems.filter(function (x) { return !x.correct; })[0];
      Player.init(p);

      var play = document.getElementById('btnPlay');
      if (play) play.addEventListener('click', function () { Player.toggle(); });
      var prev = document.getElementById('btnPrev');
      if (prev) prev.addEventListener('click', function () { Player.jump(-1); });
      var next = document.getElementById('btnNext');
      if (next) next.addEventListener('click', function () { Player.jump(1); });

      var track = document.getElementById('tlTrack');
      if (track) track.addEventListener('click', function (e) {
        var r = track.getBoundingClientRect();
        var pct = (e.clientX - r.left) / r.width;
        Player.seek(pct * Player.duration);
      });

      var sub = document.getElementById('btnSub');
      if (sub) sub.addEventListener('click', function () {
        Player.subs = !Player.subs;
        sub.classList.toggle('on', Player.subs);
        Player.update();
      });
      var mute = document.getElementById('btnMute');
      if (mute) mute.addEventListener('click', function () {
        Player.muted = !Player.muted;
        mute.innerHTML = icon(Player.muted ? 'volumeX' : 'volume', 18);
        Player.update();
        toast(Player.muted ? '配音已关闭' : '配音已打开');
      });

      var chapters = document.querySelectorAll('.chapter');
      Array.prototype.forEach.call(chapters, function (el) {
        el.addEventListener('click', function () { Player.seek(Number(el.dataset.seek)); });
      });

      var retry = document.getElementById('btnRetry');
      if (retry) retry.addEventListener('click', function () { toast('已加入同类题练习，下次批改后推送'); });

      Player.update();
    }
  };

  /* ---------------- 复习计划 ---------------- */
  var ReviewView = {
    render: function () {
      var plan = DB.reviewPlan;
      var items = plan.sessions.map(function (se) {
        var t = typeMeta(se.typeId);
        var src = problemById(se.sourceId);
        var m = DB.mastery[se.typeId] || 0;
        var paused = DB.paused[se.typeId];
        var label, cls;
        if (paused) { label = '已暂停推送'; cls = ''; }
        else if (m >= 3) { label = '已掌握'; cls = 'done'; }
        else if (m > 0) { label = '复习中 ' + m + '/3'; cls = 'doing'; }
        else { label = '待复习'; cls = ''; }
        var bad = src.steps.filter(function (s) { return !s.ok; })[0];
        return '<div class="plan-item">' +
          '<div class="plan-head">' +
            '<span class="tag" style="background:' + t.bg + ';color:' + t.color + '">' + t.name + '</span>' +
            '<span class="plan-status ' + cls + '">' + label + '</span>' +
          '</div>' +
          '<div class="plan-expr">' + esc(src.expr) + ' <span style="color:var(--ink-3);font-size:14px">你写 ' + esc(src.studentAnswer) + '</span></div>' +
          '<p class="plan-note">昨天错在：' + esc(bad ? bad.title : '') + '</p>' +
          '<div class="plan-foot">' +
            '<span class="muted">原题 1 道 + 变式 2 道</span>' +
            (paused
              ? '<button class="btn btn-ghost" disabled>' + icon('lock', 16) + '今日已停</button>'
              : '<button class="btn btn-soft" data-go="#/session?type=' + se.typeId + '">去复习</button>') +
          '</div>' +
        '</div>';
      }).join('');

      return '<div class="page">' +
        '<div class="page-head" style="padding:4px 0 16px">' +
          '<h1 class="session-title" style="font-size:22px">今日复习</h1>' +
          '<p class="session-sub">' + esc(plan.label) + ' 留下的错题，按类型逐组复习</p>' +
        '</div>' +
        '<div class="plan-list">' + items + '</div>' +
        '<div class="rule-card">' +
          '<h4>复习规则</h4>' +
          '<p>每组先重做昨天的原题；做对后自动推一道同类型变式题，连续做对 3 道判定为已掌握。中途任何一道做错，会立即生成讲解视频并标记该题，当天的同类推送到此为止。</p>' +
        '</div>' +
      '</div>';
    }
  };

  /* ---------------- 复习答题 ---------------- */
  function initSession(typeId) {
    var se = DB.reviewPlan.sessions.filter(function (s) { return s.typeId === typeId; })[0] ||
      DB.reviewPlan.sessions[0];
    State.review = {
      typeId: se.typeId,
      sourceId: se.sourceId,
      questions: se.questions,
      idx: 0,
      streak: 0,
      input: '',
      phase: 'asking'
    };
  }

  function sessionHTML() {
    var r = State.review;
    var t = typeMeta(r.typeId);
    var q = r.questions[Math.min(r.idx, r.questions.length - 1)];
    var dots = [0, 1, 2].map(function (i) {
      return '<span class="dot' + (i < r.streak ? ' on' : '') + '"></span>';
    }).join('');

    var head = '<div class="session-head">' +
      '<div><div class="session-title">' + t.name + ' · 错题重做</div>' +
      '<div class="session-sub">第 ' + Math.min(r.idx + 1, 3) + ' / 3 题 · 连对 ' + r.streak + ' 道</div></div>' +
      '<div class="streak-dots">' + dots + '</div>' +
    '</div>';

    if (r.phase === 'mastered') {
      return '<div class="page">' + head +
        '<div class="mastered-card">' +
          '<div class="medal">' + icon('award', 30) + '</div>' +
          '<h2>「' + t.name + '」已掌握</h2>' +
          '<p>连续 3 道同类题都做对了。这个类型的错题会从复习队列里移出，之后只在周测里偶尔抽查。</p>' +
        '</div>' +
        '<div class="action-row">' +
          '<button class="btn btn-ghost" data-go="#/review">返回复习计划</button>' +
          '<button class="btn btn-primary" data-go="#/home">回到今日</button>' +
        '</div>' +
      '</div>';
    }

    var displayCls = 'answer-display';
    var displayText = r.input || '在这里输入答案';
    if (r.phase === 'right') { displayCls += ' ok'; displayText = r.input; }
    if (r.phase === 'wrong' || r.phase === 'generating' || r.phase === 'video') { displayCls += ' bad'; displayText = r.input; }
    if (!r.input && r.phase === 'asking') displayCls += ' empty';

    var quiz = '<div class="quiz-card">' +
      '<div class="quiz-kind">' + esc(q.kind) + '</div>' +
      '<div class="quiz-expr">' + esc(q.expr) + ' = ?</div>' +
      '<div class="' + displayCls + '" id="ansDisplay">' + esc(displayText) + '</div>' +
    '</div>';

    var keypad = '';
    if (r.phase === 'asking') {
      var keys = [1, 2, 3, 4, 5, 6, 7, 8, 9].map(function (n) {
        return '<button class="key" data-k="' + n + '">' + n + '</button>';
      }).join('');
      keypad = '<div class="keypad" id="keypad">' + keys +
        '<button class="key fn" data-k="clear">清空</button>' +
        '<button class="key" data-k="0">0</button>' +
        '<button class="key fn" data-k="del">删除</button>' +
        '<button class="key submit" id="btnSubmit"' + (r.input ? '' : ' disabled') + '>提交答案</button>' +
      '</div>' +
      '<div class="demo-row">' +
        '<button class="demo-btn" data-demo="right">演示：答对</button>' +
        '<button class="demo-btn" data-demo="wrong">演示：答错</button>' +
      '</div>';
    }

    var phaseBlock = '';
    if (r.phase === 'right') {
      phaseBlock = '<div class="feedback ok">' +
        '<h3>' + icon('checkCircle', 18) + '答对了</h3>' +
        '<p>同类题再来一道，看看是不是真的会了。</p>' +
      '</div>';
    }
    if (r.phase === 'wrong') {
      phaseBlock = '<div class="feedback bad">' +
        '<h3>' + icon('alert', 18) + '这道又错了</h3>' +
        '<p>正确答是 ' + esc(q.answer) + '。先看一遍讲解，把这一步弄明白。</p>' +
      '</div>';
    }
    if (r.phase === 'generating') {
      phaseBlock = '<div class="gen-card">' +
        '<div class="gen-row">' +
          '<div class="spinner" style="margin:0;width:26px;height:26px;border-width:2.5px"></div>' +
          '<div><div class="gen-title">正在生成讲解视频</div>' +
          '<div class="gen-sub">大模型写脚本 · TTS 配音 · 模板渲染</div></div>' +
        '</div>' +
        '<div class="gen-bar"><i id="genBar"></i></div>' +
      '</div>';
    }
    if (r.phase === 'video') {
      var src = problemById(r.sourceId);
      var badStep = src.steps.filter(function (s) { return !s.ok; })[0];
      var stepNo = badStep ? badStep.no : 1;
      phaseBlock = '<div class="video-card">' +
          '<div class="video-cover" data-go="#/player?id=' + src.id + '">' +
            '<span class="playbig">' + icon('play', 20) + '</span>' +
            '<span class="vc-label">讲解视频 · ' + fmtTime(src.duration) + '</span>' +
          '</div>' +
          '<div class="video-meta"><b>' + t.name + ' · 针对第 ' + stepNo + ' 步的讲解</b>' +
          '<p>这道题已标记，今天的同类推送先停在这里。看完讲解，明天会重新排进复习。</p></div>' +
        '</div>' +
        '<div class="stopped-card" style="margin-top:12px">' +
          '<div class="gen-row">' +
            '<span class="batch-thumb" style="background:var(--danger-soft);color:var(--danger)">' + icon('alert', 18) + '</span>' +
            '<div><div class="gen-title">已暂停推送 · ' + t.name + '</div>' +
            '<div class="gen-sub">明天重新推送这道原题</div></div>' +
          '</div>' +
          '<div class="action-row">' +
            '<button class="btn btn-ghost" data-go="#/review">返回复习计划</button>' +
            '<button class="btn btn-primary" data-go="#/player?id=' + src.id + '">' + icon('play', 17) + '看讲解</button>' +
          '</div>' +
        '</div>';
    }

    return '<div class="page">' + head + quiz + keypad + phaseBlock + '</div>';
  }

  function bindSession() {
    var r = State.review;
    if (!r) return;

    var kp = document.getElementById('keypad');
    if (kp) {
      kp.addEventListener('click', function (e) {
        var k = e.target.closest('[data-k]');
        if (!k) return;
        var v = k.dataset.k;
        if (v === 'clear') r.input = '';
        else if (v === 'del') r.input = r.input.slice(0, -1);
        else if (r.input.length < 6) r.input += v;
        updateAnswerDisplay();
      });
    }

    var submit = document.getElementById('btnSubmit');
    if (submit) submit.addEventListener('click', submitAnswer);

    var demos = document.querySelectorAll('[data-demo]');
    Array.prototype.forEach.call(demos, function (b) {
      b.addEventListener('click', function () {
        var q = r.questions[r.idx];
        if (b.dataset.demo === 'right') r.input = q.answer;
        else r.input = String(Number(q.answer) + 1);
        updateAnswerDisplay();
      });
    });

    if (r.phase === 'generating') {
      requestAnimationFrame(function () {
        var bar = document.getElementById('genBar');
        if (bar) bar.style.width = '92%';
      });
    }
  }

  function updateAnswerDisplay() {
    var r = State.review;
    var el = document.getElementById('ansDisplay');
    var submit = document.getElementById('btnSubmit');
    if (!r || !el) return;
    el.textContent = r.input || '在这里输入答案';
    el.classList.toggle('empty', !r.input);
    el.classList.toggle('focus', !!r.input);
    el.classList.remove('ok', 'bad');
    if (submit) submit.disabled = !r.input;
  }

  function submitAnswer() {
    var r = State.review;
    if (!r || r.phase !== 'asking' || !r.input) return;
    var q = r.questions[r.idx];
    var correct = r.input === q.answer;

    if (correct) {
      r.streak += 1;
      if (r.streak >= 3) {
        DB.mastery[r.typeId] = 3;
        r.phase = 'mastered';
        renderSession();
      } else {
        r.phase = 'right';
        renderSession();
        setTimeout(function () {
          if (State.review !== r) return;
          r.idx += 1;
          r.input = '';
          r.phase = 'asking';
          renderSession();
          toast('答对了，换一道同类题');
        }, 1300);
      }
    } else {
      r.phase = 'wrong';
      DB.paused[r.typeId] = true;
      renderSession();
      setTimeout(async function () {
        if (State.review !== r) return;
        r.phase = 'generating';
        renderSession();
        await API.generateVideo(r.typeId);
        if (State.review !== r) return;
        r.phase = 'video';
        renderSession();
      }, 1200);
    }
  }

  function renderSession() {
    var view = document.getElementById('view');
    if (!view || !State.review) return;
    view.innerHTML = sessionHTML();
    bindSession();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  var SessionView = {
    render: function (query) {
      var typeId = query.type || DB.reviewPlan.sessions[0].typeId;
      if (!State.review || State.review.typeId !== typeId) initSession(typeId);
      return sessionHTML();
    },
    mount: function () { bindSession(); }
  };

  /* ---------------- 错题本 ---------------- */
  function wrongProblems() {
    return DB.problems.filter(function (p) { return !p.correct; });
  }

  function typeCounts() {
    var counts = {};
    wrongProblems().forEach(function (p) {
      if (!p.typeId) return;
      counts[p.typeId] = (counts[p.typeId] || 0) + 1;
    });
    return counts;
  }

  function itemState(p) {
    if (DB.mastery[p.typeId] >= 3) return { key: 'done', label: '已掌握' };
    if (DB.paused[p.typeId]) return { key: 'paused', label: '已暂停' };
    if (DB.mastery[p.typeId] > 0) return { key: 'doing', label: '复习中' };
    return { key: 'new', label: '未掌握' };
  }

  function wrongListHTML(filter) {
    var list = wrongProblems().filter(function (p) {
      if (filter === 'all') return true;
      var st = itemState(p);
      if (filter === 'done') return st.key === 'done';
      if (filter === 'doing') return st.key === 'doing' || st.key === 'paused';
      if (filter === 'new') return st.key === 'new';
      return true;
    });

    if (!list.length) {
      return '<div class="empty"><div class="empty-ic">' + icon('checkCircle', 24) + '</div>' +
        '<b>这里没有错题</b><p>换个筛选条件，或者去拍一张新的作业。</p></div>';
    }

    return list.map(function (p) {
      var t = p.typeId ? typeMeta(p.typeId) : null;
      var st = itemState(p);
      return '<div class="wrong-item" data-go="#/problem?id=' + p.id + '">' +
        '<div class="wi-main">' +
          '<div class="wi-expr">' + esc(p.expr) + ' = ' + esc(p.studentAnswer) + '</div>' +
          '<div class="wi-meta">' +
            (t ? '<span class="tag" style="background:' + t.bg + ';color:' + t.color + '">' + t.name + '</span>' : '') +
            '<span class="wi-state ' + st.key + '">' + st.label + '</span>' +
            '<span class="wi-date">' + esc(p.date) + '</span>' +
          '</div>' +
        '</div>' +
        '<span class="p-go">' + icon('chevronRight', 18) + '</span>' +
      '</div>';
    }).join('');
  }

  function distHTML() {
    var counts = typeCounts();
    var total = wrongProblems().length || 1;
    var keys = Object.keys(counts).sort(function (a, b) { return counts[b] - counts[a]; });
    return keys.map(function (k) {
      var t = typeMeta(k);
      var pct = Math.round(counts[k] / total * 100);
      return '<div class="dist-row">' +
        '<span class="dist-name">' + t.name + '</span>' +
        '<span class="dist-bar"><i style="width:' + pct + '%;background:' + t.color + '"></i></span>' +
        '<span class="dist-val">' + counts[k] + '</span>' +
      '</div>';
    }).join('');
  }

  var BookView = {
    render: function () {
      var total = wrongProblems().length;
      var counts = typeCounts();
      var top = Object.keys(counts).sort(function (a, b) { return counts[b] - counts[a]; })[0];
      var filters = [
        { k: 'all', label: '全部' },
        { k: 'new', label: '未掌握' },
        { k: 'doing', label: '复习中' },
        { k: 'done', label: '已掌握' }
      ].map(function (f) {
        return '<button class="ftab' + (State.bookFilter === f.k ? ' active' : '') + '" data-filter="' + f.k + '">' + f.label + '</button>';
      }).join('');

      return '<div class="page">' +
        '<div class="book-summary">' +
          '<div class="book-total">' + total + '<span>道错题</span></div>' +
          '<div class="book-copy"><b>最多的是「' + typeMeta(top).name + '」</b>' +
          '<p>共 ' + (counts[top] || 0) + ' 道，占 ' + Math.round((counts[top] || 0) / total * 100) + '%</p></div>' +
        '</div>' +

        '<section class="card">' +
          '<div class="card-head"><h3 class="card-title">错题类型分布</h3>' +
          '<span class="muted">共 ' + Object.keys(counts).length + ' 类</span></div>' +
          '<div class="dist">' + distHTML() + '</div>' +
        '</section>' +

        '<div class="filter-tabs" id="filterTabs" style="margin-top:16px">' + filters + '</div>' +
        '<div class="wrong-list" id="wrongList">' + wrongListHTML(State.bookFilter) + '</div>' +
      '</div>';
    },
    mount: function () {
      var tabs = document.getElementById('filterTabs');
      if (!tabs) return;
      tabs.addEventListener('click', function (e) {
        var b = e.target.closest('[data-filter]');
        if (!b) return;
        State.bookFilter = b.dataset.filter;
        Array.prototype.forEach.call(tabs.querySelectorAll('.ftab'), function (el) {
          el.classList.toggle('active', el === b);
        });
        var list = document.getElementById('wrongList');
        if (list) list.innerHTML = wrongListHTML(State.bookFilter);
      });
    }
  };

  /* ---------------- 家长端 ---------------- */
  function parentBodyHTML() {
    var tab = State.parentTab;

    if (tab === 'overview') {
      var total = wrongProblems().length;
      var counts = typeCounts();
      var mastered = Object.keys(DB.mastery).filter(function (k) { return DB.mastery[k] >= 3; }).length;
      var max = Math.max.apply(null, DB.trend7d.map(function (d) { return d.v; }));

      var trend = DB.trend7d.map(function (d, i) {
        var h = Math.max(10, Math.round(d.v / max * 86));
        var isToday = i === DB.trend7d.length - 1;
        return '<div class="trend-col' + (isToday ? ' today' : '') + '">' +
          '<span class="trend-v">' + d.v + '</span>' +
          '<span class="trend-bar" style="height:' + h + 'px"></span>' +
          '<span class="trend-d">' + d.d.slice(3) + '</span>' +
        '</div>';
      }).join('');

      var masteryRows = Object.keys(DB.mastery).map(function (k) {
        var t = typeMeta(k);
        var m = DB.mastery[k];
        var dots = [0, 1, 2].map(function (i) {
          return '<span class="dot' + (i < m ? ' on' : '') + '"></span>';
        }).join('');
        return '<div class="mastery-item">' +
          '<span class="mastery-name">' + t.name + '</span>' +
          '<span class="muted">' + (m >= 3 ? '已掌握' : m + '/3') + '</span>' +
          '<span class="dots">' + dots + '</span>' +
        '</div>';
      }).join('');

      return '<div class="parent-cols">' +
        '<div>' +
          '<div class="kpi-grid">' +
            '<div class="kpi"><div class="k-label">' + icon('book', 12) + '累计错题</div><b>' + total + '<small>道</small></b>' +
              '<div class="k-foot">近 7 天新增 ' + DB.trend7d.reduce(function (a, b) { return a + b.v; }, 0) + ' 道</div></div>' +
            '<div class="kpi"><div class="k-label">' + icon('award', 12) + '已掌握类型</div><b>' + mastered + '<small>/ 6</small></b>' +
              '<div class="k-foot up">本周 +1 类</div></div>' +
            '<div class="kpi"><div class="k-label">' + icon('target', 12) + '复习完成率</div><b>67<small>%</small></b>' +
              '<div class="k-foot up">较上周 +12%</div></div>' +
            '<div class="kpi"><div class="k-label">' + icon('flame', 12) + '连续打卡</div><b>' + DB.student.streakDays + '<small>天</small></b>' +
              '<div class="k-foot">昨天也完成了复习</div></div>' +
          '</div>' +

          '<section class="card" style="margin-top:14px">' +
            '<div class="card-head"><h3 class="card-title">近 7 天错题数量</h3><span class="muted">每天批改后统计</span></div>' +
            '<div class="trend">' + trend + '</div>' +
            '<div class="legend"><span><i style="background:var(--primary)"></i>每日错题</span>' +
            '<span><i style="background:var(--accent)"></i>今天</span></div>' +
          '</section>' +
        '</div>' +

        '<div>' +
          '<section class="card">' +
            '<div class="card-head"><h3 class="card-title">错题类型分布</h3><span class="muted">共 ' + total + ' 道</span></div>' +
            '<div class="dist">' + distHTML() + '</div>' +
          '</section>' +

          '<section class="card" style="margin-top:14px">' +
            '<div class="card-head"><h3 class="card-title">各类型掌握进度</h3><span class="muted">连对 3 道算学会</span></div>' +
            '<div class="mastery-list">' + masteryRows + '</div>' +
          '</section>' +
        '</div>' +
      '</div>';
    }

    if (tab === 'detail') {
      return '<div class="wrong-list">' + wrongListHTML('all') + '</div>';
    }

    var items = DB.history.map(function (h) {
      var t = typeMeta(h.typeId);
      return '<div class="tl-item ' + h.state + '">' +
        '<div class="tl-date">' + esc(h.date) + '</div>' +
        '<div class="tl-main">' + t.name + ' · ' + esc(h.result) + '</div>' +
        '<div class="tl-note">' + esc(h.note) + '</div>' +
      '</div>';
    }).join('');

    return '<section class="card">' +
      '<div class="card-head"><h3 class="card-title">复习记录</h3><span class="muted">每天推送一次</span></div>' +
      '<div class="timeline-list">' + items + '</div>' +
    '</section>';
  }

  var ParentView = {
    render: function () {
      var segs = [
        { k: 'overview', label: '概览' },
        { k: 'detail', label: '错题明细' },
        { k: 'history', label: '复习记录' }
      ].map(function (s) {
        return '<button class="seg-item' + (State.parentTab === s.k ? ' active' : '') + '" data-seg="' + s.k + '">' + s.label + '</button>';
      }).join('');

      return '<div class="page">' +
        '<div class="parent-head">' +
          '<h1>小满的数学学习</h1>' +
          '<p>三年级 · 每天 16:00 推送前一天错题复习，做错会自动生成讲解视频并暂停该类推送。</p>' +
        '</div>' +
        '<div class="seg" id="parentSeg">' + segs + '</div>' +
        '<div id="parentBody">' + parentBodyHTML() + '</div>' +
      '</div>';
    },
    mount: function () {
      var seg = document.getElementById('parentSeg');
      if (!seg) return;
      seg.addEventListener('click', function (e) {
        var b = e.target.closest('[data-seg]');
        if (!b) return;
        State.parentTab = b.dataset.seg;
        Array.prototype.forEach.call(seg.querySelectorAll('.seg-item'), function (el) {
          el.classList.toggle('active', el === b);
        });
        var body = document.getElementById('parentBody');
        if (body) body.innerHTML = parentBodyHTML();
        window.scrollTo({ top: 0, behavior: 'smooth' });
      });
    }
  };

  /* ---------------- 路由 ---------------- */
  var ROUTES = {
    '/home': { view: HomeView, nav: 'home', topbar: 'brand' },
    '/scan': { view: ScanView, nav: 'scan', topbar: 'brand' },
    '/result': { view: ResultView, nav: 'scan', topbar: 'back', title: '批改结果' },
    '/problem': { view: ProblemView, nav: '', topbar: 'back', title: '错因分析' },
    '/player': { view: PlayerView, nav: '', topbar: 'back', title: '动画讲解' },
    '/review': { view: ReviewView, nav: 'home', topbar: 'back', title: '今日复习' },
    '/session': { view: SessionView, nav: '', topbar: 'back', title: '错题重做' },
    '/book': { view: BookView, nav: 'book', topbar: 'brand' },
    '/parent': { view: ParentView, nav: '', topbar: 'parent' }
  };

  function parseHash() {
    var raw = location.hash.replace(/^#/, '') || '/home';
    var parts = raw.split('?');
    var path = parts[0];
    var query = {};
    (parts[1] || '').split('&').filter(Boolean).forEach(function (kv) {
      var seg = kv.split('=');
      query[seg[0]] = decodeURIComponent(seg[1] || '');
    });
    return { path: path, query: query };
  }

  function cleanup() {
    if (Player.timer) { clearInterval(Player.timer); Player.timer = null; }
    Player.playing = false;
    Player.p = null;
    State.review = null;
    Cam.stop();
  }

  function render() {
    cleanup();
    var r = parseHash();
    var meta = ROUTES[r.path] || ROUTES['/home'];
    var topbar = document.getElementById('topbar');
    var tabbar = document.getElementById('tabbar');
    var view = document.getElementById('view');

    topbar.innerHTML = topbarHTML(meta);
    tabbar.innerHTML = tabbarHTML(meta.nav);
    tabbar.classList.toggle('hidden', !meta.nav);

    view.innerHTML = meta.view.render(r.query);
    if (meta.view.mount) meta.view.mount(r.query);

    window.scrollTo(0, 0);
  }

  function toast(msg) {
    var el = document.getElementById('toast');
    if (!el) {
      el = document.createElement('div');
      el.id = 'toast';
      el.className = 'toast';
      document.body.appendChild(el);
    }
    el.textContent = msg;
    el.classList.add('on');
    clearTimeout(State.toastTimer);
    State.toastTimer = setTimeout(function () { el.classList.remove('on'); }, 1900);
  }

  /* ---------------- 事件委托 ---------------- */
  document.addEventListener('click', function (e) {
    var go = e.target.closest('[data-go]');
    if (go) {
      var href = go.getAttribute('data-go');
      if (href) { location.hash = href.replace(/^#/, ''); }
      return;
    }
    var back = e.target.closest('[data-back]');
    if (back) {
      if (history.length > 1) history.back();
      else location.hash = '#/home';
    }
  });

  window.addEventListener('hashchange', render);

  /* ---------------- 启动 ---------------- */
  if (!location.hash) location.hash = '#/home';
  render();
})();
