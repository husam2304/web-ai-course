// ===== لوحة المدرب =====
const API_URL = 'https://web-train.runasp.net';
const KEY_STORAGE = 'adminKey';

const $ = function (sel) { return document.querySelector(sel); };
const loginForm = $('#login-form');
const keyInput = $('#admin-key');
const loginError = $('#login-error');
const dashboard = $('#dashboard');
const dayTabs = $('#day-tabs');
const rowsBox = $('#rows');
const countBox = $('#admin-count');
const search = $('#search');

let adminKey = '';
let currentDay = 1;
let currentView = 'subs';
let currentRows = [];
let teams = [];          // كل الفرق مع كل المتدربين (حتى غير النشطين)
let summary = [];
const selected = new Set(); // تسليمات محددة للدمج

// ---------- أدوات ----------
function getStoredKey() {
  try { return sessionStorage.getItem(KEY_STORAGE) || ''; } catch (e) { return ''; }
}
function storeKey(key) {
  try { key ? sessionStorage.setItem(KEY_STORAGE, key) : sessionStorage.removeItem(KEY_STORAGE); } catch (e) { /* ignore */ }
}

// طلب للباك إند مع المفتاح. body: كائن (JSON) أو FormData
async function api(path, method, body) {
  const options = { method: method || 'GET', headers: { 'X-Admin-Key': adminKey } };
  if (body instanceof FormData) options.body = body;
  else if (body !== undefined) {
    options.headers['Content-Type'] = 'application/json';
    options.body = JSON.stringify(body);
  }
  const res = await fetch(API_URL + path, options);
  if (res.status === 401) throw new Error('auth');
  if (!res.ok) {
    let text = 'http ' + res.status;
    try { text = (await res.json()).error || text; } catch (e) { /* ignore */ }
    throw new Error(text);
  }
  return res;
}
async function apiJson(path, method, body) {
  const res = await api(path, method, body);
  const text = await res.text();
  return text ? JSON.parse(text) : {};
}

function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text == null ? '' : String(text);
  return div.innerHTML;
}
function normalize(name) {
  return String(name || '').replace(/[أإآ]/g, 'ا').replace(/ة/g, 'ه').replace(/ى/g, 'ي').replace(/\s+/g, ' ').trim().toLowerCase();
}
function allTrainees() {
  const list = [];
  for (const t of teams) for (const p of t.trainees) list.push(Object.assign({ teamName: t.name, teamId: t.id }, p));
  return list;
}

// ---------- الدخول ----------
loginForm.addEventListener('submit', function (e) {
  e.preventDefault();
  login(keyInput.value.trim());
});

async function login(key) {
  adminKey = key;
  loginError.textContent = '';
  try {
    summary = await apiJson('/api/admin/summary');
    storeKey(key);
    loginForm.hidden = true;
    dashboard.hidden = false;
    await loadTeams();
    renderDayTabs();
    loadMessages(true);
    currentDay = summary.length ? summary[summary.length - 1].day : 1;
    showView('subs');
  } catch (err) {
    storeKey('');
    loginError.textContent = err.message === 'auth' ? 'المفتاح غلط.' : 'ما قدرنا نوصل للسيرفر.';
  }
}

$('#logout-btn').addEventListener('click', function () {
  storeKey('');
  location.reload();
});

// ---------- الأقسام والأيام ----------
$('#view-tabs').addEventListener('click', function (e) {
  const btn = e.target.closest('.view-tab');
  if (btn) showView(btn.dataset.view);
});

function showView(view) {
  currentView = view;
  for (const b of document.querySelectorAll('.view-tab')) b.classList.toggle('active', b.dataset.view === view);
  for (const v of ['subs', 'roster', 'teams', 'messages', 'trash']) $('#view-' + v).hidden = v !== view;
  dayTabs.hidden = view === 'teams' || view === 'messages' || view === 'trash';
  refresh();
}

function refresh() {
  for (const t of dayTabs.children) t.classList.toggle('active', Number(t.dataset.day) === currentDay);
  if (currentView === 'subs') loadDay();
  else if (currentView === 'roster') loadRoster();
  else if (currentView === 'messages') loadMessages();
  else if (currentView === 'trash') loadTrash();
  else renderTeams();
}

function renderDayTabs() {
  dayTabs.innerHTML = '';
  for (let day = 1; day <= 5; day++) {
    const item = summary.find(function (s) { return s.day === day; });
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'day-tab';
    btn.dataset.day = day;
    btn.textContent = 'اليوم ' + day + ' (' + (item ? item.count : 0) + ')';
    btn.addEventListener('click', function () { currentDay = day; refresh(); });
    dayTabs.appendChild(btn);
  }
  for (const t of dayTabs.children) t.classList.toggle('active', Number(t.dataset.day) === currentDay);
}

async function reloadSummary() {
  try { summary = await apiJson('/api/admin/summary'); renderDayTabs(); } catch (e) { /* ignore */ }
}

async function loadTeams() {
  teams = await apiJson('/api/admin/teams');
}

// =====================================================================
// 1) التسليمات
// =====================================================================
async function loadDay() {
  selected.clear();
  if (typeof updateMergeBar === 'function') updateMergeBar();
  rowsBox.innerHTML = '<tr><td colspan="7">عم يتحمّل...</td></tr>';
  try {
    currentRows = await apiJson('/api/admin/submissions?day=' + currentDay);
    renderRows();
  } catch (err) {
    rowsBox.innerHTML = '<tr><td colspan="7">صار خطأ بالتحميل.</td></tr>';
  }
}

