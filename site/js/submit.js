// ===== نموذج التسليم اليومي =====

// رابط الباك إند (بنحطه بعد رفعه على MonsterASP)
const API_URL = 'https://web-train.runasp.net';

const MAX_FILE_MB = 50; // لازم يطابق Limits.MaxFileMb بالباك إند
const ALLOWED = '.pdf,.doc,.docx,.jpg,.jpeg,.png,.webp,.zip';

// أسئلة كل يوم. لإضافة يوم جديد: أضف عنصر هون بنفس الشكل
const FORMS = {
  1: {
    title: 'تسليم اليوم الأول: تحليل الاحتياج وتخطيط المشروع',
    note: 'ما سلّمت امبارح، أو سلّمت بدون الجمهور والأهداف؟ سلّم هون عادي، وتسليمك القديم بيضل.',
    fields: [
      { id: 'teamId', label: 'فريقك', type: 'team', required: true },
      { id: 'traineeId', label: 'اسمك', type: 'trainee', required: true },
      { id: 'audience', key: 'الجمهور والأهداف', label: 'تقرير الجمهور والأهداف', hint: 'انسخه بزر النسخ تبع الـ AI والصقه هون، عشان يضل تنسيقه', type: 'textarea', rows: 10, required: false },
      { id: 'requirementsDoc', label: 'ملف البطاقة أو وثيقة المتطلبات', hint: 'اختياري. PDF أو Word أو صورة أو ZIP', type: 'file', required: false },
      { id: 'sitemap', label: 'صورة خريطة الموقع أو الرسم الأولي', hint: 'اختياري', type: 'file', required: false },
      { id: 'question', key: 'سؤال الفهم', label: 'سؤال الفهم: اختار سؤال واحد', type: 'radio', required: true,
        options: ['اشرح بكلماتك: شو الفرق بين HTML وCSS؟', 'ليش موقعنا ما بده Backend؟'] },
      { id: 'answer', key: 'الجواب', label: 'جوابك بكلماتك', type: 'textarea', required: true },
      { id: 'learned', key: 'أهم شي تعلمته', label: 'شو أهم شغلة تعلمتها؟', type: 'textarea', rows: 2, required: false }
    ]
  },
  2: {
    title: 'تسليم اليوم الثاني: تصميم الواجهة وتجربة المستخدم',
    note: 'شغل الفريق بيرفعه أي حد من الفريق، مرة وحدة بكفي. وكل واحد بيجاوب سؤال الفهم باسمه.',
    fields: [
      { id: 'teamId', label: 'فريقك', type: 'team', required: true },
      { id: 'traineeId', label: 'اسمك', type: 'trainee', required: true },
      { id: 'plan', key: 'خطة الفريق', label: 'خطة الفريق', hint: 'انسخها بزر النسخ تبع الـ AI والصقها هون. إذا زميلك سلّمها، اتركها فاضية', type: 'textarea', rows: 10, required: false },
      { id: 'wireframe', label: 'صور الـ wireframes', hint: 'صورة من الجوال. أكثر من صورة؟ اعملهم ZIP', type: 'file', required: false },
      { id: 'design', label: 'تصميم Stitch', hint: 'صور شاشة أو ZIP', type: 'file', required: false },
      { id: 'question', key: 'سؤال الفهم', label: 'سؤال الفهم: اختار سؤال واحد', type: 'radio', required: true,
        options: ['اشرح بكلماتك قاعدة 60-30-10', 'ليش التباين بين النص والخلفية مهم؟', 'شو الفرق بين UX و UI؟'] },
      { id: 'answer', key: 'الجواب', label: 'جوابك بكلماتك', hint: 'جملتين منك أحسن من فقرة منسوخة من الـ AI', type: 'textarea', required: true },
      { id: 'learned', key: 'أهم شي تعلمته', label: 'شو أهم شغلة تعلمتها اليوم؟', type: 'textarea', rows: 2, required: false },
      { id: 'extra', key: 'شغل إضافي', label: 'شغل إضافي (اختياري)', hint: 'عملت موقع جانبي أو اشتغلت لحالك زيادة عن شغل الفريق؟ احكي شو عملت، وحط رابط إذا في', type: 'textarea', rows: 4, required: false },
      { id: 'extraFile', label: 'ملف الشغل الإضافي', hint: 'اختياري. ZIP أو صور', type: 'file', required: false }
    ]
  },
  3: {
    title: 'تسليم اليوم الثالث: البناء بـ HTML و CSS و JavaScript',
    note: 'الـ zip بيرفعه أي حد من الفريق، مرة وحدة بكفي. وكل واحد بيجاوب سؤال الفهم باسمه. النسخة الاحتياطية كل ساعة؟ اختار «نسخة احتياطية» وارفع الـ zip بس.',
    fields: [
      { id: 'kind', key: 'نوع التسليم', label: 'شو بدك تسلّم؟', type: 'choice', required: true,
        options: ['التسليم النهائي (آخر اليوم)', 'نسخة احتياطية (كل ساعة)'], values: ['تسليم نهائي', 'نسخة احتياطية'] },
      { id: 'teamId', label: 'فريقك', type: 'team', required: true },
      { id: 'traineeId', label: 'اسمك', type: 'trainee', required: true },
      { id: 'siteZip', label: 'zip موقع الفريق (المجلد كامل)', hint: 'لحد ' + MAX_FILE_MB + 'MB. إذا زميلك رفعه، اتركه فاضي', type: 'file', required: false, requiredIf: { kind: 1 } },
      { id: 'answer', key: 'الجواب', label: 'سؤال الفهم: الصق function أو loop من كود فريقك (مش من مثال المدرب)، واشرح بكلماتك شو بيعمل سطر سطر.', below: 'مسموح تستعمل prompt 4 عشان تفهم، بس الجواب بكلماتك', type: 'textarea', rows: 12, required: true, showIf: { kind: 0 } },
      { id: 'extra', key: 'شغل إضافي', label: 'شغل إضافي (اختياري)', hint: 'عملت موقع جانبي أو اشتغلت لحالك زيادة عن شغل الفريق؟ احكي شو عملت، وحط رابط إذا في', type: 'textarea', rows: 4, required: false, showIf: { kind: 0 } },
      { id: 'extraFile', label: 'ملف الشغل الإضافي', hint: 'اختياري. ZIP أو صور', type: 'file', required: false, showIf: { kind: 0 } }
    ]
  },
  4: {
    title: 'تسليم اليوم الرابع: التجميع والفحص',
    note: 'الـ zip بيرفعه أي حد من الفريق، مرة وحدة بكفي. وكل واحد بيجاوب السؤال باسمه. النسخة الاحتياطية؟ اختار «نسخة احتياطية» وارفع الـ zip بس.',
    fields: [
      { id: 'kind', key: 'نوع التسليم', label: 'شو بدك تسلّم؟', type: 'choice', required: true,
        options: ['التسليم النهائي (آخر اليوم)', 'نسخة احتياطية'], values: ['تسليم نهائي', 'نسخة احتياطية'] },
      { id: 'teamId', label: 'فريقك', type: 'team', required: true },
      { id: 'traineeId', label: 'اسمك', type: 'trainee', required: true },
      { id: 'siteZip', label: 'zip الموقع بعد التجميع (مجلد واحد فيه index.html)', hint: 'لحد ' + MAX_FILE_MB + 'MB. إذا زميلك رفعه، اتركه فاضي', type: 'file', required: false, requiredIf: { kind: 1 } },
      { id: 'answer', key: 'الجواب', label: 'اختار ميزة JS من موقعكم، وورجيني فيها الخطوات الثلاث: وين مسكت العنصر، وأي حدث، وشو غيّرت.', below: 'الصق الأسطر من كودكم، وجنب كل سطر اكتب: امسك / استنى / غيّر. الـ hamburger مسموح.', type: 'textarea', rows: 12, required: true, showIf: { kind: 0 } },
      { id: 'extra', key: 'شغل إضافي', label: 'شغل إضافي (اختياري)', hint: 'عملت موقع جانبي أو اشتغلت لحالك زيادة عن شغل الفريق؟ احكي شو عملت، وحط رابط إذا في', type: 'textarea', rows: 4, required: false, showIf: { kind: 0 } },
      { id: 'extraFile', label: 'ملف الشغل الإضافي', hint: 'اختياري. ZIP أو صور', type: 'file', required: false, showIf: { kind: 0 } }
    ]
  }
};

