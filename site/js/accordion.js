// ===== الأسئلة الشائعة (accordion) =====

// افتح أول سؤال تلقائياً عشان الزائر يفهم إنه بينفتح
const firstItem = document.querySelector('.faq-item');
firstItem.classList.add('open');
firstItem.querySelector('.faq-question').setAttribute('aria-expanded', 'true');

// جيب كل الأسئلة (قائمة)
const items = document.querySelectorAll('.faq-item');

// مرّ على كل سؤال بـ loop
for (const item of items) {
  const question = item.querySelector('.faq-question');

  question.addEventListener('click', function () {
    const wasOpen = item.classList.contains('open');

    // سكّر كل الأسئلة
    for (const other of items) {
      other.classList.remove('open');
      other.querySelector('.faq-question').setAttribute('aria-expanded', 'false');
    }

    // إذا السؤال كان مسكّر، افتحه
    if (!wasOpen) {
      item.classList.add('open');
      question.setAttribute('aria-expanded', 'true');
    }
  });
}
