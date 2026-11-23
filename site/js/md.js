// ===== عرض نص الـ AI (Markdown) بشكل مرتب =====
// بيدعم: العناوين #، **عريض**، `كود`، القوائم (- * • 1.)، الخط الفاصل ---، والجداول البسيطة.
// النص الأصلي ما بيتغير: زر «نسخ» بينسخه زي ما هو عشان ينلصق بالـ AI.

function mdEscape(text) {
  const div = document.createElement('div');
  div.textContent = text == null ? '' : String(text);
  return div.innerHTML;
}

function mdInline(text) {
  let html = mdEscape(text);
  html = html.replace(/`([^`]+)`/g, '<code>$1</code>');
  html = html.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
  html = html.replace(/(^|[\s(])\*([^*\s][^*]*)\*(?=[\s).,،:]|$)/g, '$1<em>$2</em>');
  html = html.replace(/\[([^\]]+)\]\((https?:\/\/[^)\s]+)\)/g, '<a href="$2" target="_blank" rel="noopener">$1</a>');
  // "عنوان: نص" بأول السطر → العنوان عريض (إذا مش عريض أصلاً)
  html = html.replace(/^([^:<>]{2,40}):\s/, '<strong>$1:</strong> ');
  return html;
}

function renderMarkdown(text) {
  const lines = String(text || '').replace(/\r\n/g, '\n').split('\n');
  let html = '';
  let listType = null; // 'ul' | 'ol'
  let table = null;

  const closeList = function () { if (listType) { html += '</' + listType + '>'; listType = null; } };
  const closeTable = function () {
    if (!table) return;
    html += '<div class="md-table"><table>' + table.map(function (row, i) {
      const tag = i === 0 ? 'th' : 'td';
      return '<tr>' + row.map(function (c) { return '<' + tag + '>' + mdInline(c) + '</' + tag + '>'; }).join('') + '</tr>';
    }).join('') + '</table></div>';
    table = null;
  };

  for (const raw of lines) {
    const line = raw.trim();

    if (/^\|.*\|$/.test(line)) {                              // جدول
      closeList();
      if (/^\|[\s:|-]+\|$/.test(line)) continue;              // سطر |---|---|
      const cells = line.slice(1, -1).split('|').map(function (c) { return c.trim(); });
      (table = table || []).push(cells);
      continue;
    }
    closeTable();

    if (!line) { closeList(); continue; }

    let m;
    if (/^(-{3,}|\*{3,}|_{3,})$/.test(line)) { closeList(); html += '<hr>'; continue; }
    if ((m = /^(#{1,6})\s+(.*)$/.exec(line))) {
      closeList();
      const level = Math.min(6, m[1].length + 2);              // # → h3 عشان ما يكبر زيادة
      html += '<h' + level + '>' + mdInline(m[2].replace(/\*\*/g, '')) + '</h' + level + '>';
      continue;
    }
    if (/^[1-9]\)\s/.test(line)) {                             // 1) عنوان قسم
      closeList();
      html += '<h4>' + mdInline(line.replace(/\*\*/g, '')) + '</h4>';
      continue;
    }
    if ((m = /^([-*•])\s+(.*)$/.exec(line))) {
      if (listType !== 'ul') { closeList(); html += '<ul>'; listType = 'ul'; }
      html += '<li>' + mdInline(m[2]) + '</li>';
      continue;
    }
    if ((m = /^(\d+)[.)]\s+(.*)$/.exec(line))) {
      if (listType !== 'ol') { closeList(); html += '<ol>'; listType = 'ol'; }
      html += '<li>' + mdInline(m[2]) + '</li>';
      continue;
    }
    closeList();
    html += '<p>' + mdInline(line) + '</p>';
  }
  closeList();
  closeTable();
  return html;
}

// صندوق: عنوان + أزرار نسخ وتنزيل .md + المحتوى المنسق
function mdBox(title, text, meta, open) {
  const id = 'md-' + Math.random().toString(36).slice(2, 9);
  window.__mdTexts = window.__mdTexts || {};
  window.__mdTexts[id] = { title: title, text: text };
  return '<details class="md-box"' + (open === false ? '' : ' open') + '>' +
    '<summary><span class="md-head"><span class="md-title">' + mdEscape(title) + '</span>' + (meta ? ' <span class="md-meta">' + meta + '</span>' : '') + '</span>' +
    '<span class="md-actions"><button type="button" class="md-btn md-copy" data-md-copy="' + id + '">📋 نسخ النص</button>' +
    '<button type="button" class="md-btn" data-md-download="' + id + '">تنزيل <bdi dir="ltr">.md</bdi></button></span></summary>' +
    '<div class="md-body" dir="auto">' + renderMarkdown(text) + '</div></details>';
}

document.addEventListener('click', async function (e) {
  const copyBtn = e.target.closest('[data-md-copy]');
  const dlBtn = e.target.closest('[data-md-download]');
  if (!copyBtn && !dlBtn) return;
  e.preventDefault(); // الأزرار جوا عنوان الصندوق: ما نفتح/نسكّر الصندوق لما ينكبسوا
  const item = (window.__mdTexts || {})[(copyBtn || dlBtn).dataset[copyBtn ? 'mdCopy' : 'mdDownload']];
  if (!item) return;

  if (copyBtn) {
    try {
      await navigator.clipboard.writeText(item.text);
    } catch (err) {
      const ta = document.createElement('textarea');
      ta.value = item.text;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      ta.remove();
    }
    const old = copyBtn.textContent;
    copyBtn.textContent = '✓ انتسخ';
    setTimeout(function () { copyBtn.textContent = old; }, 1500);
  } else {
    const blob = new Blob([item.text], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = item.title.replace(/[\\/:*?"<>|]+/g, '-') + '.md';
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(function () { URL.revokeObjectURL(url); }, 5000);
  }
});