const form = document.querySelector('#submit-form');
const fieldsBox = document.querySelector('#form-fields');
const title = document.querySelector('#form-title');
const msg = document.querySelector('#form-msg');
const submitBtn = document.querySelector('#submit-btn');
const progress = document.querySelector('#progress');
const progressBar = document.querySelector('#progress-bar');
const tabs = document.querySelector('#day-tabs');

let currentDay = 1;
let teams = [];        // [{id, name, trainees:[{id, fullName}]}] من الباك إند
let teamsLoaded = false;

// ---------- تبويبات الأيام ----------
for (let day = 1; day <= 5; day++) {
  const tab = document.createElement(FORMS[day] ? 'button' : 'span');
  tab.className = 'day-tab' + (FORMS[day] ? '' : ' soon');
  tab.textContent = FORMS[day] ? 'اليوم ' + day : 'اليوم ' + day + ' · قريباً';
  if (FORMS[day]) {
    tab.type = 'button';
    tab.addEventListener('click', function () { renderForm(day); });
  }
  tab.dataset.day = day;
  tabs.appendChild(tab);
}

// ---------- بناء النموذج من الأسئلة ----------
function renderForm(day) {
  currentDay = day;
  const config = FORMS[day];
  title.textContent = config.title;
  let noteBox = document.querySelector('#form-note');
  if (!noteBox) {
    noteBox = document.createElement('p');
    noteBox.id = 'form-note';
    noteBox.className = 'form-note';
    title.insertAdjacentElement('afterend', noteBox);
  }
  noteBox.textContent = config.note || '';
  noteBox.hidden = !config.note;
  fieldsBox.innerHTML = '';
  hideMessage();

  for (const tab of tabs.children) {
    tab.classList.toggle('active', Number(tab.dataset.day) === day);
  }

  for (const field of config.fields) {
    const wrap = document.createElement('div');
    wrap.className = 'form-field';
    wrap.dataset.field = field.id;

    const star = field.required ? ' <span class="req">*</span>' : '';
    const hint = field.hint ? ' <span class="hint">(' + field.hint + ')</span>' : '';

    if (field.type === 'team' && !teamsLoaded) {
      // القائمة ما تحمّلت: نرجع للكتابة اليدوية عشان التسليم ما يوقف
      wrap.innerHTML = '<label for="fullName">الاسم الكامل' + star + '</label><input type="text" id="fullName">' +
        '<label for="teamNumber" style="margin-top:12px">اسم الفريق' + star + '</label><input type="text" id="teamNumber">';
    } else if (field.type === 'trainee' && !teamsLoaded) {
      continue;
    } else if (field.type === 'team') {
      const options = teams.map(function (t) { return '<option value="' + t.id + '">' + escapeHtml(t.name) + '</option>'; }).join('');
      wrap.innerHTML = '<label for="teamId">' + field.label + star + '</label><select id="teamId"><option value="">اختار الفريق</option>' + options + '</select>';
    } else if (field.type === 'trainee') {
      wrap.innerHTML = '<label for="traineeId">' + field.label + star + '</label><select id="traineeId" disabled><option value="">اختار الفريق أول</option></select>' +
        '<p class="hint">اسمك مش موجود؟ احكي مع المدرب.</p>';
    } else if (field.type === 'choice') {
      let html = '<p class="label">' + field.label + star + '</p><div class="choice">';
      field.options.forEach(function (option, i) {
        html += '<label class="radio"><input type="radio" name="' + field.id + '" value="' + i + '"' + (i === 0 ? ' checked' : '') + '> ' + option + '</label>';
      });
      wrap.innerHTML = html + '</div>';
    } else if (field.type === 'radio') {
      let html = '<p class="label">' + field.label + star + '</p>';
      field.options.forEach(function (option, i) {
        html += '<label class="radio"><input type="radio" name="' + field.id + '" value="' + i + '"> ' + option + '</label>';
      });
      wrap.innerHTML = html;
    } else {
      let input;
      if (field.type === 'textarea') {
        input = '<textarea id="' + field.id + '" rows="' + (field.rows || 4) + '" dir="auto"></textarea>';
      } else if (field.type === 'file') {
        input = '<input type="file" id="' + field.id + '" accept="' + ALLOWED + '">';
      } else {
        input = '<input type="text" id="' + field.id + '"' + (field.inputmode ? ' inputmode="' + field.inputmode + '"' : '') + '>';
      }
      wrap.innerHTML = '<label for="' + field.id + '">' + field.label + star + hint + '</label>' + input +
        (field.below ? '<p class="hint">' + field.below + '</p>' : '');
    }

    const error = document.createElement('p');
    error.className = 'error-msg';
    wrap.appendChild(error);
    fieldsBox.appendChild(wrap);
  }

  // لما يختار الفريق: نعبّي قائمة الأسماء
  const teamSelect = fieldsBox.querySelector('#teamId');
  if (teamSelect) teamSelect.addEventListener('change', fillTrainees);

  // خيار (نهائي / احتياطي) بيخفي ويظهر حقول
  fieldsBox.querySelectorAll('.choice input').forEach(function (input) {
    input.addEventListener('change', applyChoices);
  });
  applyChoices();
}