function renderRows() {
  const q = normalize(search.value);
  const counts = {};
  for (const r of currentRows) for (const t of r.trainees) counts[t.id] = (counts[t.id] || 0) + 1;

  const visible = currentRows.filter(function (r) {
    if (!q) return true;
    const hay = [r.fullName, r.teamNumber].concat(r.trainees.map(function (t) { return t.fullName + ' ' + t.teamName; })).join(' ');
    return normalize(hay).includes(q);
  });

  const unlinked = currentRows.filter(function (r) { return r.trainees.length === 0; }).length;
  countBox.innerHTML = visible.length + ' تسليم' + (q ? ' (من أصل ' + currentRows.length + ')' : '') +
    (unlinked ? ' · <span class="warn">' + unlinked + ' غير مربوط</span>' : '');

  if (visible.length === 0) {
    rowsBox.innerHTML = '<tr><td colspan="7">ما في تسليمات.</td></tr>';
    return;
  }

  rowsBox.innerHTML = visible.map(function (r) {
    const who = r.trainees.length
      ? r.trainees.map(function (t) {
          return '<span class="chip">' + escapeHtml(t.fullName) + (counts[t.id] > 1 ? ' <button type="button" class="dup" data-dupsel="' + t.id + '" title="حدد كل تسليماته عشان تدمجهم">تكرار</button>' : '') + '</span>';
        }).join('')
      : '<span class="warn">⚠️ غير مربوط</span>';
    const typed = '<div class="typed">مكتوب: ' + escapeHtml(r.fullName) + (r.source === 'admin' ? ' · <b>رفع المدرب</b>' : '') +
      (r.updatedAt ? ' · <b class="edited">معدّل</b>' : '') + '</div>';
    const teamNames = r.trainees.length
      ? Array.from(new Set(r.trainees.map(function (t) { return t.teamName; }))).map(escapeHtml).join('، ')
      : escapeHtml(r.teamNumber);
    const time = new Date(r.createdAt).toLocaleString('en-GB', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' });
    const answers = Object.entries(r.answers).map(function (pair) {
      if (LONG_KEYS.indexOf(pair[0]) >= 0 || (pair[1] && pair[1].length > 300 && pair[1].indexOf('\n') >= 0)) {
        return pair[1] && pair[1].trim() ? mdBox(pair[0], pair[1]) : '';
      }
      return '<p><strong>' + escapeHtml(pair[0]) + ':</strong> ' + (escapeHtml(pair[1]) || '<span class="muted">—</span>') + '</p>';
    }).join('');
    const files = r.files.map(function (f) {
      return '<div class="file-row"><button class="file-btn" type="button" data-file="' + f.id + '">' + escapeHtml(f.originalName) +
        ' <small>(' + Math.max(1, Math.round(f.sizeBytes / 1024)) + 'KB)</small></button>' +
        '<button class="file-del" type="button" data-del-file="' + f.id + '" title="حذف هالملف بس" aria-label="حذف الملف ' + escapeHtml(f.originalName) + '">✕</button></div>';
    }).join('') || '<span class="muted">لا يوجد</span>';
    const fbCount = (r.feedback || []).length;
    const actions = '<button class="mini fb-btn" type="button" data-fb="' + r.id + '">ملاحظة' + (fbCount ? ' (' + fbCount + ')' : '') + '</button>' +
      '<button class="mini" type="button" data-edit="' + r.id + '">تعديل</button>' +
      '<button class="mini" type="button" data-link="' + r.id + '">ربط</button>' +
      '<button class="mini danger" type="button" data-del="' + r.id + '">حذف</button>';
    const checked = selected.has(r.id) ? ' checked' : '';
    return '<tr' + (checked ? ' class="selected"' : '') + '><td><label class="sel"><input type="checkbox" data-sel="' + r.id + '"' + checked + '> ' + r.id + '</label></td><td>' + who + typed + '</td><td>' + teamNames + '</td><td class="actions">' + actions +
      '</td><td>' + files + '</td><td dir="ltr">' + time + '</td><td class="answers">' + fbListHtml(r.feedback || [], false) + answers + '</td></tr>';
  }).join('');
}

search.addEventListener('input', renderRows);

// النصوص الطويلة (من الـ AI) بتنعرض منسقة، مع نسخ وتنزيل .md (js/md.js)
const LONG_KEYS = ['الجمهور والأهداف', 'خطة الفريق', 'شغل إضافي'];

rowsBox.addEventListener('click', async function (e) {
  const fileBtn = e.target.closest('[data-file]');
  if (fileBtn) return download('/api/admin/files/' + fileBtn.dataset.file, 'file', fileBtn);

  const delFile = e.target.closest('[data-del-file]');
  if (delFile) {
    if (!confirm('حذف هالملف بس؟ بيروح للمحذوفات، وإجابات التسليم بتضل.')) return;
    try {
      await api('/api/admin/files/' + delFile.dataset.delFile, 'DELETE');
      loadDay();
    } catch (err) { alert('ما انحذف: ' + err.message); }
    return;
  }

  const linkBtn = e.target.closest('[data-link]');
  if (linkBtn) return openLinkDialog(Number(linkBtn.dataset.link));

  const fbBtn = e.target.closest('[data-fb]');
  if (fbBtn) return openFeedback(Number(fbBtn.dataset.fb));

  const editBtn = e.target.closest('[data-edit]');
  if (editBtn) return openEdit(Number(editBtn.dataset.edit));

  const dupBtn = e.target.closest('[data-dupsel]');
  if (dupBtn) {
    // حدد كل تسليمات هالشخص بهاليوم
    const tid = Number(dupBtn.dataset.dupsel);
    selected.clear();
    currentRows.forEach(function (r) { if (r.trainees.some(function (t) { return t.id === tid; })) selected.add(r.id); });
    renderRows();
    updateMergeBar();
    return;
  }

  const delBtn = e.target.closest('[data-del]');
  if (delBtn) {
    const id = Number(delBtn.dataset.del);
    if (!confirm('حذف التسليم رقم ' + id + '؟ بيروح للمحذوفات وبتقدر ترجعه.')) return;
    try {
      await api('/api/admin/submissions/' + id, 'DELETE');
      await reloadSummary();
      loadDay();
    } catch (err) { alert('ما انحذف: ' + err.message); }
  }
});

// ---------- اختيار متدربين (للربط وللرفع) ----------
function renderPicker(box, selectedIds) {
  box.innerHTML = teams.map(function (t) {
    const people = t.trainees.map(function (p) {
      const checked = selectedIds.indexOf(p.id) >= 0 ? ' checked' : '';
      return '<label class="pick-item' + (p.isActive ? '' : ' inactive') + '"><input type="checkbox" value="' + p.id + '"' + checked + '> ' +
        escapeHtml(p.fullName) + (p.isActive ? '' : ' <small>(موقوف)</small>') + '</label>';
    }).join('') || '<span class="muted">ما في متدربين</span>';
    return '<fieldset><legend>' + escapeHtml(t.name) + '</legend>' + people + '</fieldset>';
  }).join('') || '<p class="muted">أضف الفرق والمتدربين أول من قسم «الفرق والمتدربين».</p>';
}
function pickedIds(box) {
  return Array.from(box.querySelectorAll('input:checked')).map(function (i) { return Number(i.value); });
}

// ---------- ربط تسليم ----------
const linkDialog = $('#link-dialog');
let linkingId = 0;

function openLinkDialog(id) {
  const row = currentRows.find(function (r) { return r.id === id; });
  if (!row) return;
  linkingId = id;
  $('#link-title').textContent = 'ربط التسليم رقم ' + id;
  $('#link-typed').textContent = 'المكتوب بالنموذج: ' + row.fullName + ' · ' + row.teamNumber;
  renderPicker($('#link-pick'), row.trainees.map(function (t) { return t.id; }));
  linkDialog.showModal();
}

linkDialog.addEventListener('close', async function () {
  if (linkDialog.returnValue !== 'save') return;
  try {
    await api('/api/admin/submissions/' + linkingId + '/trainees', 'PUT', { traineeIds: pickedIds($('#link-pick')) });
    loadDay();
  } catch (err) { alert('ما انحفظ: ' + err.message); }
});

// ---------- ربط تلقائي ----------
$('#auto-link').addEventListener('click', async function () {
  const btn = this;
  btn.disabled = true;
  const report = $('#link-report');
  try {
    const result = await apiJson('/api/admin/auto-link', 'POST');
    if (result.length === 0) {
      report.innerHTML = '<p>كل التسليمات مربوطة ✓</p>';
    } else {
      const ok = result.filter(function (r) { return r.linked.length > 0; });
      const bad = result.filter(function (r) { return r.linked.length === 0; });
      report.innerHTML = '<p><strong>انربط ' + ok.length + ' تسليم</strong>' + (bad.length ? ' · <span class="warn">' + bad.length + ' ما انربطوا (اربطهم يدوي)</span>' : '') +
        ' <button class="mini" type="button" id="report-close">إخفاء</button></p><ul>' +
        result.map(function (r) {
          return '<li>يوم ' + r.day + ' · #' + r.id + ' «' + escapeHtml(r.fullName) + '» ← ' +
            (r.linked.length ? escapeHtml(r.linked.join('، ')) : '<span class="warn">ما لقينا حدا</span>') + '</li>';
        }).join('') + '</ul><p class="muted">راجع القائمة: إذا في ربط غلط اضغط «ربط» جنب التسليم وعدّله.</p>';
    }
    report.hidden = false;
    loadDay();
  } catch (err) {
    alert('ما زبط: ' + err.message);
  } finally {
    btn.disabled = false;
  }
});
$('#link-report').addEventListener('click', function (e) {
  if (e.target.id === 'report-close') this.hidden = true;
});

// ---------- رفع ملف لمتدرب ----------
const uploadDialog = $('#upload-dialog');
const uploadForm = $('#upload-form');

$('#upload-open').addEventListener('click', function () {
  $('#upload-title').textContent = 'رفع ملف لليوم ' + currentDay;
  renderPicker($('#upload-pick'), []);
  $('#upload-files').value = '';
  $('#upload-note').value = '';
  $('#upload-error').textContent = '';
  uploadDialog.showModal();
});

uploadForm.addEventListener('submit', async function (e) {
  if (e.submitter && e.submitter.value === 'cancel') return; // يسكّر عادي
  e.preventDefault();
  const ids = pickedIds($('#upload-pick'));
  const files = $('#upload-files').files;
  const error = $('#upload-error');
  if (ids.length === 0) { error.textContent = 'اختار متدرب واحد على الأقل.'; return; }
  if (files.length === 0) { error.textContent = 'اختار ملف.'; return; }
  if (files.length > 3) { error.textContent = 'لحد 3 ملفات بالمرة.'; return; }

  const data = new FormData();
  data.append('day', currentDay);
  data.append('traineeIds', ids.join(','));
  data.append('note', $('#upload-note').value.trim());
  Array.from(files).forEach(function (f, i) { data.append('file' + (i + 1), f, f.name); });

  const btn = $('#upload-save');
  btn.disabled = true;
  btn.textContent = 'عم يرفع...';
  try {
    await api('/api/admin/submissions', 'POST', data);
    uploadDialog.close();
    await reloadSummary();
    loadDay();
  } catch (err) {
    error.textContent = err.message;
  } finally {
    btn.disabled = false;
    btn.textContent = 'رفع';
  }
});


// =====================================================================
// الملاحظات على التسليمات
// =====================================================================
const KIND_LABEL = { good: 'ممتاز', improve: 'تحسين', fix: 'مطلوب تصليح' };
const DEFAULT_TEMPLATES = [
  ['good', 'شغل ممتاز ومرتب 👏'],
  ['good', 'جوابك بكلماتك وواضح، هيك بالضبط'],
  ['improve', 'الجمهور عام زيادة: حددوا فئة وحدة'],
  ['improve', 'الأهداف بدها تكون أوضح، وكل هدف بجملة'],
  ['improve', 'الجواب واضح إنه منسوخ من الـ AI. اكتبه بكلماتك'],
  ['improve', 'نطاق المشروع كبير: صغّروه لـ 3-6 صفحات'],
  ['fix', 'هاي الميزة بدها Backend: خلوها واجهة عرض بس'],
  ['fix', 'ناقص تقرير الجمهور والأهداف: سلّموه من تبويب «اليوم 1»'],
  ['fix', 'الملف المرفوع مش هو المطلوب، ارفعوا الملف الصح'],
];
const TPL_KEY = 'fbTemplates';
function customTemplates() {
  try { return JSON.parse(localStorage.getItem(TPL_KEY) || '[]'); } catch (e) { return []; }
}

function fmtTime(value) {
  return value ? new Date(value).toLocaleString('en-GB', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' }) : '';
}

// قائمة الملاحظات (بجدول التسليمات وبالحوار)
function fbListHtml(list, editable) {
  if (!list.length) return '';
  return '<ul class="fb-list">' + list.map(function (f) {
    const status = (f.resolvedAt ? '<span class="fb-st ok" title="' + escapeHtml(f.resolvedBy || '') + '">✓ تم التعديل</span>'
      : f.seenAt ? '<span class="fb-st seen">👁 انشافت</span>' : '<span class="fb-st new">لسا ما انشافت</span>');
    const tools = editable ? '<span class="fb-tools"><button type="button" class="mini" data-fb-edit="' + f.id + '">تعديل</button>' +
      '<button type="button" class="mini danger" data-fb-del="' + f.id + '">حذف</button></span>' : '';
    return '<li class="fb-item ' + f.kind + '"><div class="fb-meta"><b>' + KIND_LABEL[f.kind] + '</b> · ' +
      (f.scope === 'team' ? 'للفريق' : 'لـ ' + escapeHtml(f.target)) + ' · <span dir="ltr">' + fmtTime(f.createdAt) + '</span> ' + status + tools +
      '</div><div class="fb-text">' + escapeHtml(f.text) + '</div></li>';
  }).join('') + '</ul>';
}

const fbDialog = $('#fb-dialog');
let fbRow = null;
let fbEditing = 0;

function openFeedback(id) {
  fbRow = currentRows.find(function (r) { return r.id === id; });
  if (!fbRow) return;
  $('#fb-title').textContent = 'ملاحظات على التسليم رقم ' + id;
  resetFbForm();
  renderFbDialog();
  fbDialog.showModal();
}

function renderFbDialog() {
  $('#fb-existing').innerHTML = fbListHtml(fbRow.feedback || [], true) || '<p class="muted">ما في ملاحظات لسا.</p>';
  const target = $('#fb-target');
  if (!fbRow.trainees.length) {
    target.innerHTML = '<p class="warn">التسليم مش مربوط: اربطه أول عشان نعرف لمين الملاحظة.</p>';
  } else {
    target.innerHTML = '<label class="pick-item"><input type="radio" name="fb-target" value="team" checked> للفريق كله (' + escapeHtml(fbRow.trainees[0].teamName) + ')</label>' +
      fbRow.trainees.map(function (t) {
        return '<label class="pick-item"><input type="radio" name="fb-target" value="' + t.id + '"> لـ ' + escapeHtml(t.fullName) + ' بس (شخصية، بالكود)</label>';
      }).join('');
  }
  const all = DEFAULT_TEMPLATES.concat(customTemplates());
  $('#fb-templates').innerHTML = all.map(function (t, i) {
    return '<button type="button" class="tpl ' + t[0] + '" data-tpl="' + i + '">' + escapeHtml(t[1]) + '</button>';
  }).join('');
}

function resetFbForm() {
  fbEditing = 0;
  $('#fb-text').value = '';
  $('#fb-error').textContent = '';
  $('#fb-form-title').textContent = 'ملاحظة جديدة';
  $('#fb-save').textContent = 'إضافة';
  $('#fb-cancel-edit').hidden = true;
  $('#fb-target').hidden = false;
  const k = document.querySelector('input[name="fb-kind"][value="improve"]');
  if (k) k.checked = true;
}

$('#fb-templates').addEventListener('click', function (e) {
  const b = e.target.closest('[data-tpl]');
  if (!b) return;
  const t = DEFAULT_TEMPLATES.concat(customTemplates())[Number(b.dataset.tpl)];
  const box = $('#fb-text');
  box.value = box.value.trim() ? box.value.trim() + '\n' + t[1] : t[1];
  const k = document.querySelector('input[name="fb-kind"][value="' + t[0] + '"]');
  if (k) k.checked = true;
  box.focus();
});

$('#fb-save-template').addEventListener('click', function () {
  const text = $('#fb-text').value.trim();
  if (!text) { $('#fb-error').textContent = 'اكتب الملاحظة أول.'; return; }
  const kind = document.querySelector('input[name="fb-kind"]:checked').value;
  const list = customTemplates();
  list.push([kind, text]);
  try { localStorage.setItem(TPL_KEY, JSON.stringify(list)); } catch (e) { /* ignore */ }
  renderFbDialog();
});

$('#fb-existing').addEventListener('click', async function (e) {
  const edit = e.target.closest('[data-fb-edit]');
  const del = e.target.closest('[data-fb-del]');
  if (edit) {
    const f = fbRow.feedback.find(function (x) { return x.id === Number(edit.dataset.fbEdit); });
    fbEditing = f.id;
    $('#fb-text').value = f.text;
    document.querySelector('input[name="fb-kind"][value="' + f.kind + '"]').checked = true;
    $('#fb-form-title').textContent = 'تعديل الملاحظة (بترجع تبين «جديدة» للمتدرب)';
    $('#fb-save').textContent = 'حفظ التعديل';
    $('#fb-cancel-edit').hidden = false;
    $('#fb-target').hidden = true;
    $('#fb-text').focus();
  }
  if (del) {
    if (!confirm('حذف الملاحظة؟')) return;
    try {
      await api('/api/admin/feedback/' + del.dataset.fbDel, 'DELETE');
      await refreshFbRow();
    } catch (err) { alert('ما انحذفت: ' + err.message); }
  }
});

$('#fb-cancel-edit').addEventListener('click', resetFbForm);

$('#fb-form').addEventListener('submit', async function (e) {
  if (e.submitter && e.submitter.value === 'cancel') { loadDay(); return; }
  e.preventDefault();
  const text = $('#fb-text').value.trim();
  const kind = document.querySelector('input[name="fb-kind"]:checked').value;
  const error = $('#fb-error');
  if (text.length < 2) { error.textContent = 'اكتب الملاحظة.'; return; }
  try {
    if (fbEditing) {
      await api('/api/admin/feedback/' + fbEditing, 'PUT', { kind: kind, text: text });
    } else {
      const t = document.querySelector('input[name="fb-target"]:checked');
      if (!t) { error.textContent = 'اربط التسليم أول.'; return; }
      await api('/api/admin/feedback', 'POST', {
        submissionId: fbRow.id,
        scope: t.value === 'team' ? 'team' : 'trainee',
        traineeId: t.value === 'team' ? null : Number(t.value),
        kind: kind,
        text: text,
      });
    }
    resetFbForm();
    await refreshFbRow();
  } catch (err) {
    error.textContent = err.message;
  }
});

// نعيد تحميل اليوم ونحدّث الحوار المفتوح
async function refreshFbRow() {
  currentRows = await apiJson('/api/admin/submissions?day=' + currentDay);
  fbRow = currentRows.find(function (r) { return r.id === fbRow.id; }) || fbRow;
  renderFbDialog();
  renderRows();
}

// ---------- طباعة الأكواد ----------
$('#print-codes').addEventListener('click', async function () {
  try {
    const data = await apiJson('/api/admin/codes');
    const cards = data.map(function (t) {
      return t.trainees.map(function (p) {
        return '<div class="slip"><div class="team">' + escapeHtml(t.team) + '</div><div class="name">' + escapeHtml(p.fullName) +
          '</div><div class="code">' + escapeHtml(p.code) + '</div><div class="how">موقع الدورة ← التسليم ← ملفات فريقي ← «ملاحظاتي»</div></div>';
      }).join('');
    }).join('');
    const w = window.open('', '_blank');
    w.document.write('<!DOCTYPE html><html lang="ar" dir="rtl"><head><meta charset="UTF-8"><title>أكواد الملاحظات</title><style>' +
      'body{font-family:Tahoma,Arial,sans-serif;margin:16px}.grid{display:grid;grid-template-columns:repeat(3,1fr);gap:10px}' +
      '.slip{border:2px dashed #999;border-radius:10px;padding:12px;text-align:center;break-inside:avoid}' +
      '.team{color:#B8571A;font-weight:bold}.name{font-size:18px;font-weight:bold;margin:4px 0}.code{font-size:30px;letter-spacing:6px;font-weight:bold;direction:ltr}' +
      '.how{font-size:11px;color:#555;margin-top:6px}</style></head><body><div class="grid">' + cards + '</div>' +
      '<script>window.onload=function(){window.print()}<\/script></body></html>');
    w.document.close();
  } catch (err) { alert('ما قدرنا نجيب الأكواد.'); }
});

// =====================================================================
// 2) الحضور والتقييم
// =====================================================================
async function loadRoster() {
  const box = $('#roster');
  box.innerHTML = '<p class="muted">عم يتحمّل...</p>';
  try {
    renderRoster(await apiJson('/api/admin/roster?day=' + currentDay));
  } catch (err) {
    box.innerHTML = '<p class="warn">صار خطأ بالتحميل.</p>';
  }
}

function renderRoster(data) {
  let total = 0;
  let done = 0;
  const html = data.map(function (team) {
    const active = team.trainees.filter(function (p) { return p.isActive; });
    const rows = active.map(function (p) {
      total++;
      const submitted = p.submissions.length > 0;
      if (submitted) done++;
      return '<tr class="' + (submitted ? '' : 'missing') + '"><td>' + escapeHtml(p.fullName) + '</td>' +
        '<td>' + (submitted ? '✓ <small class="muted">#' + p.submissions.join(' #') + '</small>' : '<span class="warn">✗ ما سلّم</span>') + '</td>' +
        '<td><input class="score" type="number" min="0" max="10" step="0.5" dir="ltr" data-trainee="' + p.id + '" value="' + (p.score == null ? '' : p.score) + '"></td>' +
        '<td><input class="note" type="text" maxlength="1000" data-trainee="' + p.id + '" value="' + escapeHtml(p.note || '') + '" placeholder="ملاحظة"></td>' +
        '<td class="saved" data-saved="' + p.id + '"></td></tr>';
    }).join('');
    if (!rows) return '';
    return '<div class="roster-team"><h3>' + escapeHtml(team.name) + '</h3><div class="table-wrap"><table class="admin-table roster-table">' +
      '<thead><tr><th>المتدرب</th><th>سلّم؟</th><th>العلامة /10</th><th>ملاحظة</th><th></th></tr></thead><tbody>' + rows + '</tbody></table></div></div>';
  }).join('');
  $('#roster').innerHTML = html || '<p class="muted">أضف الفرق والمتدربين أول من قسم «الفرق والمتدربين».</p>';
  $('#roster-count').innerHTML = 'اليوم ' + currentDay + ': سلّم <strong>' + done + '</strong> من ' + total +
    (total - done ? ' · <span class="warn">' + (total - done) + ' ما سلّموا</span>' : '') + ' · العلامة والملاحظة بينحفظوا لحالهم.';
}

// حفظ تلقائي لما يتغير الحقل
$('#roster').addEventListener('change', async function (e) {
  const input = e.target.closest('[data-trainee]');
  if (!input) return;
  const id = Number(input.dataset.trainee);
  const row = input.closest('tr');
  const scoreText = row.querySelector('.score').value.trim();
  const score = scoreText === '' ? null : Number(scoreText);
  const mark = row.querySelector('[data-saved]');
  if (score !== null && (isNaN(score) || score < 0 || score > 10)) {
    mark.textContent = 'العلامة من 0 لـ 10';
    mark.className = 'saved warn';
    return;
  }
  mark.textContent = '...';
  mark.className = 'saved';
  try {
    await api('/api/admin/evaluations', 'PUT', { traineeId: id, day: currentDay, score: score, note: row.querySelector('.note').value.trim() });
    mark.textContent = '✓ انحفظ';
  } catch (err) {
    mark.textContent = 'ما انحفظ';
    mark.className = 'saved warn';
  }
});

// =====================================================================
// 3) الفرق والمتدربين
// =====================================================================
function teamOptions(selected) {
  return teams.map(function (t) {
    return '<option value="' + t.id + '"' + (t.id === selected ? ' selected' : '') + '>' + escapeHtml(t.name) + '</option>';
  }).join('');
}

function renderTeams() {
  const box = $('#teams');
  if (teams.length === 0) {
    box.innerHTML = '<p class="muted">ما في فرق لسا. أضف أول فريق من فوق.</p>';
    return;
  }
  box.innerHTML = teams.map(function (t) {
    const people = t.trainees.map(function (p) {
      return '<li class="person' + (p.isActive ? '' : ' inactive') + '" data-person="' + p.id + '">' +
        '<input type="text" class="p-name" value="' + escapeHtml(p.fullName) + '" maxlength="150">' +
        '<select class="p-team">' + teamOptions(t.id) + '</select>' +
        '<label class="p-active"><input type="checkbox" class="p-on"' + (p.isActive ? ' checked' : '') + '> نشط</label>' +
        '<span class="p-code" title="كود الملاحظات الشخصية" dir="ltr">🔑 ' + escapeHtml(p.code || '----') + '</span>' +
        '<button class="mini" type="button" data-act="new-code" title="كود جديد">↻</button>' +
        '<button class="mini" type="button" data-act="save-person">حفظ</button>' +
        '<button class="mini danger" type="button" data-act="del-person">حذف</button></li>';
    }).join('');
    return '<article class="team-card" data-team="' + t.id + '">' +
      '<div class="team-head"><input type="text" class="t-name" value="' + escapeHtml(t.name) + '" maxlength="100">' +
      '<button class="mini" type="button" data-act="save-team">حفظ الاسم</button>' +
      '<button class="mini danger" type="button" data-act="del-team">حذف الفريق</button></div>' +
      '<ul class="people">' + (people || '<li class="muted">ما في متدربين</li>') + '</ul>' +
      '<div class="add-people"><textarea class="t-new" rows="2" placeholder="أسماء جديدة: كل اسم بسطر"></textarea>' +
      '<button class="btn" type="button" data-act="add-people">+ إضافة</button></div>' +
      '</article>';
  }).join('');
}

$('#team-form').addEventListener('submit', async function (e) {
  e.preventDefault();
  const input = $('#team-name');
  const name = input.value.trim();
  if (!name) return;
  try {
    await api('/api/admin/teams', 'POST', { name: name });
    input.value = '';
    await loadTeams();
    renderTeams();
  } catch (err) { alert('ما انضاف: ' + err.message); }
});

$('#teams').addEventListener('click', async function (e) {
  const btn = e.target.closest('[data-act]');
  if (!btn) return;
  const card = btn.closest('[data-team]');
  const teamId = Number(card.dataset.team);
  const person = btn.closest('[data-person]');
  btn.disabled = true;
  try {
    switch (btn.dataset.act) {
      case 'save-team':
        await api('/api/admin/teams/' + teamId, 'PUT', { name: card.querySelector('.t-name').value.trim() });
        break;
      case 'del-team':
        if (!confirm('حذف الفريق؟')) return;
        await api('/api/admin/teams/' + teamId, 'DELETE');
        break;
      case 'add-people': {
        const names = card.querySelector('.t-new').value.trim();
        if (!names) return;
        await api('/api/admin/trainees/bulk', 'POST', { teamId: teamId, names: names });
        break;
      }
      case 'save-person':
        await api('/api/admin/trainees/' + person.dataset.person, 'PUT', {
          fullName: person.querySelector('.p-name').value.trim(),
          teamId: Number(person.querySelector('.p-team').value),
          isActive: person.querySelector('.p-on').checked,
        });
        break;
      case 'new-code':
        if (!confirm('كود جديد؟ القديم بيوقف يشتغل.')) return;
        await api('/api/admin/trainees/' + person.dataset.person + '/code', 'POST');
        break;
      case 'del-person': {
        if (!confirm('حذف المتدرب؟ (إذا عنده تسليمات أو علامات بيتوقف بس، وما بينحذف تاريخه)')) return;
        const r = await apiJson('/api/admin/trainees/' + person.dataset.person, 'DELETE');
        if (r.deactivated) alert('عنده تسليمات أو علامات، فوقّفناه بدل ما نحذفه. ما رح يطلع بقائمة التسليم.');
        break;
      }
    }
    await loadTeams();
    renderTeams();
  } catch (err) {
    alert('ما زبط: ' + err.message);
  } finally {
    btn.disabled = false;
  }
});

// =====================================================================
// التحميل (Excel / ZIP / ملف)
// =====================================================================
async function download(path, fallbackName, button) {
  const original = button.innerHTML;
  button.disabled = true;
  button.textContent = 'عم يتحمّل...';
  try {
    const res = await api(path);
    const blob = await res.blob();
    const name = fileNameFrom(res.headers.get('Content-Disposition')) || fallbackName;
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = name;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(function () { URL.revokeObjectURL(url); }, 10000);
  } catch (err) {
    alert('ما قدرنا نحمّل الملف.');
  } finally {
    button.disabled = false;
    button.innerHTML = original;
  }
}

function fileNameFrom(header) {
  if (!header) return '';
  const star = /filename\*=UTF-8''([^;]+)/i.exec(header);
  if (star) return decodeURIComponent(star[1]);
  const plain = /filename="?([^";]+)"?/i.exec(header);
  return plain ? plain[1] : '';
}

