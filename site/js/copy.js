// ===== أزرار «نسخ» =====

const copyButtons = document.querySelectorAll('.copy-btn');

for (const button of copyButtons) {
  button.addEventListener('click', function () {
    // جيب النص من الصندوق اللي اسمه مكتوب بـ data-target
    const box = document.querySelector('#' + button.dataset.target);
    const text = box.innerText;

    copyText(text).then(function () {
      button.textContent = 'تم النسخ ✓';
      button.classList.add('done');
      setTimeout(function () {
        button.textContent = 'نسخ';
        button.classList.remove('done');
      }, 2000);
    });
  });
}

// النسخ: الطريقة الحديثة، ولو ما اشتغلت (متصفح قديم) الطريقة القديمة
function copyText(text) {
  if (navigator.clipboard && window.isSecureContext) {
    return navigator.clipboard.writeText(text);
  }
  const area = document.createElement('textarea');
  area.value = text;
  document.body.appendChild(area);
  area.select();
  document.execCommand('copy');
  area.remove();
  return Promise.resolve();
}
