
// ---------- Day 3 helpers ----------
async function iconRows(s, rows, x, w, y0, step, o = {}) {
  for (let i = 0; i < rows.length; i++) {
    const y = y0 + i * step;
    await iconCircle(s, rows[i][0], x + w - 0.7, y, 0.7, rows[i][3] || C.accent1);
    s.addText(rows[i][1], R({ x, y: y + 0.0, w: w - 0.95, h: 0.42, fontSize: o.ts || 18, bold: true, color: C.text2 }));
    s.addText(rows[i][2], R({ x, y: y + 0.44, w: w - 0.95, h: step - 0.5, fontSize: o.bs || 14, color: "3E5266" }));
  }
}
function divider(kicker, title, sub, section, notes) {
  const s = newSlide("DIVIDER", kicker, title, section);
  if (sub) s.addText(sub, R({ x: M, y: 4.3, w: CW, h: 0.5, fontSize: 18, color: "C9D6E0" }));
  if (notes) s.addNotes(notes);
  return s;
}
function codeBox(s, x, y, w, h, text, label, fs = 14) {
  box(s, x, y, w, h, C.text2);
  if (label) s.addText(label, R({ x: x + 0.3, y: y + 0.15, w: w - 0.6, h: 0.35, fontSize: 13, bold: true, color: HEX.accent6 }));
  s.addText(text, { x: x + 0.3, y: y + (label ? 0.6 : 0.25), w: w - 0.6, h: h - (label ? 0.8 : 0.45), fontSize: fs, color: "F1F4F8", fontFace: "Courier New", align: "left", valign: "top", margin: 0, isTextBox: true });
}
function promptBox(s, x, y, w, h, text, label, fs = 13) {
  box(s, x, y, w, h, C.text2);
  s.addText(label || "Prompt · من «ملفات الدورة»", R({ x: x + 0.3, y: y + 0.15, w: w - 0.6, h: 0.35, fontSize: 13, bold: true, color: HEX.accent6 }));
  s.addText(text, R({ x: x + 0.3, y: y + 0.6, w: w - 0.6, h: h - 0.8, fontSize: fs, color: C.background1, paraSpaceAfter: 2 }));
}
function numList(s, items, x, y, w, h, fs = 16) {
  s.addText(items.map((t, i) => ({ text: `${i + 1}. ${t}`, options: { breakLine: i < items.length - 1, paraSpaceAfter: 8, rtlMode: true } })), R({ x, y, w, h, fontSize: fs, color: C.text1 }));
}
function practice(s, title, steps, success, y = 1.8, h = 4.0) {
  const { xs, cw } = colsX(2, 0.4);
  box(s, xs[0], y, cw, h, C.background2);
  s.addText(title, R({ x: xs[0] + 0.3, y: y + 0.2, w: cw - 0.6, h: 0.45, fontSize: 18, bold: true, color: C.accent1 }));
  numList(s, steps, xs[0] + 0.3, y + 0.75, cw - 0.6, h - 0.9, 15);
  box(s, xs[1], y, cw, h, C.text2);
  s.addText("مؤشر النجاح", R({ x: xs[1] + 0.3, y: y + 0.2, w: cw - 0.6, h: 0.45, fontSize: 18, bold: true, color: C.accent6 }));
  s.addText(bullets(success, { space: 10 }), R({ x: xs[1] + 0.3, y: y + 0.75, w: cw - 0.6, h: h - 0.9, fontSize: 16, color: C.background1 }));
}
// code on the left, explanation rows on the right
async function codeAndRows(s, codeText, label, rows, o = {}) {
  const cw = o.codeW || 6.4;
  codeBox(s, M, 1.8, cw, o.codeH || 4.7, codeText, label, o.fs || 14);
  const x = M + cw + 0.4;
  await iconRows(s, rows, x, W - M - x, 1.8, o.step || 1.15, { ts: o.ts || 17, bs: o.bs || 14 });
}