$('#export-day').addEventListener('click', function () {
  download('/api/admin/export?day=' + currentDay, 'course-day' + currentDay + '.xlsx', this);
});
$('#export-all').addEventListener('click', function () {
  download('/api/admin/export', 'course-all.xlsx', this);
});
$('#zip-day').addEventListener('click', function () {
  download('/api/admin/files-zip?day=' + currentDay, 'files-day' + currentDay + '.zip', this);
});

// دخول تلقائي إذا المفتاح محفوظ بهالجلسة
const saved = getStoredKey();
if (saved) login(saved);

// =====================================================================
// 4) رسائل صفحة التواصل
// =====================================================================
const MSG_KIND = { question: 'سؤال تقني', absence: 'غياب أو تأخير', feedback: 'ملاحظة على الدورة', other: 'غير هيك' };
let messages = [];

async function loadMessages(badgeOnly) {
  try {
    messages = await apiJson('/api/admin/messages');
  } catch (err) {
    if (!badgeOnly) $('#messages').innerHTML = '<p class="warn">صار خطأ بالتحميل.</p>';
    return;
  }
  const fresh = messages.filter(function (m) { return m.status === 'new'; }).length;
  const badge = $('#msg-badge');
  badge.textContent = fresh;
  badge.hidden = fresh === 0;
  if (!badgeOnly) renderMessages();
}

