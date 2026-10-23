/* ============================================================
   算一算 · 模拟数据（单一数据源）
   所有页面只从这里取数，不散落硬编码。
   ============================================================ */

window.TYPES = {
  'carry-add': {
    name: '进位遗漏', short: '进位', color: '#D64545', bg: '#FBE8E6',
    hint: '个位相加满十，忘了向高位进 1'
  },
  'borrow-sub': {
    name: '退位遗漏', short: '退位', color: '#D9702F', bg: '#FCEEDF',
    hint: '不够减时借了 1，后面的数位忘了减掉'
  },
  'times-table': {
    name: '乘法口诀错误', short: '口诀', color: '#B9851F', bg: '#FAF1DA',
    hint: '乘法口诀记错，部分积从源头就偏了'
  },
  'basic-add': {
    name: '口算基础不牢', short: '口算', color: '#2E8B62', bg: '#E5F3EB',
    hint: '20 以内加减不熟，答案靠猜'
  },
  'division-estimate': {
    name: '试商偏差', short: '试商', color: '#3F7FA6', bg: '#E7F1F6',
    hint: '除法试商偏大或偏小，商位写错'
  },
  'align': {
    name: '数位未对齐', short: '对齐', color: '#7A6A8F', bg: '#EFEBF4',
    hint: '竖式书写时个位、十位没有对齐'
  }
};

/* ---------- 竖式布局生成 ---------- */
function padCells(n, width) {
  return String(n).padStart(width, ' ').split('');
}

function addSubLayout(a, b, op, studentAns) {
  const res = String(studentAns);
  const w = Math.max(String(a).length, String(b).length, res.length) + 1;
  const row = (n, sign) => [sign || '', ...padCells(n, w - 1)];
  return {
    cols: w,
    rows: [
      { cells: row(a, '') },
      { cells: row(b, op) },
      { line: true },
      { cells: row(res, ''), result: true }
    ]
  };
}

function diffResultCells(layout, correctAns) {
  const ri = layout.rows.length - 1;
  const cells = layout.rows[ri].cells;
  const corr = padCells(correctAns, cells.length - 1);
  const out = [];
  for (let i = 1; i < cells.length; i++) {
    if (cells[i].trim() !== '' && cells[i] !== corr[i - 1]) out.push({ r: ri, c: i });
  }
  return out;
}

function mkAddSub(o) {
  const layout = addSubLayout(o.a, o.b, o.op, o.studentAnswer);
  const p = Object.assign({}, o, { layout, wrongCells: [] });
  p.wrongCells = o.correct ? [] : diffResultCells(layout, o.correctAnswer);
  return p;
}

/* 加法/减法讲解分镜：按数位逐位高亮 */
function addSubChapters(p, texts) {
  const cols = p.layout.cols;
  const rows = [0, 1, p.layout.rows.length - 1];
  const place = { ones: cols - 1, tens: cols - 2, hundreds: cols - 3 };
  return [
    { at: 0, title: '读题', text: texts.intro, hl: null },
    { at: 5, title: texts.step1Title, text: texts.step1, hl: { rows, cols: [place.ones] } },
    { at: 11, title: texts.step2Title, text: texts.step2, hl: { rows, cols: [place.tens], wrong: !!texts.wrong } },
    { at: 19, title: texts.step3Title, text: texts.step3, hl: { rows, cols: [place.hundreds] } },
    { at: 26, title: '记住', text: texts.tip, hl: null }
  ];
}

/* ---------- 题目数据 ---------- */
const P = [];

/* p1 · 246 + 378，学生写 614（十位漏加进位） */
P.push(mkAddSub({
  id: 'p1', expr: '246 + 378', a: 246, b: 378, op: '+', grade: '三年级',
  studentAnswer: '614', correctAnswer: '624', correct: false,
  typeId: 'carry-add', date: '今天', batchId: 'b1',
  steps: [
    { no: 1, title: '个位：6 + 8 = 14', desc: '写 4，向十位进 1', ok: true },
    { no: 2, title: '十位：4 + 7 + 1 = 12', desc: '应该写 2 再进 1；你写成了 1，漏掉了进位的 1', ok: false },
    { no: 3, title: '百位：2 + 3 + 1 = 6', desc: '写 6，得到 624', ok: true }
  ]
}));

