// ===== ملفات الدورة: بطاقات بتضل مقفولة لحد ما المدرب يفتحها من لوحة المدرب =====
// القفل إخفاء بالصفحة بس (مش حماية). إذا السيرفر ما ردّ، بنفتح كل شي عشان الشرح ما يوقف.
(function () {
  const API_URL = 'https://web-train.runasp.net';
  const POLL_MS = 20000;
  const cards = document.querySelectorAll('[data-lock]');
  if (!cards.length) return;

  for (const card of cards) {
    const msg = document.createElement('p');
    msg.className = 'lock-msg';
    msg.textContent = '🔒 بتنفتح لما نوصلها بالشرح';
    card.querySelector('.lock-body').insertAdjacentElement('beforebegin', msg);
  }

  let first = true;
  function apply(openKeys) {
    for (const card of cards) {
      const open = openKeys === null || openKeys.indexOf(card.dataset.lock) !== -1;
      const wasLocked = card.classList.contains('is-locked');
      card.classList.toggle('is-locked', !open);
      if (open && wasLocked && !first) {
        card.classList.add('just-opened');
        setTimeout(function () { card.classList.remove('just-opened'); }, 4000);
      }
    }
    first = false;
  }

  async function check() {
    try {
      const res = await fetch(API_URL + '/api/unlocks', { cache: 'no-store' });
      if (!res.ok) throw new Error('http');
      apply(await res.json());
    } catch (e) {
      apply(null);
    }
  }

  check();
  setInterval(function () { if (!document.hidden) check(); }, POLL_MS);
  document.addEventListener('visibilitychange', function () { if (!document.hidden) check(); });
})();
