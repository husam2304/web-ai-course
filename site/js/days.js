// ===== ملفات الدورة: عرض يوم واحد بكل مرة =====
const dayLinks = document.querySelectorAll('.day-tab[data-day]');
const panels = document.querySelectorAll('.day-panel');

function showDay(day) {
  for (const p of panels) p.hidden = p.dataset.day !== String(day);
  for (const a of dayLinks) a.classList.toggle('active', a.dataset.day === String(day));
}

for (const a of dayLinks) {
  a.addEventListener('click', function (e) {
    e.preventDefault();
    showDay(a.dataset.day);
    history.replaceState(null, '', '#day' + a.dataset.day);
  });
}

// من الرابط (#day1 أو رابط قسم جوا يوم)، وإلا آخر يوم
function fromHash() {
  const hash = location.hash.slice(1);
  let day = '';
  const m = /^day(\d)$/.exec(hash);
  if (m) day = m[1];
  else if (hash) {
    const target = document.getElementById(hash);
    const panel = target && target.closest('.day-panel');
    if (panel) day = panel.dataset.day;
  }
  if (!day && dayLinks.length) day = dayLinks[dayLinks.length - 1].dataset.day;
  showDay(day);
  if (hash) { const t = document.getElementById(hash); if (t) setTimeout(function () { t.scrollIntoView(); }, 0); }
}
fromHash();
window.addEventListener('hashchange', fromHash);