/* p2 · 47 × 26，学生写 1212（部分积 282 写成 272） */
P.push({
  id: 'p2', expr: '47 × 26', a: 47, b: 26, op: '×', grade: '三年级',
  studentAnswer: '1212', correctAnswer: '1222', correct: false,
  typeId: 'times-table', date: '今天', batchId: 'b1',
  layout: {
    cols: 5,
    rows: [
      { cells: ['', '', '', '4', '7'] },
      { cells: ['×', '', '', '2', '6'] },
      { line: true },
      { cells: ['', '', '2', '8', '2'], partial: true },
      { cells: ['', '9', '4', '0', ''], partial: true },
      { line: true },
      { cells: ['', '1', '2', '1', '2'], result: true }
    ]
  },
  wrongCells: [{ r: 6, c: 3 }],
  steps: [
    { no: 1, title: '47 × 6 = 282', desc: '六七四十二写 2 进 4，四六二十四加 4 得 28。这一行你写成了 272', ok: false },
    { no: 2, title: '47 × 20 = 940', desc: '十位相乘的结果左移一位写', ok: true },
    { no: 3, title: '282 + 940 = 1222', desc: '两行部分积相加，得到正确答案', ok: true }
  ]
});

/* p3 · 503 - 268，学生写 245（十位忘了减去借走的 1） */
P.push(mkAddSub({
  id: 'p3', expr: '503 - 268', a: 503, b: 268, op: '-', grade: '三年级',
  studentAnswer: '245', correctAnswer: '235', correct: false,
  typeId: 'borrow-sub', date: '今天', batchId: 'b1',
  steps: [
    { no: 1, title: '个位：3 不够减 8，向前借 1', desc: '13 − 8 = 5', ok: true },
    { no: 2, title: '十位：0 借出 1 后剩 9', desc: '9 − 6 = 3；你写成了 4，忘了减掉被借走的 1', ok: false },
    { no: 3, title: '百位：5 借出 1 后剩 4', desc: '4 − 2 = 2，得到 235', ok: true }
  ]
}));

/* p4 · 6 × 7 全对 */
P.push({
  id: 'p4', expr: '6 × 7', a: 6, b: 7, op: '×', grade: '二年级',
  studentAnswer: '42', correctAnswer: '42', correct: true,
  typeId: null, date: '今天', batchId: 'b1', layout: null, wrongCells: [],
  steps: [
    { no: 1, title: '六七四十二', desc: '口诀背得很熟，直接写得数', ok: true }
  ]
});

/* p5 · 8 + 7，学生写 14（凑十后少加 1） */
P.push(mkAddSub({
  id: 'p5', expr: '8 + 7', a: 8, b: 7, op: '+', grade: '一年级',
  studentAnswer: '14', correctAnswer: '15', correct: false,
  typeId: 'basic-add', date: '今天', batchId: 'b1',
  steps: [
    { no: 1, title: '8 + 7 拆成 8 + 2 + 5', desc: '先凑十：8 + 2 = 10', ok: true },
    { no: 2, title: '10 + 5 = 15', desc: '你写成了 14，凑十以后少加了 1', ok: false }
  ]
}));

/* p6 · 84 ÷ 6，学生写 13（试商偏小） */
P.push({
  id: 'p6', expr: '84 ÷ 6', a: 84, b: 6, op: '÷', grade: '三年级',
  studentAnswer: '13', correctAnswer: '14', correct: false,
  typeId: 'division-estimate', date: '今天', batchId: 'b1',
  layout: null, wrongCells: [],
  steps: [
    { no: 1, title: '试商：8 ÷ 6 商 1', desc: '1 × 6 = 6，8 − 6 = 2，余 2', ok: true },
    { no: 2, title: '落下个位 4，24 ÷ 6 = 4', desc: '应该商 4；你写了 3，试商偏小', ok: false }
  ]
});