// قيمة خيار (رقم الخيار المختار)
function choiceIndex(fieldId) {
  const checked = form.querySelector('input[name="' + fieldId + '"]:checked');
  return checked ? Number(checked.value) : 0;
}

function matches(cond) {
  return Object.keys(cond).every(function (k) { return choiceIndex(k) === cond[k]; });
}

function isShown(field) { return !field.showIf || matches(field.showIf); }
function isRequired(field) { return field.required || (field.requiredIf ? matches(field.requiredIf) : false); }

function applyChoices() {
  const config = FORMS[currentDay];
  for (const field of config.fields) {
    const wrap = fieldsBox.querySelector('[data-field="' + field.id + '"]');
    if (!wrap) continue;
    wrap.hidden = !isShown(field);
    const label = wrap.querySelector('label[for="' + field.id + '"]');
    if (field.requiredIf && label) {
      let star = label.querySelector('.req');
      if (isRequired(field) && !star) label.insertAdjacentHTML('beforeend', ' <span class="req">*</span>');
      if (!isRequired(field) && star) star.remove();
    }
    if (wrap.hidden) setError(field.id, '');
  }
}

// شارة: في ملاحظات من المدرب على الفريق؟
async function showFeedbackBadge(teamId) {
  let badge = document.querySelector('#fb-badge');
  if (!badge) {
    badge = document.createElement('a');
    badge.id = 'fb-badge';
    badge.className = 'fb-badge';
    badge.href = 'team-files.html';
    form.insertAdjacentElement('beforebegin', badge);
  }
  badge.hidden = true;
  if (!teamId) return;
  try {
    const res = await fetch(API_URL + '/api/teams/' + teamId + '/feedback/count');
    if (!res.ok) return;
    const c = await res.json();
    if (!c.total) return;
    try { localStorage.setItem('myTeam', teamId); } catch (e) { /* ignore */ }
    badge.textContent = c.isNew
      ? '📝 في ' + c.isNew + ' ملاحظة جديدة من المدرب على فريقك. شوفها من هون'
      : '📝 ملاحظات المدرب على فريقك: ' + c.open + ' لسا بدها تعديل. شوفها من هون';
    badge.classList.toggle('is-new', c.isNew > 0);
    badge.hidden = c.isNew === 0 && c.open === 0;
  } catch (e) { /* ignore */ }
}

