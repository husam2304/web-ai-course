// ===== المشاريع: البيانات + الفلتر =====

// قائمة المشاريع (array): فاضية لحد يوم النشر، وكل فريق بيضيف سطر لمشروعه
// type لازم يكون واحد من: store, restaurant, portfolio, services, education
const projects = [
  // مثال على مشروع (شيل الـ // من أول السطر عشان يشتغل):
  // { name: "مخبز الأمل", team: "فريق 1", type: "restaurant", typeLabel: "مطعم وكافيه", link: "https://my-bakery.netlify.app" },
];

const grid = document.querySelector('#projects-grid');
const emptyMsg = document.querySelector('#empty-msg');
const filterButtons = document.querySelectorAll('.filter-btn');
const filterBar = document.querySelector('#filter-bar');
const comingSoon = document.querySelector('#coming-soon');

// إذا القائمة فاضية: اخفِ الفلتر واعرض «قريباً»
if (projects.length === 0) {
  filterBar.hidden = true;
  comingSoon.hidden = false;
}

// ابنِ بطاقة لكل مشروع
for (const project of projects) {
  const card = document.createElement('article');
  card.className = 'project-card';
  card.dataset.type = project.type;

  // إذا في رابط: زر للموقع، غير هيك: «قريباً»
  let bottom = '<span class="badge-soon">قريباً</span>';
  if (project.link !== "") {
    bottom = '<a class="project-link" href="' + project.link + '" target="_blank" rel="noopener">زيارة الموقع ←</a>';
  }

  card.innerHTML =
    '<span class="project-type">' + project.typeLabel + '</span>' +
    '<h3>' + project.name + '</h3>' +
    '<p class="project-team">' + project.team + '</p>' +
    bottom;

  grid.appendChild(card);
}

// الفلتر: لما نكبس على نوع، بنظهر بطاقاته بس
for (const button of filterButtons) {
  button.addEventListener('click', function () {
    const selected = button.dataset.type;

    // غيّر الزر المفعّل
    for (const other of filterButtons) {
      other.classList.remove('active');
    }
    button.classList.add('active');

    // مرّ على البطاقات وقرر: تظهر ولا تختفي؟
    const cards = document.querySelectorAll('.project-card');
    let visibleCount = 0;
    for (const card of cards) {
      if (selected === 'all' || card.dataset.type === selected) {
        card.classList.remove('hidden');
        visibleCount++;
      } else {
        card.classList.add('hidden');
      }
    }

    // إذا ما ضل ولا بطاقة، اعرض رسالة
    emptyMsg.hidden = visibleCount !== 0;
  });
}
