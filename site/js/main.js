// ===== قائمة الجوال (hamburger) =====

// 1. مين؟ جيب الزر والقائمة من الصفحة
const menuBtn = document.querySelector('.menu-btn');
const nav = document.querySelector('.main-nav');

// 2. متى؟ لما حدا يكبس الزر
menuBtn.addEventListener('click', function () {
  // 3. شو؟ ضيف أو شيل الكلاس open، والـ CSS بيظهر أو بيخفي القائمة
  nav.classList.toggle('open');

  // حدّث aria-expanded عشان قارئ الشاشة يعرف إذا القائمة مفتوحة
  const isOpen = nav.classList.contains('open');
  menuBtn.setAttribute('aria-expanded', isOpen);
});