function fillTrainees() {
  const teamSelect = fieldsBox.querySelector('#teamId');
  showFeedbackBadge(teamSelect.value);
  const nameSelect = fieldsBox.querySelector('#traineeId');
  const team = teams.find(function (t) { return String(t.id) === teamSelect.value; });
  if (!team) {
    nameSelect.innerHTML = '<option value="">اختار الفريق أول</option>';
    nameSelect.disabled = true;
    return;
  }
  nameSelect.innerHTML = '<option value="">اختار اسمك</option>' + team.trainees.map(function (p) {
    return '<option value="' + p.id + '">' + escapeHtml(p.fullName) + '</option>';
  }).join('');
  nameSelect.disabled = false;
}

function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text == null ? '' : String(text);
  return div.innerHTML;
}

// ---------- الفحص ----------
function setError(fieldId, text) {
  const wrap = fieldsBox.querySelector('[data-field="' + fieldId + '"]');
  wrap.classList.toggle('invalid', text !== '');
  wrap.querySelector('.error-msg').textContent = text;
}

function validate(config) {
  let ok = true;
  for (const field of config.fields) {
    let error = '';
    if (!isShown(field) || field.type === 'choice') continue;
    if (field.type === 'team' && !teamsLoaded) {
      const name = document.querySelector('#fullName').value.trim();
      const team = document.querySelector('#teamNumber').value.trim();
      if (name.length < 2) error = 'اكتب اسمك.';
      else if (team.length < 1) error = 'اكتب اسم الفريق.';
    } else if (field.type === 'trainee' && !teamsLoaded) {
      continue;
    } else if (field.type === 'team') {
      if (!document.querySelector('#teamId').value) error = 'اختار فريقك.';
    } else if (field.type === 'trainee') {
      if (!document.querySelector('#traineeId').value) error = 'اختار اسمك.';
    } else if (field.type === 'radio') {
      if (field.required && !form.querySelector('input[name="' + field.id + '"]:checked')) error = 'اختار سؤال.';
    } else if (field.type === 'file') {
      const file = document.querySelector('#' + field.id).files[0];
      if (isRequired(field) && !file) error = 'ارفع الملف.';
      else if (file && file.size > MAX_FILE_MB * 1024 * 1024) error = 'الملف أكبر من ' + MAX_FILE_MB + 'MB.';
    } else {
      const value = document.querySelector('#' + field.id).value.trim();
      if (field.required && value.length < 2) error = 'هاد الحقل مطلوب.';
    }
    setError(field.id, error);
    if (error) ok = false;
  }
  return ok;
}