// رقم أردني 07XXXXXXXX → 9627XXXXXXXX عشان رابط الواتساب
function waNumber(phone) {
  let p = String(phone || '').replace(/[^\d]/g, '');
  if (p.indexOf('00') === 0) p = p.slice(2);
  if (p.indexOf('0') === 0) p = '962' + p.slice(1);
  return p;
}

function renderMessages() {
  const filter = $('#msg-filter').value;
  const list = messages.filter(function (m) { return filter === 'all' || m.status === filter; });
  if (!list.length) {
    $('#messages').innerHTML = '<p class="muted">ما في رسائل.</p>';
    return;
  }
  $('#messages').innerHTML = list.map(function (m) {
    const who = m.isAnonymous ? '<span class="muted">بدون اسم</span>' : escapeHtml(m.name) + (m.teamName ? ' · ' + escapeHtml(m.teamName) : '');
    const first = m.isAnonymous ? '' : String(m.name || '').split(' ')[0];
    const waText = encodeURIComponent('أهلاً ' + first + '، معك حسام مدرب الدورة. بخصوص رسالتك: «' + m.message.slice(0, 80) + (m.message.length > 80 ? '...' : '') + '»\n');
    const wa = m.phone ? '<a class="mini wa" href="https://wa.me/' + waNumber(m.phone) + '?text=' + waText + '" target="_blank" rel="noopener" data-wa="' + m.id + '">رد عالواتساب</a>' : '';
    return '<article class="msg ' + m.status + '" data-msg="' + m.id + '">' +
      '<div class="msg-head"><span class="msg-kind ' + m.kind + '">' + MSG_KIND[m.kind] + '</span> <b>' + who + '</b>' +
      (m.phone ? ' · <span dir="ltr">' + escapeHtml(m.phone) + '</span>' : '') +
      ' · <span dir="ltr" class="muted">' + fmtTime(m.createdAt) + '</span>' +
      (m.status === 'new' ? ' <span class="fb-st new">جديدة</span>' : ' <span class="fb-st ok">✓ تم الرد</span>') + '</div>' +
      '<div class="msg-text">' + escapeHtml(m.message) + '</div>' +
      '<div class="msg-foot"><input type="text" class="msg-note" maxlength="1000" placeholder="ملاحظة إلك بس..." value="' + escapeHtml(m.adminNote || '') + '">' +
      wa +
      '<button type="button" class="mini" data-msg-status="' + (m.status === 'new' ? 'replied' : 'new') + '">' + (m.status === 'new' ? '✓ تم الرد' : 'رجّعها جديدة') + '</button>' +
      '<button type="button" class="mini danger" data-msg-del>حذف</button></div></article>';
  }).join('');
}

