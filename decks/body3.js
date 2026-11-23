
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
  s.addText(label || "Prompt · انسخ وعبّي الأقواس", R({ x: x + 0.3, y: y + 0.15, w: w - 0.6, h: 0.35, fontSize: 13, bold: true, color: HEX.accent6 }));
  s.addText(text, R({ x: x + 0.3, y: y + 0.6, w: w - 0.6, h: h - 0.8, fontSize: fs, color: C.background1, paraSpaceAfter: 2 }));
}
function numList(s, items, x, y, w, h, fs = 16) {
  s.addText(items.map((t, i) => ({ text: `${i + 1}. ${t}`, options: { breakLine: i < items.length - 1, paraSpaceAfter: 8, rtlMode: true } })), R({ x, y, w, h, fontSize: fs, color: C.text1 }));
}
function practice(s, title, steps, success, y = 1.8) {
  // left: success; right: steps
  const { xs, cw } = colsX(2, 0.4);
  box(s, xs[0], y, cw, 4.0, C.background2);
  s.addText(title, R({ x: xs[0] + 0.3, y: y + 0.2, w: cw - 0.6, h: 0.45, fontSize: 18, bold: true, color: C.accent1 }));
  numList(s, steps, xs[0] + 0.3, y + 0.75, cw - 0.6, 3.1, 15);
  box(s, xs[1], y, cw, 4.0, C.text2);
  s.addText("مؤشر النجاح", R({ x: xs[1] + 0.3, y: y + 0.2, w: cw - 0.6, h: 0.45, fontSize: 18, bold: true, color: C.accent6 }));
  s.addText(bullets(success, { space: 10 }), R({ x: xs[1] + 0.3, y: y + 0.75, w: cw - 0.6, h: 3.1, fontSize: 16, color: C.background1 }));
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
  s.addNotes("مبارح صممتوا موقعكم بـ Stitch. بس هاد التصميم صورة: ما بتقدر تكبس على زر فيه. اليوم بنحوله لموقع حقيقي بيفتح بالمتصفح.");

  s = newSlide("CONTENT", "افتتاح · من التصميم للكود", "اليوم بنحوّل الصورة لموقع بيشتغل", S0);
  await stepsFlow(s, [
    { icon: "FaImage", num: "1", title: "تصميم Stitch", body: "صورة لكل صفحة + دليل التصميم" },
    { icon: "FaComments", num: "2", title: "Prompt للـ AI", body: "ChatGPT أو Claude، قسم قسم" },
    { icon: "FaCode", num: "3", title: "الكود", body: "HTML وCSS وJavaScript، بتفهموه وبتراجعوه" },
    { icon: "FaGlobe", num: "4", title: "المتصفح", body: "موقع بيفتح على Live Server", dark: true },
  ], 1.9, 3.2, { bodySize: 15, titleSize: 19 });
  callout(s, M, 5.45, CW, 0.95, "اعرض شاشة Stitch لموقع الدورة جنب النسخة الشغالة، واكبس على الـ hamburger والـ accordion", { size: 16 });
  s.addNotes("هاي اللحظة اللي بتشدهم: نفس التصميم، بس هلأ بيتكبس عليه. دقيقتين.");

  s = newSlide("CONTENT", "افتتاح · ليش هيك؟", "ليش HTML وCSS عادي، ومش كود Stitch؟", S0);
  {
    const Q = [["FaRandom", "كود Stitch صعب القراءة", "بيصدّر Tailwind: كلاسات كتير بكل سطر، صعب على مبتدئ يفهمه أو يعدله"], ["FaSearch", "بدنا نفهم كل سطر", "عشان نقدر نصلح ونعدل بالاختبار باليوم الرابع"], ["FaUserCog", "إنتو المراجعين", "التصميم هو المرجع، الـ AI بيكتب، وإنتو بتفهموا وبتقرروا"]];
    const { xs, cw } = colsX(3, 0.3);
    for (let i = 0; i < 3; i++) await card(s, xs[i], 1.9, cw, 3.6, { icon: Q[i][0], title: Q[i][1], body: Q[i][2], titleSize: 19, titleH: 0.9, bodySize: 15 });
  }
  callout(s, M, 5.8, CW, 0.7, "ممنوع اليوم: Tailwind أو Bootstrap أو أي framework", { size: 16 });
  s.addNotes("دقيقتين. القاعدة الذهبية من اليوم الأول: إذا ما بتقدر تشرح الكود بجملة، لا تحطه بموقعك.");

  s = newSlide("CONTENT", "افتتاح · هدف اليوم", "الحد الأدنى المطلوب آخر اليوم", S0);
  {
    const D = [["FaHome", "الرئيسية كاملة", "ومطابقة لتصميم Stitch"], ["FaLink", "كل الصفحات موجودة", "ومربوطة ببعض من الـ nav"], ["FaMagic", "ميزتين تفاعليتين", "شغالات (الـ hamburger ما بينحسب)"], ["FaLayerGroup", "نسخة مدموجة", "بتشتغل على Live Server"]];
    const { xs, cw } = colsX(4, 0.3);
    for (let i = 0; i < 4; i++) await card(s, xs[i], 1.85, cw, 2.9, { icon: D[i][0], num: String(i + 1), title: D[i][1], body: D[i][2], titleSize: 18, bodySize: 15 });
  }
  callout(s, M, 5.1, CW, 1.2, "«مش مطلوب تخلصوا كل الصفحات كاملة اليوم. المطلوب: الرئيسية كاملة، كل الصفحات موجودة ومربوطة، والميزتين شغالات. الباقي بنكمله بكرا.»", { size: 16 });
  s.addNotes("الجملة على الشاشة هي الجملة المهمة. 3 دقائق مع الأجندة.");

  s = newSlide("CONTENT", "أجندة اليوم", "شو رح نعمل اليوم؟", S0);
  table(s, ["الوقت", "الجزء", "الموضوع"], [
    ["0:00", "افتتاح", "من التصميم للكود، الحد الأدنى، قواعد الفريق"],
    ["0:10", "الدورة 1", "HTML وبناء الهيكل بالـ AI"],
    ["0:40", "الدورة 2", "أساسيات CSS والمتغيرات + نقطة المشاركة"],
    ["1:10", "الدورة 3", "بناء الصفحات قسم قسم + الصور"],
    ["1:50", "استراحة", "15 دقيقة"],
    ["2:05", "الدورة 4", "التوافق مع الجوال"],
    ["2:25", "الدورة 5", "أساسيات JavaScript والميزات التفاعلية"],
    ["3:08", "الدورة 6", "باقي الصفحات"],
    ["3:35", "الدورة 7", "الدمج والفحص"],
    ["3:55", "الختام", "التقييم ولمحة عن بكرا"],
  ], { y: 1.8, colW: [1.6, 2.2, 8.333], rowH: 0.44, fs: 14 });
  s.addNotes("اليوم يوم البناء: 70 دقيقة شرح و140 تطبيق.");

  s = newSlide("CONTENT", "افتتاح · قواعد الفريق", "كل ملف إله مالك واحد بس", S0);
  table(s, ["الملف", "المالك", "ملاحظة"], [
    ["style.css", "A بس", "المتغيرات والـ header والـ footer والأزرار"],
    ["js/main.js", "A بس", "كود الـ hamburger"],
    ["ملفات HTML", "كل صفحة لمالك واحد", "مثلاً A: index وabout · B: menu وcontact"],
    ["css/[page].css", "مالك الصفحة", "تنسيق الصفحة الخاص فيها"],
    ["js/[feature].js", "اللي بيبني الميزة", "كل ميزة بملف لحالها"],
    ["images/", "الكل", "page-desc.jpg، أحرف صغيرة، بدون مسافات"],
  ], { y: 1.8, colW: [2.6, 2.8, 6.733], rowH: 0.5, fs: 15 });
  callout(s, M, 5.6, CW, 0.85, "B بده يغير لون مشترك؟ بيبعث التغيير لـ A برسالة. بده شي خاص بصفحته؟ بيحطه بـ css/[page].css", { size: 15, bold: false });
  s.addNotes("وزّع الورقة المطبوعة. كل فريق يحدد مين A ومين B، ويكتب مين بيملك أي صفحة. A غالباً الأقوى لأنه مالك الملفات المشتركة. 3 دقائق.");

  s = newSlide("STATEMENT", "القاعدة الذهبية لليوم", "ما حدا بيعدّل ملف مش إله", S0);
  s.addText("هيك الدمج آخر اليوم بيصير نسخ ملفات بس، بدون ما حدا يمسح شغل الثاني", R({ x: M, y: 4.6, w: CW, h: 0.6, fontSize: 20, color: C.text2 }));
  s.addNotes("كررها 3 مرات باليوم: هلأ، آخر C2، وبالدمج. وابعث ملف الـ prompts على الجروب.");

  // ===== C1 =====
  const S1 = "الدورة 1: HTML";
  pres.addSection({ title: S1 });
  divider("الدورة 1 · 30 دقيقة", "HTML وبناء الهيكل بالـ AI", "هيكل الصفحة · Semantic tags · المجلدات والمسارات · Prompt موحد", S1, "شرح 12 دقيقة، تطبيق 18 على لابتوب A.");

  s = newSlide("CONTENT", "الدورة 1 · تذكير", "هيكل أي صفحة (من بطاقة التعريف)", S1);
  codeBox(s, M, 1.8, 6.4, 4.7, '<!DOCTYPE html>\n<html lang="ar" dir="rtl">\n<head>\n  <meta charset="UTF-8">\n  <meta name="viewport"\n    content="width=device-width,\n    initial-scale=1.0">\n  <title>مخبز الأمل</title>\n  <link rel="stylesheet" href="style.css">\n</head>\n<body>\n  ...\n</body>\n</html>', "index.html", 14);
  await iconRows(s, [
    ["FaLanguage", 'lang="ar" dir="rtl"', "اللغة عربي والاتجاه من اليمين"],
    ["FaFont", "meta charset", "بدونه العربي بيطلع رموز غريبة"],
    ["FaMobileAlt", "meta viewport", "عشان الموقع يناسب الجوال", C.accent2],
    ["FaEyeSlash", "<head>", "معلومات للمتصفح ما بتظهر", C.accent2],
    ["FaEye", "<body>", "كل شي بيشوفه الزائر"],
  ], 7.3, W - M - 7.3, 1.8, 0.95, { ts: 17, bs: 14 });
  s.addNotes("افتح كود بطاقة التعريف من اليوم الأول وامرق عليه. 3 دقائق.");

  s = newSlide("CONTENT", "الدورة 1 · Semantic tags", "الصفحة زي الجريدة: رأس وجسم وذيل", S1);
  {
    // page diagram on left
    const px = M, py = 1.8, pw = 5.0;
    box(s, px, py, pw, 4.8, "FFFFFF", "D5DCE4");
    const blk = (y, h, t, fill, col) => { s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: px + 0.2, y, w: pw - 0.4, h, rectRadius: 0.08, fill: { color: fill }, line: { color: fill, width: 0 }, objectName: "tag-block" }); s.addText(t, { x: px + 0.2, y, w: pw - 0.4, h, fontSize: 16, bold: true, color: col, align: "center", valign: "middle", fontFace: "Courier New", margin: 0, isTextBox: true }); };
    blk(py + 0.2, 0.7, "<header>  logo + <nav>", HEX.dk2, HEX.lt1);
    s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: px + 0.2, y: py + 1.05, w: pw - 0.4, h: 2.85, rectRadius: 0.08, fill: { color: HEX.lt2 }, line: { color: HEX.accent1, width: 1.5 }, objectName: "main-block" });
    s.addText("<main>", { x: px + 0.35, y: py + 1.1, w: 2, h: 0.4, fontSize: 14, bold: true, color: HEX.accent1, fontFace: "Courier New", align: "left", margin: 0, isTextBox: true });
    blk(py + 1.55, 1.0, "<section> hero", HEX.accent6, HEX.dk2);
    blk(py + 2.7, 1.0, "<section> services", HEX.accent3, HEX.dk2);
    blk(py + 4.05, 0.55, "<footer>", HEX.dk2, HEX.lt1);
  }
  table(s, ["Tag", "وظيفته"], [
    ["header / nav", "رأس الصفحة وروابط التنقل"],
    ["main / section", "المحتوى، مقسوم أقسام"],
    ["footer", "ذيل الصفحة: تواصل وحقوق"],
    ["h1 – h3 / p", "عناوين (h1 واحد بس) وفقرات"],
    ["a href", "رابط، وhref وين بيودّي"],
    ["img src alt", "صورة، مسارها، ووصفها"],
    ["button / form", "زر بيعمل شي / نموذج"],
  ], { x: 6.0, y: 1.8, w: W - M - 6.0, colW: [2.6, 4.133], rowH: 0.55, fs: 14 });
  s.addNotes("ارسم مربعات على شاشة Stitch وسمّي كل tag. ليش مش كله div؟ لأن قارئ الشاشة للمكفوفين وGoogle بيفهموا الصفحة من هاي الأسماء. 5 دقائق.");

  s = newSlide("CONTENT", "الدورة 1 · الملفات", "المجلدات والمسارات", S1);
  codeBox(s, M, 1.8, 5.2, 4.7, "my-bakery/\n  index.html\n  menu.html\n  contact.html\n  style.css\n  css/\n    index.css\n    menu.css\n  js/\n    main.js\n  images/\n    index-hero.jpg", "شجرة المشروع", 15);
  await iconRows(s, [
    ["FaRoute", "المسار النسبي", "images/index-hero.jpg يعني: ادخل مجلد images وخد الصورة"],
    ["FaBan", "ممنوع C:\\Users\\...", "بيشتغل عندك بس، وبيخرب عند أي حدا ثاني", C.accent2],
    ["FaFileSignature", "أسماء الملفات", "إنجليزي، أحرف صغيرة، بدون مسافات (استعمل -)"],
  ], 6.2, W - M - 6.2, 1.9, 1.5, { ts: 18, bs: 15 });
  s.addNotes("4 دقائق. ارسم الشجرة واسألهم: كيف بوصل للصورة من index.html؟");

  s = newSlide("CONTENT", "الدورة 1 · Prompt موحد", "Prompt الهيكل: نفس الشي لكل الفرق", S1);
  promptBox(s, M, 1.75, CW, 4.2,
    "بدي تبنيلي هيكل موقع بـ HTML وCSS وJavaScript عادي، بدون أي framework أو library (لا Tailwind ولا Bootstrap).\n" +
    "اسم الموقع: [..] · الصفحات: [index.html الرئيسية، ...] · الألوان: primary [#..] secondary [#..] accent [#..] background [#..] text [#..] · الخطوط: [..] من Google Fonts\n" +
    "1. مجلدات css وjs وimages.\n" +
    "2. كل صفحة: lang=\"ar\" dir=\"rtl\"، meta charset وviewport، عنوان خاص، رابط لـ style.css ولـ css/[اسم الصفحة].css.\n" +
    "3. نفس الـ header (شعار + nav لكل الصفحات + زر hamburger) ونفس الـ footer، وmain فاضي.\n" +
    "4. js/main.js مربوط بـ defer، فيه فتح وسكر الـ hamburger.\n" +
    "5. style.css: المتغيرات بـ :root (--primary, --secondary, --accent, --bg, --text, --font-heading, --font-body) + الـ header والـ footer والأزرار بس.\n" +
    "6. ملفات css/[الصفحة].css فاضية. 7. الكلاسات إنجليزي والتعليقات عربي.\n" +
    "اعطيني كل ملف كامل مع اسمه ومساره، واشرحلي بسطرين وظيفة كل ملف.", "Prompt الهيكل · بملف الـ prompts على الجروب", 13);
  callout(s, M, 6.1, CW, 0.6, "ليش موحد؟ نفس الأسماء عند الكل، فبتقدر تساعد أي فريق بسرعة، والدمج بيصير سهل", { size: 14, bold: false });
  s.addNotes("لو الـ AI وقف بنص الرد: «كمّل من حيث وقفت». الـ prompt الكامل بملف الـ prompts.");

  s = newSlide("CONTENT", "الدورة 1 · تطبيق · 18 دقيقة", "ابنوا هيكل موقعكم (على لابتوب A)", S1);
  practice(s, "الخطوات", ["عبّوا الـ prompt من دليل التصميم وقائمة الصفحات", "أنشئوا المجلد بـ VS Code وانسخوا كل ملف لمكانه", "افتحوا index.html بـ Live Server", "اكبسوا على كل رابط بالـ nav", "كل عضو يشرح لزميله وظيفة ملف واحد"], ["الموقع بيفتح", "الـ header والـ footer بكل الصفحات", "كل الروابط شغالة", "العربي ظاهر صح", "مش مهم الشكل لسا"]);
  callout(s, M, 6.0, CW, 0.6, "أكثر غلطة: style.css جوا مجلد css بالغلط", { size: 15 });
  s.addNotes("لف وتأكد من مكان الملفات والعربي.");

  // ===== C2 =====
  const S2 = "الدورة 2: CSS";
  pres.addSection({ title: S2 });
  divider("الدورة 2 · 30 دقيقة", "أساسيات CSS والمتغيرات", "شكل القاعدة · Box model · Flexbox · المتغيرات · نقطة المشاركة", S2, "الهدف مش إنهم يكتبوا CSS، الهدف يقرأوه ويعدلوا قيمة ويفهموا شو بيطلبوا من الـ AI.");

  s = newSlide("CONTENT", "الدورة 2 · شكل القاعدة", "كل قاعدة CSS: مين؟ شو؟ لأي قيمة؟", S2);
  codeBox(s, M, 1.8, 5.6, 3.2, ".btn {\n  background: var(--primary);\n  color: white;\n  padding: 12px 24px;\n}", "style.css", 18);
  codeBox(s, M, 5.2, 5.6, 1.3, '<a class="btn">احجز الآن</a>', "HTML", 16);
  await iconRows(s, [
    ["FaCrosshairs", "selector", "‏.btn: مين بدي أنسّق (النقطة يعني class)"],
    ["FaSlidersH", "property", "background: شو بدي أغير", C.accent2],
    ["FaTag", "value", "var(--primary): لأي قيمة"],
    ["FaLink", "class هو الجسر", "نفس الاسم بالـ HTML وبالـ CSS", C.accent2],
  ], 6.6, W - M - 6.6, 1.8, 1.18, { ts: 17, bs: 15 });
  s.addNotes("دقيقتين.");

  s = newSlide("CONTENT", "الدورة 2 · Box model", "كل عنصر زي برواز صورة على الحيط", S2);
  {
    const x0 = M, y0 = 1.8, w0 = 6.2, h0 = 4.7;
    const layer = (i, fill, label, col, dash) => {
      const d = i * 0.6;
      s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: x0 + d, y: y0 + d, w: w0 - 2 * d, h: h0 - 2 * d, rectRadius: 0.1, fill: { color: fill }, line: { color: dash ? HEX.accent4 : fill, width: dash ? 1.5 : 0, dashType: dash ? "dash" : "solid" }, objectName: "box-" + label });
      s.addText(label, { x: x0 + d + 0.15, y: y0 + d + 0.08, w: 2.5, h: 0.4, fontSize: 15, bold: true, color: col, align: "left", margin: 0, isTextBox: true, fontFace: "Courier New" });
    };
    layer(0, "FFFFFF", "margin", HEX.accent4, true);
    layer(1, HEX.dk2, "border", HEX.lt1);
    layer(2, HEX.accent2, "padding", HEX.lt1);
    layer(3, HEX.accent3, "content", HEX.dk2);
  }
  table(s, ["الجزء", "بالبرواز", "المعنى"], [
    ["content", "الصورة نفسها", "النص أو الصورة"],
    ["padding", "الورق الأبيض حوالين الصورة", "مسافة جوا العنصر"],
    ["border", "البرواز", "الحدود"],
    ["margin", "المسافة للبرواز الجار", "مسافة برا العنصر"],
  ], { x: 7.1, y: 1.8, w: W - M - 7.1, colW: [1.4, 2.4, 1.833], rowH: 0.62, fs: 14 });
  callout(s, 7.1, 5.1, W - M - 7.1, 1.4, "جرّب قدامهم: F12 وhover على زر. الـ padding بالأخضر والـ margin بالبرتقالي", { size: 15, bold: false });
  s.addNotes("4 دقائق. غيّر القيمة من DevTools وخليهم يشوفوا.");

  s = newSlide("CONTENT", "الدورة 2 · Flexbox", "Flexbox زي رف كتب", S2);
  codeBox(s, M, 1.8, 6.6, 3.4, "nav ul {\n  display: flex;\n  gap: 24px;\n  justify-content: space-between;\n  align-items: center;\n}", "style.css", 17);
  await iconRows(s, [
    ["FaColumns", "display: flex", "حط العناصر جنب بعض"],
    ["FaArrowsAltH", "gap", "المسافة بينهن", C.accent2],
    ["FaAlignJustify", "justify-content", "توزيعهن بالعرض"],
    ["FaAlignCenter", "align-items", "محاذاتهن بالطول", C.accent2],
  ], 7.6, W - M - 7.6, 1.8, 0.85, { ts: 17, bs: 14 });
  callout(s, M, 5.45, CW, 1.05, "بالعربي: مع dir=\"rtl\" الصف بيبلش من اليمين تلقائياً. ولو الـ AI حط margin-left والمسافات غلط، اطلب gap أو margin-inline-start", { size: 15, bold: false });
  s.addNotes("4 دقائق.");

  s = newSlide("CONTENT", "الدورة 2 · المتغيرات", "المتغير زي علبة دهان مكتوب عليها اسمها", S2);
  codeBox(s, M, 1.8, 6.6, 3.0, ":root {\n  --primary: #E07A2F;\n  --text: #13293D;\n  --font-heading: 'Cairo', sans-serif;\n}\nh1 {\n  color: var(--text);\n  font-family: var(--font-heading);\n}", "style.css", 15);
  {
    const x = 7.6, w = W - M - 7.6;
    await card(s, x, 1.8, w, 3.0, { icon: "FaFillDrip", title: "بتغيّر مرة وحدة", body: "بتغير اللي جوا العلبة، وكل الحيطان بتتغير. غيّر --primary وشوف كل الأزرار بكل الصفحات تتغير", titleSize: 19, bodySize: 15 });
  }
  callout(s, M, 5.1, CW, 1.3, "متغيرات المشروع السبعة: --primary · --secondary · --accent · --bg · --text · --font-heading · --font-body", { size: 16 });
  s.addNotes("دقيقتين. جرّب تغيير --primary قدامهم.");

  s = newSlide("CONTENT", "الدورة 2 · تطبيق · 18 دقيقة", "طابقوا الألوان والخطوط والـ header", S2);
  {
    const { xs, cw } = colsX(2, 0.4);
    box(s, xs[0], 1.8, cw, 4.7, C.background2);
    s.addText("الخطوات", R({ x: xs[0] + 0.3, y: 2.0, w: cw - 0.6, h: 0.45, fontSize: 18, bold: true, color: C.accent1 }));
    numList(s, ["تأكدوا إن قيم :root نفس دليل التصميم (الـ AI أحياناً بيغيرها)", "Google Fonts: اختاروا الخط وانسخوا الـ <link> للـ <head> بكل صفحة", "قارنوا الـ header والـ footer بشاشة Stitch، واطلبوا تعديل بالـ prompt"], xs[0] + 0.3, 2.55, cw - 0.6, 3.8, 15);
    promptBox(s, xs[1], 1.8, cw, 4.7, "هاد الـ header تبعي حالياً [الصق الكود]. بدي يصير زي هاي الصورة [ارفق screenshot].\n\nعدّل بـ style.css بس، استعمل المتغيرات الموجودة، وقلي شو غيّرت.", "Prompt تعديل الـ header", 16);
  }
  s.addNotes("لف على الفرق. نبّه قبل نهاية C2 بـ 5 دقائق على نقطة المشاركة.");

  s = newSlide("CONTENT", "الدورة 2 · آخر 3 دقائق", "نقطة المشاركة: من هون كل واحد على جهازه", S2);
  await stepsFlow(s, [
    { icon: "FaFileArchive", num: "1", title: "A بيضغط المجلد", body: "كليك يمين ← Compress to ZIP" },
    { icon: "FaWhatsapp", num: "2", title: "بيبعثه لـ B", body: "على WhatsApp Web" },
    { icon: "FaFolderOpen", num: "3", title: "B بيفتحه", body: "بـ VS Code ← Open Folder" },
    { icon: "FaCheckCircle", num: "4", title: "Live Server", body: "B بيتأكد إنه شغال عنده", dark: true },
  ], 1.9, 3.2, { bodySize: 15, titleSize: 18 });
  callout(s, M, 5.45, CW, 0.95, "ما حدا يكمّل لـ C3 قبل ما النسخة تشتغل عند B", { size: 17 });
  s.addNotes("لو فريق فردي بيتخطى هاي الخطوة.");

  // ===== C3 =====
  const S3 = "الدورة 3: بناء الصفحات";
  pres.addSection({ title: S3 });
  divider("الدورة 3 · 40 دقيقة", "بناء الصفحات قسم قسم", "بناء حي · Prompt القسم · الصور · أطول تطبيق باليوم", S3, "شرح 10 دقائق، تطبيق 30. هون بيبلش الشغل المنفصل.");

  s = newSlide("CONTENT", "الدورة 3 · الفكرة", "ما بنطلب الصفحة كاملة بمرة وحدة", S3);
  await stepsFlow(s, [
    { icon: "FaCut", num: "1", title: "قص القسم", body: "من شاشة Stitch: Win + Shift + S" },
    { icon: "FaPaste", num: "2", title: "الصق الـ prompt", body: "مع الصورة" },
    { icon: "FaCopy", num: "3", title: "انسخ الكود", body: "HTML جوا main، وCSS بـ css/[page].css" },
    { icon: "FaSave", num: "4", title: "احفظ وشوف", body: "Ctrl + S والمتصفح" },
    { icon: "FaQuestion", num: "5", title: "اشرحلي سطر سطر", body: "افهم قبل ما تكمل", dark: true },
  ], 1.9, 3.3, { bodySize: 14, titleSize: 16 });
  callout(s, M, 5.5, CW, 0.95, "الـ AI لما يكتب كود طويل بيغلط أكثر، وإنت ما بتعرف وين الغلط. قسم قسم: بتطلب، بتلصق، بتجرب", { size: 15, bold: false });
  s.addNotes("ابنِ قسم الـ hero لموقع الدورة قدامهم، 7 دقائق.");

  s = newSlide("CONTENT", "الدورة 3 · Prompt القسم", "Prompt: قسم واحد من الصفحة", S3);
  promptBox(s, M, 1.75, 7.6, 4.85,
    "بدي تبنيلي قسم واحد بس من صفحة [اسم الصفحة]، زي الصورة المرفقة.\nالقسم: [hero / الخدمات / آراء العملاء / ...]\nالمحتوى الحقيقي: [العناوين والنصوص بالعربي]\n\nالشروط:\n• HTML بس لهاد القسم، جوا <section> بـ class واضح، عشان أحطه جوا <main>.\n• CSS لهاد القسم بس، بحطه بـ css/[اسم الصفحة].css.\n• استعمل المتغيرات الموجودة، وما تكتب ألوان جديدة.\n• بدون Tailwind أو أي library.\n• الصور من images بالأسماء: [..]، وكل صورة إلها alt بالعربي.\n• الكلاسات إنجليزي وتبدأ باسم القسم (hero-title)، والتعليقات عربي.", "Prompt القسم", 14);
  {
    const x = 8.6, w = W - M - 8.6;
    await card(s, x, 1.75, w, 2.3, { icon: "FaTags", title: "ليش hero-title؟", body: "عشان ما يطلع .title مرتين والواحد يخرّب الثاني", titleSize: 17, bodySize: 14 });
    await card(s, x, 4.25, w, 2.35, { icon: "FaRedo", iconFill: C.accent2, title: "بعد كل قسم", body: "احفظ ← شوف ← شغال؟ كمّل. مش شغال؟ صلحه هلأ", titleSize: 17, bodySize: 14 });
  }
  s.addNotes("بعدها: «اشرحلي الكود سطر سطر» واقرأ معهم سطرين.");

  s = newSlide("CONTENT", "الدورة 3 · الصور", "من وين نجيب الصور؟", S3);
  {
    const { xs, cw } = colsX(2, 0.4);
    await card(s, xs[0], 1.8, cw, 2.6, { icon: "FaCamera", title: "Unsplash", body: "صور حقيقية: أكل، أماكن، ناس، مكاتب. مجاني ومسموح. نزّل بحجم Medium مش Original", titleSize: 20, bodySize: 15 });
    await card(s, xs[1], 1.8, cw, 2.6, { icon: "FaRobot", iconFill: C.accent2, title: "توليد بالـ AI", body: "لشي مش موجود: شعار، رسمة خاصة. بياخذ وقت وإله حد يومي، والنص العربي جوا الصورة غالباً بيطلع غلط", titleSize: 20, bodySize: 15 });
  }
  {
    const T = [["alt بيوصف الصورة", "«كعكة شوكولاتة بالفراولة»، مش «صورة»"], ["التسمية", "[الصفحة]-[الوصف].jpg، أحرف صغيرة"], ["أكبر من 1MB؟", "ضغطها بـ squoosh.app قبل ما تحطها"]];
    const { xs, cw } = colsX(3, 0.3);
    for (let i = 0; i < 3; i++) await card(s, xs[i], 4.65, cw, 1.85, { title: T[i][0], body: T[i][1], titleSize: 17, bodySize: 15 });
  }
  s.addNotes("3 دقائق. الصور الكبيرة بتبطّئ الموقع، وبنفحص هاد باليوم الرابع.");

  s = newSlide("CONTENT", "الدورة 3 · تطبيق · 30 دقيقة", "كل واحد على جهازه", S3);
  {
    const { xs, cw } = colsX(2, 0.4);
    await card(s, xs[0], 1.8, cw, 2.4, { icon: "FaHome", num: "A", title: "الصفحة الرئيسية", body: "قسم قسم. هاي الأولوية لأنها من الحد الأدنى", titleSize: 20, bodySize: 15 });
    await card(s, xs[1], 1.8, cw, 2.4, { icon: "FaFileAlt", iconFill: C.accent2, num: "B", title: "أول صفحة من صفحاته", body: "بنفس الطريقة، والصور لصفحاته بس", titleSize: 20, bodySize: 15 });
  }
  callout(s, M, 4.45, CW, 0.75, "بعد كل قسمين: ورّي زميلك النتيجة (دقيقة وحدة)", { size: 16 });
  s.addText([{ text: "إنت بتلف · دوّر على: ", options: { bold: true, color: HEX.accent1, rtlMode: true } }, { text: "CSS محطوط بـ style.css بدل ملف الصفحة (خصوصاً عند B) · كلاسات Tailwind زي flex px-4 · ألوان hex جديدة بدل المتغيرات", options: { rtlMode: true } }], R({ x: M, y: 5.4, w: CW, h: 1.1, fontSize: 15, color: C.text1 }));
  s.addNotes("مؤشر النجاح: نص الرئيسية على الأقل عند A، وقسمين من صفحة B.");

  s = newSlide("STATEMENT", "من 1:50 لـ 2:05", "استراحة 15 دقيقة", S3);
  s.addText("احفظوا كل شي (Ctrl + S) وسكروا اللابتوب، مش تطفوه", R({ x: M, y: 4.6, w: CW, h: 0.6, fontSize: 20, color: C.text2 }));
  s.addNotes("استغل أول 5 دقائق تمرّ على الفرق المتأخرة.");

  // ===== C4 =====
  const S4 = "الدورة 4: الجوال";
  pres.addSection({ title: S4 });
  divider("الدورة 4 · 20 دقيقة", "التوافق مع الجوال", "DevTools · Media query · Prompt الإصلاح", S4, "شرح 8 دقائق، تطبيق 12. اسألهم: مين فتح موقع من الجوال اليوم؟");

  s = newSlide("CONTENT", "الدورة 4 · افحص", "شوف موقعك كأنه على جوال", S4);
  await stepsFlow(s, [
    { icon: "FaKeyboard", num: "1", title: "F12", body: "افتح DevTools" },
    { icon: "FaMobileAlt", num: "2", title: "Ctrl + Shift + M", body: "أيقونة الجوال" },
    { icon: "FaListAlt", num: "3", title: "اختار جهاز", body: "iPhone أو Galaxy" },
    { icon: "FaBug", num: "4", title: "دوّر على المشاكل", body: "بطاقات مضغوطة، صورة طالعة برا", dark: true },
  ], 1.9, 3.1, { bodySize: 15, titleSize: 18 });
  callout(s, M, 5.35, CW, 1.05, "أغلب زوار المواقع بيجوا من الجوال. الموقع اللي بيتخرب على الجوال نصه خربان", { size: 16 });
  s.addNotes("اعرض موقع الدورة قبل الإصلاح. 3 دقائق.");

  s = newSlide("CONTENT", "الدورة 4 · Media query", "جملة «إذا» للـ CSS", S4);
  codeBox(s, M, 1.8, 7.0, 4.7, "/* العادي: جنب بعض */\n.services-list {\n  display: flex;\n  gap: 24px;\n}\n\n/* شاشة الجوال */\n@media (max-width: 768px) {\n  .services-list {\n    flex-direction: column;\n  }\n}\n\nimg { max-width: 100%; height: auto; }", "css/index.css", 14);
  await iconRows(s, [
    ["FaRulerHorizontal", "768px", "رقم واحد لكل المشروع"],
    ["FaLayerGroup", "column أو wrap", "تحت بعض دايماً، أو بس اللي ما إله مكان", C.accent2],
    ["FaImage", "max-width: 100%", "الصورة ما تطلع أعرض من مكانها"],
    ["FaBars", "الـ hamburger", "جاي من الهيكل، بنفهم كوده بالدورة الجاية", C.accent2],
  ], 7.9, W - M - 7.9, 1.8, 1.18, { ts: 17, bs: 14 });
  s.addNotes("الـ media query تبع كل صفحة بملفها، واللي للـ header بـ style.css عند A.");

  s = newSlide("CONTENT", "الدورة 4 · تطبيق · 12 دقيقة", "صلّحوا أكبر مشكلتين", S4);
  {
    const { xs, cw } = colsX(2, 0.4);
    box(s, xs[0], 1.8, cw, 4.7, C.background2);
    s.addText("الخطوات", R({ x: xs[0] + 0.3, y: 2.0, w: cw - 0.6, h: 0.45, fontSize: 18, bold: true, color: C.accent1 }));
    numList(s, ["افتح صفحاتك بوضع الجوال", "اكتب أكبر مشكلتين شفتهن", "صلحهن بالـ prompt، واحدة وحدة", "جرّب اللابتوب مرة ثانية: ما تخرب؟"], xs[0] + 0.3, 2.55, cw - 0.6, 2.6, 16);
    s.addText("النجاح: الرئيسية مقروءة على الجوال، ما في scroll بالعرض", R({ x: xs[0] + 0.3, y: 5.3, w: cw - 0.6, h: 1.0, fontSize: 15, bold: true, color: C.accent2 }));
    promptBox(s, xs[1], 1.8, cw, 4.7, "صفحة [اسم الصفحة] على الجوال فيها مشكلة: [البطاقات مضغوطة / النص صغير كتير].\nهاد الـ HTML والـ CSS تبع القسم: [الصق]. وهاي screenshot من وضع الجوال [ارفق].\n\nضيفلي @media (max-width: 768px) بملف css/[اسم الصفحة].css بس، بدون ما تغيّر شكل اللابتوب.", "Prompt إصلاح الجوال", 15);
  }
  s.addNotes("التدقيق الكامل باليوم الرابع.");

  // ===== C5 =====
  const S5 = "الدورة 5: JavaScript";
  pres.addSection({ title: S5 });
  divider("الدورة 5 · 43 دقيقة", "أساسيات JavaScript والميزات التفاعلية", "المتغيرات · array · if · for · function · hamburger · الميزات", S5, "شرح 18 دقيقة، تطبيق 25. الهدف يقدروا يقرأوا أي كود JS بيطلعلهم من الـ AI بعدين، مش بس كود الميزات.");

  s = newSlide("CONTENT", "الدورة 5 · شو دور JavaScript؟", "الموقع زي البيت", S5);
  {
    const Q = [["FaBuilding", "HTML", "الجدران: شو موجود بالصفحة"], ["FaPaintRoller", "CSS", "الدهان والأثاث: كيف بيبين"], ["FaLightbulb", "JavaScript", "الكهرباء: تكبس الزر بيضوي الضو"]];
    const { xs, cw } = colsX(3, 0.3);
    for (let i = 0; i < 3; i++) await card(s, xs[i], 1.9, cw, 3.3, { icon: Q[i][0], iconFill: i === 2 ? C.accent2 : C.accent1, title: Q[i][1], body: Q[i][2], titleSize: 24, bodySize: 17, dark: i === 2 });
  }
  callout(s, M, 5.5, CW, 0.95, "افتحوا F12 ← Console، وكل واحد يكتب معي على جهازه سطر سطر ويكبس Enter", { size: 16 });
  s.addNotes("دقيقة. بعدها 10 دقائق أساسيات بالـ Console.");

  s = newSlide("CONTENT", "الدورة 5 · أ. المتغيرات", "المتغير: علبة عليها اسم، فيها قيمة", S5);
  codeBox(s, M, 1.8, 7.4, 4.7, 'let name = "سارة";      // string\nlet age = 25;           // number\nlet isStudent = true;   // boolean\nconst siteName = "مخبز الأمل";\n\nage = 26;     // تغيير القيمة\n\nconsole.log(name, age);', "Console", 16);
  await iconRows(s, [
    ["FaUnlock", "let", "قيمة ممكن تتغير"],
    ["FaLock", "const", "علبة مقفلة، ثابتة", C.accent2],
    ["FaHistory", "var", "طريقة قديمة، نفس الفكرة لو شفتها"],
    ["FaTerminal", "console.log()", "بتطبع شو جوا المتغير: أهم أداة للفهم", C.accent2],
  ], 8.3, W - M - 8.3, 1.8, 1.18, { ts: 17, bs: 14 });
  s.addNotes("دقيقتين. النص بين علامتين \"\"، الرقم بدون.");

  s = newSlide("CONTENT", "الدورة 5 · ب. array · ج. if", "القوائم والشروط", S5);
  {
    const { xs, cw } = colsX(2, 0.4);
    codeBox(s, xs[0], 1.8, cw, 2.6, 'const products = [\n  "كعك",\n  "خبز",\n  "معمول"\n];\nproducts[0];      // كعك\nproducts.length;  // 3', "array: علبة فيها قائمة", 16);
    s.addText("العدّ بيبلش من 0 مش من 1", R({ x: xs[0], y: 4.55, w: cw, h: 0.5, fontSize: 16, bold: true, color: C.accent1 }));
    codeBox(s, xs[1], 1.8, cw, 2.6, 'if (age >= 18) {\n  console.log("مسموح");\n} else {\n  console.log("مش مسموح");\n}', "if: إشارة المرور", 16);
    s.addText("المقارنات: ===  يساوي · !==  لا يساوي · >  <  >=  <=", R({ x: xs[1], y: 4.55, w: cw, h: 0.5, fontSize: 15, color: C.text2 }));
  }
  callout(s, M, 5.35, CW, 1.1, "انتبهوا: = يعني «حط القيمة»، و=== يعني «هل بيساوي؟». خلطهم أشهر غلطة", { size: 17 });
  s.addNotes("3 دقائق للاثنين.");

  s = newSlide("CONTENT", "الدورة 5 · د. for loop", "عامل بيمرّ على الرفوف رف رف", S5);
  {
    const { xs, cw } = colsX(2, 0.4);
    codeBox(s, xs[0], 1.8, cw, 2.2, 'for (let i = 0; i < 5; i++) {\n  console.log("الدورة رقم", i);\n}', "عدّ من 0 لـ 4", 15);
    table(s, ["الجزء", "معناه"], [["let i = 0", "ابلش العدّ من 0"], ["i < 5", "كمّل طول ما i أصغر من 5"], ["i++", "زيد 1 كل مرة"]], { x: xs[0], y: 4.2, w: cw, colW: [2.0, cw - 2.0], rowH: 0.5, fs: 14 });
    codeBox(s, xs[1], 1.8, cw, 2.2, 'for (const product of products) {\n  console.log("عندنا:", product);\n}', "المرور على قائمة (الأكثر استعمالاً)", 15);
    await card(s, xs[1], 4.2, cw, 2.3, { icon: "FaFilter", iconFill: C.accent2, title: "الـ filter من جوا", body: "loop بيمرّ على كل البطاقات، وجوّاه if: إذا من نفس الصنف اظهرها، غير هيك اخفيها", titleSize: 17, bodySize: 14 });
  }
  s.addNotes("3 دقائق. اربطها بالميزات: الميزات مبنية من نفس الأساسيات.");

  s = newSlide("CONTENT", "الدورة 5 · هـ. function", "الدالة: وصفة باسم، بتكتبها مرة وبتستعملها كل ما بدك", S5);
  codeBox(s, M, 1.8, 7.0, 3.3, 'function greet(person) {\n  return "أهلاً " + person;\n}\n\nconsole.log(greet("أحمد"));\n// أهلاً أحمد', "Console", 17);
  await iconRows(s, [
    ["FaSignInAlt", "person = parameter", "المدخل اللي بتعطيه للوصفة"],
    ["FaSignOutAlt", "return", "النتيجة اللي بترجع", C.accent2],
    ["FaMousePointer", "function () { ... }", "اللي جوا addEventListener نفس الفكرة: وصفة بتشتغل لما يصير كبس"],
  ], 7.9, W - M - 7.9, 1.8, 1.1, { ts: 16, bs: 14 });
  callout(s, M, 5.35, CW, 1.1, "تمرين: array فيه 3 أسماء من صفحاتك ← اطبعهم بـ for ← ضيف if بتطبع «هاد الأول» لما i === 0 ← اللي خلص يحطها بـ function", { size: 15, bold: false });
  s.addNotes("دقيقتين شرح، والتمرين ضمن الـ 10 دقائق.");

  s = newSlide("CONTENT", "الدورة 5 · قاموس", "قاموس سريع لقراءة كود الـ AI", S5);
  table(s, ["لما تشوف", "معناه"], [
    ["let  /  const", "متغير"],
    ["[ ]", "قائمة (array)"],
    ["{ } بعد if أو for أو function", "الكود اللي جوّاها"],
    ["if  /  else", "شرط"],
    ["for  /  forEach", "تكرار على كل عنصر"],
    ["function  أو  =>", "دالة (وصفة)"],
    ["//", "تعليق، ما بيشتغل"],
  ], { x: M, y: 1.8, w: 7.4, colW: [3.6, 3.8], rowH: 0.56, fs: 16 });
  {
    const x = 8.3, w = W - M - 8.3;
    promptBox(s, x, 1.8, w, 3.9, "اشرحلي هاد الكود كأني مبتدئ: شو المتغيرات، وين في شرط، ووين في loop.", "جملة للـ AI بأي مشروع قدام", 17);
  }
  s.addNotes("خلي القاموس بملف الـ prompts.");

  s = newSlide("CONTENT", "الدورة 5 · مثال حقيقي", "الـ hamburger سطر سطر", S5);
  {
    const { xs, cw } = colsX(2, 0.4);
    codeBox(s, xs[0], 1.8, cw, 4.7, "// 1. جيب العناصر من الصفحة\nconst menuBtn =\n  document.querySelector('.menu-btn');\nconst nav =\n  document.querySelector('.main-nav');\n\n// 2. لما حدا يكبس الزر\nmenuBtn.addEventListener('click',\n  function () {\n    // 3. ضيف أو شيل الكلاس\n    nav.classList.toggle('open');\n  });", "js/main.js", 14);
    codeBox(s, xs[1], 1.8, cw, 3.0, "@media (max-width: 768px) {\n  .main-nav { display: none; }\n  .main-nav.open {\n    display: block;\n  }\n}", "style.css", 15);
    callout(s, xs[1], 5.0, cw, 1.5, "JS ما بيغيّر الشكل بنفسه، بيضيف كلاس بس. والـ CSS هو اللي بيغير الشكل", { size: 15 });
  }
  s.addNotes("4 دقائق. افتح js/main.js من موقع الدورة.");

  s = newSlide("CONTENT", "الدورة 5 · القالب", "وراء أغلب الميزات: 3 أسئلة", S5);
  await stepsFlow(s, [
    { icon: "FaCrosshairs", num: "1", title: "مين؟", body: "querySelector: جيب العنصر" },
    { icon: "FaMousePointer", num: "2", title: "متى؟", body: "addEventListener('click'): لما يصير كبس" },
    { icon: "FaExchangeAlt", num: "3", title: "شو؟", body: "classList.toggle: غيّر الكلاس، والـ CSS بيغير الشكل", dark: true },
  ], 1.9, 3.0, { bodySize: 15, titleSize: 22 });
  await iconRows(s, [
    ["FaTerminal", "الميزة مش شغالة؟ افتح Console", "الأحمر = خطأ. انسخ الرسالة وابعثها للـ AI. وشوف بـ Elements: الكلاس انضاف؟ والـ CSS تبعه موجود؟"],
  ], M, CW, 5.2, 1.3, { ts: 17, bs: 15 });
  s.addNotes("امسح حرف من اسم الكلاس قدامهم ووريهم الخطأ بالـ Console. دقيقتين.");

  s = newSlide("CONTENT", "الدورة 5 · الميزات", "أمثلة ميزات تفاعلية", S5);
  {
    const F = [["FaQuestionCircle", "Accordion", "أسئلة شائعة"], ["FaFilter", "Filter", "تصفية منتجات"], ["FaFolder", "Tabs", "تبويبات"], ["FaCheckSquare", "Form validation", "فحص النموذج"], ["FaImages", "Slider", "عرض صور"], ["FaWindowRestore", "Modal", "نافذة منبثقة"], ["FaMoon", "Dark mode", "وضع ليلي"], ["FaArrowUp", "Back to top", "رجوع لأعلى"]];
    const { xs, cw } = colsX(4, 0.3);
    for (let i = 0; i < 8; i++) await card(s, xs[i % 4], i < 4 ? 1.8 : 3.95, cw, 1.95, { icon: F[i][0], iconFill: i % 2 ? C.accent2 : C.accent1, title: F[i][1], body: F[i][2], titleSize: 17, bodySize: 14 });
  }
  callout(s, M, 6.1, CW, 0.6, "كل فريق حدد ميزاته باليوم الأول. والـ hamburger ما بينحسب منهن", { size: 15 });
  s.addNotes("دقيقة.");

  s = newSlide("CONTENT", "الدورة 5 · Prompt الميزة", "Prompt: ميزة تفاعلية", S5);
  promptBox(s, M, 1.75, CW, 4.1, "بدي أضيف ميزة [اسم الميزة] لصفحة [اسم الصفحة].\nشو بدها تعمل: [اوصفها من عين الزائر، مثلاً: لما أكبس على السؤال ينفتح جوابه وينسكر الباقي].\nهاد الـ HTML الحالي للقسم: [الصق].\n\nالشروط:\n• JavaScript عادي بملف js/[اسم الميزة].js، بدون libraries.\n• استعمل querySelector وaddEventListener وclassList.\n• الـ CSS الجديد بـ css/[اسم الصفحة].css، وما تغيّر style.css أو main.js.\n• قلي بالضبط شو أغيّر بالـ HTML، ووين أحط <script src=\"js/...\" defer>.\n• تعليقات بالعربي، وبالآخر اشرحلي الكود بخطوات بسيطة.", "Prompt الميزة", 15);
  callout(s, M, 6.0, CW, 0.6, "Form validation: النموذج بيعرض رسالة نجاح بس. ما في backend يستقبل", { size: 14, bold: false });

  s = newSlide("CONTENT", "الدورة 5 · تطبيق · 25 دقيقة", "كل عضو بيبني ميزة", S5);
  practice(s, "الخطوات", ["ميزة وحدة على صفحة من صفحاتك (فريق 3: اثنين بيبنوا والثالث بيكمل صفحات)", "جرّبها: بتشتغل؟ وعلى الجوال كمان؟", "افتح الـ Console: ما في أحمر؟", "اشرح لزميلك: مين؟ متى؟ شو؟"], ["ميزتين شغالات بالفريق", "كل عضو بيشرح ميزته بالأسئلة الثلاثة", "ما في أخطاء حمرا"]);
  callout(s, M, 6.0, CW, 0.6, "أكثر سبب: الـ <script> مش مضاف أو مساره غلط، أو اسم الكلاس مش نفسه", { size: 14 });

  // ===== C6 =====
  const S6 = "الدورة 6: باقي الصفحات";
  pres.addSection({ title: S6 });
  divider("الدورة 6 · 27 دقيقة", "باقي الصفحات", "تكرار بسرعة · صفحة جديدة من صفحة موجودة · الأولويات", S6, "شرح 5 دقائق، تطبيق 22. أهم دورة تلف فيها.");

  s = newSlide("CONTENT", "الدورة 6 · صفحة ما طلعت بالهيكل؟", "اعمل صفحة جديدة من صفحة موجودة", S6);
  await stepsFlow(s, [
    { icon: "FaCopy", num: "1", title: "انسخ صفحة", body: "contact.html ← gallery.html" },
    { icon: "FaEraser", num: "2", title: "فضّي main", body: "وخلّي الـ header والـ footer" },
    { icon: "FaHeading", num: "3", title: "غيّر title", body: "عنوان الصفحة الجديدة" },
    { icon: "FaFileCode", num: "4", title: "CSS جديد", body: "css/gallery.css وغيّر الـ link" },
    { icon: "FaLink", num: "5", title: "رابط بالـ nav", body: "بكل الصفحات", dark: true },
  ], 1.9, 2.9, { bodySize: 14, titleSize: 16 });
  callout(s, M, 5.05, CW, 1.4, "الاستثناء الوحيد: رابط الـ nav الجديد. اتفقوا على الاسم هلأ، وكل واحد بيضيفه بصفحاته هو، بنفس المكان ونفس النص", { size: 16 });

  s = newSlide("CONTENT", "الدورة 6 · تطبيق · 22 دقيقة", "الأولويات بالترتيب", S6);
  await stepsFlow(s, [
    { icon: "FaHome", num: "1", title: "الرئيسية كاملة", body: "عند A" },
    { icon: "FaMagic", num: "2", title: "الميزة الثانية", body: "شغالة" },
    { icon: "FaColumns", num: "3", title: "أول قسم", body: "من كل صفحة باقية" },
    { icon: "FaGem", num: "4", title: "التفاصيل", body: "hover، مسافات، تطابق مع Stitch", dark: true },
  ], 1.9, 2.8, { bodySize: 15, titleSize: 18 });
  callout(s, M, 4.95, CW, 0.75, "كل صفحة فيها شي أحسن من صفحة وحدة مثالية والباقي فاضي", { size: 17 });
  s.addText("كل صفحة خلصت: افحصها بوضع الجوال مباشرة · بالدقيقة 3:25: «10 دقائق وبنبلش الدمج، احفظوا»", R({ x: M, y: 5.9, w: CW, h: 0.7, fontSize: 15, color: C.text2 }));
  s.addNotes("علّم الفرق البعيدة عن الحد الأدنى واقعد معهم أول.");

  // ===== C7 =====
  const S7 = "الدورة 7: الدمج";
  pres.addSection({ title: S7 });
  divider("الدورة 7 · 20 دقيقة", "الدمج والفحص", "7 خطوات · Checklist · لو شي خرب", S7, "شرح 5 دقائق، تطبيق 15. اعمل دمج تجريبي قدامهم بمجلدين على جهازك.");

  s = newSlide("CONTENT", "الدورة 7 · خطوات الدمج", "الدمج = نسخ ملفات بس", S7);
  {
    const steps = ["B بيعمل ZIP فيه ملفاته هو بس: صفحاته، css وjs تبعته، صوره", "بيبعثه لـ A على WhatsApp", "A بيفك الضغط وبينسخ كل ملف لمكانه", "Windows سأل «استبدال؟» على style.css أو main.js ← لأ", "سكربتات ميزات B مضافة بصفحاته هو", "A بيفتح الموقع بـ Live Server وبيمرّ على الـ checklist", "A بيبعث النسخة المدموجة لـ B: الاثنين معهم نسخة"];
    const { xs, cw } = colsX(2, 0.4);
    for (let i = 0; i < 7; i++) {
      const col = i < 4 ? 0 : 1, row = i < 4 ? i : i - 4;
      const x = xs[col], y = 1.8 + row * 1.08;
      box(s, x, y, cw, 0.95, i === 3 ? C.accent3 : C.background2);
      s.addShape(pres.shapes.OVAL, { x: x + cw - 0.75, y: y + 0.2, w: 0.55, h: 0.55, fill: { color: C.accent1 }, line: { color: C.accent1, width: 0 }, objectName: "step-num" });
      s.addText(String(i + 1), { x: x + cw - 0.75, y: y + 0.2, w: 0.55, h: 0.55, fontSize: 16, bold: true, color: HEX.lt1, align: "center", valign: "middle", margin: 0, isTextBox: true });
      s.addText(steps[i], R({ x: x + 0.25, y, w: cw - 1.15, h: 0.95, fontSize: 15, bold: i === 3, color: C.text2, valign: "middle" }));
    }
    callout(s, xs[1], 1.8 + 3 * 1.08, cw, 0.95, "فريق 3: B وC بيبعثوا لـ A · فردي: ما في دمج", { size: 14, bold: false, fill: C.background2 });
  }
  s.addNotes("«B بيبعث ملفاته هو بس، مش المجلد كله.» «لو Windows سألك تستبدل style.css أو main.js، الجواب لأ.»");

  s = newSlide("CONTENT", "الدورة 7 · الفحص", "Checklist قبل التسليم", S7);
  {
    const items = ["كل روابط الـ nav من كل صفحة بتفتح الصفحة الصح", "كل الصور ظاهرة (ما في صورة مكسورة)", "الميزتين شغالات بعد الدمج، والـ hamburger كمان", "الرئيسية مقروءة بوضع الجوال", "الـ Console ما فيه أحمر بأي صفحة", "الاثنين معهم ZIP للنسخة المدموجة"];
    const { xs, cw } = colsX(2, 0.4);
    for (let i = 0; i < 6; i++) {
      const col = i < 3 ? 0 : 1, row = i % 3;
      const y = 1.8 + row * 1.05;
      box(s, xs[col], y, cw, 0.9, C.background2);
      s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: xs[col] + cw - 0.65, y: y + 0.23, w: 0.44, h: 0.44, rectRadius: 0.06, fill: { color: C.background1 }, line: { color: HEX.dk2, width: 1.5 }, objectName: "checkbox" });
      s.addText(items[i], R({ x: xs[col] + 0.25, y, w: cw - 1.1, h: 0.9, fontSize: 15, bold: true, color: C.text2, valign: "middle" }));
    }
  }
  callout(s, M, 5.1, CW, 1.35, "لو شي خرب بعد الدمج: غالباً ملف انتسخ لمجلد غلط أو استُبدل. ارجع لنسخة B الأصلية وانسخ الملف مرة ثانية. لهيك ما حدا بيمسح نسخته قبل نهاية اليوم", { size: 15, bold: false });
  s.addNotes("الفرق اللي خلصت، سجّل تقييمها مباشرة.");

  // ===== Closing =====
  const S8 = "الختام";
  pres.addSection({ title: S8 });
  s = newSlide("CONTENT", "الختام · 5 دقائق", "التقييم على Google Form", S8);
  {
    const D = [["FaFileArchive", "ZIP النسخة المدموجة", "واحد لكل فريق، A بيرفعه"], ["FaCamera", "screenshot", "من صفحة بنيتها إنت"], ["FaQuestion", "سؤال فهم", "واحد من الثلاثة"], ["FaStar", "تقييم ذاتي", "من 1 لـ 5: قديش بتقدر تشرح كودك؟"]];
    const { xs, cw } = colsX(4, 0.3);
    for (let i = 0; i < 4; i++) await card(s, xs[i], 1.85, cw, 2.6, { icon: D[i][0], num: String(i + 1), title: D[i][1], body: D[i][2], titleSize: 17, bodySize: 14 });
  }
  callout(s, M, 4.75, CW, 1.1, "أسئلة الفهم (بتتبدّل بينهم): شو الفرق بين margin وpadding؟ · شو بتعمل querySelector؟ · ليش بنحط الألوان بمتغيرات؟", { size: 15, bold: false });
  s.addNotes("3 دقائق للـ Form.");

  s = newSlide("DIVIDER", "ملخص اليوم", "شو تعلمنا اليوم؟", S8);
  {
    const pts = ["HTML الهيكل، CSS الشكل، JS الحركة", "قسم قسم، وافهم قبل ما تكمل", "المتغيرات وlet وif وfor", "كل ملف إله مالك واحد"];
    const { xs, cw } = colsX(4, 0.25);
    for (let i = 0; i < 4; i++) {
      s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: xs[i], y: 4.25, w: cw, h: 1.1, rectRadius: 0.12, fill: { color: "2C4A66" }, line: { color: "2C4A66", width: 0 }, objectName: "summary-card" });
      s.addText(pts[i], { x: xs[i] + 0.2, y: 4.25, w: cw - 0.4, h: 1.1, fontSize: 15, bold: true, color: HEX.lt1, align: "center", valign: "middle", margin: 0, rtlMode: true, isTextBox: true });
    }
    s.addText("بكرا: بنختبر الموقع على أجهزة مختلفة، نصلح الأخطاء، ونكمل الصفحات · جيبوا النسخة المدموجة", R({ x: M, y: 5.7, w: CW, h: 0.8, fontSize: 16, color: "C9D6E0" }));
  }
  s.addNotes("«ما حدا يعدل على النسخة بالبيت لحاله بدون ما يخبّر زميله.» دقيقتين.");

  // ===== Appendix =====
  const S9 = "ملحق: أخطاء شائعة";
  pres.addSection({ title: S9 });
  const ERR = [
    ["التعديل مش بيبيّن", "الملف مش محفوظ", "Ctrl + S، أو File ← Auto Save"],
    ["الصفحة بدون تنسيق", "مسار الـ link للـ CSS غلط", "قارن المسار بمكان الملف"],
    ["صورة مكسورة", "المسار أو الامتداد أو حرف كبير", "انسخ الاسم من المجلد والصقه"],
    ["العربي رموز غريبة", "ناقص meta charset", "ضيف السطر، وتأكد من UTF-8 بـ VS Code"],
    ["null بالـ Console", "script قبل الصفحة، أو الكلاس مش موجود", "defer، وقارن اسم الكلاس حرف حرف"],
    ["ميزة بصفحة ومش بثانية", "الـ script مضاف بصفحة وحدة", "أضفه بالصفحة الثانية"],
    ["تنسيق صفحة خرّب ثانية", "CSS خاص انحط بـ style.css", "انقله لـ css/[page].css"],
    ["كلاسات زي px-4 flex", "تسلل Tailwind", "«بدون Tailwind، CSS عادي، قسم واحد بس»"],
    ["الـ AI وقف بنص الكود", "الرد أطول من الحد", "«كمّل من حيث وقفت» أو ملف ملف"],
    ["الـ AI غيّر الألوان", "نسي سياق المحادثة", "ذكّره، أو محادثة جديدة والصق style.css"],
    ["النص عكس الاتجاه", "ناقص dir=\"rtl\" أو margin-left", "تأكد من html dir واستعمل gap"],
    ["شغال محلياً، بيخرب أونلاين", "Cake.JPG مقابل cake.jpg", "كل الأسماء أحرف صغيرة من الأول"],
    ["Live Server مش بيفتح", "فاتح ملف مش مجلد", "File ← Open Folder على المشروع"],
    ["مش لاقي الملف بعد فك ZIP", "مجلد داخل مجلد", "افتح المجلد الداخلي"],
  ];
  for (let part = 0; part < 2; part++) {
    s = newSlide("CONTENT", "ملحق · مرجع إلك وإنت بتلف", `أخطاء شائعة وحلولها (${part + 1} من 2)`, S9);
    table(s, ["العرض", "السبب", "الحل"], ERR.slice(part * 7, part * 7 + 7), { y: 1.8, colW: [3.4, 4.0, 4.733], rowH: 0.62, fs: 14 });
    s.addNotes("القاعدة العامة لأي مشكلة: احفظت؟ المسار صح؟ الاسم نفسه؟");
  }

  await pres.writeFile({ fileName: "day3-ar.pptx" });
  await applyTheme("day3-ar.pptx", THEME);
  console.log("done");
}
build().catch((e) => { console.error(e); process.exit(1); });
