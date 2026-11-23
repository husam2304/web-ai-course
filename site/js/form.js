// ===== نموذج التواصل: فحص الحقول (validation) وإرسال الرسالة للباك إند =====
const API_URL = 'https://web-train.runasp.net';

const form = document.querySelector('#contact-form');
const successMsg = document.querySelector('#success-msg');
const formError = document.querySelector('#form-error');
const anonymous = document.querySelector('#anonymous');
const who = document.querySelector('#who');
const button = document.querySelector('#contact-btn');

// دالة بتعرض خطأ تحت الحقل
function showError(fieldId, message) {
  const input = document.querySelector('#' + fieldId);
  const error = document.querySelector('#' + fieldId + '-error');
  input.parentElement.classList.add('invalid');
  error.textContent = message;
}

// دالة بتمسح الخطأ
function clearError(fieldId) {
  const input = document.querySelector('#' + fieldId);
  const error = document.querySelector('#' + fieldId + '-error');
  input.parentElement.classList.remove('invalid');
  error.textContent = '';
}

// «بدون اسم»: نخبي الاسم والفريق والهاتف
anonymous.addEventListener('change', function () {
  who.hidden = anonymous.checked;
});

// قائمة الفرق (اختيارية: لو ما تحملت، الفورم بيشتغل عادي)
fetch(API_URL + '/api/teams')
  .then(function (res) { return res.ok ? res.json() : []; })
  .then(function (teams) {
    const select = document.querySelector('#team');
    for (const t of teams) {
      const option = document.createElement('option');
      option.value = t.name;
      option.textContent = t.name;
      select.appendChild(option);
    }
  })
  .catch(function () { /* ignore */ });

form.addEventListener('submit', async function (event) {
  // امنع الصفحة من إعادة التحميل
  event.preventDefault();
  successMsg.hidden = true;
  formError.hidden = true;

  const isAnonymous = anonymous.checked;
  const name = document.querySelector('#name').value.trim();
  const phone = document.querySelector('#phone').value.replace(/[\s-]/g, '');
  const message = document.querySelector('#message').value.trim();
  let isValid = true;

  // الاسم: حرفين على الأقل (إلا إذا بدون اسم)
  if (!isAnonymous && name.length < 2) {
    showError('name', 'اكتب اسمك (حرفين على الأقل)، أو اختار «بدون اسم»');
    isValid = false;
  } else {
    clearError('name');
  }

  // الهاتف: اختياري، بس إذا انكتب لازم يكون أرقام
  if (!isAnonymous && phone && !/^\+?\d{7,15}$/.test(phone)) {
    showError('phone', 'اكتب رقم صحيح، مثل 0791234567');
    isValid = false;
  } else {
    clearError('phone');
  }

  // الرسالة: 5 أحرف على الأقل
  if (message.length < 5) {
    showError('message', 'الرسالة قصيرة، اكتب أكثر شوي');
    isValid = false;
  } else {
    clearError('message');
  }

  if (!isValid) return;

  button.disabled = true;
  button.textContent = 'عم يبعت...';
  try {
    const res = await fetch(API_URL + '/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: name,
        phone: phone,
        teamName: document.querySelector('#team').value,
        kind: document.querySelector('#kind').value,
        message: message,
        anonymous: isAnonymous,
        website: document.querySelector('#website').value,
      }),
    });
    if (!res.ok) {
      let text = 'ما وصلت الرسالة، جرّب كمان مرة.';
      try { text = (await res.json()).error || text; } catch (e) { /* ignore */ }
      throw new Error(text);
    }
    successMsg.hidden = false;
    form.reset();
    who.hidden = false;
  } catch (err) {
    formError.textContent = err.message === 'Failed to fetch' ? 'ما قدرنا نوصل للسيرفر. جرّب كمان مرة أو تواصل عالواتساب.' : err.message;
    formError.hidden = false;
  } finally {
    button.disabled = false;
    button.textContent = 'إرسال';
  }
});