/* ---------- 昨天的错题（进入复习队列） ---------- */
P.push(mkAddSub({
  id: 'y1', expr: '357 + 286', a: 357, b: 286, op: '+', grade: '三年级',
  studentAnswer: '543', correctAnswer: '643', correct: false,
  typeId: 'carry-add', date: '昨天', batchId: 'b0',
  steps: [
    { no: 1, title: '个位：7 + 6 = 13', desc: '写 3，向十位进 1', ok: true },
    { no: 2, title: '十位：5 + 8 + 1 = 14', desc: '写 4，向百位进 1', ok: true },
    { no: 3, title: '百位：3 + 2 + 1 = 6', desc: '你写成了 5，百位漏加进位', ok: false }
  ]
}));

P.push(mkAddSub({
  id: 'y2', expr: '602 - 347', a: 602, b: 347, op: '-', grade: '三年级',
  studentAnswer: '265', correctAnswer: '255', correct: false,
  typeId: 'borrow-sub', date: '昨天', batchId: 'b0',
  steps: [
    { no: 1, title: '个位：2 不够减 7，借 1', desc: '12 − 7 = 5', ok: true },
    { no: 2, title: '十位：0 借出 1 后剩 9', desc: '9 − 4 = 5；你写成了 6', ok: false },
    { no: 3, title: '百位：6 借出 1 后剩 5', desc: '5 − 3 = 2', ok: true }
  ]
}));

P.push({
  id: 'y3', expr: '38 × 24', a: 38, b: 24, op: '×', grade: '三年级',
  studentAnswer: '902', correctAnswer: '912', correct: false,
  typeId: 'times-table', date: '昨天', batchId: 'b0',
  layout: {
    cols: 5,
    rows: [
      { cells: ['', '', '', '3', '8'] },
      { cells: ['×', '', '', '2', '4'] },
      { line: true },
      { cells: ['', '', '1', '5', '2'], partial: true },
      { cells: ['', '7', '6', '0', ''], partial: true },
      { line: true },
      { cells: ['', '', '9', '0', '2'], result: true }
    ]
  },
  wrongCells: [{ r: 6, c: 3 }],
  steps: [
    { no: 1, title: '38 × 4 = 152', desc: '个位相乘写第一行部分积', ok: true },
    { no: 2, title: '38 × 20 = 760', desc: '十位相乘左移一位', ok: true },
    { no: 3, title: '152 + 760 = 912', desc: '你写成了 902，相加时百位算错', ok: false }
  ]
});

/* ---------- 错题本里的历史题目 ---------- */
P.push(mkAddSub({
  id: 'h1', expr: '305 + 198', a: 305, b: 198, op: '+', grade: '三年级',
  studentAnswer: '493', correctAnswer: '503', correct: false,
  typeId: 'carry-add', date: '10月21日', batchId: null,
  steps: [
    { no: 1, title: '个位：5 + 8 = 13', desc: '写 3 进 1', ok: true },
    { no: 2, title: '十位：0 + 9 + 1 = 10', desc: '写 0 进 1', ok: true },
    { no: 3, title: '百位：3 + 1 + 1 = 5', desc: '你写成了 4，漏加进位', ok: false }
  ]
}));

P.push(mkAddSub({
  id: 'h2', expr: '74 - 29', a: 74, b: 29, op: '-', grade: '二年级',
  studentAnswer: '55', correctAnswer: '45', correct: false,
  typeId: 'borrow-sub', date: '10月21日', batchId: null,
  steps: [
    { no: 1, title: '个位：4 不够减 9，借 1', desc: '14 − 9 = 5', ok: true },
    { no: 2, title: '十位：7 借出 1 后剩 6', desc: '6 − 2 = 4；你写成了 5', ok: false }
  ]
}));

P.push(mkAddSub({
  id: 'h3', expr: '9 + 6', a: 9, b: 6, op: '+', grade: '一年级',
  studentAnswer: '16', correctAnswer: '15', correct: false,
  typeId: 'basic-add', date: '10月20日', batchId: null,
  steps: [
    { no: 1, title: '9 + 6，凑十法', desc: '9 + 1 = 10，6 还剩 5', ok: true },
    { no: 2, title: '10 + 5 = 15', desc: '你写成了 16', ok: false }
  ]
}));