$('#msg-filter').addEventListener('change', renderMessages);

$('#messages').addEventListener('click', async function (e) {
  const card = e.target.closest('[data-msg]');
  if (!card) return;
  const id = card.dataset.msg;
  try {
    if (e.target.closest('[data-wa]')) {
      // فتحنا الواتساب: نعلّمها «تم الرد» تلقائياً
      await api('/api/admin/messages/' + id, 'PUT', { status: 'replied' });
      return loadMessages();
    }
    const status = e.target.closest('[data-msg-status]');
    if (status) {
      await api('/api/admin/messages/' + id, 'PUT', { status: status.dataset.msgStatus });
      return loadMessages();
    }
    if (e.target.closest('[data-msg-del]')) {
      if (!confirm('حذف الرسالة؟')) return;
      await api('/api/admin/messages/' + id, 'DELETE');
      return loadMessages();
    }
  } catch (err) { alert('ما زبط: ' + err.message); }
});

// الملاحظة الداخلية بتنحفظ لما تطلع من الخانة
$('#messages').addEventListener('change', async function (e) {
  if (!e.target.classList.contains('msg-note')) return;
  const id = e.target.closest('[data-msg]').dataset.msg;
  try {
    await api('/api/admin/messages/' + id, 'PUT', { adminNote: e.target.value });
    e.target.classList.add('saved-ok');
  } catch (err) { alert('ما انحفظت الملاحظة.'); }
});