async function build() {
  // ===== Opening =====
  const S0 = "الافتتاح";
  pres.addSection({ title: S0 });
  let s = pres.addSlide({ masterName: "DIVIDER", sectionTitle: S0 });
  s.addText("دورة تطوير المواقع الإلكترونية بمساعدة الذكاء الاصطناعي", { placeholder: "kicker", rtlMode: true, align: "right" });
  s.addText("اليوم الثالث: بناء الموقع", { placeholder: "title", rtlMode: true, align: "right" });
  s.addText("من تصميم Stitch لموقع حقيقي بـ HTML وCSS وJavaScript", R({ x: M, y: 4.2, w: CW, h: 0.5, fontSize: 22, color: "C9D6E0" }));
  s.addText("المدرب: حسام عليان", R({ x: M, y: 4.8, w: CW, h: 0.45, fontSize: 18, color: C.background1, bold: true }));
  for (let i = 0; i < 5; i++) {
    const x = W - M - 0.55 - i * 0.75;
    const on = i === 2, done = i < 2;
    const fill = on ? C.accent1 : done ? "4A6B88" : "2C4A66";
    s.addShape(pres.shapes.OVAL, { x, y: 1.3, w: 0.55, h: 0.55, fill: { color: fill }, line: { color: fill, width: 0 }, objectName: "day-dot" });
    s.addText(String(i + 1), { x, y: 1.3, w: 0.55, h: 0.55, fontSize: 16, bold: true, color: HEX.lt1, align: "center", valign: "middle", margin: 0, isTextBox: true });
  }
  s.addNotes("قبل ما تبلّش: كل فريق قاعد حوالين جهاز واحد. مدح التصاميم أول شي: مبارح كل الفرق عملت تصاميم قوية فعلاً. اعرض شاشتين من تصاميمهم.");

  s = newSlide("CONTENT", "افتتاح · من التصميم للكود", "اليوم بنحوّل الصورة لموقع بيشتغل", S0);
  await stepsFlow(s, [
    { icon: "FaImage", num: "1", title: "صورة Stitch", body: "صورة الشاشة + DESIGN.md: المرجع بس" },
    { icon: "FaComments", num: "2", title: "Prompt للـ AI", body: "ChatGPT أو Claude، صفحة صفحة" },
    { icon: "FaCode", num: "3", title: "الكود", body: "HTML وCSS وJS عادي، بتفهموه" },
    { icon: "FaGlobe", num: "4", title: "المتصفح", body: "موقع بيفتح على Live Server", dark: true },
  ], 1.9, 3.2, { bodySize: 15, titleSize: 19 });
  callout(s, M, 5.45, CW, 0.95, "«مبارح صممتوا صورة: ما بتقدر تكبس على زر فيها. اليوم بنحولها لموقع حقيقي»", { size: 16 });
  s.addNotes("دقيقة. اعرض موقع الدورة شغال واكبس على الـ hamburger والفلترة بصفحة المشاريع.");

  // review: UI vs UX
  s = newSlide("CONTENT", "مراجعة من اليوم 2 · 1 من 2", "UI مش «الخلفية»", S0);
  {
    const { xs, cw } = colsX(2, 0.4);
    await card(s, xs[0], 1.8, cw, 2.9, { icon: "FaPalette", title: "UI: كل شي بتشوفه وبتكبس عليه", body: "الأزرار، الخطوط، المسافات، الأيقونات، الألوان", titleSize: 20, titleH: 0.9, bodySize: 16 });
    await card(s, xs[1], 1.8, cw, 2.9, { icon: "FaRoute", iconFill: C.accent2, title: "UX: شو بتحس وإنت بتستخدمه", body: "قديش سهل وسريع توصل لهدفك", titleSize: 20, titleH: 0.9, bodySize: 16 });
  }
  callout(s, M, 5.0, CW, 1.4, "مثال: زر «اطلب» حلو ولونه ممتاز (UI ممتاز)، بس مخبّى آخر الصفحة (UX سيئ)", { size: 18 });
  s.addNotes("دقيقة. احكيها «شغلة انلخبطت عند ناس كتير»، مش غلط فلان.");

  s = newSlide("CONTENT", "مراجعة من اليوم 2 · 2 من 2", "التباين مش لعمى الألوان بس", S0);
  {
    const T = [["FaSun", "اللي قاعد بالشمس"], ["FaMobileAlt", "شاشة إضاءتها واطية"], ["FaUserClock", "كبار السن"], ["FaGlasses", "اللي نظره ضعيف"]];
    const { xs, cw } = colsX(4, 0.3);
    for (let i = 0; i < 4; i++) await card(s, xs[i], 1.8, cw, 2.4, { icon: T[i][0], iconFill: i % 2 ? C.accent2 : C.accent1, title: T[i][1], titleSize: 18 });
  }
  callout(s, M, 4.5, CW, 1.0, "التباين بيخدم الكل. نص فاتح على خلفية فاتحة = مشكلة، حتى لو شكله حلو", { size: 18 });
  s.addText("سؤال سريع: «مين استعمل جواله بالشمس وما قدر يقرأ؟» هاد هو التباين", R({ x: M, y: 5.75, w: CW, h: 0.5, fontSize: 16, color: "3E5266" }));
  s.addNotes("دقيقة.");

  s = newSlide("CONTENT", "افتتاح · قواعد اليوم", "4 قواعد (مكتوبين عاللوح)", S0);
  {
    const Q = [
      ["FaBan", "كود Stitch ممنوع", "بناخد منه صورة الشاشة و DESIGN.md بس"],
      ["FaPaintBrush", "بدون Tailwind", "CSS عادي بملف style.css"],
      ["FaCommentDots", "بتقدر تشرحه؟", "إذا لا: «اشرحلي هالسطر»"],
      ["FaListOl", "العلامة على الخطوات", "اللي بيقفز عن خطوة بيخسر علامتها"],
    ];
    const { xs, cw } = colsX(4, 0.3);
    for (let i = 0; i < 4; i++) await card(s, xs[i], 1.8, cw, 3.1, { icon: Q[i][0], num: String(i + 1), title: Q[i][1], body: Q[i][2], titleSize: 18, bodySize: 15 });
  }
  callout(s, M, 5.2, CW, 1.2, "ليش مش كود Stitch؟ لأنه Tailwind (مكتبة ما بنعرفها) ومليان classes ما بنفهمها. بكرا بدنا نصلّح أخطاء، وما بتقدر تصلّح كود مش فاهمه", { size: 15, bold: false });
  s.addNotes("3 دقائق. كود Stitch كمان فيه JS شغّال (خصوصاً the sun): إغراء النسخ كبير، فوضّح من هلأ.");

  s = newSlide("CONTENT", "افتتاح · طريقة الشغل", "الفريق فريق واحد، على جهاز واحد", S0);
  {
    const Q = [
      ["FaLaptop", "جهاز واحد", "بتشتغلوا وبتراجعوا وبتسلّموا مع بعض. ما في أدوار ولا تقسيم ولا دمج"],
      ["FaFileArchive", "zip كل ساعة", "على «ملفات فريقي». إذا الجهاز علق أو الـ AI مسح شغل، بنرجع لآخر نسخة"],
      ["FaUserPlus", "شغل إضافي", "اللي بده يزيد اشي لحاله، على جهازه، وبيرفعه بخانته بالفورم"],
    ];
    const { xs, cw } = colsX(3, 0.3);
    for (let i = 0; i < 3; i++) await card(s, xs[i], 1.8, cw, 2.9, { icon: Q[i][0], iconFill: i === 1 ? C.accent2 : C.accent1, title: Q[i][1], body: Q[i][2], titleSize: 19, bodySize: 15 });
  }
  callout(s, M, 5.0, CW, 0.7, "مواعيد الـ zip: 0:45 · 1:50 · 2:45 · 3:45 (التسليم)", { size: 16 });
  s.addNotes("دقيقة. نصيحة مش قاعدة: بدّلوا مين ماسك الـ keyboard بين صفحة وصفحة.");

  s = newSlide("STATEMENT", "القاعدة الذهبية لليوم", "أي سطر بالموقع، أي حدا بالفريق لازم يقدر يشرحه", S0);
  s.addText("رح أسأل أي واحد عن أي سطر", R({ x: M, y: 4.6, w: CW, h: 0.6, fontSize: 20, color: C.text2 }));
  s.addNotes("كررها بكل لفّة على الطاولات.");

  s = newSlide("CONTENT", "افتتاح · هدف اليوم", "آخر اليوم بدنا من كل فريق 3 أشياء", S0);
  {
    const D = [["FaLink", "كل الصفحات موجودة", "ومربوطة ببعض من الـ nav"], ["FaImage", "الشكل قريب من التصميم", "الألوان والخطوط والترتيب"], ["FaMagic", "ميزة JavaScript وحدة", "على الأقل شغالة (الـ hamburger ما بينحسب)"]];
    const { xs, cw } = colsX(3, 0.3);
    for (let i = 0; i < 3; i++) await card(s, xs[i], 1.85, cw, 2.9, { icon: D[i][0], num: String(i + 1), title: D[i][1], body: D[i][2], titleSize: 19, bodySize: 15 });
  }
  callout(s, M, 5.1, CW, 1.1, "«الباقي بنكمله بكرا: بنفحص، بنصلّح، وبنكمل الميزات»", { size: 17 });
  s.addNotes("دقيقة، مع الأجندة.");

  s = newSlide("CONTENT", "أجندة اليوم", "شو رح نعمل اليوم؟", S0);
  table(s, ["الوقت", "الجزء", "شو بيصير"], [
    ["0:00", "الافتتاح", "مراجعة غلطتين، قواعد اليوم، الجهاز الواحد"],
    ["0:10", "HTML", "شرح على موقع الدورة"],
    ["0:25", "تطبيق", "الهيكل + الصور + data.js"],
    ["0:45", "CSS", "style.css، :root، Flex و Grid، الجوال"],
    ["1:05", "تطبيق", "الصفحات وحدة وحدة"],
    ["1:50", "استراحة", "15 دقيقة"],
    ["2:05", "اللغة", "عربي وإنجليزي وموقع بلغتين"],
    ["2:15", "JavaScript", "بيانات ← رسم ← حدث"],
    ["2:45", "تطبيق", "الميزات (بلف على الطاولات)"],
    ["3:30", "الفحص", "الروابط والـ Console"],
    ["3:45", "التسليم", "zip الموقع وسؤال الفهم"],
  ], { y: 1.75, colW: [1.5, 2.2, 8.433], rowH: 0.43, fs: 14 });
  s.addNotes("كل شرح قصير بيجي بعده تطبيق فوراً.");

  // ===== HTML =====
  const S1 = "HTML: الهيكل";
  pres.addSection({ title: S1 });
  divider("0:10 · شرح 15 دقيقة", "HTML: الهيكل", "هيكل الصفحة · الروابط · الصور · الفورم · المجلدات · اللغة", S1, "افتح موقع الدورة واعمل View Source (Ctrl + U). HTML بيحدد شو موجود، مش شكله.");

  s = newSlide("CONTENT", "HTML · 1", "هيكل أي صفحة: كل صفحاتكم رح تبلّش هيك", S1);
  await codeAndRows(s, '<!DOCTYPE html>\n<html lang="ar" dir="rtl">\n<head>\n  <meta charset="UTF-8">\n  <meta name="viewport"\n   content="width=device-width,\n   initial-scale=1.0">\n  <title>اسم الصفحة</title>\n  <link rel="stylesheet"\n        href="css/style.css">\n</head>\n<body>\n  <header>...</header>\n  <main>...</main>\n  <footer>...</footer>\n  <script src="js/data.js"></script>\n  <script src="js/main.js"></script>\n</body>\n</html>', "index.html", [
    ["FaFont", "meta charset", "بدونه العربي بيطلع رموز"],
    ["FaMobileAlt", "meta viewport", "بدونه الموقع بيطلع صغير عالجوال", C.accent2],
    ["FaNewspaper", "header · main · footer", "زي الجريدة: راس وجسم وذيل. الـ header والـ footer نفسهم بكل الصفحات"],
    ["FaSortAmountDown", "data.js قبل main.js", "آخر الـ body. المكونات عالطاولة قبل ما الطباخ يبلّش", C.accent2],
  ], { codeH: 4.85, fs: 12, step: 1.2 });
  s.addNotes("4 دقائق. ورّيهم كل جزء بالـ View Source تبع موقع الدورة.");

  s = newSlide("CONTENT", "HTML · 2", "الروابط والصور", S1);
  {
    const { xs, cw } = colsX(2, 0.4);
    codeBox(s, xs[0], 1.8, cw, 1.9, '<nav>\n  <a href="index.html">الرئيسية</a>\n  <a href="menu.html">المنيو</a>\n</nav>', "الروابط", 14);
    s.addText(bullets(["الرابط نسبي: اسم الملف بس، بدون C:\\Users\\... عشان يضل شغال لما ننشر يوم 5", "أسماء الملفات إنجليزي، أحرف صغيرة، بدون مسافات: about.html"], { space: 8 }), R({ x: xs[0], y: 3.9, w: cw, h: 2.6, fontSize: 15 }));
    codeBox(s, xs[1], 1.8, cw, 1.9, '<img src="images/latte.jpg"\n     alt="كوب لاتيه">', "الصور", 14);
    s.addText(bullets(["الصور بتنزل عالجهاز بمجلد images/. روابط صور Stitch ممكن توقف بأي لحظة", "alt: وصف للي ما بيشوفوا (الوصول من اليوم 2)", "Unsplash أو توليد بالـ AI: على اختياركم"], { space: 8 }), R({ x: xs[1], y: 3.9, w: cw, h: 2.6, fontSize: 15 }));
  }
  s.addNotes("4 دقائق.");

  s = newSlide("CONTENT", "HTML · 3", "الفورم: بدون ولا سطر JavaScript", S1);
  await codeAndRows(s, '<form id="contactForm">\n  <label for="name">الاسم</label>\n  <input id="name" type="text"\n         required>\n  <button type="submit">\n    إرسال\n  </button>\n</form>', "contact.html", [
    ["FaLink", "label for = input id", "كبسة على الكلمة بتحط المؤشر بالحقل"],
    ["FaAsterisk", "required", "بيمنع الإرسال والحقل فاضي، بدون JS", C.accent2],
    ["FaUsers", "مين بده إياه؟", "DSA وتكنولوجيا وآفاق و the sun"],
  ], { codeH: 3.6, fs: 15, step: 1.2 });
  callout(s, M, 5.65, CW, 0.8, "جرّبها قدامهم على صفحة التواصل بموقع الدورة: اكبس إرسال والحقل فاضي", { size: 15, bold: false });
  s.addNotes("دقيقتين.");

  s = newSlide("CONTENT", "HTML · 4", "هيكل المجلدات الموحّد (كل الفرق)", S1);
  codeBox(s, M, 1.8, 5.6, 4.7, "project/\n├── index.html\n├── menu.html, about.html ...\n├── css/\n│   ├── style.css\n│   └── menu.css\n├── js/\n│   ├── data.js\n│   └── main.js\n└── images/", "شجرة المشروع", 16);
  await iconRows(s, [
    ["FaPaintBrush", "css/style.css", "مشترك لكل الموقع. css/[page].css خاص بصفحة (اختياري)"],
    ["FaDatabase", "js/data.js", "البيانات: المنيو، الأدوات، الكتب، المصورين", C.accent2],
    ["FaMousePointer", "js/main.js", "التفاعل: واحد لكل الصفحات"],
    ["FaImages", "images/", "كل الصور محلية، بأسماء إنجليزي صغيرة", C.accent2],
  ], 6.6, W - M - 6.6, 1.8, 1.15, { ts: 17, bs: 14 });
  s.addNotes("دقيقتين. ارسمه عاللوح وخليه طول اليوم.");

  s = newSlide("CONTENT", "HTML · 5 · دقيقة", "احسموا لغتكم هلأ", S1);
  codeBox(s, M, 1.8, CW, 1.6, '<html lang="ar" dir="rtl">   <!-- عربي -->\n<html lang="en" dir="ltr">   <!-- English -->', null, 18);
  {
    const { xs, cw } = colsX(3, 0.3);
    const T = [["FaLanguage", "عربي، إنجليزي، أو لغتين", "على اختيار الفريق. اللي بده لغتين بيبلّش بوحدة"], ["FaExclamationTriangle", "AI و DSA", "تصاميمكم طلعت بالإنجليزي، وخطة DSA بتحكي عربي: احسموا"], ["FaClock", "بعد الاستراحة", "بنشرح بالتفصيل شو بيتغير، وكيف بيصير الموقع بلغتين"]];
    for (let i = 0; i < 3; i++) await card(s, xs[i], 3.65, cw, 2.85, { icon: T[i][0], iconFill: i === 1 ? C.accent2 : C.accent1, title: T[i][1], body: T[i][2], titleSize: 17, bodySize: 15 });
  }
  s.addNotes("دقيقة. الـ prompt الأول بيسأل عن اللغة، فلازم يحسموا قبله.");

  s = newSlide("CONTENT", "تطبيق · prompt 1", "Prompt الهيكل", S1);
  promptBox(s, M, 1.75, CW, 4.9,
    "أنا مبتدئ ببني موقع [فكرة الموقع] بـ HTML و CSS و JavaScript عادي، بدون Tailwind وبدون أي مكتبة.\n" +
    "اللغة: [عربي RTL / إنجليزي LTR]. الصفحات: [index.html, menu.html, ...].\n" +
    "مرفق ملف التصميم DESIGN.md (أو صورة الرئيسية): خد منه الألوان والخطوط بس.\n" +
    "بدي:\n" +
    "1. هيكل المجلدات: css/style.css و js/data.js و js/main.js و images/.\n" +
    "2. style.css فيه :root بـ 6 لـ 8 متغيرات بس (خلفية 60%، أساسي 30%، مميز 10%، لون النص، الخط، الزوايا)، وclasses مشتركة: .container .btn .card .cards، و header و footer و media query للجوال مع hamburger.\n" +
    "3. index.html فيها الهيكل الكامل (header مع nav لكل الصفحات وزر hamburger، main فاضي، footer)، و data.js قبل main.js آخر الـ body.\n" +
    "4. data.js فيه مصفوفة اسمها items فيها عنصرين مثال بالحقول: [id, name, category, price, image ...].\n" +
    "5. main.js فيه كود الـ hamburger بس.\n" +
    "اشرحلي بالعربي بسطر شو وظيفة كل ملف.", "Prompt 1 · الهيكل · من «ملفات الدورة»", 13);
  s.addNotes("الـ prompt كامل بقسم اليوم 3 بـ «ملفات الدورة». آفاق: بيرفقوا صورة الرئيسية بدل DESIGN.md.");

  s = newSlide("CONTENT", "تطبيق · 20 دقيقة", "ابنوا الهيكل على جهاز الفريق", S1);
  practice(s, "الخطوات", [
    "محادثة AI جديدة + prompt 1 + DESIGN.md أو صورة الرئيسية",
    "المجلدات بـ VS Code، وكل ملف بمكانه، و index.html على Live Server",
    "اقرأوا شرح كل ملف مع بعض. أي سطر مش واضح: «اشرحلي»",
    "الصور على images/ بأسماء إنجليزي صغيرة",
    "عبّوا data.js ببياناتكم الحقيقية بنفس شكل العنصرين",
    "0:45: zip رقم 1 على «ملفات فريقي»",
  ], ["index.html بتفتح بالـ header والـ footer والألوان", "المجلدات بالشكل الموحّد", "data.js فيه بياناتكم", "ولا class تبع Tailwind"], 1.8, 4.7);
  s.addNotes("لف: آفاق أول، بعدين the sun (شكل بيانات localStorage يتحدد هلأ)، بعدين DSA (اللغة والألوان). دوّر على :root فيه أكثر من 8 متغيرات.");

  // ===== CSS =====
  const S2 = "CSS: الشكل والصفحات";
  pres.addSection({ title: S2 });
  divider("0:45 · شرح 20 دقيقة", "CSS: ملف واحد لكل الموقع", "المتغيرات · الـ class · Flex و Grid · الجوال", S2, "الفكرة: لما تغيّر لون مرة وحدة بيتغير بكل الصفحات. مقاطع قصيرة، وبنصها بيجربوا.");

  s = newSlide("CONTENT", "CSS · 1", "الألوان من DESIGN.md إلى :root", S2);
  await codeAndRows(s, ':root {\n  --bg: #f8f9ff;      /* 60% */\n  --primary: #00236f; /* 30% */\n  --accent: #006c49;  /* 10% */\n  --text: #0d1c2e;\n  --radius: 12px;\n  --font: "Tajawal", sans-serif;\n}\nbody {\n  background: var(--bg);\n  color: var(--text);\n  font-family: var(--font);\n}\n.btn {\n  background: var(--accent);\n  border-radius: var(--radius);\n}', "css/style.css", [
    ["FaFillDrip", "علبة دهان عليها اسم", "بتغيّر العلبة، بيتغير كل حيط مدهون منها"],
    ["FaChartPie", "60-30-10 صارت كود", "خلفية، أساسي، مميز: من اليوم 2", C.accent2],
    ["FaExclamationTriangle", "DESIGN.md فيه 45 لون", "الـ prompt بيطلب 6 لـ 8 بس، وإلا ما حدا بيفهم :root"],
  ], { codeH: 4.75, fs: 12.5, step: 1.3 });
  s.addNotes("5 دقائق.");

  s = newSlide("STATEMENT", "جرّبوا · دقيقتين", "غيّروا --primary لأحمر فاقع واحفظوا", S2);
  s.addText("شوفوا الـ header كله تغيّر بكل الصفحات. بعدين رجّعوه", R({ x: M, y: 4.6, w: CW, h: 0.6, fontSize: 20, color: C.text2 }));
  s.addNotes("هاي اللحظة اللي بتثبّت فكرة المتغيرات.");

  s = newSlide("CONTENT", "CSS · 2", "الـ class: التناسق بالكود", S2);
  {
    const { xs, cw } = colsX(2, 0.4);
    await card(s, xs[0], 1.8, cw, 2.7, { icon: "FaClone", title: ".card وحدة لكل البطاقات", body: "منيو، أدوات، كتب، أعمال: نفس الـ class", titleSize: 19, bodySize: 16 });
    await card(s, xs[1], 1.8, cw, 2.7, { icon: "FaHandPointer", iconFill: C.accent2, title: ".btn واحد لكل الأزرار", body: "نفس الشكل بكل الصفحات", titleSize: 19, bodySize: 16 });
  }
  callout(s, M, 4.8, CW, 1.4, "«التناسق اللي حكينا عنه مبارح بالـ UI؟ بالكود اسمه: نفس الـ class»", { size: 18 });
  s.addNotes("3 دقائق. ورّيهم .btn بموقع الدورة بالـ DevTools.");

  s = newSlide("CONTENT", "CSS · 3", "Flexbox لصف واحد، Grid لشبكة", S2);
  codeBox(s, M, 1.8, CW, 1.75, "header { display: flex; justify-content: space-between; align-items: center; }\n.cards  { display: grid; gap: 16px;\n          grid-template-columns: repeat(auto-fill, minmax(250px, 1fr)); }", null, 15);
  {
    const { xs, cw } = colsX(3, 0.3);
    const T = [["FaGripLines", "flex: طابور", "الـ header والـ nav: عناصر بصف واحد"], ["FaTh", "grid: رفوف مكتبة", "البطاقات: منيو، أدوات، كتب، أعمال"], ["FaMobileAlt", "auto-fill", "البطاقات بتنزل لحالها عالجوال. صغّر النافذة وشوف"]];
    for (let i = 0; i < 3; i++) await card(s, xs[i], 3.8, cw, 2.7, { icon: T[i][0], iconFill: i === 1 ? C.accent2 : C.accent1, title: T[i][1], body: T[i][2], titleSize: 18, bodySize: 15 });
  }
  s.addNotes("4 دقائق.");

  s = newSlide("CONTENT", "CSS · 4", "الجوال والـ hamburger", S2);
  await codeAndRows(s, "@media (max-width: 768px) {\n  nav { display: none; }\n  nav.open {\n    display: flex;\n    flex-direction: column;\n  }\n  .menu-btn { display: block; }\n}", "css/style.css", [
    ["FaMobileAlt", "media query واحد", "تحت 768px: القواعد هاي بس بتشتغل"],
    ["FaLink", "أول رابط بين CSS و JS", "CSS بيحضّر شكل .open، و JS بيحطها وبيشيلها", C.accent2],
    ["FaFont", "الخطوط والأيقونات", "Google Fonts (Tajawal، Cairo) و Material Symbols مسموحين: هدول مش Tailwind"],
  ], { codeH: 3.9, fs: 15, step: 1.3 });
  s.addNotes("4 دقائق + دقيقة الخطوط. التفاصيل بنفحصها يوم 4 بالـ DevTools.");

  s = newSlide("CONTENT", "تطبيق · prompt 2", "بناء صفحة من الصفر (لكل صفحة)", S2);
  promptBox(s, M, 1.75, 8.2, 4.9,
    "هاي صورة تصميم صفحة [اسم الصفحة]. ابنيها بـ HTML و CSS عادي، بدون Tailwind.\n" +
    "هاد الـ style.css المشترك عندنا: [الصق style.css]\n" +
    "وهاد الـ header والـ footer: [الصقهم]\n" +
    "الشروط:\n" +
    "• استخدم المتغيرات والـ classes الموجودة، ولا تعدّل style.css.\n" +
    "• أي CSS جديد خاص بالصفحة حطه بملف css/[اسم-الصفحة].css.\n" +
    "• الصور من مجلد images/ بأسماء واضحة، ولكل صورة alt.\n" +
    "• البطاقات المتكررة لا تكتبها بالـ HTML: حط مكانها <div id=\"list\" class=\"cards\"></div> بس.\n" +
    "• بدون JavaScript بهالخطوة.\n" +
    "ابني الصفحة قسم قسم، وبعد كل قسم اشرح بسطرين بالعربي شو عملت.", "Prompt 2 · صفحة · مع صورة الشاشة", 13);
  {
    const x = M + 8.5, w = W - M - x;
    await card(s, x, 1.75, w, 2.35, { icon: "FaImage", title: "المرجع: الصورة بس", body: "مش كود Stitch", titleSize: 17, bodySize: 14 });
    await card(s, x, 4.3, w, 2.35, { icon: "FaTh", iconFill: C.accent2, title: "البطاقات فاضية", body: "بترسمها JS بعد الاستراحة", titleSize: 17, bodySize: 14 });
  }
  s.addNotes("prompt 2 كامل بـ «ملفات الدورة».");

  s = newSlide("CONTENT", "تطبيق · 45 دقيقة", "الصفحات وحدة وحدة، والفريق كله على نفس الصفحة", S2);
  practice(s, "الخطوات", [
    "الرئيسية أول: prompt 2 + صورتها + style.css + الـ header والـ footer",
    "قسم قسم: الصق، احفظ (Ctrl + S)، شوف، قارن بالصورة",
    "صفحة جديدة: انسخ index.html، فضّي main، غيّر title، وكمّل بـ prompt 2",
    "خلصتوا صفحة؟ راجعوها مع بعض، بعدين اللي بعدها",
    "1:50: zip رقم 2 قبل الاستراحة",
  ], ["الرئيسية قريبة من التصميم", "نص الصفحات على الأقل موجودة ومربوطة", "ولا class تبع Tailwind", "أي واحد بيشرح أي سطر"], 1.8, 4.7);
  s.addNotes("لف: Tailwind تسلل؟ الـ AI عدّل style.css؟ اسأل أضعف واحد عن سطر، وإذا ما عرف الفريق كله بيوقف دقيقة وبيشرحله. IT Team: تقسيم ملفهم الواحد لـ 4 صفحات.");

  s = newSlide("STATEMENT", "من 1:50 لـ 2:05", "استراحة 15 دقيقة", S2);
  s.addText("قبل ما تقوموا: zip رقم 2 على «ملفات فريقي»", R({ x: M, y: 4.6, w: CW, h: 0.6, fontSize: 20, color: C.text2 }));
  s.addNotes("بالاستراحة افتح «ملفات فريقي» وشوف مين رفع، ورتّب لفّة ما بعد JavaScript.");

  // ===== Language =====
  const S3 = "العربي والإنجليزي";
  pres.addSection({ title: S3 });
  divider("2:05 · 10 دقايق", "العربي والإنجليزي والموقع بلغتين", "lang و dir · شو ما بينقلب لحاله · طريقتين للغتين", S3, "كل فريق بيختار لغة موقعه، وإنت بتشرح للكل كيف كل خيار بيشتغل.");

  s = newSlide("CONTENT", "اللغة · 1", "سطر واحد بيقلب الموقع", S3);
  codeBox(s, M, 1.8, CW, 1.5, '<html lang="ar" dir="rtl">   <!-- عربي: من اليمين -->\n<html lang="en" dir="ltr">   <!-- English: from the left -->', null, 18);
  {
    const { xs, cw } = colsX(2, 0.4);
    await card(s, xs[0], 3.55, cw, 2.95, { icon: "FaExchangeAlt", title: "dir بيقلب كل شي لحاله", body: "اتجاه النص، وترتيب الـ flex والـ grid، ومكان الـ scrollbar", titleSize: 19, bodySize: 16 });
    await card(s, xs[1], 3.55, cw, 2.95, { icon: "FaVolumeUp", iconFill: C.accent2, title: "lang للمتصفح وقارئ الشاشة", body: "بيلفظوا صح، وبيفيد بمحركات البحث", titleSize: 19, bodySize: 16 });
  }
  s.addNotes("3 دقائق. افتح موقع الدورة بالـ DevTools وغيّر dir=\"rtl\" لـ ltr قدامهم.");

  s = newSlide("CONTENT", "اللغة · 2", "شو ما بينقلب لحاله", S3);
  await codeAndRows(s, "/* ثابت: ما بينقلب */\nmargin-left: 16px;\npadding-right: 8px;\n\n/* بيمشي مع الاتجاه */\nmargin-inline-start: 16px;\npadding-inline-end: 8px;", "css/style.css", [
    ["FaArrowsAltH", "left و right ثابتين", "«اليمين» مقابل «أول السطر»: inline بيمشي مع dir"],
    ["FaArrowRight", "أيقونات فيها اتجاه", "سهم «التالي» بده قلب بالعربي", C.accent2],
    ["FaFont", "الخط", "للعربي Tajawal أو Cairo. خطوط Stitch الإنجليزية (مثل CAFFEON) ما فيها عربي"],
  ], { codeH: 3.9, fs: 15, step: 1.3 });
  s.addNotes("3 دقائق.");

  s = newSlide("CONTENT", "اللغة · 3", "موقع بلغتين: طريقتين", S3);
  table(s, ["", "نسختين من كل صفحة", "زر تبديل بـ JavaScript"], [
    ["الفكرة", "index.html عربي، و en/index.html إنجليزي، وزر هو رابط", "صفحة وحدة، النصوص بـ object، والزر بيبدّلهم"],
    ["السهولة", "أسهل، بدون JS", "بدها JS متوسط"],
    ["العيب", "أي تعديل بينعمل مرتين", "كل نص لازم يكون إله مفتاح"],
    ["مناسبة لـ", "مواقع صغيرة نصها ثابت", "IT Team وتكنولوجيا (ميزة من ميزاتهم)"],
  ], { y: 1.8, colW: [1.8, 5.1, 5.233], rowH: 0.7, fs: 15 });
  callout(s, M, 5.85, CW, 0.75, "«أول شي الموقع كامل بلغة وحدة، والتبديل آخر شي». الكود بيجي بآخر JavaScript", { size: 16 });
  s.addNotes("4 دقائق. التعمق مع IT Team وتكنولوجيا على الطاولة.");

  // ===== JavaScript =====
  const S4 = "JavaScript";
  pres.addSection({ title: S4 });
  divider("2:15 · شرح 30 دقيقة على مراحل", "JavaScript: بيانات ← رسم ← حدث", "data.js · forEach · البحث · الفلترة · classList · المواضيع الخاصة", S4, "اكتب كل مرحلة بـ demo.html وشغّلها قدامهم. ابدأ بصفحة المشاريع بموقع الدورة: «بآخر هالنص ساعة بتعرفوا تعملوها».");

  s = newSlide("CONTENT", "JavaScript · النمط", "أغلب ميزاتكم نفس النمط", S4);
  await stepsFlow(s, [
    { icon: "FaDatabase", num: "1", title: "بيانات", body: "مصفوفة بـ data.js" },
    { icon: "FaPaintRoller", num: "2", title: "رسم", body: "loop بيرسم البطاقات" },
    { icon: "FaHandPointer", num: "3", title: "حدث", body: "كتابة، كبسة، اختيار" },
    { icon: "FaSyncAlt", num: "4", title: "رسم من جديد", body: "بالنتيجة الجديدة", dark: true },
  ], 1.9, 3.0, { bodySize: 15, titleSize: 19 });
  callout(s, M, 5.2, CW, 1.2, "المنيو والأدوات والكتب والأعمال كلها «مصفوفة بطاقات». والمتغيرات والـ loop و if والدوال بتلاقوها بأي كود بيكتبه الـ AI", { size: 15, bold: false });
  s.addNotes("دقيقة.");

  s = newSlide("CONTENT", "JavaScript · المرحلة 1", "المتغيرات والمصفوفة (data.js)", S4);
  codeBox(s, M, 1.8, CW, 1.9, 'const items = [\n  { id: 1, name: "لاتيه", category: "قهوة", price: 2.5, image: "images/latte.jpg" },\n  { id: 2, name: "تشيز كيك", category: "حلويات", price: 3, image: "images/cake.jpg" }\n];', "js/data.js", 14);
  {
    const { xs, cw } = colsX(3, 0.3);
    const T = [["FaBox", "const و let", "const للي ما بيتغير، let للي بيتغير: علبة عليها اسم"], ["FaIdCard", "object = بطاقة معلومات", "مفتاح وقيمة. والمصفوفة مجموعة بطاقات"], ["FaHashtag", "الـ id مهم", "بنستخدمه بصفحة التفاصيل"]];
    for (let i = 0; i < 3; i++) await card(s, xs[i], 3.95, cw, 2.55, { icon: T[i][0], iconFill: i === 1 ? C.accent2 : C.accent1, title: T[i][1], body: T[i][2], titleSize: 18, bodySize: 15 });
  }
  s.addNotes("4 دقائق.");

  s = newSlide("CONTENT", "JavaScript · المرحلة 2", "الرسم بـ loop", S4);
  await codeAndRows(s, 'const list =\n  document.getElementById("list");\n\nfunction render(arr) {\n  list.innerHTML = "";\n  arr.forEach(item => {\n    list.innerHTML += `\n      <div class="card">\n        <img src="${item.image}">\n        <h3>${item.name}</h3>\n        <p>${item.price} JD</p>\n      </div>`;\n  });\n}\nrender(items);', "js/main.js", [
    ["FaCrosshairs", "getElementById", "بنمسك عنصر من الـ HTML"],
    ["FaBook", "function", "وصفة بإسم: بنكتبها مرة وبنستدعيها كل ما بدنا", C.accent2],
    ["FaRedo", "forEach", "لكل بطاقة بالمصفوفة اعمل هالشي: موظف بيمرق عالطابور"],
    ["FaDollarSign", "${ } جوا الـ backticks", "بنحط قيمة جوا النص. وبتلاقوا كمان for (let i = 0; ...): نفس الفكرة", C.accent2],
  ], { codeH: 4.85, fs: 12.5, step: 1.2 });
  s.addNotes("6 دقائق. جرّب قدامهم: ضيف سطر بـ data.js واحفظ. بطاقة جديدة بدون ما نلمس الـ HTML. هاي أهم لحظة بالشرح.");

  s = newSlide("STATEMENT", "جرّب قدامهم", "سطر جديد بـ data.js = بطاقة جديدة", S4);
  s.addText("بدون ما نلمس الـ HTML", R({ x: M, y: 4.6, w: CW, h: 0.6, fontSize: 22, color: C.text2 }));

  s = newSlide("CONTENT", "JavaScript · المرحلة 3", "الأحداث والبحث", S4);
  await codeAndRows(s, 'const search =\n  document.getElementById("search");\n\nsearch.addEventListener("input", () => {\n  const q = search.value.trim();\n  render(items.filter(item =>\n    item.name.includes(q)));\n});', "js/main.js", [
    ["FaBell", "addEventListener", "«لما يصير هالشي، اعمل هالشي». input مع كل حرف، click مع الكبسة"],
    ["FaFilter", "filter", "مصفاة القهوة: مصفوفة جديدة فيها بس اللي الشرط صح عليهم، والأصلية ما بتتغير", C.accent2],
  ], { codeH: 3.8, fs: 14, step: 1.5 });
  s.addNotes("4 دقائق.");

  s = newSlide("CONTENT", "JavaScript · المرحلة 4", "الفلترة بالأزرار مع if", S4);
  codeBox(s, M, 1.8, 6.4, 1.3, '<button class="filter" data-cat="all">الكل</button>\n<button class="filter" data-cat="قهوة">قهوة</button>', "HTML", 12);
  codeBox(s, M, 3.25, 6.4, 3.3, 'document.querySelectorAll(".filter")\n  .forEach(btn => {\n  btn.addEventListener("click", () => {\n    const cat = btn.dataset.cat;\n    if (cat === "all") {\n      render(items);\n    } else {\n      render(items.filter(item =>\n        item.category === cat));\n    }\n  });\n});', "js/main.js", 12.5);
  await iconRows(s, [
    ["FaTrafficLight", "if / else", "إشارة المرور: إذا هيك اعمل هيك، وإلا اعمل غيره"],
    ["FaEquals", "===", "بيساوي بالضبط", C.accent2],
    ["FaTag", "data-cat و dataset.cat", "معلومة مخبّاة على الزر، و JS بيقرأها"],
  ], 7.2, W - M - 7.2, 1.8, 1.3, { ts: 17, bs: 14 });
  s.addNotes("4 دقائق.");

  s = newSlide("CONTENT", "JavaScript · المرحلة 5", "الـ hamburger والنوافذ: classList.toggle", S4);
  await codeAndRows(s, 'const menuBtn =\n  document.querySelector(".menu-btn");\nconst nav = document.querySelector("nav");\n\nif (menuBtn) {\n  menuBtn.addEventListener("click", () =>\n    nav.classList.toggle("open"));\n}', "js/main.js", [
    ["FaToggleOn", "toggle", "إذا الـ class موجود بيشيله، وإذا مش موجود بيحطه"],
    ["FaShieldAlt", "if (menuBtn)", "main.js واحد لكل الصفحات: كل ميزة بتتأكد إن عنصرها موجود", C.accent2],
    ["FaClone", "نفس الفكرة", "التبويبات، الـ accordion، النافذة المنبثقة، dark mode"],
  ], { codeH: 3.8, fs: 14, step: 1.3 });
  s.addNotes("3 دقائق.");

  s = newSlide("CONTENT", "JavaScript · Backend", "الميزات اللي بدها Backend: واجهة عرض", S4);
  await codeAndRows(s, 'form.addEventListener("submit", (e) => {\n  e.preventDefault(); // لا تبعت\n  msg.textContent =\n    "تم الاستلام ✔ (نسخة تجريبية)";\n});', "js/main.js", [
    ["FaEye", "الشكل كامل", "الدخول والحجز والدفع: الصفحة كاملة والزر بيطلّع رسالة"],
    ["FaServer", "ما في سيرفر بيحفظ", "موقع الدورة مثال على «هيك بيصير لما في Backend»: تسليمكم بيوصل عندي", C.accent2],
  ], { codeH: 3.0, fs: 14, step: 1.5 });
  callout(s, M, 5.2, CW, 1.2, "الـ Console صاحبكم: F12 ← Console. أي خطأ أحمر بينسخ كامل وبينلصق للـ AI (prompt 5)", { size: 16 });
  s.addNotes("دقيقتين + دقيقة Console: اغلط قدامهم غلطة مقصودة (Items بدل items) وورّيهم الخطأ.");

  s = newSlide("CONTENT", "المواضيع الخاصة · دقيقة لكل واحد", "مش كل فريق بحاجتها: اللي بحاجتها بمرق عليه", S4);
  {
    const T = [
      ["FaSave", "localStorage", 'localStorage.setItem(...)', "ذاكرة المتصفح: بتضل بعد الـ refresh، بس على نفس الجهاز. مش قاعدة بيانات", "the sun · IT · تكنولوجيا"],
      ["FaLink", "?id=", "details.html?id=3", "صفحة وحدة لـ 11 مصوّر: بتقرأ الرقم من الرابط وبتدوّر عليه بـ data.js", "DSA · آفاق · تكنولوجيا"],
      ["FaQuestionCircle", "منطق الاختبار", "score[cat]++", "كل جواب بيزيد نقطة لتصنيف، والنتيجة أعلى تصنيف: object و if", "آفاق"],
      ["FaLanguage", "تبديل اللغة", 'data-i18n="title"', "بيغيّر lang و dir، وبيبدّل النصوص بـ forEach، وبيحفظ بـ localStorage", "IT Team · تكنولوجيا"],
    ];
    const { xs, cw } = colsX(4, 0.25);
    for (let i = 0; i < 4; i++) {
      const x = xs[i], y = 1.8, h = 4.75;
      box(s, x, y, cw, h, C.background2);
      await iconCircle(s, T[i][0], x + cw - 0.85, y + 0.2, 0.6, i % 2 ? C.accent2 : C.accent1);
      s.addText(T[i][1], R({ x: x + 0.2, y: y + 0.95, w: cw - 0.4, h: 0.45, fontSize: 18, bold: true, color: C.text2 }));
      box(s, x + 0.15, y + 1.5, cw - 0.3, 0.6, C.text2);
      s.addText(T[i][2], { x: x + 0.25, y: y + 1.5, w: cw - 0.5, h: 0.6, fontSize: 11, color: "F1F4F8", fontFace: "Courier New", align: "left", valign: "middle", margin: 0, isTextBox: true });
      s.addText(T[i][3], R({ x: x + 0.2, y: y + 2.25, w: cw - 0.4, h: 1.8, fontSize: 14, color: "3E5266" }));
      s.addText(T[i][4], R({ x: x + 0.2, y: y + h - 0.55, w: cw - 0.4, h: 0.4, fontSize: 12, bold: true, color: C.accent2 }));
    }
  }
  s.addNotes("6 دقائق كلهم. التعمق على الطاولة وقت التطبيق، والكود الكامل بالسكربت.");

  s = newSlide("CONTENT", "تطبيق · prompt 3", "ميزة JavaScript خطوة خطوة", S4);
  promptBox(s, M, 1.75, CW, 3.7,
    "بدي أضيف ميزة [وصف الميزة، مثلاً: بحث وفلترة للمنيو حسب الفئة].\n" +
    "البيانات بملف data.js هيك: [الصق عنصرين من المصفوفة]\n" +
    "وهاد الـ HTML تبع الجزء: [الصقه]\n" +
    "اكتب الكود بـ JavaScript عادي، على خطوات، كل خطوة لحالها ومعها شرح بالعربي.\n" +
    "استخدم const/let و forEach و filter و addEventListener، ولا تستخدم مكتبات.\n" +
    "الكود بينضاف لـ main.js المشترك بين كل الصفحات: حطه بـ function باسم واضح، وجوا if بتتأكد إن العنصر موجود.\n" +
    "اعطيني الكود الجديد بس، ولا تعيد كتابة main.js كله.", "Prompt 3 · ميزة JavaScript", 14);
  {
    const { xs, cw } = colsX(2, 0.4);
    promptBox(s, xs[0], 5.6, cw, 1.0, "اشرحلي هالكود سطر سطر بالعربي البسيط... وبالآخر اسألني سؤال", "Prompt 4 · اشرحلي (بعد كل ميزة)", 13);
    promptBox(s, xs[1], 5.6, cw, 1.0, "شو سبب الخطأ بجملة، وبعدين اعطيني السطر المصلّح بس", "Prompt 5 · تصليح خطأ (مع الخطأ الأحمر)", 13);
  }
  s.addNotes("الـ prompts الكاملة بـ «ملفات الدورة».");

  s = newSlide("CONTENT", "تطبيق · 45 دقيقة", "ابنوا ميزاتكم", S4);
  practice(s, "الخطوات", [
    "أول ميزة: رسم البطاقات من data.js. بعدها البحث أو الفلترة",
    "كل ميزة بـ prompt 3، والكود الجديد بينضاف لـ main.js",
    "شغالة؟ prompt 4 على الكود، والفريق كله بيقرأ الشرح",
    "خطأ أحمر؟ prompt 5، والسطر المصلّح بس",
    "2:45: zip رقم 3",
  ], ["ميزة JavaScript وحدة على الأقل شغالة (غير الـ hamburger)", "أي واحد بيشرح سطر منها", "الـ Console نظيف"], 1.8, 4.7);
  s.addNotes("إنت بتلف حوالي 7 دقايق لكل فريق: آفاق، the sun، DSA، AI، تكنولوجيا، IT Team. بعدها ارجع لأي فريق واقف.");

  s = newSlide("CONTENT", "تطبيق · الحد الأدنى لكل فريق", "شو لازم يشتغل آخر اليوم؟", S4);
  table(s, ["الفريق", "الحد الأدنى آخر اليوم", "بكرا"], [
    ["آفاق", "4 صفحات، المكتبة من data.js مع فلترة، اختبار بـ 3 أسئلة بيطلّع كتاب", "الباقي"],
    ["the sun", "إعداد البنود بـ localStorage، ولوحة التحكم: السقف مقابل المصروف", "التنبيهات والطباعة"],
    ["DSA", "6 صفحات بالشكل، الاستكشاف ببحث وفلترة، التفاصيل بـ ?id=", "الدخول واللوحة واجهة عرض"],
    ["AI", "5 صفحات، المنيو بفلترة الفئات، وميزة JS ثانية (عداد سلة أو تبويبات)", "الحجز والدفع واجهة عرض"],
    ["تكنولوجيا", "4 صفحات، الأدوات بفلترة وبحث، ونسخ الـ prompt", "المقارنة وتبديل اللغة"],
    ["IT Team", "التقسيم لـ 4 صفحات و style.css و data.js، والفريق بيشرح الـ functions", "التحدي"],
  ], { y: 1.75, colW: [1.8, 7.4, 2.933], rowH: 0.72, fs: 14 });
  s.addNotes("مرجع إلك وإنت بتلف. التفاصيل بجدول «ملاحظات لكل فريق» بالسكربت.");

  s = newSlide("CONTENT", "للسريعين", "خلصتوا قبل الكل؟ اختاروا تحدي", S4);
  {
    const T = [["FaMoon", "dark mode", "classList.toggle مع حفظ الاختيار بـ localStorage"], ["FaArrowUp", "زر «للأعلى»", "بيظهر بعد الـ scroll"], ["FaMagic", "أنيميشن البطاقات", "ظهور البطاقات وإنت نازل بـ IntersectionObserver"]];
    const { xs, cw } = colsX(3, 0.3);
    for (let i = 0; i < 3; i++) await card(s, xs[i], 1.8, cw, 3.0, { icon: T[i][0], iconFill: i === 1 ? C.accent2 : C.accent1, title: T[i][1], body: T[i][2], titleSize: 19, bodySize: 15 });
  }
  callout(s, M, 5.1, CW, 1.1, "نفس الشرط: الفريق كله بيقدر يشرحه", { size: 18 });
  s.addNotes("خصوصاً IT Team.");

  // ===== Check & submit =====
  const S5 = "الفحص والتسليم";
  pres.addSection({ title: S5 });
  s = newSlide("CONTENT", "3:30 · الفحص · 15 دقيقة", "افحصوا موقعكم صفحة صفحة", S5);
  {
    const items = ["كل روابط الـ nav شغالة، من كل صفحة", "الـ Console نظيف (بدون أحمر) بكل صفحة", "الصور كلها محلية بمجلد images/", "ميزة JS وحدة على الأقل شغالة (غير الـ hamburger)", "الـ zip فيه المجلد كامل، مش index.html لحاله"];
    for (let i = 0; i < items.length; i++) {
      const y = 1.85 + i * 0.82;
      box(s, M, y, CW, 0.68, i % 2 ? "FFFFFF" : C.background2, "D5DCE4");
      s.addShape(pres.shapes.RECTANGLE, { x: W - M - 0.62, y: y + 0.17, w: 0.34, h: 0.34, fill: { color: "FFFFFF" }, line: { color: HEX.accent1, width: 2 }, objectName: "checkbox" });
      s.addText(items[i], R({ x: M + 0.3, y: y + 0.1, w: CW - 1.2, h: 0.48, fontSize: 18, color: C.text2, valign: "middle" }));
    }
  }
  callout(s, M, 6.05, CW, 0.6, "مشكلة ما انحلت بدقيقتين؟ اكتبوها بورقة لبكرا: اليوم 4 يوم الاختبار والإصلاح", { size: 14, bold: false });
  s.addNotes("إنت بتمرق دقيقة على كل فريق.");

  s = newSlide("CONTENT", "3:45 · التسليم", "من موقع الدورة ← التسليم ← اليوم 3", S5);
  {
    const { xs, cw } = colsX(3, 0.3);
    await card(s, xs[0], 1.8, cw, 3.5, { icon: "FaFileArchive", num: "الفريق · مرة وحدة", title: "zip الموقع كامل", body: "أي عضو بيرفعه (هاد zip رقم 4)", titleSize: 19, bodySize: 15 });
    await card(s, xs[1], 1.8, cw, 3.5, { icon: "FaUser", iconFill: C.accent2, num: "كل واحد باسمه", title: "سؤالين", body: "1. الصق function أو loop من كود فريقك (مش من مثال المدرب)، واشرح بكلماتك شو بيعمل سطر سطر\n2. شو الصفحة أو الجزء اللي بنيته اليوم؟", titleSize: 19, bodySize: 14 });
    await card(s, xs[2], 1.8, cw, 3.5, { icon: "FaPlusCircle", num: "اختياري", title: "شغل إضافي", body: "لأي حدا اشتغل شي لحاله على جهازه", titleSize: 19, bodySize: 15 });
  }
  callout(s, M, 5.55, CW, 0.95, "«مسموح prompt 4 عشان تفهموا، بس الجواب بكلماتكم. والمنسوخ من الـ AI بياخد ملاحظة «بكلماتك»»", { size: 15 });
  s.addNotes("10 دقائق. السؤال الأول عليه العلامة. كل واحد يختار كود غير تبع صاحبه إذا قدر.");

  s = newSlide("DIVIDER", "بكرا · اليوم الرابع", "بنخرّبه عن قصد، وبنصلّحه", S5);
  s.addText("DevTools · كل فريق بيجرب موقع فريق ثاني · بنكمل الميزات. اللي فاهم كوده بيصلّح بسرعة", R({ x: M, y: 4.3, w: CW, h: 0.9, fontSize: 18, color: "C9D6E0" }));
  s.addNotes("دقيقتين. واشكرهم على شغلة محددة شفتها اليوم.");

  // ===== Appendix =====
  const S9 = "ملحق";
  pres.addSection({ title: S9 });
  const ERR = [
    ["الصفحة بدون تنسيق أبداً", "مسار style.css غلط", "الملف بـ css/؟ الرابط css/style.css؟"],
    ["العربي طالع رموز", "ناقص meta charset", "أول سطر بالـ head"],
    ["البطاقات ما بتظهر", "main.js قبل data.js، أو الـ id غير", "الترتيب آخر الـ body، ونفس الاسم بالضبط"],
    ["Cannot read properties of null", "العنصر مش بهاي الصفحة", "if (list) { ... }"],
    ["is not defined", "اسم غلط أو الملف مش مربوط", "JS بيفرق بين الكبير والصغير"],
    ["الصور مكسّرة", "مسافة أو عربي بالاسم، أو .JPG", "أسماء إنجليزي صغيرة بدون مسافات"],
    ["الـ AI رجّع Tailwind", "نسي الشرط", "«بدون Tailwind، CSS عادي بـ style.css»"],
    ["الـ AI مسح شغل سابق", "كتب الملف كله من جديد", "«الكود الجديد بس»، وارجع لآخر zip"],
    ["الـ AI وقف بنص الكود", "الرد أطول من الحد", "«كمّل من حيث وقفت»، أو قسم قسم"],
    ["الـ AI غيّر الألوان", "نسي سياق المحادثة", "ذكّره، أو محادثة جديدة والصق style.css"],
    ["الموقع مقلوب بالعربي", "ناقص dir=\"rtl\" أو margin-left", "dir على <html>، و margin-inline-start"],
    ["بيخرب على جهاز ثاني", "مسار مطلق C:\\Users\\...", "مسارات نسبية بس"],
    ["localStorage مش على جهاز ثاني", "هيك بيشتغل أصلاً", "اربطها بـ «ليش المواقع بدها Backend»"],
    ["Live Server ما بيفتح", "فاتح ملف مش مجلد", "File ← Open Folder"],
  ];
  for (let part = 0; part < 2; part++) {
    s = newSlide("CONTENT", "ملحق · مرجع إلك وإنت بتلف", `أخطاء متوقعة وحلها (${part + 1} من 2)`, S9);
    table(s, ["العرض", "السبب", "الحل"], ERR.slice(part * 7, part * 7 + 7), { y: 1.8, colW: [3.6, 3.9, 4.633], rowH: 0.62, fs: 14 });
    s.addNotes("القاعدة العامة: احفظت؟ المسار صح؟ الاسم نفسه؟");
  }

  await pres.writeFile({ fileName: "day3-ar.pptx" });
  await applyTheme("day3-ar.pptx", THEME);
  console.log("done");
}
build().catch((e) => { console.error(e); process.exit(1); });