P.push({
  id: 'h4', expr: '96 ÷ 8', a: 96, b: 8, op: '÷', grade: '三年级',
  studentAnswer: '11', correctAnswer: '12', correct: false,
  typeId: 'division-estimate', date: '10月20日', batchId: null,
  layout: null, wrongCells: [],
  steps: [
    { no: 1, title: '9 ÷ 8 商 1，余 1', desc: '1 × 8 = 8，9 − 8 = 1', ok: true },
    { no: 2, title: '落下 6，16 ÷ 8 = 2', desc: '应该商 2；你写了 1', ok: false }
  ]
});

P.push(mkAddSub({
  id: 'h5', expr: '63 - 27', a: 63, b: 27, op: '-', grade: '二年级',
  studentAnswer: '46', correctAnswer: '36', correct: false,
  typeId: 'borrow-sub', date: '10月19日', batchId: null,
  steps: [
    { no: 1, title: '个位：3 不够减 7，借 1', desc: '13 − 7 = 6', ok: true },
    { no: 2, title: '十位：6 借出 1 后剩 5', desc: '5 − 2 = 3；你写成了 4', ok: false }
  ]
}));

/* ---------- 讲解分镜（大模型脚本 + 模板渲染的呈现） ---------- */
const byId = {};
P.forEach(p => { byId[p.id] = p; });

byId.p1.chapters = addSubChapters(byId.p1, {
  intro: '小满，我们来看这道题：246 加 378。别急，从个位开始，一位一位地加。',
  step1Title: '个位相加', step1: '个位是 6 加 8，等于 14。写 4，向十位进 1。这一步你做对了。',
  step2Title: '十位相加', step2: '十位是 4 加 7，还要加上刚进的 1，等于 12。写 2，再向百位进 1。你这里写成了 1，就是忘了加进位的 1。',
  step3Title: '百位相加', step3: '百位是 2 加 3，再加进位的 1，等于 6。所以正确答案是 624。',
  tip: '进位的小 1 写在横线上，算下一位时一定要先把它加上。',
  wrong: true
});
byId.p1.duration = 31;

byId.p2.chapters = [
  { at: 0, title: '读题', text: '47 乘 26，我们用竖式，分两步来乘。', hl: null },
  { at: 5, title: '第一步', text: '先算 47 乘个位的 6。六七四十二，写 2 进 4；四六二十四，加 4 得 28。这一行应该是 282。', hl: { rows: [3], cols: [2, 3, 4] } },
  { at: 12, title: '找到问题', text: '你写成了 272，说明进位的 4 没有加上。部分积一错，最后的结果就跟着错。', hl: { rows: [3], cols: [2, 3, 4], wrong: true } },
  { at: 19, title: '第二步', text: '再算 47 乘十位的 2，得 94，写在左移一位的位置，就是 940。', hl: { rows: [4], cols: [1, 2, 3] } },
  { at: 25, title: '两行相加', text: '282 加 940 等于 1222，这才是正确答案。', hl: { rows: [6], cols: [1, 2, 3, 4] } }
];
byId.p2.duration = 32;

byId.p3.chapters = addSubChapters(byId.p3, {
  intro: '503 减 268，这道题要连续退位，我们慢慢来。',
  step1Title: '个位退位', step1: '个位 3 不够减 8，向十位借 1，变成 13 减 8，等于 5。',
  step2Title: '十位退位', step2: '十位本来是 0，借给个位 1 以后，只能向百位再借，变成 9。9 减 6 等于 3。你写成了 4，就是忘了减掉被借走的 1。',
  step3Title: '百位相减', step3: '百位 5 被借走 1，剩 4，4 减 2 等于 2。所以答案是 235。',
  tip: '退位以后，每一位都要先减掉借走的 1，再相减。',
  wrong: true
});
byId.p3.duration = 31;