// ---------- طباعة لافتات الفرق (من بيانات النظام مباشرة) ----------
// كل فريق بورقة A4: النص الفوقاني مقلوب، فلما تنطوي الورقة وتوقف عالطاولة بينقرا الاسم من الجهتين.
$('#print-tents').addEventListener('click', async function () {
  try {
    await loadTeams();
    const list = teams.map(function (t) {
      return { name: t.name, members: t.trainees.filter(function (p) { return p.isActive; }).map(function (p) { return p.fullName; }) };
    }).filter(function (t) { return t.members.length > 0; });
    if (!list.length) { alert('ما في فرق فيها متدربين.'); return; }

    const face = function (t) {
      return '<div class="face"><div class="kicker">دورة تطوير المواقع بمساعدة الذكاء الاصطناعي</div>' +
        '<div class="team" dir="auto">' + escapeHtml(t.name) + '</div><ul class="members">' +
        t.members.map(function (m) { return '<li>' + escapeHtml(m) + '</li>'; }).join('') + '</ul></div>';
    };
    const pages = list.map(function (t) {
      return '<section class="page"><div class="half top">' + face(t) + '</div><div class="fold"></div><div class="half">' + face(t) + '</div></section>';
    }).join('');

    const w = window.open('', '_blank');
    w.document.write('<!DOCTYPE html><html lang="ar" dir="rtl"><head><meta charset="UTF-8"><title>لافتات الفرق</title>' +
      '<link href="https://fonts.googleapis.com/css2?family=Cairo:wght@800&family=Tajawal:wght@700&display=swap" rel="stylesheet"><style>' +
      '@page{size:A4 portrait;margin:0}*{box-sizing:border-box}body{margin:0;font-family:Tajawal,Tahoma,sans-serif;color:#13293D}' +
      '.page{width:210mm;height:297mm;display:flex;flex-direction:column;page-break-after:always;overflow:hidden}' +
      '.half{height:148.5mm;display:flex;align-items:center;justify-content:center;padding:12mm 14mm}.top{transform:rotate(180deg)}' +
      '.fold{height:0;border-top:1px dashed #9AA8B5}' +
      '.face{width:100%;height:100%;border:3px solid #13293D;border-radius:10mm;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:8mm;position:relative;overflow:hidden}' +
      '.face::before{content:"";position:absolute;inset:0 0 auto 0;height:9mm;background:#B8571A;-webkit-print-color-adjust:exact;print-color-adjust:exact}' +
      '.kicker{font-size:13pt;color:#5B6B7A;font-weight:700;margin-top:6mm}' +
      '.team{font-family:Cairo,Tahoma,sans-serif;font-weight:800;font-size:68pt;line-height:1.15;text-align:center}' +
      '.members{list-style:none;margin:0;padding:0;display:flex;gap:7mm;flex-wrap:wrap;justify-content:center}' +
      '.members li{font-size:28pt;font-weight:700;background:#FFF1E3;color:#8A3F10;border-radius:999px;padding:2mm 8mm;-webkit-print-color-adjust:exact;print-color-adjust:exact}' +
      '</style></head><body>' + pages +
      '<script>document.fonts.ready.then(function(){setTimeout(function(){window.print()},300)})<\/script></body></html>');
    w.document.close();
  } catch (err) { alert('ما قدرنا نجيب الفرق.'); }
});

