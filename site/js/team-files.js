// ===== ملفات فريقي: اختار الفريق ونزّل كل اللي رفعه =====
const API_URL = 'https://web-train.runasp.net';
const STORAGE = 'myTeam';
let teams = [];
let currentTeam = '';
let personal = null; // { traineeId, code } بعد ما يدخل الكود صح (للجلسة بس، عشان أجهزة القاعة)

const select = document.querySelector('#tf-team');
const list = document.querySelector('#tf-list');
const msg = document.querySelector('#tf-msg');

function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text == null ? '' : String(text);
  return div.innerHTML;
}

function showMsg(text) {
  msg.textContent = text;
  msg.hidden = !text;
}

function size(bytes) {
  return bytes > 1024 * 1024 ? (bytes / 1024 / 1024).toFixed(1) + 'MB' : Math.max(1, Math.round(bytes / 1024)) + 'KB';
}

function when(value) {
  return new Date(value).toLocaleString('en-GB', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' });
}

async function loadTeams() {
  try {
    const res = await fetch(API_URL + '/api/teams');
    if (!res.ok) throw new Error('http');
    teams = await res.json();
    select.innerHTML = '<option value="">اختار فريقك</option>' + teams.map(function (t) {
      return '<option value="' + t.id + '">' + escapeHtml(t.name) + '</option>';
    }).join('');
    // نتذكر آخر فريق اختاره على هالجهاز
    let saved = '';
    try { saved = localStorage.getItem(STORAGE) || ''; } catch (e) { /* ignore */ }
    if (saved && teams.some(function (t) { return String(t.id) === saved; })) {
      select.value = saved;
      loadFiles(saved);
    }
  } catch (err) {
    select.innerHTML = '<option value="">—</option>';
    showMsg('ما قدرنا نوصل للسيرفر. تأكد من الإنترنت وحدّث الصفحة.');
  }
}

async function loadFiles(teamId) {
  list.innerHTML = '';
  showMsg('');
  feedbackBox.innerHTML = '';
  personalBox.hidden = !teamId;
  personalList.innerHTML = '';
  codeMsg.hidden = true;
  currentTeam = teamId;
  if (!teamId) return;
  try { localStorage.setItem(STORAGE, teamId); } catch (e) { /* ignore */ }
  fillMe(teamId);
  loadTeamFeedback(teamId);
  list.innerHTML = '<p class="muted">عم يتحمّل...</p>';
  try {
    const [filesRes, textsRes] = await Promise.all([
      fetch(API_URL + '/api/teams/' + teamId + '/files'),
      fetch(API_URL + '/api/teams/' + teamId + '/texts'),
    ]);
    if (!filesRes.ok) throw new Error('http');
    const files = await filesRes.json();
    const texts = textsRes.ok ? await textsRes.json() : []; // النصوص إضافة: لو فشلت بنعرض الملفات بس
    render(teamId, files, texts);
  } catch (err) {
    list.innerHTML = '';
    showMsg('صار خطأ بالتحميل، جرّب كمان مرة.');
  }
}

function render(teamId, files, texts) {
  if (files.length === 0 && texts.length === 0) {
    list.innerHTML = '<p class="tf-empty">لسا ما في شي مرفوع لهالفريق.</p>';
    return;
  }
  // تجميع حسب اليوم (الأحدث أول)
  const days = {};
  for (const f of files) (days[f.day] = days[f.day] || { files: [], texts: [] }).files.push(f);
  for (const t of texts) (days[t.day] = days[t.day] || { files: [], texts: [] }).texts.push(t);
  const order = Object.keys(days).map(Number).sort(function (a, b) { return b - a; });

  list.innerHTML = order.map(function (day) {
    const textHtml = days[day].texts.map(function (t, i) {
      const meta = escapeHtml(t.uploadedBy) + ' · <span dir="ltr">' + when(t.createdAt) + '</span>';
      return mdBox(t.title + ' · اليوم ' + day, t.text, meta, i === 0); // أحدث نص مفتوح، والباقي مطوي
    }).join('');
    const items = days[day].files.map(function (f) {
      const url = API_URL + '/api/teams/' + teamId + '/files/' + f.id;
      return '<li><a class="tf-file" href="' + url + '" download>' +
        '<span class="tf-name">' + escapeHtml(f.originalName) + '</span>' +
        '<span class="tf-meta">' + escapeHtml(f.uploadedBy) + ' · <span dir="ltr">' + when(f.createdAt) + '</span> · ' + size(f.sizeBytes) + '</span>' +
        '</a></li>';
    }).join('');
    return '<section class="tf-day"><h2>اليوم ' + day + '</h2>' + textHtml + (items ? '<ul>' + items + '</ul>' : '') + '</section>';
  }).join('');
}

select.addEventListener('change', function () { loadFiles(select.value); });
loadTeams();

// =====================================================================
// ملاحظات المدرب
// =====================================================================
const feedbackBox = document.querySelector('#tf-feedback');
const personalBox = document.querySelector('#tf-personal');
const personalList = document.querySelector('#tf-personal-list');
const codeForm = document.querySelector('#tf-code-form');
const meSelect = document.querySelector('#tf-me');
const codeInput = document.querySelector('#tf-code');
const codeMsg = document.querySelector('#tf-code-msg');
const KIND = { good: 'ممتاز 👏', improve: 'تحسين', fix: 'مطلوب تصليح' };

function fbHtml(list, scope) {
  return '<ul class="fb-list">' + list.map(function (f) {
    const done = !!f.resolvedAt;
    return '<li class="fb-item ' + f.kind + (done ? ' done' : '') + '">' +
      '<div class="fb-meta"><b>' + KIND[f.kind] + '</b> · اليوم ' + f.day + ' · تسليم #' + f.submissionId +
      ' · <span dir="ltr">' + when(f.createdAt) + '</span>' + (f.isNew ? ' <span class="fb-new">جديد</span>' : '') + '</div>' +
      '<div class="fb-text">' + escapeHtml(f.text) + '</div>' +
      (f.kind === 'good' ? '' : '<div class="fb-foot">' + (done ? '<span class="fb-done">✓ تم التعديل' + (f.resolvedBy ? ' · ' + escapeHtml(f.resolvedBy) : '') + '</span> ' : '') +
        '<button type="button" class="md-btn' + (done ? '' : ' md-copy') + '" data-resolve="' + f.id + '" data-scope="' + scope + '" data-to="' + (done ? '0' : '1') + '">' +
        (done ? 'تراجع' : '✓ تم التعديل') + '</button></div>') +
      '</li>';
  }).join('') + '</ul>';
}

async function loadTeamFeedback(teamId) {
  try {
    const res = await fetch(API_URL + '/api/teams/' + teamId + '/feedback');
    if (!res.ok) return;
    const list = await res.json();
    if (teamId !== currentTeam) return;
    if (!list.length) { feedbackBox.innerHTML = ''; return; }
    const open = list.filter(function (f) { return !f.resolvedAt && f.kind !== 'good'; }).length;
    feedbackBox.innerHTML = '<section class="tf-box tf-fb"><h2>ملاحظات المدرب للفريق' +
      (open ? ' <span class="fb-count">' + open + ' لسا بدها تعديل</span>' : '') + '</h2>' + fbHtml(list, 'team') + '</section>';
  } catch (e) { /* الملاحظات إضافة: ما بنوقف الصفحة */ }
}

function fillMe(teamId) {
  const team = teams.find(function (t) { return String(t.id) === String(teamId); });
  meSelect.innerHTML = '<option value="">اسمك</option>' + (team ? team.trainees : []).map(function (p) {
    return '<option value="' + p.id + '">' + escapeHtml(p.fullName) + '</option>';
  }).join('');
  personal = null;
  try {
    const saved = JSON.parse(sessionStorage.getItem('myCode') || 'null');
    if (saved && team && team.trainees.some(function (p) { return p.id === saved.traineeId; })) {
      meSelect.value = String(saved.traineeId);
      codeInput.value = saved.code;
      loadPersonal(saved.traineeId, saved.code);
    }
  } catch (e) { /* ignore */ }
}

async function loadPersonal(traineeId, code) {
  codeMsg.hidden = true;
  personalList.innerHTML = '<p class="muted">عم يتحمّل...</p>';
  try {
    const res = await fetch(API_URL + '/api/feedback/personal', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ traineeId: traineeId, code: code }),
    });
    if (res.status === 403 || res.status === 400) {
      personalList.innerHTML = '';
      codeMsg.textContent = 'الكود غلط. تأكد منه أو اسأل المدرب.';
      codeMsg.hidden = false;
      try { sessionStorage.removeItem('myCode'); } catch (e) { /* ignore */ }
      return;
    }
    if (!res.ok) throw new Error('http');
    const data = await res.json();
    personal = { traineeId: traineeId, code: code };
    try { sessionStorage.setItem('myCode', JSON.stringify(personal)); } catch (e) { /* ignore */ }
    personalList.innerHTML = data.items.length ? fbHtml(data.items, 'trainee') : '<p class="tf-empty">ما في ملاحظات شخصية إلك لسا.</p>';
  } catch (e) {
    personalList.innerHTML = '';
    codeMsg.textContent = 'صار خطأ، جرّب كمان مرة.';
    codeMsg.hidden = false;
  }
}

