
async function build() {
  // ===== Opening =====
  const S0 = "الافتتاح";
  pres.addSection({ title: S0 });
  let s = pres.addSlide({ masterName: "DIVIDER", sectionTitle: S0 });
  s.addText("دورة تطوير المواقع الإلكترونية بمساعدة الذكاء الاصطناعي", { placeholder: "kicker", rtlMode: true, align: "right" });
  s.addText("اليوم الرابع: خلّي الموقع يشتغل صح", { placeholder: "title", rtlMode: true, align: "right" });
  s.addText("نكمّل، نختبر، نصلّح، ونجهّز للنشر", R({ x: M, y: 4.2, w: CW, h: 0.5, fontSize: 22, color: "C9D6E0" }));
  s.addText("المدرب: حسام عليان", R({ x: M, y: 4.8, w: CW, h: 0.45, fontSize: 18, color: C.background1, bold: true }));
  for (let i = 0; i < 5; i++) {
    const x = W - M - 0.55 - i * 0.75;
    const on = i === 3, done = i < 3;
    const fill = on ? C.accent1 : done ? "4A6B88" : "2C4A66";
    s.addShape(pres.shapes.OVAL, { x, y: 1.3, w: 0.55, h: 0.55, fill: { color: fill }, line: { color: fill, width: 0 }, objectName: "day-dot" });
    s.addText(String(i + 1), { x, y: 1.3, w: 0.55, h: 0.55, fontSize: 16, bold: true, color: HEX.lt1, align: "center", valign: "middle", margin: 0, isTextBox: true });
  }
  s.addNotes("مبارح بنيتوا الموقع. اليوم بنتأكد إنه شغال صح عند أي حدا، مش بس عندكم.");

  s = newSlide("CONTENT", "افتتاح · مراجعة · 4 دقائق", "شو بيطبع هاد الكود؟", S0);
  codeBox(s, M, 1.8, 7.2, 3.4, 'const pages = [\n  "الرئيسية",\n  "المنيو",\n  "تواصل"\n];\nfor (let i = 0; i < pages.length; i++) {\n  if (i === 1) {\n    console.log(pages[i]);\n  }\n}', "Console", 16);
  {
    const x = 8.1, w = W - M - 8.1;
    const Q = [["FaQuestion", "شو بيطبع؟", "المنيو، لأن العدّ من 0"], ["FaEquals", "= أو ===؟", "= حط القيمة، === هل بيساوي؟", C.accent2], ["FaBars", "الـ hamburger", "مين؟ متى؟ شو؟"]];
    await iconRows(s, Q, x, w, 1.8, 1.15, { ts: 17, bs: 15 });
  }
  callout(s, M, 5.45, CW, 0.95, "اسأل برفع الإيد قبل ما تكشف الجواب", { size: 16, bold: false });
  s.addNotes("3 أسئلة، 4 دقائق.");

  s = newSlide("CONTENT", "افتتاح · وين وصلتوا؟", "ارفع إيدك على كل بند خلصته", S0);
  {
    const D = [["FaHome", "الرئيسية كاملة"], ["FaLink", "كل الصفحات مربوطة"], ["FaMagic", "ميزتين شغالات"], ["FaLayerGroup", "نسخة مدموجة"]];
    const { xs, cw } = colsX(4, 0.3);
    for (let i = 0; i < 4; i++) await card(s, xs[i], 1.85, cw, 2.2, { icon: D[i][0], num: String(i + 1), title: D[i][1], titleSize: 18 });
  }
  callout(s, M, 4.4, CW, 1.9, "«الموقع اللي بيشتغل عندك مش بالضرورة بيشتغل عند غيرك. اليوم بنكمّل، بنلاقي الأخطاء قبل ما يلاقيها الزائر، وبنجهّز الموقع للنشر. بكرة بيصير إله رابط حقيقي.»", { size: 17 });
  s.addNotes("سجّل الفرق اللي ناقصها أكثر من بند: هدول أول ناس بتقعد معهم بـ C1.");

  s = newSlide("CONTENT", "أجندة اليوم", "شو رح نعمل اليوم؟", S0);
  table(s, ["الوقت", "الجزء", "الموضوع"], [
    ["0:00", "افتتاح", "مراجعة ووين وصلنا"],
    ["0:10", "الدورة 1", "إكمال الصفحات"],
    ["0:45", "الدورة 2", "الـ Debugging بالـ AI + مسابقة الأخطاء المزروعة"],
    ["1:20", "استراحة", "15 دقيقة"],
    ["1:35", "الدورة 3", "Lighthouse: السرعة والوصول وSEO"],
    ["2:05", "الدورة 4", "الاختبار التبادلي بين الفرق"],
    ["2:40", "الدورة 5", "إصلاح الأخطاء"],
    ["3:15", "الدورة 6", "التجهيز للنشر على Netlify Drop"],
    ["3:40", "الختام", "أكبر خطأ، التقييم، ولمحة عن بكرا"],
  ], { y: 1.8, colW: [1.6, 2.2, 8.333], rowH: 0.42, fs: 14 });
  callout(s, M, 6.25, CW, 0.5, "قواعد ملكية الملفات لسا شغالة: ما حدا بيعدّل ملف مش إله", { size: 15 });
  s.addNotes("أقل يوم شرح: 43 دقيقة شرح و152 تطبيق.");

  // ===== C1 =====
  const S1 = "الدورة 1: إكمال الصفحات";
  pres.addSection({ title: S1 });
  divider("الدورة 1 · 35 دقيقة", "إكمال الصفحات", "نفس طريقة مبارح · prompt السياق · الأولويات · دمج سريع", S1, "شرح 5 دقائق، تطبيق 30.");

  s = newSlide("CONTENT", "الدورة 1 · قبل ما تبلش", "محادثة جديدة؟ ابلشها بـ prompt السياق", S1);
  promptBox(s, M, 1.75, 7.6, 4.75, "أنا ببني موقع [اسم المشروع] بـ HTML وCSS وJavaScript عادي، بدون أي framework.\n\nهاد ملف style.css تبعي (فيه المتغيرات): [الصق]\n\nوهاي صفحة كاملة من الموقع كمثال على الأسلوب: [الصق]\n\nبدنا نكمل صفحة [اسم الصفحة] قسم قسم، بنفس الأسلوب ونفس المتغيرات. استنى أبعتلك أول قسم.", "Prompt السياق", 15);
  {
    const x = 8.6, w = W - M - 8.6;
    await card(s, x, 1.75, w, 4.75, { icon: "FaBrain", title: "ليش؟", body: "المحادثة تبعت مبارح ممكن تكون ضاعت، أو طالت والـ AI نسي المتغيرات والأسلوب. هيك بيرجع يعرف كل شي بأول رسالة", titleSize: 19, bodySize: 15 });
  }

  s = newSlide("CONTENT", "الدورة 1 · تطبيق · 30 دقيقة", "ابلش حسب الناقص عندك", S1);
  await stepsFlow(s, [
    { icon: "FaExclamationCircle", num: "1", title: "الحد الأدنى", body: "الرئيسية أو ميزة أو روابط ناقصة؟ هاد أول شي" },
    { icon: "FaColumns", num: "2", title: "الأقسام الناقصة", body: "كمّل الصفحات حسب تصميم Stitch" },
    { icon: "FaGem", num: "3", title: "التطابق", body: "مسافات، hover، الجوال", dark: true },
  ], 1.9, 2.7, { bodySize: 15, titleSize: 19 });
  {
    const { xs, cw } = colsX(2, 0.4);
    await card(s, xs[0], 4.85, cw, 1.65, { icon: "FaClock", title: "25 دقيقة: كل واحد على صفحاته", titleSize: 17 });
    await card(s, xs[1], 4.85, cw, 1.65, { icon: "FaCodeBranch", iconFill: C.accent2, title: "آخر 5 دقائق: دمج سريع عند A", titleSize: 17 });
  }
  s.addNotes("فريق بعيد كتير: قلّل النطاق معهم (صفحة بتندمج بصفحة، قسم بينشال). أي تقليص بيروح لخطة التطوير بالعرض بكرة.");

  // ===== C2 =====
  const S2 = "الدورة 2: الـ Debugging";
  pres.addSection({ title: S2 });
  divider("الدورة 2 · 35 دقيقة", "الـ Debugging بالـ AI", "4 خطوات · رسائل الخطأ · Elements · prompt الإصلاح · مسابقة", S2, "شرح 12 دقيقة، تطبيق 23.");

  s = newSlide("CONTENT", "الدورة 2 · الطريقة", "الـ Debugging زي المحقق: الأدلة قبل الاتهام", S2);
  await stepsFlow(s, [
    { icon: "FaSearch", num: "1", title: "شو صار بالضبط؟", body: "«ما بينفتح الجواب لما أكبس» مش «خربان»" },
    { icon: "FaTerminal", num: "2", title: "شوف الأدلة", body: "Console وElements" },
    { icon: "FaLightbulb", num: "3", title: "خمّن السبب", body: "أو اسأل الـ AI بالأدلة" },
    { icon: "FaWrench", num: "4", title: "غيّر شي واحد", body: "وجرّب. 5 أشياء مرة وحدة؟ ما بتعرف مين صلّح", dark: true },
  ], 1.9, 3.3, { bodySize: 15, titleSize: 18 });
  callout(s, M, 5.5, CW, 0.9, "نفس الأربع خطوات بأي مشكلة، بأي موقع، حتى بعد الدورة", { size: 16 });
  s.addNotes("دقيقتين.");

  s = newSlide("CONTENT", "الدورة 2 · رسالة الخطأ", "اقرأ الرسالة: هي بتقلك وين المشكلة", S2);
  codeBox(s, M, 1.8, CW, 1.45, "Uncaught TypeError: Cannot read properties of null (reading 'addEventListener')\n    at accordion.js:3", "Console", 16);
  {
    const { xs, cw } = colsX(3, 0.3);
    const T = [["null", "الـ querySelector ما لاقى العنصر"], ["accordion.js:3", "الملف ورقم السطر. اكبس عليه بيوديك"], ["الخلاصة", "اسم الكلاس بالـ JS مش نفسه بالـ HTML، أو ناقص defer"]];
    for (let i = 0; i < 3; i++) await card(s, xs[i], 3.45, cw, 1.6, { title: T[i][0], body: T[i][1], titleSize: 17, bodySize: 14, dark: i === 2 });
  }
  table(s, ["الرسالة", "معناها"], [
    ["Cannot read properties of null", "العنصر مش موجود"],
    ["Failed to load resource: 404", "ملف مش موجود بهالمسار"],
    ["... is not defined / Unexpected token", "اسم مكتوب غلط / قوس أو فاصلة ناقصة"],
  ], { y: 5.2, colW: [5.5, 6.633], rowH: 0.42, fs: 13 });
  s.addNotes("4 دقائق. اعرض الرسالة حرفياً وفكّكها.");

  s = newSlide("CONTENT", "الدورة 2 · Elements", "كليك يمين على أي عنصر ← Inspect", S2);
  await iconRows(s, [
    ["FaCode", "الـ HTML الحقيقي", "بتشوف الكلاسات عليه، وإذا open انضاف لما كبست"],
    ["FaPaintBrush", "Styles على الجانب", "القواعد الطالعة على العنصر. القاعدة المشطوبة يعني في قاعدة ثانية غلبتها", C.accent2],
    ["FaFlask", "جرّب قيمة هون", "التغيير بيروح مع refresh. لما تلاقي القيمة الصح انقلها للملف"],
  ], M, CW, 1.9, 1.5, { ts: 19, bs: 16 });
  s.addNotes("3 دقائق على موقع الدورة.");

  s = newSlide("CONTENT", "الدورة 2 · Prompt الإصلاح", "Prompt: إصلاح خطأ", S2);
  promptBox(s, M, 1.75, 7.6, 4.75, "عندي مشكلة بموقع HTML/CSS/JS عادي.\nشو عملت: [كبست على السؤال بصفحة البرنامج]\nشو كنت متوقع: [ينفتح الجواب]\nشو صار: [ولا شي]\nرسالة الخطأ بالـ Console: [الصقها كاملة]\nالكود المتعلق: [الـ HTML تبع القسم + ملف الـ JS]\n\nاشرحلي شو السبب أول، بعدين اعطيني التعديل المطلوب بس (مش الملف كله من جديد).", "Prompt الإصلاح", 15);
  {
    const x = 8.6, w = W - M - 8.6;
    await card(s, x, 1.75, w, 2.25, { icon: "FaQuestionCircle", title: "السبب أول", body: "عشان تتعلم، وتتأكد إن الـ AI فهم المشكلة", titleSize: 17, bodySize: 14 });
    await card(s, x, 4.2, w, 2.3, { icon: "FaCut", iconFill: C.accent2, title: "التعديل بس", body: "الملف كله من جديد بيغيّر أشياء ما طلبتها وبيخرب الشغال", titleSize: 17, bodySize: 14 });
  }
  s.addNotes("لو التعديل ما زبط مرتين: ارجع للخطوة 1 واوصف من جديد، أو نادي المدرب.");

  s = newSlide("STATEMENT", "مسابقة · 23 دقيقة", "بموقع الدورة 5 أخطاء مخبّاية", S2);
  s.addText("نزّلوا course-site-bugs من الجروب · لكل خطأ: الصفحة · شو بيبيّن · السبب · الحل · أول فريق بيلاقي الخمسة بيرفع إيده", R({ x: M, y: 4.6, w: CW, h: 1.0, fontSize: 19, color: C.text2 }));
  s.addNotes("دقيقتين تنزيل، 15 بحث، 6 للحلول. الـ AI مسموح بس بـ prompt الإصلاح. اللي علقوا: دلّهم على الأداة مش على المكان. بعد 8 دقائق ممكن تلميح.");

  s = newSlide("CONTENT", "الدورة 2 · الحلول", "الأخطاء الخمسة", S2);
  table(s, ["#", "وين", "الخطأ", "الأداة اللي بتكشفه"], [
    ["1", "program.html", "styles.css بدل style.css", "Console: 404"],
    ["2", "css/index.css", "Hero.jpg والملف hero.jpg", "ما بيبيّن عندك! بيخرب بعد النشر"],
    ["3", "js/accordion.js", "faq-itm بدل faq-item", "Console: null"],
    ["4", "trainer.html", "ناقص dir=\"rtl\"", "Elements"],
    ["5", "الـ nav", "contactus.html بدل contact.html", "اكبس على كل رابط"],
  ], { y: 1.8, colW: [0.6, 2.4, 4.4, 4.733], rowH: 0.6, fs: 15 });
  callout(s, M, 5.6, CW, 0.9, "رقم 2: مش كل خطأ بيبيّن عندك. Windows ما بيفرّق بين الأحرف الكبيرة والصغيرة، بس السيرفر بيفرّق", { size: 15 });
  s.addNotes("اعرض هاي السلايد بعد الـ 15 دقيقة بس. وقف على رقم 2: بيمهّد لفحص الأسماء بـ C6.");

  s = newSlide("STATEMENT", "من 1:20 لـ 1:35", "استراحة 15 دقيقة", S2);
  s.addText("بعد الاستراحة بنشتغل على مواقعكم الحقيقية، مش موقع الأخطاء", R({ x: M, y: 4.6, w: CW, h: 0.6, fontSize: 20, color: C.text2 }));

  // ===== C3 =====
  const S3 = "الدورة 3: Lighthouse";
  pres.addSection({ title: S3 });
  divider("الدورة 3 · 30 دقيقة", "Lighthouse", "فحص السيارة السنوي لموقعك: 4 علامات + كيف تصلح", S3, "شرح 10 دقائق، تطبيق 20.");

  s = newSlide("CONTENT", "الدورة 3 · التشغيل", "شغّل Lighthouse بدقيقة", S3);
  await stepsFlow(s, [
    { icon: "FaUserSecret", num: "1", title: "Incognito", body: "Ctrl + Shift + N وافتح الصفحة بـ Live Server" },
    { icon: "FaTools", num: "2", title: "F12 ← Lighthouse", body: "ممكن يكون مخفي ورا »" },
    { icon: "FaMobileAlt", num: "3", title: "Mobile", body: "Navigation والـ 4 مجالات معلّمات" },
    { icon: "FaPlay", num: "4", title: "Analyze", body: "Analyze page load", dark: true },
  ], 1.9, 3.0, { bodySize: 15, titleSize: 18 });
  {
    const { xs, cw } = colsX(3, 0.3);
    const L = [["2A9D8F", "90 – 100", "أخضر"], ["F4A261", "50 – 89", "برتقالي"], ["D1495B", "أقل من 50", "أحمر"]];
    for (let i = 0; i < 3; i++) {
      s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: xs[i], y: 5.2, w: cw, h: 1.2, rectRadius: 0.12, fill: { color: L[i][0] }, line: { color: L[i][0], width: 0 }, objectName: "score" });
      s.addText(`${L[i][2]}: ${L[i][1]}`, { x: xs[i], y: 5.2, w: cw, h: 1.2, fontSize: 20, bold: true, color: HEX.lt1, align: "center", valign: "middle", margin: 0, rtlMode: true, isTextBox: true });
    }
  }
  s.addNotes("شغّله على موقع الدورة قدامهم. Incognito عشان الـ extensions ما تأثر.");

  s = newSlide("CONTENT", "الدورة 3 · المجالات", "4 علامات، وشو أشهر مشاكلها", S3);
  {
    const Q = [["FaTachometerAlt", "Performance", "السرعة", "صور كبيرة: ضغطها أو WebP بـ squoosh.app"], ["FaUniversalAccess", "Accessibility", "الكل بيقدر يستعمله", "alt ناقص، تباين، زر بدون اسم، ترتيب العناوين"], ["FaCheckDouble", "Best Practices", "الممارسات الصح", "أخطاء بالـ Console"], ["FaGoogle", "SEO", "Google بيفهم الصفحة", "ناقص meta description، روابط «اضغط هنا»"]];
    const { xs, cw } = colsX(4, 0.3);
    for (let i = 0; i < 4; i++) await card(s, xs[i], 1.85, cw, 3.3, { icon: Q[i][0], iconFill: i % 2 ? C.accent2 : C.accent1, num: Q[i][2], title: Q[i][1], body: Q[i][3], titleSize: 18, bodySize: 14 });
  }
  callout(s, M, 5.45, CW, 1.0, "الهدف: Accessibility وSEO وBest Practices أخضر. الـ Performance بيتغيّر على Live Server، فركّز على الصور بس", { size: 15 });
  s.addNotes("3 دقائق.");

  s = newSlide("CONTENT", "الدورة 3 · الإصلاحات", "أكثر 3 إصلاحات بتحتاجوها", S3);
  codeBox(s, M, 1.8, CW, 3.55, '<!-- 1. وصف الصفحة لـ Google: جملة خاصة بكل صفحة -->\n<meta name="description" content="مخبز الأمل في عمان: كعك ومعمول طازة كل يوم">\n\n<!-- 2. اسم لزر الـ hamburger -->\n<button class="menu-btn" aria-label="فتح القائمة">☰</button>\n\n<!-- 3. كل صورة إلها alt بيوصفها -->\n<img src="images/menu-cake.jpg" alt="كعكة شوكولاتة بالفراولة">', "HTML", 15);
  {
    const { xs, cw } = colsX(2, 0.4);
    callout(s, xs[0], 5.55, cw, 0.95, "التباين: نفس فحص WebAIM. لون مشترك بـ style.css؟ شغل A", { size: 14, bold: false });
    callout(s, xs[1], 5.55, cw, 0.95, "بعد كل إصلاح: شغّل Lighthouse مرة ثانية وشوف الرقم يطلع", { size: 14, bold: false, fill: C.background2 });
  }
  s.addNotes("الـ aria-label بالـ header بكل صفحة: كل واحد بيضيفه بصفحاته.");

  s = newSlide("CONTENT", "الدورة 3 · تطبيق · 20 دقيقة", "افحص، صلّح، وافحص مرة ثانية", S3);
  practice(s, "الخطوات", ["Lighthouse على صفحتين من صفحاتك (A: الرئيسية أول) + screenshot", "اقرأ كل مشكلة حمرا أو برتقالية. مش فاهم؟ الصقها للـ AI مع القسم", "صلّح أكبر 3 مشاكل", "شغّله مرة ثانية + screenshot بعد"], ["Accessibility وSEO أخضر", "screenshot قبل وبعد محفوظ للتقييم", "الصور الكبيرة انضغطت"]);
  callout(s, M, 6.0, CW, 0.6, "«هاي ملاحظة من Lighthouse على صفحتي [الصق]. اشرحلي معناها وكيف أصلحها بالكود تبعي [الصق القسم]»", { size: 13, bold: false });

  // ===== C4 =====
  const S4 = "الدورة 4: الاختبار التبادلي";
  pres.addSection({ title: S4 });
  divider("الدورة 4 · 35 دقيقة", "الاختبار التبادلي", "فريق ثاني بيشوف موقعك أول مرة، زي أي زائر حقيقي", S4, "شرح 5 دقائق، تطبيق 30.");

  s = newSlide("CONTENT", "الدورة 4 · ليش؟", "إنت بتعرف وين كل زر لأنك بنيته", S4);
  table(s, ["ما بينفع", "بينفع"], [
    ["«الفلتر خربان»", "«صفحة المنيو، وضع الجوال: كبست على «حلويات»، توقعت تضل الحلويات بس، ضلّت كل المنتجات ظاهرة»"],
    ["«الموقع مش حلو على الجوال»", "«الرئيسية، وضع الجوال: بطاقات الخدمات طالعة برا الشاشة وفي scroll بالعرض»"],
  ], { y: 1.8, colW: [3.8, 8.333], rowH: 0.85, fs: 14 });
  {
    const { xs, cw } = colsX(4, 0.25);
    const T = ["الصفحة", "شو عملت", "شو توقعت", "شو صار"];
    for (let i = 0; i < 4; i++) await card(s, xs[i], 4.55, cw, 0.9, { title: T[i], titleSize: 18, dark: true });
  }
  s.addText("الأهمية: عالية = خربان أو بيمنع المهمة · متوسطة = شغال بس محيّر · بسيطة = إملاء أو مسافة أو لون", R({ x: M, y: 5.7, w: CW, h: 0.8, fontSize: 15, color: C.text2 }));
  s.addNotes("نفس أسئلة prompt الإصلاح، فالتقرير المكتوب منيح بينلصق للـ AI مباشرة بـ C5.");

  s = newSlide("CONTENT", "الدورة 4 · التطبيق", "الترتيب دائري: 1 ← 2 ← 3 ... ← 1", S4);
  await stepsFlow(s, [
    { icon: "FaPenFancy", num: "3 دقائق", title: "التحضير", body: "كل فريق بيكتب مهمتين خاصين بموقعه، وA بيبعث ZIP + المهمتين" },
    { icon: "FaVial", num: "17 دقيقة", title: "الاختبار", body: "عضو على اللابتوب وعضو على وضع الجوال، والتقرير بيتعبى" },
    { icon: "FaPaperPlane", num: "10 دقائق", title: "التسليم", body: "التقرير على WhatsApp، والمراسل بيشرح أهم خطأين", dark: true },
  ], 1.9, 2.9, { bodySize: 15, titleSize: 19 });
  callout(s, M, 5.1, CW, 1.35, "المُختبِر ما بيصلّح شي، بيكتب بس · صاحب الموقع ما بيدافع، بيسمع وبيسأل · المراسل بيبدأ بشي عجبه بالموقع", { size: 16 });
  s.addNotes("كل فريق بيختبِر وبينختبَر بنفس الوقت، وما حدا بيقعد فاضي. المراسل يروح، والعضو الثاني يضل يستقبل.");

  s = newSlide("CONTENT", "الدورة 4 · المهام", "مهام الاختبار", S4);
  {
    const T = [["FaSitemap", "التنقل", "من الرئيسية لكل صفحة من الـ nav، والرجوع من الشعار"], ["FaMagic", "الميزات", "الميزتين والـ hamburger، على الجوال كمان"], ["FaStopwatch", "الـ CTA", "لاقي الإجراء الرئيسي بأقل من 10 ثواني"], ["FaSpellCheck", "المحتوى", "إملاء، نص ما بينقرأ، صورة ما ظهرت"], ["FaStar", "+ مهمتين", "من الفريق صاحب الموقع"]];
    const { xs, cw } = colsX(5, 0.25);
    for (let i = 0; i < 5; i++) await card(s, xs[i], 1.85, cw, 3.4, { icon: T[i][0], iconFill: i === 4 ? C.accent2 : C.accent1, title: T[i][1], body: T[i][2], titleSize: 17, bodySize: 14, dark: i === 4 });
  }
  callout(s, M, 5.55, CW, 0.9, "النجاح: كل فريق معه تقرير فيه 3 أخطاء على الأقل، كل واحد بالأسئلة الأربعة وإله أهمية", { size: 15, bold: false });
  s.addNotes("اقرأ تقارير بشكل سريع، واللي مكتوب «خربان» بس اطلب يكملوه. هاد جزء من التقييم.");

  // ===== C5 =====
  const S5 = "الدورة 5: الإصلاح";
  pres.addSection({ title: S5 });
  divider("الدورة 5 · 35 دقيقة", "إصلاح الأخطاء", "الفرز أول · لا تخرب شي شغال · نسخة احتياطية", S5, "شرح 3 دقائق، تطبيق 32.");

  s = newSlide("CONTENT", "الدورة 5 · الطريقة", "زي طوارئ المستشفى: الأخطر أول", S5);
  await stepsFlow(s, [
    { icon: "FaSave", num: "1", title: "نسخة احتياطية", body: "backup-day4.zip قبل أي تعديل" },
    { icon: "FaUsers", num: "2", title: "وزّع حسب المالك", body: "صفحة B لـ B، والمشترك لـ A" },
    { icon: "FaSortAmountDown", num: "3", title: "الأهمية", body: "عالية ← متوسطة ← بسيطة" },
    { icon: "FaCheck", num: "4", title: "صلّح وعلّم ✓", body: "prompt الإصلاح ← جرّب ← ✓ بالتقرير", dark: true },
  ], 1.9, 3.0, { bodySize: 15, titleSize: 18 });
  callout(s, M, 5.2, CW, 1.25, "بعد كل إصلاح جرّب المكان اللي صلحته، وكمان الصفحة كلها والجوال. أشهر شي بالمشاريع الحقيقية: تصلح خطأ وتعمل اثنين", { size: 16 });

  s = newSlide("CONTENT", "الدورة 5 · تطبيق · 32 دقيقة", "صلّحوا، ودمجوا، وتأكدوا", S5);
  {
    const T = [["FaSave", "دقيقتين", "النسخة الاحتياطية + توزيع الأخطاء"], ["FaWrench", "25 دقيقة", "كل واحد على ملفاته، العالية أول"], ["FaCodeBranch", "5 دقائق", "دمج، وA بيفحص العالية بالنسخة المدموجة"]];
    const { xs, cw } = colsX(3, 0.3);
    for (let i = 0; i < 3; i++) await card(s, xs[i], 1.85, cw, 2.6, { icon: T[i][0], num: T[i][1], title: T[i][2], titleSize: 17, dark: i === 1 });
  }
  callout(s, M, 4.75, CW, 1.7, "خطأ أكبر من الوقت (ميزة بدها إعادة كتابة)؟ بسّطها أو رحّلها لخطة التطوير، بس لازم تضل ميزتين شغالات. النجاح: كل الأخطاء العالية انحلّت بالنسخة المدموجة", { size: 15, bold: false });
  s.addNotes("ما بتصلح بإيدك. بتسأل: شو بتقلك الـ Console؟ شو بعثت للـ AI؟");

  // ===== C6 =====
  const S6 = "الدورة 6: التجهيز للنشر";
  pres.addSection({ title: S6 });
  divider("الدورة 6 · 25 دقيقة", "التجهيز للنشر على Netlify Drop", "شروط المجلد · فحص الأسماء · favicon · حساب Netlify", S6, "شرح 8 دقائق، تطبيق 17. اسحب موقع الدورة على Netlify Drop قدامهم.");

  s = newSlide("CONTENT", "الدورة 6 · شروط المجلد", "Netlify بياخد المجلد زي ما هو", S6);
  table(s, ["الشرط", "ليش"], [
    ["index.html بالمجلد الرئيسي مباشرة", "Netlify بيفتحه أول شي، بدونه الموقع ممكن ما يبيّن"],
    ["كل الأسماء: إنجليزي، أحرف صغيرة، بدون مسافات", "السيرفر بيفرّق بين Hero.jpg وhero.jpg"],
    ["كل href وsrc بطابق اسم الملف حرف حرف", "نفس السبب"],
    ["ما في ملفات زايدة (Stitch، ZIP، Word)", "بتنرفع مع الموقع"],
    ["كل صفحة إلها title خاص وfavicon", "هاد اللي بيبيّن على التبويب"],
  ], { y: 1.8, colW: [5.6, 6.533], rowH: 0.62, fs: 15 });
  callout(s, M, 5.65, CW, 0.8, "فحص سريع: بـ VS Code اضغط Ctrl + Shift + F وابحث عن src= وhref=، وقارن كل نتيجة باسم الملف بالـ Explorer", { size: 14, bold: false });
  s.addNotes("3 دقائق.");

  s = newSlide("CONTENT", "الدورة 6 · فحص الأسماء", "Prompt: فحص الأسماء + favicon", S6);
  promptBox(s, M, 1.75, 7.6, 3.4, "هاي قائمة ملفات موقعي بالمسارات: [انسخها من الـ Explorer]\nوهاد الـ HTML تبع صفحة [اسم الصفحة]: [الصق]\nتأكد إن كل href وsrc بطابق اسم ملف موجود بالضبط، بنفس الأحرف الكبيرة والصغيرة.\nاعطيني قائمة باللي مش مطابق بس.", "Prompt فحص الأسماء", 15);
  codeBox(s, M, 5.35, 7.6, 1.15, '<link rel="icon" href="images/favicon.png">', "favicon: بالـ head بكل صفحة", 15);
  {
    const x = 8.6, w = W - M - 8.6;
    await card(s, x, 1.75, w, 4.75, { icon: "FaIcons", title: "favicon", body: "الأيقونة الصغيرة بالتبويب. A بيعملها من حرف أو emoji (favicon.io) وبيحطها بـ images/favicon.png، وكل واحد بيضيف السطر بصفحاته", titleSize: 19, bodySize: 15 });
  }

  s = newSlide("CONTENT", "الدورة 6 · حساب Netlify", "اعملوا الحساب اليوم، مش بكرة", S6);
  {
    const { xs, cw } = colsX(2, 0.4);
    await card(s, xs[0], 1.85, cw, 3.0, { icon: "FaHourglassHalf", title: "ليش لازم حساب؟", body: "Netlify Drop بينشر بدون حساب، بس الموقع اللي ما بتضيفه لحسابك بينمسح خلال ساعة", titleSize: 19, bodySize: 16 });
    await card(s, xs[1], 1.85, cw, 3.0, { icon: "FaUserPlus", iconFill: C.accent2, title: "A بيعمل الحساب", body: "على netlify.com بالإيميل أو حساب Google، بيفعّله، وبيتأكد إنه بيعرف كلمة السر", titleSize: 19, bodySize: 16 });
  }
  callout(s, M, 5.15, CW, 1.3, "اختاروا اسم الرابط: إنجليزي، أحرف صغيرة، بشرطات. مثلاً my-bakery يعني الرابط my-bakery.netlify.app. وجهّزوا اسمين احتياطيين لو محجوز", { size: 15 });
  s.addNotes("2 دقيقة. بكرة ما بدنا نضيع وقت على تفعيل الإيميلات.");

  s = newSlide("CONTENT", "الدورة 6 · تطبيق · 17 دقيقة", "المجلد النهائي", S6);
  table(s, ["العضو", "المهمة"], [
    ["A", "الـ favicon، حساب Netlify، فحص أسماء صفحاته، تنظيف الملفات الزايدة"],
    ["B", "فحص أسماء صفحاته وصوره، سطر الـ favicon والـ title بصفحاته"],
    ["الاثنين", "الدمج النهائي، تجربة أخيرة بـ Live Server، وfinal-day4.zip عند الاثنين"],
  ], { y: 1.8, colW: [2.0, 10.133], rowH: 0.75, fs: 16 });
  callout(s, M, 4.95, CW, 0.85, "تغيير اسم ملف لازم يتغيّر معه كل href أو src بيشير عليه (Ctrl + Shift + F على الاسم القديم)", { size: 15 });
  callout(s, M, 5.95, CW, 0.65, "النجاح: مجلد نظيف عند الاثنين، حساب Netlify شغال عند A، واسم الرابط متفق عليه", { size: 15, bold: false, fill: C.background2 });
  s.addNotes("افتح Explorer عند كل فريق ودوّر على أحرف كبيرة أو مسافات أو عربي بالأسماء، ومجلد داخل مجلد.");

  // ===== Closing =====
  const S7 = "الختام";
  pres.addSection({ title: S7 });
  s = newSlide("CONTENT", "الختام · 6 دقائق", "أكبر خطأ لقيناه اليوم", S7);
  promptBox(s, M, 2.0, CW, 2.2, "«أكبر خطأ لقيناه اليوم كان ... وكشفناه بـ ...»", "كل فريق بجملة وحدة", 26);
  callout(s, M, 4.6, CW, 1.2, "الكل عنده أخطاء، حتى المحترفين. الفرق إنك بتعرف كيف تلاقيها وتصلحها", { size: 18 });
  s.addNotes("الهدف يسمعوا إن الكل عنده أخطاء، والمهم كيف لاقوها.");

  s = newSlide("CONTENT", "الختام · 8 دقائق", "التقييم على Google Form", S7);
  {
    const D = [["FaFileArchive", "final-day4.zip", "واحد لكل فريق، A بيرفعه"], ["FaTachometerAlt", "Lighthouse", "screenshot لصفحة من صفحاتك"], ["FaQuestion", "سؤال فهم", "واحد من الثلاثة"], ["FaWrench", "خطأ صلحته", "شو سببه وكيف صلحته؟"]];
    const { xs, cw } = colsX(4, 0.3);
    for (let i = 0; i < 4; i++) await card(s, xs[i], 1.85, cw, 2.6, { icon: D[i][0], num: String(i + 1), title: D[i][1], body: D[i][2], titleSize: 17, bodySize: 14 });
  }
  callout(s, M, 4.75, CW, 1.1, "أسئلة الفهم: شو بتعمل لما ميزة ما بتشتغل؟ · شو معنى رسالة 404 بالـ Console؟ · ليش الصور لازم يكون إلها alt؟", { size: 15, bold: false });

  s = newSlide("DIVIDER", "ملخص اليوم", "شو تعلمنا اليوم؟", S7);
  {
    const pts = ["الأدلة قبل الاتهام: Console وElements", "Lighthouse: 4 علامات وكيف تصلح", "عين فريق ثاني بتشوف اللي ما بتشوفه", "الأسماء أحرف صغيرة، والمجلد جاهز"];
    const { xs, cw } = colsX(4, 0.25);
    for (let i = 0; i < 4; i++) {
      s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: xs[i], y: 4.25, w: cw, h: 1.1, rectRadius: 0.12, fill: { color: "2C4A66" }, line: { color: "2C4A66", width: 0 }, objectName: "summary-card" });
      s.addText(pts[i], { x: xs[i] + 0.2, y: 4.25, w: cw - 0.4, h: 1.1, fontSize: 15, bold: true, color: HEX.lt1, align: "center", valign: "middle", margin: 0, rtlMode: true, isTextBox: true });
    }
    s.addText("بكرة آخر يوم: رابط حقيقي، نفتحه من الجوال، نربطه ببطاقة التعريف، وكل فريق بيعرض مشروعه. فكروا: شو القصة اللي بدكم تحكوها؟", R({ x: M, y: 5.6, w: CW, h: 0.9, fontSize: 16, color: "C9D6E0" }));
  }
  s.addNotes("تذكيرات: اللابتوب والجوال مشحونين، A يعرف إيميل وكلمة سر Netlify، final-day4.zip عند الاثنين، ومجلد بطاقة التعريف جاهز.");

  // ===== Appendix =====
  const S9 = "ملحق: أخطاء شائعة";
  pres.addSection({ title: S9 });
  const ERR = [
    ["الـ AI صلّح وخرّب شي ثاني", "رجّع الملف كله", "النسخة الاحتياطية + «التعديل المطلوب بس»"],
    ["نفس الخطأ رجع بعد الدمج", "انبعثت نسخة قديمة", "قارن وقت التعديل وابعث الملف من جديد"],
    ["Lighthouse ما بيبيّن", "مخفي ورا » أو مش Chrome", "» فوق بـ DevTools، أو افتح بـ Chrome"],
    ["Performance بيتغيّر كل مرة", "طبيعي على الجهاز", "Incognito، وركّز على الصور"],
    ["Buttons do not have an accessible name", "زر أيقونة بس", "aria-label=\"فتح القائمة\""],
    ["Headings not in sequentially-descending order", "قفز من h1 لـ h3", "h1 ← h2 ← h3، والحجم بالـ CSS"],
    ["Form elements do not have associated labels", "حقل بدون label", "label for=\"email\" مع id=\"email\""],
    ["Links do not have descriptive text", "«اضغط هنا»", "نص بيوصف وين بيودّي"],
    ["الـ favicon ما بيبيّن", "المتصفح مخزّن القديم", "Ctrl + Shift + R أو Incognito"],
    ["تغيير اسم ملف كسّر صفحات", "href بالاسم القديم", "Ctrl + Shift + F وغيّره بكل مكان"],
  ];
  for (let part = 0; part < 2; part++) {
    s = newSlide("CONTENT", "ملحق · مرجع إلك وإنت بتلف", `أخطاء اليوم الرابع وحلولها (${part + 1} من 2)`, S9);
    table(s, ["العرض", "السبب", "الحل"], ERR.slice(part * 5, part * 5 + 5), { y: 1.8, colW: [4.6, 3.0, 4.533], rowH: 0.75, fs: 14 });
    s.addNotes("جدول أخطاء الكود من اليوم الثالث لسا شغال.");
  }

  await pres.writeFile({ fileName: "day4-ar.pptx" });
  await applyTheme("day4-ar.pptx", THEME);
  console.log("done");
}
build().catch((e) => { console.error(e); process.exit(1); });