// =====================================================================
// تعديل تسليم: اليوم، الإجابات، الملفات
// =====================================================================
const editDialog = $('#edit-dialog');
let editRow = null;

function dayOptions(selectedDay) {
  let html = '';
  for (let d = 1; d <= 5; d++) html += '<option value="' + d + '"' + (d === selectedDay ? ' selected' : '') + '>اليوم ' + d + '</option>';
  return html;
}

function answerField(key, value) {
  return '<div class="ans-field"><div class="ans-head"><input type="text" class="ans-key" value="' + escapeHtml(key) + '" maxlength="100" aria-label="اسم الحقل">' +
    '<button type="button" class="mini danger" data-ans-del>حذف الحقل</button></div>' +
    '<textarea class="ans-val" rows="' + Math.min(12, Math.max(2, String(value || '').split('\n').length + 1)) + '" dir="auto">' + escapeHtml(value) + '</textarea></div>';
}

function openEdit(id) {
  editRow = currentRows.find(function (r) { return r.id === id; });
  if (!editRow) return;
  $('#edit-title').textContent = 'تعديل التسليم رقم ' + id + ' · ' + editRow.fullName;
  $('#edit-day').innerHTML = dayOptions(editRow.day || currentDay);
  $('#edit-answers').innerHTML = Object.entries(editRow.answers).map(function (p) { return answerField(p[0], p[1]); }).join('');
  $('#edit-files').innerHTML = editRow.files.map(function (f) {
    return '<label class="pick-item"><input type="checkbox" class="keep-file" value="' + f.id + '" checked> ' + escapeHtml(f.originalName) +
      ' <small class="muted">(شيل العلامة = يروح للمحذوفات)</small></label>';
  }).join('') || '<p class="muted">ما في ملفات.</p>';
  $('#edit-newfiles').value = '';
  $('#edit-newkey').value = '';
  $('#edit-error').textContent = '';
  editDialog.showModal();
}

$('#edit-addkey').addEventListener('click', function () {
  const key = $('#edit-newkey').value.trim();
  if (!key) return;
  $('#edit-answers').insertAdjacentHTML('beforeend', answerField(key, ''));
  $('#edit-newkey').value = '';
});

$('#edit-answers').addEventListener('click', function (e) {
  if (e.target.closest('[data-ans-del]')) e.target.closest('.ans-field').remove();
});

$('#edit-form').addEventListener('submit', async function (e) {
  if (e.submitter && e.submitter.value === 'cancel') return;
  e.preventDefault();
  const error = $('#edit-error');
  const answers = {};
  for (const f of document.querySelectorAll('#edit-answers .ans-field')) {
    const key = f.querySelector('.ans-key').value.trim();
    if (!key) continue;
    if (Object.prototype.hasOwnProperty.call(answers, key)) { error.textContent = 'في حقلين بنفس الاسم: ' + key; return; }
    answers[key] = f.querySelector('.ans-val').value;
  }
  const newFiles = $('#edit-newfiles').files;
  if (newFiles.length > 3) { error.textContent = 'لحد 3 ملفات بالمرة.'; return; }

  const btn = $('#edit-save');
  btn.disabled = true;
  btn.textContent = 'عم يحفظ...';
  try {
    await api('/api/admin/submissions/' + editRow.id, 'PUT', { day: Number($('#edit-day').value), answers: answers });
    for (const box of document.querySelectorAll('#edit-files .keep-file')) {
      if (!box.checked) await api('/api/admin/files/' + box.value, 'DELETE');
    }
    if (newFiles.length) {
      const data = new FormData();
      Array.from(newFiles).forEach(function (f, i) { data.append('adminFile' + (i + 1), f, f.name); });
      await api('/api/admin/submissions/' + editRow.id + '/files', 'POST', data);
    }
    editDialog.close();
    await reloadSummary();
    loadDay();
  } catch (err) {
    error.textContent = err.message;
  } finally {
    btn.disabled = false;
    btn.textContent = 'حفظ';
  }
});

// =====================================================================
// دمج التسليمات المكررة
// =====================================================================
const mergeDialog = $('#merge-dialog');

function updateMergeBar() {
  const bar = $('#merge-bar');
  bar.hidden = selected.size < 2;
  $('#merge-count').textContent = 'محدد ' + selected.size + ' تسليمات';
}

rowsBox.addEventListener('change', function (e) {
  const box = e.target.closest('[data-sel]');
  if (!box) return;
  const id = Number(box.dataset.sel);
  if (box.checked) selected.add(id); else selected.delete(id);
  box.closest('tr').classList.toggle('selected', box.checked);
  updateMergeBar();
});

$('#merge-clear').addEventListener('click', function () {
  selected.clear();
  renderRows();
  updateMergeBar();
});

let mergeRows = [];