byId.p5.chapters = [
  { at: 0, title: '读题', text: '8 加 7，我们用凑十法，一眼就能看出来。', hl: null },
  { at: 4, title: '先凑十', text: '从 7 里拿出 2，和 8 凑成 10。', hl: { rows: [0, 1], cols: [2] } },
  { at: 9, title: '再加剩下的', text: '7 拿走 2 还剩 5，10 加 5 等于 15。你写成 14，是凑十以后少加了 1。', hl: { rows: [3], cols: [2], wrong: true } },
  { at: 16, title: '记住', text: '凑十法要记住：从另一个数里拿出多少，就要在它身上减掉多少。', hl: null }
];
byId.p5.duration = 21;

/* 其余题目给一段通用脚本，保证任何错题都能生成讲解 */
function genericChapters(p) {
  const bad = p.steps.findIndex(s => !s.ok);
  const list = p.steps.map((s, i) => ({
    at: i === 0 ? 0 : 5 + (i - 1) * 6,
    title: '第 ' + s.no + ' 步',
    text: s.title + '。' + s.desc,
    hl: null
  }));
  list.push({ at: 5 + p.steps.length * 6, title: '记住', text: '这道题的关键在第 ' + (bad + 1) + ' 步，下次算到这里慢一点。', hl: null });
  return list;
}
P.forEach(p => {
  if (!p.chapters) {
    p.chapters = genericChapters(p);
    p.duration = 5 + p.steps.length * 6 + 5;
  }
});

/* ---------- 批次 ---------- */
window.DB = {
  student: { name: '小满', grade: '三年级', streakDays: 6, avatar: '满' },
  types: window.TYPES,
  problems: P,
  batches: [
    { id: 'b1', title: '数学作业 · 第 3 页', date: '今天 16:20', problemIds: ['p1', 'p2', 'p3', 'p4', 'p5', 'p6'] },
    { id: 'b0', title: '数学作业 · 第 2 页', date: '昨天 17:05', problemIds: ['y1', 'y2', 'y3'] }
  ],
  mastery: { 'carry-add': 1, 'borrow-sub': 2, 'times-table': 0, 'basic-add': 3, 'division-estimate': 0, 'align': 0 },
  paused: { 'carry-add': false, 'borrow-sub': false, 'times-table': false, 'basic-add': false, 'division-estimate': false, 'align': false },
  reviewPlan: {
    label: '昨天 · 10月22日',
    sessions: [
      {
        typeId: 'carry-add', sourceId: 'y1',
        questions: [
          { expr: '357 + 286', answer: '643', kind: '昨日原题' },
          { expr: '468 + 257', answer: '725', kind: '同类变式' },
          { expr: '529 + 183', answer: '712', kind: '同类变式' }
        ]
      },
      {
        typeId: 'borrow-sub', sourceId: 'y2',
        questions: [
          { expr: '602 - 347', answer: '255', kind: '昨日原题' },
          { expr: '701 - 458', answer: '243', kind: '同类变式' },
          { expr: '800 - 536', answer: '264', kind: '同类变式' }
        ]
      },
      {
        typeId: 'times-table', sourceId: 'y3',
        questions: [
          { expr: '38 × 24', answer: '912', kind: '昨日原题' },
          { expr: '56 × 37', answer: '2072', kind: '同类变式' },
          { expr: '43 × 28', answer: '1204', kind: '同类变式' }
        ]
      }
    ]
  },
  trend7d: [
    { d: '10/17', v: 4 }, { d: '10/18', v: 2 }, { d: '10/19', v: 5 },
    { d: '10/20', v: 3 }, { d: '10/21', v: 6 }, { d: '10/22', v: 4 }, { d: '10/23', v: 3 }
  ],
  history: [
    { date: '10月22日', typeId: 'carry-add', result: '做错 · 已暂停推送', note: '第 2 题做错，已重新观看讲解，本题已标记', state: 'bad' },
    { date: '10月21日', typeId: 'borrow-sub', result: '已掌握', note: '连对 3 道，判定学会', state: 'good' },
    { date: '10月20日', typeId: 'basic-add', result: '已掌握', note: '连对 3 道，判定学会', state: 'good' },
    { date: '10月19日', typeId: 'times-table', result: '做错 · 已暂停推送', note: '第 1 题做错，已重新观看讲解', state: 'bad' }
  ]
};