// ---------- الإرسال ----------
form.addEventListener('submit', function (event) {
  event.preventDefault();
  const config = FORMS[currentDay];
  if (!validate(config)) {
    showMessage('في حقول ناقصة، شوف الملاحظات بالأحمر.', 'error');
    return;
  }

  const data = new FormData();
  const answers = {};
  data.append('day', currentDay);
  data.append('website', form.querySelector('input[name="website"]').value);

  for (const field of config.fields) {
    if (!isShown(field)) continue;
    if (field.type === 'choice') {
      answers[field.key] = field.values[choiceIndex(field.id)];
    } else if (field.type === 'team' && !teamsLoaded) {
      data.append('fullName', document.querySelector('#fullName').value.trim());
      data.append('teamNumber', document.querySelector('#teamNumber').value.trim());
    } else if (field.type === 'trainee') {
      if (teamsLoaded) data.append('traineeId', document.querySelector('#traineeId').value);
    } else if (field.type === 'team') {
      // الفريق بيتحدد من المتدرب بالباك إند
    } else if (field.type === 'file') {
      const file = document.querySelector('#' + field.id).files[0];
      if (file) data.append(field.id, file, file.name);
    } else if (field.type === 'radio') {
      const checked = form.querySelector('input[name="' + field.id + '"]:checked');
      answers[field.key || field.label] = checked ? field.options[Number(checked.value)] : '';
    } else {
      answers[field.key || field.label] = document.querySelector('#' + field.id).value.trim();
    }
  }
  data.append('answers', JSON.stringify(answers));

  send(data);
});