$('#merge-open').addEventListener('click', function () {
  mergeRows = currentRows.filter(function (r) { return selected.has(r.id); })
    .sort(function (a, b) { return new Date(a.createdAt) - new Date(b.createdAt); });
  if (mergeRows.length < 2) return;

  $('#merge-title').textContent = 'دمج ' + mergeRows.length + ' تسليمات: #' + mergeRows.map(function (r) { return r.id; }).join(' #');
  $('#merge-target').innerHTML = mergeRows.map(function (r) {
    return '<option value="' + r.id + '">#' + r.id + ' (' + fmtTime(r.createdAt) + ')</option>';
  }).join('');
  $('#merge-day').innerHTML = dayOptions(currentDay);

  // كل الحقول من كل التسليمات
  const keys = [];
  mergeRows.forEach(function (r) { Object.keys(r.answers).forEach(function (k) { if (keys.indexOf(k) < 0) keys.push(k); }); });

  $('#merge-fields').innerHTML = keys.map(function (key, ki) {
    // القيم المختلفة (بدون تكرار)، والافتراضي: آخر قيمة مش فاضية
    const options = [];
    mergeRows.forEach(function (r) {
      const v = (r.answers[key] || '').trim();
      if (v && !options.some(function (o) { return o.value === v; })) options.push({ value: v, from: r.id });
    });
    const chosen = options.length ? options[options.length - 1].value : '';
    const radios = options.map(function (o, i) {
      return '<label class="merge-opt"><input type="radio" name="mf' + ki + '" value="' + i + '"' + (i === options.length - 1 ? ' checked' : '') + '>' +
        '<span class="merge-from">من #' + o.from + '</span><span class="merge-val">' + escapeHtml(o.value.length > 220 ? o.value.slice(0, 220) + '…' : o.value) + '</span></label>';
    }).join('') + '<label class="merge-opt"><input type="radio" name="mf' + ki + '" value="empty"' + (options.length ? '' : ' checked') + '><span class="merge-val muted">فاضي</span></label>';
    return '<fieldset class="merge-field" data-ki="' + ki + '"><legend>' + escapeHtml(key) +
      (options.length > 1 ? ' <span class="warn">(' + options.length + ' قيم مختلفة)</span>' : '') + '</legend>' + radios +
      '<textarea class="merge-final" rows="' + Math.min(8, Math.max(2, chosen.split('\n').length + 1)) + '" dir="auto" aria-label="القيمة النهائية">' + escapeHtml(chosen) + '</textarea></fieldset>';
  }).join('');
  $('#merge-fields').__keys = keys;
  // نحفظ القيم الكاملة للخيارات (مش المقصوصة)
  $('#merge-fields').__options = keys.map(function (key) {
    const options = [];
    mergeRows.forEach(function (r) {
      const v = (r.answers[key] || '').trim();
      if (v && options.indexOf(v) < 0) options.push(v);
    });
    return options;
  });

  $('#merge-files').innerHTML = mergeRows.map(function (r) {
    return r.files.map(function (f) {
      return '<label class="pick-item"><input type="checkbox" class="merge-keep" value="' + f.id + '" checked> ' + escapeHtml(f.originalName) + ' <small class="muted">(من #' + r.id + ')</small></label>';
    }).join('');
  }).join('') || '<p class="muted">ما في ملفات.</p>';

  const people = [];
  mergeRows.forEach(function (r) { r.trainees.forEach(function (t) { if (people.indexOf(t.fullName) < 0) people.push(t.fullName); }); });
  $('#merge-people').textContent = people.length ? 'التسليم بيضل مربوط بـ: ' + people.join('، ') + '. والملاحظات اللي عليهم بتنتقل للتسليم المدموج.' : 'ولا تسليم مربوط بمتدرب.';
  $('#merge-error').textContent = '';
  mergeDialog.showModal();
});

// اختيار قيمة بيعبّي الخانة النهائية
$('#merge-fields').addEventListener('change', function (e) {
  if (e.target.type !== 'radio') return;
  const fs = e.target.closest('.merge-field');
  const options = $('#merge-fields').__options[Number(fs.dataset.ki)];
  fs.querySelector('.merge-final').value = e.target.value === 'empty' ? '' : options[Number(e.target.value)];
});

$('#merge-form').addEventListener('submit', async function (e) {
  if (e.submitter && e.submitter.value === 'cancel') return;
  e.preventDefault();
  const answers = {};
  const keys = $('#merge-fields').__keys;
  for (const fs of document.querySelectorAll('#merge-fields .merge-field')) answers[keys[Number(fs.dataset.ki)]] = fs.querySelector('.merge-final').value;
  const target = Number($('#merge-target').value);
  const keep = Array.from(document.querySelectorAll('#merge-files .merge-keep:checked')).map(function (b) { return Number(b.value); });
  const btn = $('#merge-save');
  btn.disabled = true;
  try {
    await api('/api/admin/merge', 'POST', {
      targetId: target,
      sourceIds: mergeRows.map(function (r) { return r.id; }).filter(function (id) { return id !== target; }),
      day: Number($('#merge-day').value),
      answers: answers,
      keepFileIds: keep,
    });
    mergeDialog.close();
    selected.clear();
    updateMergeBar();
    await reloadSummary();
    loadDay();
  } catch (err) {
    $('#merge-error').textContent = err.message;
  } finally {
    btn.disabled = false;
  }
});

// =====================================================================
// 5) المحذوفات
// =====================================================================
async function loadTrash() {
  const box = $('#trash');
  box.innerHTML = '<p class="muted">عم يتحمّل...</p>';
  try {
    const t = await apiJson('/api/admin/trash');
    const subs = t.submissions.map(function (s) {
      return '<li class="trash-item"><div><b>تسليم #' + s.id + '</b> · اليوم ' + s.day + ' · ' + escapeHtml(s.trainees.length ? s.trainees.join('، ') : s.fullName) +
        ' · ' + s.files + ' ملفات' + (s.mergedIntoId ? ' · <span class="chip">اندمج بـ #' + s.mergedIntoId + '</span>' : '') +
        ' <span class="muted" dir="ltr">' + fmtTime(s.deletedAt) + '</span></div>' +
        '<div><button type="button" class="mini" data-restore-sub="' + s.id + '">استرجاع</button>' +
        '<button type="button" class="mini danger" data-purge-sub="' + s.id + '">حذف نهائي</button></div></li>';
    }).join('');
    const files = t.files.map(function (f) {
      return '<li class="trash-item"><div><b>' + escapeHtml(f.originalName) + '</b> · من تسليم #' + f.submissionId + ' (اليوم ' + f.day + ' · ' + escapeHtml(f.who) + ')' +
        ' <span class="muted" dir="ltr">' + fmtTime(f.deletedAt) + '</span></div>' +
        '<div><button type="button" class="mini" data-restore-file="' + f.id + '">استرجاع</button>' +
        '<button type="button" class="mini danger" data-purge-file="' + f.id + '">حذف نهائي</button></div></li>';
    }).join('');
    box.innerHTML = '<h3>تسليمات (' + t.submissions.length + ')</h3>' + (subs ? '<ul class="trash-list">' + subs + '</ul>' : '<p class="muted">فاضي.</p>') +
      '<h3>ملفات (' + t.files.length + ')</h3>' + (files ? '<ul class="trash-list">' + files + '</ul>' : '<p class="muted">فاضي.</p>');
  } catch (err) {
    box.innerHTML = '<p class="warn">صار خطأ بالتحميل.</p>';
  }
}

$('#trash').addEventListener('click', async function (e) {
  const b = e.target.closest('button');
  if (!b) return;
  try {
    if (b.dataset.restoreSub) await api('/api/admin/trash/submissions/' + b.dataset.restoreSub + '/restore', 'POST');
    else if (b.dataset.restoreFile) await api('/api/admin/trash/files/' + b.dataset.restoreFile + '/restore', 'POST');
    else if (b.dataset.purgeSub) {
      if (!confirm('حذف نهائي للتسليم مع ملفاته وملاحظاته؟ ما في رجعة.')) return;
      await api('/api/admin/trash/submissions/' + b.dataset.purgeSub, 'DELETE');
    } else if (b.dataset.purgeFile) {
      if (!confirm('حذف نهائي للملف؟ ما في رجعة.')) return;
      await api('/api/admin/trash/files/' + b.dataset.purgeFile, 'DELETE');
    } else return;
    await reloadSummary();
    loadTrash();
  } catch (err) { alert('ما زبط: ' + err.message); }
});