codeForm.addEventListener('submit', function (e) {
  e.preventDefault();
  if (!meSelect.value) { codeMsg.textContent = 'اختار اسمك.'; codeMsg.hidden = false; return; }
  if (!/^\d{4,6}$/.test(codeInput.value.trim())) { codeMsg.textContent = 'الكود أرقام بس.'; codeMsg.hidden = false; return; }
  loadPersonal(Number(meSelect.value), codeInput.value.trim());
});

document.addEventListener('click', async function (e) {
  const btn = e.target.closest('[data-resolve]');
  if (!btn) return;
  btn.disabled = true;
  const body = { resolved: btn.dataset.to === '1', teamId: Number(currentTeam) };
  if (btn.dataset.scope === 'trainee') {
    if (!personal) return;
    body.traineeId = personal.traineeId;
    body.code = personal.code;
  } else if (meSelect.value) {
    body.traineeId = Number(meSelect.value); // بنعرف مين من الفريق أكّد التعديل
  }
  try {
    const res = await fetch(API_URL + '/api/feedback/' + btn.dataset.resolve + '/resolve', {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body),
    });
    if (!res.ok) throw new Error('http');
    if (btn.dataset.scope === 'trainee') loadPersonal(personal.traineeId, personal.code);
    else loadTeamFeedback(currentTeam);
  } catch (err) {
    btn.disabled = false;
    alert('ما زبط، جرّب كمان مرة.');
  }
});
