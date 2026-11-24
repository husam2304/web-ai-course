
async function build() {
  // ===== Opening =====
  const S0 = "الافتتاح";
  pres.addSection({ title: S0 });
  let s = pres.addSlide({ masterName: "DIVIDER", sectionTitle: S0 });
  s.addText("دورة تطوير المواقع الإلكترونية بمساعدة الذكاء الاصطناعي", { placeholder: "kicker", rtlMode: true, align: "right" });
  s.addText("اليوم الرابع: نقرأ الكود ونربط الموقع", { placeholder: "title", rtlMode: true, align: "right" });
  s.addText("كيف تقرأ سطر HTML وCSS وJavaScript، وكيف تصير صفحاتكم موقع واحد", R({ x: M, y: 4.2, w: CW, h: 0.5, fontSize: 22, color: "C9D6E0" }));
  s.addText("المدرب: حسام عليان", R({ x: M, y: 4.8, w: CW, h: 0.45, fontSize: 18, color: C.background1, bold: true }));
  for (let i = 0; i < 5; i++) {
    const x = W - M - 0.55 - i * 0.75;
    const on = i === 3, done = i < 3;
    const fill = on ? C.accent1 : done ? "4A6B88" : "2C4A66";
    s.addShape(pres.shapes.OVAL, { x, y: 1.3, w: 0.55, h: 0.55, fill: { color: fill }, line: { color: fill, width: 0 }, objectName: "day-dot" });
    s.addText(String(i + 1), { x, y: 1.3, w: 0.55, h: 0.55, fontSize: 16, bold: true, color: HEX.lt1, align: "center", valign: "middle", margin: 0, isTextBox: true });
  }
  s.addNotes("افتح ملفات فريق واحد عالشاشة قبل ما تبلّش.");

  s = newSlide("CONTENT", "افتتاح · مبارح", "مبارح ما راح عالفاضي", S0);
  {
    const T = [["FaPaintBrush", "الـ CSS شغال", "عند كل الفرق"], ["FaCode", "الـ JS مكتوب", "والـ ids مطابقة للـ HTML"], ["FaUnlink", "الربط خربان", "مسارات غلط، وأسماء مش موجودة، وكل صفحة بمجلد"]];
    const { xs, cw } = colsX(3, 0.3);
    for (let i = 0; i < 3; i++) await card(s, xs[i], 1.8, cw, 2.8, { icon: T[i][0], iconFill: i === 2 ? C.accent1 : C.accent2, title: T[i][1], body: T[i][2], titleSize: 20, bodySize: 16 });
  }
  callout(s, M, 4.9, CW, 1.4, "«الصفحات مش شايفة بعض، زي غرف بيت ما بينها أبواب. اليوم بنتعلم نقرأ الكود اللي عندنا، وبنفتح الأبواب»", { size: 18 });
  s.addNotes("دقيقتين.");

  s = newSlide("CONTENT", "افتتاح · هدف اليوم", "شرط النشر بكرا: 3 شغلات", S0);
  {
    const D = [["FaFolder", "مجلد واحد", "فيه index.html"], ["FaLink", "الصفحات مربوطة", "بالقائمة، من كل صفحة"], ["FaCheckCircle", "Console نظيف", "بدون أحمر"]];
    const { xs, cw } = colsX(3, 0.3);
    for (let i = 0; i < 3; i++) await card(s, xs[i], 1.85, cw, 2.9, { icon: D[i][0], num: String(i + 1), title: D[i][1], body: D[i][2], titleSize: 21, bodySize: 17 });
  }
  callout(s, M, 5.1, CW, 1.1, "«أي سطر بالموقع، أي حدا بالفريق لازم يقدر يقرأه. واليوم بنتعلم كيف»", { size: 18 });
  s.addNotes("دقيقة.");

  s = newSlide("CONTENT", "افتتاح · الأوراق", "ورقتين معكم طول اليوم", S0);
  {
    const { xs, cw } = colsX(2, 0.4);
    await card(s, xs[0], 1.8, cw, 2.9, { icon: "FaBook", title: "ورقة المرجع = القاموس", body: "لكل واحد. أي سطر مش فاهمه، دوّر عليه هون", titleSize: 21, bodySize: 17 });
    await card(s, xs[1], 1.8, cw, 2.9, { icon: "FaMap", iconFill: C.accent2, title: "ورقة التصليح = الخريطة", body: "لكل فريق. خطوات بأسماء ملفاتكم الحقيقية، وما فيها ولا فراغ تعبّوه. بس الصقوا الملف مكان «(الصق هون)»", titleSize: 21, bodySize: 17 });
  }
  callout(s, M, 5.0, CW, 1.3, "هلأ، خطوة 1: zip لمجلدكم زي ما هو ← صفحة التسليم ← «نسخة احتياطية». إذا شي خرب اليوم، بنرجع لهون", { size: 17 });
  s.addNotes("دقيقتين للأوراق و3 للنسخة الاحتياطية.");

  s = newSlide("CONTENT", "أجندة اليوم", "شو رح نعمل اليوم؟", S0);
  table(s, ["الوقت", "الجزء", "شو بيصير"], [
    ["0:00", "الافتتاح", "الأوراق والنسخة الاحتياطية"],
    ["0:10", "HTML", "كيف تقرأ سطر + تطبيق على موقعكم"],
    ["0:30", "CSS", "كيف تقرأ قاعدة + تطبيق"],
    ["0:50", "JavaScript", "امسك ← استنى ← غيّر + تطبيق"],
    ["1:10", "الملفات والربط", "الهيكل، الأسلاك، الـ relative path"],
    ["1:25", "تطبيق", "نقل الملفات وتصليح الأسلاك"],
    ["1:55", "استراحة", "15 دقيقة"],
    ["2:10", "تطليع المشترك", "style.css و main.js"],
    ["2:50", "المحلي والخارجي", "تنزيل الصور"],
    ["3:10", "البيانات بـ JS", "data.js"],
    ["3:40", "الفحص والتسليم", "Console نظيف وتسليم"],
  ], { y: 1.75, colW: [1.5, 2.6, 8.033], rowH: 0.43, fs: 14 });
  s.addNotes("كل شرح قصير، وبعده تطبيق فوري على موقعكم.");

  // ===== HTML =====
  const S1 = "HTML";
  pres.addSection({ title: S1 });
  divider("0:10 · شرح 15 + تطبيق 5", "HTML: كيف تقرأ سطر", "شكل السطر · هيكل الصفحة · التاجات · الخصائص", S1, "مش بنشرح «شو هو HTML»: بنتعلم نقرأ السطر. الأمثلة من ملفاتهم عالشاشة.");

  s = newSlide("CONTENT", "HTML · شكل السطر", "تاج بيفتح، وتاج بيسكر، والمحتوى بالنص", S1);
  codeBox(s, M, 1.8, CW, 1.3, '<a href="menu.html" class="nav-link">المنيو</a>', null, 26);
  {
    const T = [["FaCode", "<a ...>", "تاج الفتح: نوع العنصر (a = رابط)، والخصائص جواه"], ["FaSlidersH", 'href="menu.html"', "خاصية = قيمة: وين بيودي"], ["FaFont", "المنيو", "المحتوى: اللي بيشوفه الزائر"], ["FaCode", "</a>", "تاج الإغلاق"]];
    const { xs, cw } = colsX(4, 0.25);
    for (let i = 0; i < 4; i++) await card(s, xs[i], 3.3, cw, 1.95, { title: T[i][1], body: T[i][2], titleSize: 16, bodySize: 14 });
  }
  callout(s, M, 5.45, CW, 1.0, "بتنقرأ: «رابط (a)، بيوديك على menu.html، عليه class اسمه nav-link، ومكتوب عليه المنيو»", { size: 17 });
  s.addNotes("4 دقائق. اقرأه بصوت عالي، بعدين القاعة كلها بتقرأ رابط من الـ nav تبع فريق عالشاشة.");

  s = newSlide("CONTENT", "HTML · هيكل أي صفحة", "وين الأسلاك بالصفحة؟", S1);
  codeBox(s, M, 1.8, 6.6, 4.8, '<!DOCTYPE html>\n<html lang="ar" dir="rtl">\n<head>\n  <meta charset="UTF-8">\n  <meta name="viewport" content="...">\n  <title>اسم الصفحة</title>\n  <link rel="stylesheet" href="css/style.css">\n  <link rel="stylesheet" href="css/menu.css">\n</head>\n<body>\n  <header> ... </header>\n  <main> ... </main>\n  <footer> ... </footer>\n  <script src="js/main.js"></script>\n  <script src="js/menu.js"></script>\n</body>\n</html>', "menu.html", 12.5);
  await iconRows(s, [
    ["FaEyeSlash", "head", "معلومات للمتصفح، ما بتظهر. فيه أسلاك الـ CSS (link)"],
    ["FaEye", "body", "كل شي بيشوفه الزائر: header و main و footer", C.accent2],
    ["FaPlug", "script آخر الـ body", "أسلاك الـ JS"],
  ], 7.5, W - M - 7.5, 1.8, 1.35, { ts: 18, bs: 15 });
  callout(s, 7.5, 5.85, W - M - 7.5, 0.75, "«هدول الأسلاك اللي بنصلّحهم اليوم»", { size: 15 });
  s.addNotes("4 دقائق. اسألهم: وين السطر اللي بيربط الصفحة بالشكل؟ ووين اللي بيربطها بالحركة؟");

  const TAGS = [
    ["header / footer", "راس وذيل الصفحة (نفسهم بكل الصفحات)", "<header>...</header>"],
    ["nav", "قائمة الروابط", "<nav>...</nav>"],
    ["main", "محتوى الصفحة الأساسي", "<main>...</main>"],
    ["section", "قسم من الصفحة", '<section id="menu">'],
    ["h1 لـ h3", "عناوين (h1 واحد بكل صفحة)", "<h1>CAFFEON</h1>"],
    ["p", "فقرة", "<p>نص</p>"],
    ["a", "رابط", '<a href="about.html">من نحن</a>'],
    ["img", "صورة (ما إلها تاج إغلاق)", '<img src="images/latte.jpg" alt="لاتيه">'],
    ["ul / li", "قائمة وعناصرها", "<ul><li>قهوة</li></ul>"],
    ["div", "صندوق بلمّ عناصر", '<div class="card">'],
    ["span", "قطعة نص صغيرة", '<span class="price">3 JD</span>'],
    ["button", "زر", '<button id="addBtn">أضف</button>'],
    ["form", "فورم", '<form id="contactForm">'],
    ["label / input", "عنوان الحقل والحقل", '<label for="name"> <input id="name">'],
    ["link", "بيربط ملف CSS (بالـ head)", '<link rel="stylesheet" href="css/style.css">'],
    ["script", "بيربط ملف JS (آخر الـ body)", '<script src="js/main.js"></script>'],
  ];
  for (let part = 0; part < 2; part++) {
    s = newSlide("CONTENT", "HTML · القاموس", `أهم التاجات (${part + 1} من 2)`, S1);
    table(s, ["التاج", "شو بيعمل", "مثال"], TAGS.slice(part * 8, part * 8 + 8), { ltr: [2], y: 1.8, colW: [2.2, 4.4, 5.533], rowH: 0.56, fs: 14 });
    s.addNotes("مش لازم يحفظوه: «هاد القاموس». دوّر على كل تاج بكود فريق (Ctrl + F).");
  }

  s = newSlide("CONTENT", "HTML · الخصائص", "أهم الخصائص", S1);
  table(s, ["الخاصية", "شو بتعمل"], [
    ["href", "وين بيودي الرابط، أو وين ملف الـ CSS"],
    ["src", "وين الصورة أو ملف الـ JS"],
    ["alt", "وصف الصورة للي ما بيشوفوا"],
    ["id", "اسم لعنصر واحد بالصفحة (الـ JS بيمسكه فيه)"],
    ["class", "اسم لمجموعة عناصر (الـ CSS بينسقهم فيه)"],
    ["data-...", 'معلومة إضافية للـ JS، مثل data-category="coffee"'],
    ["lang / dir", "لغة الصفحة واتجاهها: ar و rtl، أو en و ltr"],
  ], { ltr: [0], y: 1.75, colW: [2.4, 9.733], rowH: 0.46, fs: 15 });
  callout(s, M, 5.75, CW, 0.75, "«id للـ JS، و class للـ CSS. هيك اللغات الثلاث بتلاقي بعض»", { size: 17 });
  s.addNotes("3 دقائق.");

  s = newSlide("CONTENT", "HTML · تطبيق · 5 دقايق", "اقرأوا موقعكم", S1);
  practice(s, "على أي صفحة من موقعكم", [
    "لاقوا 3 أسطر: رابط (a)، وصورة (img)، و script",
    "كل واحد بيقرأ سطر بصوت عالي بطريقة «بتنقرأ»",
    "الملف اللي بالـ href أو الـ src موجود فعلاً؟ اكتبوا الجواب",
    "اكتبوا بإيدكم سطر رابط جديد بالـ nav واحفظوا",
  ], ["كل واحد قرأ سطر كجملة", "كل فريق كتب سطر رابط", "لقيتوا src بيشاور على ملف مش موجود؟ ممتاز: هاي أول أخطاءكم الحقيقية"], 1.8, 4.6);
  s.addNotes("اسأل أضعف واحد بكل فريق يقرألك سطر.");

  // ===== CSS =====
  const S2 = "CSS";
  pres.addSection({ title: S2 });
  divider("0:30 · شرح 15 + تطبيق 5", "CSS: كيف تقرأ قاعدة", "شكل القاعدة · الـ selector · الخصائص · الجوال · مين بيغلب", S2, "المرجع: قسم «CSS: الشكل» بالورقة.");

  s = newSlide("CONTENT", "CSS · شكل القاعدة", "selector { property: value; }", S2);
  codeBox(s, M, 1.8, CW, 1.2, ".card { background: white; padding: 16px; }", null, 26);
  {
    const T = [["FaCrosshairs", "مين؟", "selector: ‏.card = كل اللي عليهم class اسمه card (النقطة = class)"], ["FaSlidersH", "شو بدي أغيّر؟", "property: ‏background، padding"], ["FaTag", "لأي قيمة؟", "value: ‏white، 16px"]];
    const { xs, cw } = colsX(3, 0.3);
    for (let i = 0; i < 3; i++) await card(s, xs[i], 3.2, cw, 2.0, { icon: T[i][0], iconFill: i === 1 ? C.accent2 : C.accent1, title: T[i][1], body: T[i][2], titleSize: 18, bodySize: 14 });
  }
  callout(s, M, 5.4, CW, 1.0, "بتنقرأ: «كل عنصر عليه class اسمه card: خلفيته بيضا، ومسافة من جوا 16 بكسل»", { size: 17 });
  s.addNotes("4 دقائق. التشبيه: أمر لمصمم ديكور: «كل الكراسي، لونها، أحمر». بعدين اقرأوا قاعدة من CSS فريق عالشاشة.");

  s = newSlide("CONTENT", "CSS · الـ selector", "مين بتمسك القاعدة؟", S2);
  table(s, ["الـ selector", "بيمسك", "مثال"], [
    ["اسم تاج", "كل التاجات من هالنوع", "p { }"],
    [".class", "كل اللي عليهم هالـ class", ".card { }"],
    ["#id", "عنصر واحد", "#cart { }"],
    ["مسافة بينهم", "عنصر جوا عنصر", ".card img { }"],
    [":hover", "لما الماوس يكون فوقه", ".btn:hover { }"],
  ], { ltr: [2], y: 1.8, colW: [2.8, 5.4, 3.933], rowH: 0.62, fs: 17 });
  s.addNotes("3 دقائق.");

  const PROPS = [
    ["النص", "color", "لون الخط", "color: #222;"],
    ["النص", "font-size", "حجم الخط", "font-size: 18px;"],
    ["النص", "font-weight", "سماكة الخط", "font-weight: 700;"],
    ["النص", "font-family", "نوع الخط", 'font-family: "Cairo", sans-serif;'],
    ["النص", "text-align", "محاذاة النص", "text-align: center;"],
    ["الصندوق", "width / height", "العرض والطول", "width: 100%;"],
    ["الصندوق", "padding", "مسافة من جوا", "padding: 16px;"],
    ["الصندوق", "margin", "مسافة من برّا", "margin-bottom: 24px;"],
    ["الصندوق", "border", "إطار", "border: 1px solid #ddd;"],
    ["الصندوق", "border-radius", "زوايا دائرية", "border-radius: 12px;"],
    ["الخلفية", "background", "لون أو صورة خلفية", "background: var(--primary);"],
    ["الترتيب", "display: flex", "العناصر جواه جنب بعض", "display: flex;"],
    ["الترتيب", "justify-content", "توزيع بالاتجاه الأساسي", "justify-content: space-between;"],
    ["الترتيب", "align-items", "محاذاة بالاتجاه الثاني", "align-items: center;"],
    ["الترتيب", "gap", "مسافة بين العناصر", "gap: 16px;"],
    ["الترتيب", "display: grid", "شبكة (للبطاقات)", "display: grid;"],
    ["الترتيب", "grid-template-columns", "عدد الأعمدة وعرضها", "grid-template-columns: repeat(3, 1fr);"],
    ["الألوان", "--اسم و var()", "متغير لون بـ :root", "--primary: #1531a8; بعدين color: var(--primary);"],
    ["الإخفاء", "display: none", "بيخفي العنصر", "display: none;"],
  ];
  for (let part = 0; part < 2; part++) {
    const rows = part === 0 ? PROPS.slice(0, 10) : PROPS.slice(10);
    s = newSlide("CONTENT", "CSS · القاموس", `أهم الخصائص (${part + 1} من 2)`, S2);
    table(s, ["المجموعة", "الخاصية", "شو بتعمل", "مثال"], rows, { ltr: [1, 3], y: 1.75, colW: [1.6, 2.9, 2.9, 4.733], rowH: 0.43, fs: 13 });
    s.addNotes("ما تمرق على كل سطر: اختار من كود فريق color و padding و display: flex، وغيّر قيمة قدامهم. قبل ما تحفظ: «شو رح يصير؟»");
  }

  s = newSlide("CONTENT", "CSS · الجوال ومين بيغلب", "قاعدتين مهمين", S2);
  {
    const { xs, cw } = colsX(2, 0.4);
    codeBox(s, xs[0], 1.8, cw, 2.3, "@media (max-width: 768px) {\n  .cards { grid-template-columns: 1fr; }\n}", "الجوال", 15);
    s.addText("القواعد جوا @media بتشتغل بس على الشاشات الصغيرة", R({ x: xs[0], y: 4.3, w: cw, h: 0.9, fontSize: 16 }));
    await card(s, xs[1], 1.8, cw, 3.4, { icon: "FaTrophy", title: "مين بيغلب؟", body: "لما قاعدتين بنفس الـ selector على نفس العنصر، اللي بملف مربوط بعدين بتغلب. عشان هيك style.css أول، وملف الصفحة بعده", titleSize: 20, bodySize: 16 });
  }
  callout(s, M, 5.5, CW, 0.9, "التشبيه: آخر واحد حكى بالاجتماع بيمشي كلامه. بنرجعلها بـ «تطليع المشترك»", { size: 16, bold: false });
  s.addNotes("دقيقة للجوال و3 لمين بيغلب.");

  s = newSlide("CONTENT", "CSS · تطبيق · 5 دقايق", "لاقوا القاعدة وغيّروها", S2);
  practice(s, "على موقعكم", [
    "من الـ HTML اختاروا عنصر عليه class (مثلاً زر)",
    "لاقوا قاعدته بملف الـ CSS (Ctrl + F باسم الـ class)",
    "اقرأوها: مين؟ شو بدي أغيّر؟ لأي قيمة؟",
    "غيّروا قيمة وحدة (لون أو حجم)، احفظوا، وشوفوا",
  ], ["كل فريق ربط class من الـ HTML بقاعدته بالـ CSS", "غيّروا قيمة وشافوا النتيجة"], 1.8, 4.6);

  // ===== JS =====
  const S3 = "JavaScript";
  pres.addSection({ title: S3 });
  divider("0:50 · شرح 15 + تطبيق 5", "JavaScript: امسك ← استنى ← غيّر", "الخطوات الثلاث · الأوامر · الملف المشترك · الـ Console", S3, "المرجع: قسم «JavaScript: الحركة» بالورقة.");

  s = newSlide("CONTENT", "JavaScript · 3 خطوات", "أي ميزة JS هي 3 خطوات", S3);
  codeBox(s, M, 1.8, 7.4, 2.4, 'const btn = document.getElementById("addBtn");  // 1\nbtn.addEventListener("click", () => {            // 2\n  btn.textContent = "تمت الإضافة";                // 3\n});', null, 13);
  await iconRows(s, [
    ["FaHandPaper", "1. امسك", "الجرس: العنصر اللي الـ id تبعه addBtn"],
    ["FaBell", "2. استنى", "حدا كبس: الحدث (click)", C.accent2],
    ["FaLightbulb", "3. غيّر", "الضو اشتغل: النص تغيّر"],
  ], 8.3, W - M - 8.3, 1.8, 0.85, { ts: 17, bs: 14 });
  callout(s, M, 4.45, CW, 1.0, "بتنقرأ: «امسك العنصر اللي الـ id تبعه addBtn وسميه btn. لما حدا يكبس عليه، غيّر النص المكتوب عليه»", { size: 16 });
  callout(s, M, 5.6, CW, 0.8, "addBtn هو الـ id بالـ HTML. إذا مش نفس الاسم حرف بحرف، الـ JS ما بيلاقي العنصر", { size: 15, bold: false, fill: C.background2 });
  s.addNotes("5 دقائق. بعدين القاعة بتلاقي الخطوات الثلاث بقائمة الجوال تبع فريق عالشاشة.");

  const CMDS = [
    ["const / let", "متغير: const ما بيتغير، let بيتغير", "let count = 0;"],
    ["document.getElementById", "بيمسك عنصر بالـ id", 'document.getElementById("cart")'],
    ["document.querySelector", "بيمسك أول عنصر بأي selector", 'document.querySelector(".nav")'],
    ["document.querySelectorAll", "بيمسك كل العناصر", 'document.querySelectorAll(".card")'],
    ["addEventListener", "بيستنى حدث: click أو input أو submit", 'btn.addEventListener("click", ...)'],
    ["textContent", "النص اللي جوا العنصر", "badge.textContent = count;"],
    ["innerHTML", "HTML جوا العنصر", 'list.innerHTML = "<p>فاضي</p>";'],
    ["classList", "بيضيف أو بيشيل class: add و remove و toggle", 'nav.classList.toggle("open");'],
    ["style", "بيغيّر CSS من JS", 'bar.style.width = "80%";'],
    ["if / else", "شرط", "if (spent > cap) { ... } else { ... }"],
    ["function", "مجموعة أوامر باسم، بتناديها وقت ما بدك", "function showCart() { ... }"],
    ["forEach", "لكل عنصر بالمصفوفة، اعمل هالشي", "items.forEach(item => { ... });"],
    ["filter", "مصفوفة جديدة فيها بس اللي الشرط صح عليهم", "items.filter(i => i.price < 3)"],
    ["localStorage", "بيحفظ على نفس الجهاز بعد الـ refresh", 'localStorage.setItem("lang", "ar");'],
    ["console.log", "بيطبع بالـ Console (للتجربة)", 'console.log("شغال");'],
  ];
  for (let part = 0; part < 2; part++) {
    const rows = part === 0 ? CMDS.slice(0, 9) : CMDS.slice(9);
    s = newSlide("CONTENT", "JavaScript · القاموس", part === 0 ? "أهم الأوامر: امسك، استنى، غيّر" : "أهم الأوامر: أدوات", S3);
    table(s, ["الأمر", "شو بيعمل", "مثال"], rows, { ltr: [0, 2], y: 1.75, colW: [3.3, 4.6, 4.233], rowH: 0.5, fs: 13 });
    s.addNotes(part === 0 ? "امسك: getElementById و querySelector و querySelectorAll. استنى: addEventListener. غيّر: textContent و innerHTML و classList و style." : "مش لازم يحفظوه: هاد القاموس.");
  }

  s = newSlide("CONTENT", "JavaScript · الملف المشترك والـ Console", "قاعدتين قبل ما نربط", S3);
  {
    const { xs, cw } = colsX(2, 0.4);
    await card(s, xs[0], 1.8, cw, 3.2, { icon: "FaShareAlt", title: "main.js مربوط بكل الصفحات", body: "أي كود فيه لازم يتأكد إن العنصر موجود أول: if (btn) { ... }\nوما بصير نفس اسم const بملفين مربوطين بنفس الصفحة", titleSize: 19, bodySize: 15 });
    await card(s, xs[1], 1.8, cw, 3.2, { icon: "FaBug", iconFill: C.accent2, title: "F12 ← Console", body: "404 (Not Found) = الملف مش موجود بالمكان اللي بالمسار. هاد اللي بنصلّحه بعد شوي. جدول الأخطاء آخر ورقة المرجع", titleSize: 19, bodySize: 15 });
  }
  callout(s, M, 5.3, CW, 1.0, "افتح صفحة فريق فيها script src بيشاور على ملف مش موجود، وورّيهم الـ 404", { size: 15, bold: false });
  s.addNotes("دقيقتين للقاعدة و3 للـ Console.");

  s = newSlide("CONTENT", "JavaScript · تطبيق · 5 دقايق", "نفس سؤال فورم اليوم", S3);
  practice(s, "على موقعكم", [
    "اختاروا ميزة JS من موقعكم (الـ hamburger مسموح)",
    "حطوا تعليق جنب كل خطوة: // امسك و // استنى و // غيّر",
    "كل واحد بيشرح للثاني خطوة وحدة بكلماته",
  ], ["كل فريق علّم الخطوات الثلاث على ميزة من كوده", "«هاد بالضبط سؤال الفورم آخر اليوم»"], 1.8, 4.6);
  s.addNotes("الـ JS عند أغلبهم مش شغال لأنه مش مربوط. مش مشكلة: التمرين قراءة.");

  // ===== Files & wiring =====
  const S4 = "الملفات والربط";
  pres.addSection({ title: S4 });
  divider("1:10 · شرح 15 + تطبيق 30", "الملفات والربط", "الهيكل الموحّد · الأسلاك الثلاثة · الـ relative path · الأسماء", S4, "المرجع: قسم «الملفات والربط» بالورقة.");

  s = newSlide("CONTENT", "الملفات · الهيكل الموحّد", "كل الصفحات برّا، وملفاتها بمجلدات", S4);
  codeBox(s, M, 1.8, 6.6, 4.6, "my-site/\n├── index.html, menu.html, about.html\n├── css/\n│   ├── style.css\n│   └── menu.css ...\n├── js/\n│   ├── main.js, data.js\n│   └── menu.js ...\n└── images/", "الهيكل", 14);
  await iconRows(s, [
    ["FaHome", "البيت", "الصفحات غرف على نفس الممر"],
    ["FaShareAlt", "المشترك", "style.css و main.js لكل الصفحات، وملف لكل صفحة جنبهم", C.accent2],
    ["FaArchive", "الخزائن", "css للألوان، و js للأجهزة، و images للصور", C.accent2],
    ["FaTimesCircle", "مبارح", "كل غرفة كانت بيت لحالها"],
  ], 7.5, W - M - 7.5, 1.8, 1.05, { ts: 18, bs: 15 });
  s.addNotes("3 دقائق.");

  s = newSlide("CONTENT", "الملفات · الأسلاك الثلاثة", "3 أسلاك بتربط الموقع", S4);
  table(s, ["السلك", "بيربط", "وين بينحط"], [
    ['<link rel="stylesheet" href="css/style.css">', "الصفحة بالـ CSS", "بالـ head"],
    ['<script src="js/main.js"></script>', "الصفحة بالـ JS", "آخر الـ body"],
    ['<a href="menu.html">', "صفحة بصفحة", "وين ما بدك"],
  ], { ltr: [0], y: 1.8, colW: [6.4, 3.0, 2.733], rowH: 0.65, fs: 15 });
  callout(s, M, 4.6, CW, 0.8, "الترتيب بيفرق: CSS: style.css أول وبعدين ملف الصفحة. JS: main.js بعدين data.js بعدين ملف الصفحة", { size: 15 });
  callout(s, M, 5.6, CW, 0.8, "مثال من ورقة AI: menu.html بتربط menu.js، بس الملف اسمه js/main.js. السلك بيشاور على مكان فاضي", { size: 15, bold: false, fill: C.background2 });
  s.addNotes("4 دقائق.");

  s = newSlide("CONTENT", "الملفات · الـ relative path", "المسار بينحسب من مكان الملف اللي كاتب السطر", S4);
  table(s, ["الحالة", "المسار", "مثال"], [
    ["ملف بنفس المجلد", "اسمه بس", "من index.html لـ about.html"],
    ["ملف جوا مجلد", "اسم المجلد / اسم الملف", "من index.html لـ css/style.css"],
    ["ملف بمجلد فوق", "../ قبل الاسم", "من css/style.css لصورة: url(../images/bg.jpg)"],
  ], { y: 1.8, colW: [2.8, 3.4, 5.933], rowH: 0.62, fs: 15 });
  {
    const { xs, cw } = colsX(3, 0.3);
    const T = [["FaWalking", "جنبك", "اسم الملف"], ["FaDoorOpen", "جوا الغرفة", "css/style.css"], ["FaLevelUpAlt", "اطلع طابق", "../"]];
    for (let i = 0; i < 3; i++) await card(s, xs[i], 4.5, cw, 1.4, { title: T[i][1] + " = " + T[i][2], titleSize: 17 });
  }
  s.addText("صورة جوا ملف CSS: دايماً ../images/... · ممنوع: C:\\Users\\... ومسار بيبلش بـ /", R({ x: M, y: 6.1, w: CW, h: 0.5, fontSize: 14, color: "3E5266" }));
  s.addNotes("5 دقائق. ارسمها عاللوح كبناية. اسألهم قبل التطبيق: «من css/style.css بدي صورة بـ images/: شو بكتب؟»");

  s = newSlide("CONTENT", "الملفات · الأسماء", "إنجليزي، أحرف صغيرة، بدون مسافات", S4);
  {
    const { xs, cw } = colsX(2, 0.4);
    await card(s, xs[0], 1.8, cw, 2.4, { icon: "FaCheck", iconFill: C.accent2, title: "about-us.html", body: "صح", titleSize: 22, bodySize: 17 });
    await card(s, xs[1], 1.8, cw, 2.4, { icon: "FaTimes", title: "About Us.html", body: "غلط", titleSize: 22, bodySize: 17 });
  }
  callout(s, M, 4.45, CW, 0.9, "JS/Main.js غير js/main.js: على جهازك بيمشي، بس بعد النشر بكرا بيخرب", { size: 16 });
  callout(s, M, 5.55, CW, 0.9, "مثال من ورقة DSA: «explore portfolios.html» صارت explore.html", { size: 16, bold: false, fill: C.background2 });
  s.addNotes("3 دقائق.");

  s = newSlide("CONTENT", "تطبيق · 30 دقيقة", "نقل الملفات وتصليح الأسلاك (ورقة التصليح، خطوات 2 لـ 4)", S4);
  practice(s, "الخطوات", [
    "الهيكل الجديد: مجلد واحد بالاسم اللي بالورقة، وجواه css و js و images",
    "انقلوا وغيّروا الأسماء حسب جدول «الاسم هلأ ← الاسم الجديد»",
    "صلّحوا الأسلاك: بحث واستبدال (Ctrl + H) بكل صفحة حسب الجدول",
    "القائمة: نفس الـ nav بكل الصفحات",
    "جرّبوا: index.html على Live Server، تنقلوا، والـ Console بكل صفحة",
  ], ["مجلد واحد", "index.html بيودي على كل الصفحات", "ما في 404 بالـ Console", "الـ JS اشتغل لأول مرة!"], 1.8, 4.7);
  s.addNotes("بعد خطوة الأسلاك الـ JS بيشتغل لأول مرة عند أغلب الفرق: احتفل فيها بصوت عالي. لفّة: the sun، آفاق، تكنولوجيا، AI، IT، DSA.");

  s = newSlide("STATEMENT", "من 1:55 لـ 2:10", "استراحة 15 دقيقة", S4);
  s.addText("قبلها: zip للمجلد الجديد ← صفحة التسليم ← «نسخة احتياطية»", R({ x: M, y: 4.6, w: CW, h: 0.6, fontSize: 20, color: C.text2 }));
  s.addNotes("بالاستراحة مرّ على الفرق اللي لسا عندهم 404.");

  // ===== Shared =====
  const S5 = "تطليع المشترك";
  pres.addSection({ title: S5 });
  divider("2:10 · شرح 10 + تطبيق 30", "تطليع المشترك", "style.css للشكل · main.js للحركة · مش دمج الكل", S5, "افتح ملفي CSS لصفحتين من فريق جنب بعض، وورّيهم قواعد الـ header والـ footer مكررة.");

  s = newSlide("CONTENT", "المشترك · ليش؟", "نفس الـ header مكرر بـ 5 ملفات", S5);
  {
    const { xs, cw } = colsX(2, 0.4);
    await card(s, xs[0], 1.8, cw, 2.6, { icon: "FaCopy", title: "هلأ", body: "بدك تغيّر لون الـ header؟ بتغيّره بـ 5 ملفات، ورح تنسى واحد", titleSize: 20, bodySize: 16 });
    await card(s, xs[1], 1.8, cw, 2.6, { icon: "FaFileAlt", iconFill: C.accent2, title: "بعد التطليع", body: "المشترك بملف واحد: style.css للشكل، و main.js للحركة", titleSize: 20, bodySize: 16 });
  }
  callout(s, M, 4.7, CW, 0.75, "مش دمج الكل: بس المكرر (الـ header، الـ footer، المتغيرات، الأزرار، قائمة الجوال)", { size: 16 });
  callout(s, M, 5.6, CW, 0.75, "مين بيغلب؟ style.css أول، وملف الصفحة بعده، فالصفحة بتقدر تغيّر المشترك عندها", { size: 15, bold: false, fill: C.background2 });
  s.addNotes("5 دقائق. التشبيه: بدل ما كل غرفة إلها مفتاح كهرباء رئيسي، في لوحة وحدة للبيت.");

  s = newSlide("CONTENT", "المشترك · خطأ متوقع", "has already been declared", S5);
  codeBox(s, M, 1.8, CW, 1.2, "Uncaught SyntaxError: Identifier 'menuToggle' has already been declared", "Console", 16);
  await iconRows(s, [
    ["FaClone", "شو صار؟", "نفس اسم const بملفين مربوطين بنفس الصفحة، فكل الـ JS بيوقف"],
    ["FaTools", "الحل", "احذف الكود المكرر من ملف الصفحة", C.accent2],
    ["FaUsers", "مثال DSA", "كود قائمة الجوال (menuToggle و mainNav) بـ main.js، ومكرر بـ 4 ملفات"],
  ], M, CW, 3.25, 1.05, { ts: 18, bs: 15 });
  s.addNotes("دقيقتين.");

  s = newSlide("CONTENT", "تطبيق · 30 دقيقة", "خطوات 5 و6 بورقة التصليح", S5);
  practice(s, "الخطوات", [
    "الـ CSS: prompt أول صفحة بيطلّع style.css، وبعدين prompt لكل صفحة بيشيل منها المكرر",
    "سطر style.css فوق سطر ملف الصفحة",
    "بعد كل صفحة: قارنوا بالشكل القديم (تغيير صغير طبيعي)",
    "الـ JS: main.js قبل ملف الصفحة، واحذفوا المكرر بـ prompt الورقة",
    "جرّبوا زر القائمة على عرض جوال (F12 ← أيقونة الجوال)",
  ], ["style.css مربوط بكل الصفحات", "ملفات الصفحات أصغر", "قائمة الجوال شغالة", "ما في أحمر بالـ Console"], 1.8, 4.7);
  s.addNotes("الـ AI قطع الملف بالنص أو كتب «باقي الكود زي ما هو»؟ ارجعوله واطلبوا الملف كامل بدون اختصار.");

  // ===== Local / external =====
  const S6 = "المحلي والخارجي";
  pres.addSection({ title: S6 });
  s = newSlide("CONTENT", "2:50 · المحلي والخارجي", "أغراضك ببيتك، ولا مستعارة من الجيران؟", S6);
  table(s, ["", "المحلي", "الخارجي"], [
    ["شو هو", "ملف بمجلد موقعك", "رابط بيبلش بـ https://"],
    ["مثال", "images/latte.jpg", "https://fonts.googleapis.com/..."],
    ["متى نستعمله", "الصور وملفاتك", "الخطوط والأيقونات (Google Fonts و Material Symbols)"],
    ["الخطر", "ما في", "بده إنترنت، وممكن يوقف بأي لحظة"],
  ], { y: 1.75, colW: [2.2, 4.0, 5.933], rowH: 0.5, fs: 14 });
  callout(s, M, 4.95, CW, 0.75, "صور Stitch روابط خارجية، فلازم تنزل على images/. و Tailwind (cdn.tailwindcss.com) ممنوع", { size: 16 });
  callout(s, M, 5.8, CW, 0.7, "جرّب قدامهم: افصل النت واعمل refresh لصفحة فيها صور Stitch. «شو رح يصير؟»", { size: 15, bold: false, fill: C.background2 });
  s.addNotes("5 دقائق.");

  s = newSlide("CONTENT", "تطبيق · 15 دقيقة", "نزّلوا الصور", S6);
  practice(s, "بكل صفحة", [
    "Ctrl + F على https://: صورة ولا خط؟",
    "كل صورة: افتحوا الرابط، كليك يمين ← Save image، احفظوها بـ images/ باسم إنجليزي صغير (latte.jpg)",
    "غيّروا الـ src لـ images/latte.jpg. وبملف CSS: url(../images/latte.jpg)",
    "الخطوط والأيقونات من Google بتضل خارجية",
  ], ["صور الرئيسية على الأقل محلية", "بتظهر بدون نت", "الباقي بيكمل أول يوم 5"], 1.8, 4.6);

  // ===== data.js =====
  const S7 = "البيانات بـ JS";
  pres.addSection({ title: S7 });
  divider("3:10 · شرح 10 + تطبيق 20", "البيانات بـ JavaScript", "مصفوفة بـ data.js · loop بيرسم البطاقات", S7, "أول شي بينشال: إذا الساعة 3:10 وفي فرق لسا عندها 404، خلي الوقت للتصليح.");

  s = newSlide("CONTENT", "البيانات · data.js", "إضافة منتج جديد = سطر واحد", S7);
  codeBox(s, M, 1.8, CW, 1.9, 'const items = [\n  { id: 1, name: "لاتيه", price: 2.5, image: "images/latte.jpg" },\n  { id: 2, name: "موكا", price: 3, image: "images/mocha.jpg" }\n];', "js/data.js", 16);
  {
    const { xs, cw } = colsX(3, 0.3);
    const T = [["FaList", "[ ] مصفوفة", "مجموعة عناصر"], ["FaIdCard", "{ } object", "عنصر: مفتاح وقيمة"], ["FaTable", "زي Excel", "كل سطر منتج، وقالب البطاقة بينطبع مرة لكل سطر"]];
    for (let i = 0; i < 3; i++) await card(s, xs[i], 3.95, cw, 2.5, { icon: T[i][0], iconFill: i === 1 ? C.accent2 : C.accent1, title: T[i][1], body: T[i][2], titleSize: 18, bodySize: 15 });
  }
  s.addNotes("6 دقائق: الفكرة و data.js.");

  s = newSlide("CONTENT", "البيانات · الـ loop", "الـ loop بيرسم بطاقة لكل عنصر", S7);
  codeBox(s, M, 1.8, 6.8, 3.7, 'const list = document.getElementById("list");\nitems.forEach(item => {\n  list.innerHTML += `\n    <div class="card">\n      <img src="${item.image}" alt="${item.name}">\n      <h3>${item.name}</h3>\n      <p>${item.price} دينار</p>\n    </div>`;\n});', "ملف الصفحة", 12.5);
  await iconRows(s, [
    ["FaRedo", "forEach", "لكل عنصر بـ items، اعمل هالشي"],
    ["FaDollarSign", "${ }", "جوا الـ backticks بتحط قيمة جوا النص", C.accent2],
    ["FaHandPaper", "نفس الخطوات", "امسك list، وغيّر الـ innerHTML"],
  ], 7.7, W - M - 7.7, 1.8, 1.2, { ts: 17, bs: 14 });
  callout(s, M, 5.7, CW, 0.75, 'بالـ HTML: <div id="list" class="cards"></div> فاضي، و data.js مربوط قبل ملف الصفحة', { size: 15 });
  s.addNotes("4 دقائق. بتنقرأ: «لكل عنصر بـ items، ضيف جوا list بطاقة فيها صورته واسمه وسعره».");

  s = newSlide("CONTENT", "تطبيق · 20 دقيقة", "خطوة «تحسين» بورقة التصليح", S7);
  practice(s, "الخطوات", [
    "prompt الورقة (مكتوب لصفحتكم: المنيو عند AI، والمبدعين عند DSA)",
    "ترتيب الـ scripts: js/main.js بعدين js/data.js بعدين ملف الصفحة",
    "جرّبوا: ضيفوا سطر بـ data.js وشوفوا البطاقة طلعت",
  ], ["البطاقات بتنرسم من data.js", "البحث والفلترة ضلوا شغالين"], 1.8, 4.6);

  // ===== Check & submit =====
  const S8 = "الفحص والتسليم";
  pres.addSection({ title: S8 });
  s = newSlide("CONTENT", "3:40 · الفحص · 10 دقايق", "افحصوا صفحة صفحة", S8);
  {
    const items = ["القائمة بتودي على كل الصفحات، من كل صفحة", "F12 ← Console: ما في أحمر بولا صفحة", "الميزات اللي كانت مكتوبة شغالة (بحث، فلترة، قائمة الجوال)", "المجلد واحد، وفيه index.html"];
    for (let i = 0; i < items.length; i++) {
      const y = 1.85 + i * 0.9;
      box(s, M, y, CW, 0.74, i % 2 ? "FFFFFF" : C.background2, "D5DCE4");
      s.addShape(pres.shapes.RECTANGLE, { x: W - M - 0.62, y: y + 0.2, w: 0.34, h: 0.34, fill: { color: "FFFFFF" }, line: { color: HEX.accent1, width: 2 }, objectName: "checkbox" });
      s.addText(items[i], R({ x: M + 0.3, y: y + 0.12, w: CW - 1.2, h: 0.5, fontSize: 18, color: C.text2, valign: "middle" }));
    }
  }
  callout(s, M, 5.6, CW, 0.85, "أحمر بالـ Console؟ جدول الأخطاء آخر ورقة المرجع. مش موجود هناك؟ للـ AI: «قلي السبب بجملة، واعطيني السطر المصلّح بس»", { size: 14, bold: false });

  s = newSlide("CONTENT", "3:50 · التسليم", "صفحة التسليم ← اليوم 4 ← «تسليم نهائي»", S8);
  {
    const { xs, cw } = colsX(3, 0.3);
    await card(s, xs[0], 1.8, cw, 3.5, { icon: "FaFileArchive", num: "الفريق · مرة وحدة", title: "zip الموقع بعد التجميع", body: "المجلد الواحد اللي فيه index.html", titleSize: 19, bodySize: 15 });
    await card(s, xs[1], 1.8, cw, 3.5, { icon: "FaUser", iconFill: C.accent2, num: "كل واحد باسمه", title: "سؤال واحد", body: "اختار ميزة JS من موقعكم، وورجيني فيها الخطوات الثلاث: وين مسكت العنصر، وأي حدث، وشو غيّرت", titleSize: 19, bodySize: 15 });
    await card(s, xs[2], 1.8, cw, 3.5, { icon: "FaPlusCircle", num: "اختياري", title: "شغل إضافي", body: "لأي حدا اشتغل شي لحاله على جهازه", titleSize: 19, bodySize: 15 });
  }
  callout(s, M, 5.55, CW, 0.95, "«اللي علّم الخطوات الثلاث بتطبيق JS الصبح، جوابه جاهز. الصقوا الأسطر من كودكم، واشرحوها بكلماتكم»", { size: 15 });
  s.addNotes("7 دقائق.");

  s = newSlide("DIVIDER", "بكرا · اليوم الخامس", "بننشر مواقعكم عالنت", S8);
  s.addText("رابط حقيقي بتفتحوه من جوالاتكم، وبتعرضوه. اللي باقيله شي بيكمله أول نص ساعة", R({ x: M, y: 4.3, w: CW, h: 0.9, fontSize: 18, color: "C9D6E0" }));
  s.addNotes("3 دقائق.");

  // ===== Appendix =====
  const S9 = "ملحق";
  pres.addSection({ title: S9 });
  s = newSlide("CONTENT", "ملحق · مرجع إلك وإنت بتلف", "أخطاء الـ Console", S9);
  table(s, ["الخطأ", "معناه", "الحل"], [
    ["404 (Not Found)", "الملف مش موجود بالمكان اللي بالمسار", "قارن المسار بـ href أو src مع اسم الملف ومكانه حرف بحرف"],
    ["Cannot read properties of null", "الـ JS دوّر على عنصر وما لقاه", "الـ id بالـ JS نفسه اللي بالـ HTML؟ أو حط if (العنصر) { }"],
    ["... is not defined", "اسم مش معرّف", "غلط إملائي؟ (Items غير items) أو data.js مش مربوط قبل ملف الصفحة"],
    ["has already been declared", "نفس اسم const بملفين مربوطين", "احذف الكود المكرر من ملف الصفحة"],
  ], { ltr: [0], y: 1.8, colW: [3.3, 3.8, 5.033], rowH: 0.75, fs: 14 });
  callout(s, M, 5.85, CW, 0.8, "القاعدة العامة قبل ما تقرأ أي كود: احفظت؟ المسار صح؟ الاسم نفسه؟", { size: 16 });

  s = newSlide("CONTENT", "ملحق · لفّة الطاولات", "مين أول؟", S9);
  table(s, ["الفريق", "الوضع", "أصعب خطوة", "انتبه لـ"], [
    ["the sun", "ما في بناء من اليوم 3 بالملفات", "بناء صفحتين من الصفر", "شوف جهازهم أول شي"],
    ["آفاق", "صفحة وحدة فيها كل اشي", "prompt التقسيم لـ 4 صفحات", "نتيجة الاختبار مربوطة بالمكتبة"],
    ["تكنولوجيا", "5 صفحات، المسارات كلها غلط", "تصليح الأسلاك", "الأحرف الكبيرة (JS)، وصفحة Tailwind آخر شي"],
    ["AI", "4 صفحات بمجلدات، و JS مش مربوط", "تطليع الـ CSS المشترك", "footer الـ about ممكن يتغير: طبيعي"],
    ["IT Team", "3 صفحات بأسماء عشوائية", "أطول ورقة (9 خطوات)", "العلامة على الفهم"],
    ["DSA", "أنظف شغل، كله بمجلد واحد", "حذف كود القائمة المكرر", "main.js قبل حذف المكرر = الـ JS بيوقف"],
  ], { y: 1.75, colW: [1.7, 3.4, 3.2, 3.833], rowH: 0.7, fs: 13 });

  await pres.writeFile({ fileName: "day4-ar.pptx" });
  await applyTheme("day4-ar.pptx", THEME);
  console.log("done");
}
build().catch((e) => { console.error(e); process.exit(1); });
