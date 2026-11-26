// ===== المشاريع: فريق فريق، من الباك إند =====
// الرابط وبطاقة كل فريق بيعبّيهم المدرب من لوحة المدرب، وهون بس بنعرضهم.
const API_URL = 'https://web-train.runasp.net';

// اسم المشروع ونوعه لكل فريق (من خطط الفرق)
// type لازم يكون واحد من: store, restaurant, portfolio, services, education
const PROJECTS = {
  'ai': { name: 'CAFFEON', type: 'restaurant', typeLabel: 'مطعم وكافيه' },
  'it team': { name: 'منيو مطعم إيطالي', type: 'restaurant', typeLabel: 'مطعم وكافيه' },
  'dsa': { name: 'NOVA', type: 'portfolio', typeLabel: 'أعمال المبدعين' },
  'تكنولوجيا': { name: 'نقطة AI', type: 'education', typeLabel: 'تعليمي' },
  'آفاق': { name: 'آفاق', type: 'education', typeLabel: 'تعليمي' },
  'the sun': { name: 'وازن', type: 'services', typeLabel: 'خدمات' }
};

const grid = document.querySelector('#projects-grid');
const emptyMsg = document.querySelector('#empty-msg');
const filterButtons = document.querySelectorAll('.filter-btn');
const filterBar = document.querySelector('#filter-bar');
const comingSoon = document.querySelector('#coming-soon');

function esc(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

// «تكنولوجيا / Technology» أو «DSA (كان فريق 1)» بيلاقوا مشروعهم من أول كلمة معروفة
function projectFor(teamName) {
  const name = teamName.toLowerCase().trim();
  for (const key in PROJECTS) {
    if (name === key || name.startsWith(key + ' ') || name.startsWith(key + '/') || name.startsWith(key + '(')) return PROJECTS[key];
  }
  return { name: teamName, type: 'services', typeLabel: 'مشروع' };
}

function safeUrl(url) {
  return /^https?:\/\//i.test(url || '') ? url : '';
}

function renderTeam(team) {
  const project = projectFor(team.name);
  const link = safeUrl(team.projectUrl);
  const block = document.createElement('section');
  block.className = 'team-block';
  block.dataset.type = project.type;

  let bottom = '<span class="badge-soon">قريباً</span>';
  if (link) bottom = '<a class="project-link" href="' + esc(link) + '" target="_blank" rel="noopener">زيارة الموقع ←</a>';

  let html =
    '<article class="project-card">' +
      '<span class="project-type">' + esc(project.typeLabel) + '</span>' +
      '<h3>' + esc(project.name) + '</h3>' +
      '<p class="project-team">فريق ' + esc(team.name) + '</p>' +
      bottom +
    '</article>';

  // بطاقة الفريق: زي ما هي، جوا إطار معزول (sandbox)
  if (team.hasCard) {
    const mine = link
      ? '<a class="btn member-project" href="' + esc(link) + '" target="_blank" rel="noopener">مشروعنا ←</a>'
      : '<span class="badge-soon">مشروعنا: قريباً</span>';
    html += '<div class="member-cards"><figure class="member-card">' +
      '<iframe src="' + API_URL + '/api/showcase/cards/' + team.id + '?v=' + team.v + '" title="بطاقة فريق ' + esc(team.name) + '" loading="lazy" sandbox="allow-scripts allow-popups allow-popups-to-escape-sandbox"></iframe>' +
      '<figcaption>' + mine + '</figcaption>' +
    '</figure></div>';
  }
  block.innerHTML = html;
  grid.appendChild(block);
}

async function start() {
  let teams = [];
  try {
    const res = await fetch(API_URL + '/api/showcase', { cache: 'no-store' });
    if (res.ok) teams = await res.json();
  } catch (err) {
    teams = [];
  }
  if (teams.length === 0) {
    filterBar.hidden = true;
    comingSoon.hidden = false;
    return;
  }
  teams.forEach(renderTeam);
}

// الفلتر: لما نكبس على نوع، بنظهر فرقه بس
for (const button of filterButtons) {
  button.addEventListener('click', function () {
    const selected = button.dataset.type;
    for (const other of filterButtons) other.classList.remove('active');
    button.classList.add('active');

    let visibleCount = 0;
    for (const block of document.querySelectorAll('.team-block')) {
      const show = selected === 'all' || block.dataset.type === selected;
      block.classList.toggle('hidden', !show);
      if (show) visibleCount++;
    }
    emptyMsg.hidden = visibleCount !== 0;
  });
}

start();