// XMLHttpRequest بدل fetch عشان نعرض نسبة رفع الملفات
function send(data) {
  submitBtn.disabled = true;
  submitBtn.textContent = 'عم يتم الإرسال...';
  progress.hidden = false;
  progressBar.style.width = '0%';
  hideMessage();

  const xhr = new XMLHttpRequest();
  xhr.open('POST', API_URL + '/api/submissions');

  xhr.upload.addEventListener('progress', function (e) {
    if (e.lengthComputable) progressBar.style.width = Math.round((e.loaded / e.total) * 100) + '%';
  });

  xhr.addEventListener('load', function () {
    let body = {};
    try { body = JSON.parse(xhr.responseText); } catch (err) { /* ignore */ }
    if (xhr.status >= 200 && xhr.status < 300) {
      // نخلّي الفريق والاسم مختارين عشان لو بدهم يسلّموا كمان مرة
      const keepTeam = fieldsBox.querySelector('#teamId') ? fieldsBox.querySelector('#teamId').value : '';
      const keepName = fieldsBox.querySelector('#traineeId') ? fieldsBox.querySelector('#traineeId').value : '';
      const keepBackup = !!form.querySelector('input[name="kind"][value="1"]:checked');
      renderForm(currentDay);
      if (keepBackup) selectBackup();
      if (keepTeam) {
        fieldsBox.querySelector('#teamId').value = keepTeam;
        fillTrainees();
        fieldsBox.querySelector('#traineeId').value = keepName;
      }
      showMessage('تم التسليم بنجاح ✓ رقم التسليم: ' + body.id, 'success');
    } else if (xhr.status === 429) {
      showMessage('طلبات كتير بنفس الوقت، استنى دقيقة وجرّب كمان مرة.', 'error');
    } else {
      showMessage(body.error || 'صار خطأ، جرّب كمان مرة.', 'error');
    }
    done();
  });

  xhr.addEventListener('error', function () {
    showMessage('ما قدرنا نوصل للسيرفر. تأكد من الإنترنت وجرّب كمان مرة.', 'error');
    done();
  });

  xhr.send(data);
}

function done() {
  submitBtn.disabled = false;
  submitBtn.textContent = 'تسليم';
  progress.hidden = true;
}

function showMessage(text, type) {
  msg.textContent = text;
  msg.className = 'form-msg ' + type;
  msg.hidden = false;
  msg.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

function hideMessage() {
  msg.hidden = true;
}

// ---------- تحميل الفرق ثم عرض النموذج ----------
async function start() {
  title.textContent = 'عم يتحمّل...';
  try {
    const res = await fetch(API_URL + '/api/teams');
    if (!res.ok) throw new Error('http');
    teams = (await res.json()).filter(function (t) { return t.trainees.length > 0; });
    teamsLoaded = teams.length > 0;
  } catch (err) {
    teamsLoaded = false;
  }
  // نفتح آخر يوم إله فورم. submit.html#backup بيفتح النسخة الاحتياطية مباشرة
  renderForm(Math.max.apply(null, Object.keys(FORMS).map(Number)));
  if (location.hash === '#backup') selectBackup();
}

window.addEventListener('hashchange', function () {
  if (location.hash !== '#backup') return;
  const last = Math.max.apply(null, Object.keys(FORMS).map(Number));
  if (currentDay !== last) renderForm(last);
  selectBackup();
});

function selectBackup() {
  const input = form.querySelector('input[name="kind"][value="1"]');
  if (!input) return;
  input.checked = true;
  applyChoices();
}

start();
