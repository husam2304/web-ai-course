
// ---------- Day 2 slides ----------
function swatch(s, x, y, w, h, hex, label, textHex) {
  s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x, y, w, h, rectRadius: 0.1, fill: { color: hex }, line: { color: "D5DCE4", width: 1 }, objectName: "swatch" });
  s.addText(label, { x, y, w, h, fontSize: 13, bold: true, color: textHex, align: "center", valign: "middle", margin: 0, rtlMode: true, isTextBox: true });
}
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

async function build() {
  // ===== Opening =====
  const S0 = "الافتتاح";
  pres.addSection({ title: S0 });
  let s = pres.addSlide({ masterName: "DIVIDER", sectionTitle: S0 });
  s.addText("دورة تطوير المواقع الإلكترونية بمساعدة الذكاء الاصطناعي", { placeholder: "kicker", rtlMode: true, align: "right" });
  s.addText("اليوم الثاني: تصميم الواجهة وتجربة المستخدم", { placeholder: "title", rtlMode: true, align: "right" });
  s.addText("من الورقة لتصميم ملون لكل صفحات موقعك", R({ x: M, y: 4.2, w: CW, h: 0.5, fontSize: 22, color: "C9D6E0" }));
  s.addText("المدرب: حسام عليان", R({ x: M, y: 4.8, w: CW, h: 0.45, fontSize: 18, color: C.background1, bold: true }));
  for (let i = 0; i < 5; i++) {
    const x = W - M - 0.55 - i * 0.75;
    const on = i === 1, done = i === 0;
    const fill = on ? C.accent1 : done ? "4A6B88" : "2C4A66";
    s.addShape(pres.shapes.OVAL, { x, y: 1.3, w: 0.55, h: 0.55, fill: { color: fill }, line: { color: fill, width: 0 }, objectName: "day-dot" });
    s.addText(String(i + 1), { x, y: 1.3, w: 0.55, h: 0.55, fontSize: 16, bold: true, color: HEX.lt1, align: "center", valign: "middle", margin: 0, isTextBox: true });
  }
  s.addNotes("أهلاً فيكم باليوم الثاني. امبارح خططنا، واليوم بنصمم. آخر اليوم كل فريق رح يكون عنده تصميم ملون معتمد لكل صفحات موقعه.");

  s = newSlide("CONTENT", "افتتاح · مراجعة سريعة", "خلونا نتذكر امبارح", S0);
  {
    const Q = [["FaServer", "شو الفرق بين الموقع الثابت والديناميكي؟", "الثابت نفس المحتوى للكل، والديناميكي بيتجهز إلك وبده Backend"], ["FaStar", "شو القاعدة الذهبية؟", "إذا ما بتقدر تشرح الكود بجملة، لا تحطه بموقعك"], ["FaHandPointer", "شو الـ CTA؟", "الزر اللي بيخلي الزائر يعمل الإجراء الرئيسي"]];
    const { xs, cw } = colsX(3, 0.3);
    for (let i = 0; i < 3; i++) await card(s, xs[i], 1.9, cw, 3.6, { icon: Q[i][0], title: Q[i][1], body: "الجواب: " + Q[i][2], titleSize: 19, titleH: 1.0, bodySize: 15 });
  }
  callout(s, M, 5.8, CW, 0.7, "اسأل قبل ما تكشف الجواب، وخليهم يجاوبوا برفع الإيد", { bold: false, size: 15 });
  s.addNotes("3 أسئلة برفع الإيد، 4 دقائق. اكشف الجواب بعد ما تسمع منهم.");

  s = newSlide("CONTENT", "افتتاح · ملاحظات على امبارح", "3 ملاحظات من تسليماتكم", S0);
  {
    const N = [["FaClipboardCheck", "الخطة ناقصة", "فريقين ما سلّموا الجمهور والأهداف، وما حدا سلّم الصفحات والخريطة. اليوم بنكمّلها أول شي"], ["FaServer", "ليش ما بدنا Backend؟", "مش لأنه «الكود جاهز». لأنه ما في بيانات بتنحفظ: لا حسابات ولا طلبات ولا دفع"], ["FaKeyboard", "«بكلماتك» يعني بكلماتك", "الجواب المنسوخ من الـ AI بيبين، وما بيثبت إنك فاهم. جملتين منك أحسن من صفحة منسوخة"]];
    const { xs, cw } = colsX(3, 0.3);
    for (let i = 0; i < 3; i++) await card(s, xs[i], 1.9, cw, 3.4, { icon: N[i][0], num: String(i + 1), title: N[i][1], body: N[i][2], titleSize: 19, bodySize: 15 });
  }
  callout(s, M, 5.6, CW, 0.85, "ومن اليوم: شغل الفريق بيرفعه أي حد، وكل واحد بيجاوب سؤال الفهم باسمه", { size: 16 });
  s.addNotes("بدون أسماء فرق. الملاحظة الثانية مهمة: في فريق كتب إنه ما بحتاج Backend لأنه راح ياخذ الكود جاهز. صحّحها بمثال: لو الموقع بده يتذكر مين سجّل أو شو طلب الزبون، هاد بده Backend. 4 دقائق.");

  s = newSlide("CONTENT", "افتتاح · هدف اليوم", "شو رح تسلّموا آخر اليوم؟", S0);
  await stepsFlow(s, [
    { icon: "FaPencilRuler", num: "1", title: "Wireframes", body: "لكل الصفحات، ونسخة الجوال للرئيسية" },
    { icon: "FaPalette", num: "2", title: "دليل التصميم", body: "الألوان والخطوط وشكل الزر، والتباين مفحوص" },
    { icon: "FaDesktop", num: "3", title: "تصميم ملون", body: "كل الصفحات من Google Stitch" },
    { icon: "FaCheckCircle", num: "4", title: "اعتماد", body: "بعد مراجعة فريق ثاني والمدرب", dark: true },
  ], 1.9, 3.3, { bodySize: 15, titleSize: 19 });
  callout(s, M, 5.55, CW, 0.9, "مثال: موقع الدورة. هيك بدأ كـ wireframe على ورق، وهيك صار بالتصميم النهائي", { size: 16 });
  s.addNotes("اعرض الـ wireframe تبع رئيسية موقع الدورة جنب التصميم النهائي. «هيك بتبلشوا اليوم، وهيك بتخلصوا.» 6 دقائق مع المثال.");

  s = newSlide("CONTENT", "أجندة اليوم", "شو رح نعمل اليوم؟", S0);
  table(s, ["الوقت", "الجزء", "الموضوع"], [
    ["0:00", "افتتاح", "مراجعة وملاحظات وهدف اليوم"],
    ["0:10", "تعويض", "خطة الفريق"],
    ["0:40", "الدورة 1", "مبادئ UX/UI وتحليل مواقع حقيقية"],
    ["0:55", "الدورة 2", "الـ Wireframes والمكونات"],
    ["1:20", "استراحة", "15 دقيقة"],
    ["1:35", "الدورة 3", "الألوان والخطوط ودليل التصميم"],
    ["2:00", "الدورة 4", "إمكانية الوصول"],
    ["2:15", "الدورة 5", "التصميم للجوال"],
    ["2:25", "الدورة 6", "التصميم بـ Google Stitch"],
    ["3:15", "الدورة 7", "المراجعة والاعتماد"],
    ["3:35", "الختام", "التسليم ولمحة عن بكرا"],
  ], { y: 1.75, colW: [1.6, 2.2, 8.333], rowH: 0.43, fs: 14 });
  s.addNotes("بينتهي 3:45، و15 دقيقة احتياط لأنه امبارح تأخرنا. الدورات 1 و4 و5 صارت أقصر عشان التعويض. عملي أكثر من امبارح.");

  // ===== Catch-up: team plan =====
  const SX = "تعويض: خطة الفريق";
  pres.addSection({ title: SX });
  divider("تعويض · 30 دقيقة", "نكمّل خطة امبارح", "الصفحات · الأولويات · خريطة الموقع · الإحساس العام", SX, "ما في Wireframes قبل ما الخطة تتسلّم وتأشّر عليها. الفرق اللي سلّمت الجمهور والأهداف امبارح بتبلش من الصفحات.");

  s = newSlide("CONTENT", "تعويض · قاعدة واضحة", "ميزة بدها Backend؟ بتنعمل واجهة بس", SX);
  {
    const { xs, cw } = colsX(2, 0.4);
    await card(s, xs[0], 1.8, cw, 3.55, { icon: "FaCheck", iconFill: C.accent2, title: "مسموح كواجهة عرض", body: bullets(["صفحة تسجيل دخول شكلها كامل", "فورم طلب أو حجز", "نجوم تقييم بتتلوّن لما تكبس", "الزر بيعرض رسالة «قريباً» أو «تم» بس"]), titleSize: 21, bodySize: 16 });
    await card(s, xs[1], 1.8, cw, 3.55, { icon: "FaTimes", iconFill: "C0392B", title: "مش جزء من مشروعنا", body: bullets(["حسابات بتنحفظ فعلاً", "طلبات بتوصل لصاحب المحل", "دفع حقيقي", "تقييمات بتضل بعد ما تسكّر الصفحة"]), titleSize: 21, bodySize: 16 });
  }
  callout(s, M, 5.6, CW, 0.85, "اتفقنا امبارح: اللي بده Backend بيبين بالتصميم، بس ما بيحفظ شي. واكتبوه بالخطة: «واجهة عرض فقط»", { size: 16 });
  s.addNotes("هاي للفرق اللي فكرتها فيها حسابات أو حفظ بيانات. احكي مع الفريق لحاله إذا بده تصغير أكثر. دقيقتين.");

  s = newSlide("CONTENT", "تعويض · 25 دقيقة", "قالب خطة الفريق", SX);
  {
    const F = [["1", "الفكرة بجملة", "شو الموقع ولمين"], ["2", "الجمهور والأهداف", "من امبارح، أو عبّوه هلأ"], ["3", "الإجراء الرئيسي", "الزر الأهم بالموقع"], ["4", "الصفحات (3 لـ 6)", "اسم كل صفحة وأقسامها"], ["5", "ضروري ولاحقاً", "شو بندخل بالنسخة الأولى"], ["6", "ميزتين تفاعليتين", "وشو منها «واجهة عرض فقط»"], ["7", "خريطة الموقع", "مين بيوصل لمين"], ["8", "الإحساس العام", "3 كلمات وألوان مقترحة"]];
    const { xs, cw } = colsX(4, 0.25);
    for (let i = 0; i < 8; i++) {
      const x = xs[i % 4], y = i < 4 ? 1.8 : 3.55;
      box(s, x, y, cw, 1.55, i === 7 ? C.text2 : C.background2);
      s.addText(F[i][0], R({ x: x + 0.2, y: y + 0.15, w: cw - 0.4, h: 0.35, fontSize: 15, bold: true, color: i === 7 ? C.accent6 : C.accent1 }));
      s.addText(F[i][1], R({ x: x + 0.2, y: y + 0.5, w: cw - 0.4, h: 0.45, fontSize: 18, bold: true, color: i === 7 ? C.background1 : C.text2 }));
      s.addText(F[i][2], R({ x: x + 0.2, y: y + 0.97, w: cw - 0.4, h: 0.45, fontSize: 14, color: i === 7 ? "C9D6E0" : "3E5266" }));
    }
  }
  callout(s, M, 5.35, CW, 1.1, "الـ prompt والقالب على موقع الدورة ← ملفات الدورة ← اليوم 2. انسخوا الخطة بزر النسخ تبع الـ AI، والصقوها بخانة «خطة الفريق» بالتسليم", { size: 15 });
  s.addNotes("مر على كل فريق وأشّر على الخطة قبل ما يبلشوا Wireframes. زر النسخ تبع الـ AI بيحافظ على التنسيق (Markdown)، والتظليل بيخربه. الفريق اللي خلص بدري بيبلش مبادئ UX لحاله من الشرائح.");

  s = newSlide("CONTENT", "تعويض · التسليم والتقييم", "كيف بنسلّم من اليوم؟", SX);
  await stepsFlow(s, [
    { icon: "FaUsers", num: "شغل الفريق", title: "أي حد بالفريق", body: "الخطة كنص، والـ wireframes، وتصميم Stitch. مرة وحدة بكفي" },
    { icon: "FaUserCheck", num: "كل واحد", title: "باسمه", body: "اسمك من القائمة، وجواب سؤال الفهم بكلماتك" },
    { icon: "FaRocket", num: "اختياري", title: "شغل إضافي", body: "عملت موقع جانبي أو اشتغلت لحالك زيادة؟ إله خانة لحاله" },
    { icon: "FaStar", num: "التقييم", title: "على الخطوات", body: "مش على أحلى نتيجة. اللي بيقفز عن الخطوات بيخسر علامتها", dark: true },
  ], 1.85, 3.4, { bodySize: 14 });
  callout(s, M, 5.55, CW, 0.9, "مستعجل أو عندك خبرة؟ خلّص شغل الفريق خطوة خطوة أول، وبعدها جرّب أفكارك بخانة «شغل إضافي»", { size: 15 });
  s.addNotes("هاي للمستعجلين ولأصحاب الخلفية التقنية: شغل الفريق بالخطوات، وطاقتهم الزيادة بتروح للشغل الإضافي وبتنحسبلهم. دقيقتين.");

  // ===== Cycle 1 =====
  const S1 = "الدورة 1: مبادئ UX/UI";
  pres.addSection({ title: S1 });
  divider("الدورة 1 · 15 دقيقة", "مبادئ UX/UI", "الفرق بين UX و UI · 8 مبادئ · تحليل موقعين حقيقيين", S1, "الهدف: المشارك بيفرّق بين UX و UI، وبيعرف 8 مبادئ أساسية، وبيقدر يحكم على موقع إذا تصميمه جيد أو سيئ ولیش.".replace("ولیش", "وليش"));

  s = newSlide("CONTENT", "الدورة 1 · مبادئ UX/UI", "UX و UI: كيف بيشتغل، وكيف بيبين", S1);
  {
    const { xs, cw } = colsX(2, 0.4);
    await card(s, xs[0], 1.85, cw, 3.3, { icon: "FaRoute", title: "UX = User Experience", body: [{ text: "كيف بيشتغل", options: { bold: true, breakLine: true, rtlMode: true, color: HEX.accent2 } }, { text: "هل الموقع سهل ومفهوم؟ هل الزائر بيوصل لهدفه بسرعة؟", options: { rtlMode: true } }], titleSize: 22, titleH: 0.55, bodySize: 17 });
    await card(s, xs[1], 1.85, cw, 3.3, { icon: "FaPaintBrush", iconFill: C.accent2, title: "UI = User Interface", body: [{ text: "كيف بيبين", options: { bold: true, breakLine: true, rtlMode: true, color: HEX.accent2 } }, { text: "الألوان والخطوط والأزرار والمسافات", options: { rtlMode: true } }], titleSize: 22, titleH: 0.55, bodySize: 17 });
  }
  callout(s, M, 5.45, CW, 1.05, "تشبيه المطبخ: UX هو وين الثلاجة ووين الفرن، و UI هو لون الخزائن وشكل المقابض. مطبخ حلو بس الثلاجة بعيدة عن الفرن يعني UX سيئ", { size: 16 });
  s.addNotes("«UX هو تخطيط المطبخ، و UI هو لون الخزائن وشكل المقابض.» 3 دقائق.");

  const P = [
    ["FaSortAmountDown", "التسلسل البصري", "Visual Hierarchy", "الأهم أكبر وأوضح وأعلى. عنوان الـ Hero أكبر شي، والـ CTA بلون مختلف"],
    ["FaEye", "أنماط القراءة", "F و Z", "العين بتمسح الصفحة بشكل ثابت. بالعربي بتبدأ من اليمين، فالمهم فوق على اليمين"],
    ["FaExpandArrowsAlt", "المسافات البيضاء", "Whitespace", "الفراغ مش ضياع، هو اللي بيريّح العين وبيفصل المجموعات عن بعض"],
    ["FaClone", "الاتساق", "Consistency", "نفس الشي بيبين نفس الشكل: الأزرار بنفس اللون، والقائمة بنفس المكان بكل صفحة"],
    ["FaUserCheck", "المألوف", "Jakob's Law", "الناس بتتوقع موقعك يشتغل زي المواقع اللي بتعرفها: القائمة فوق، والشعار برجّع للرئيسية"],
    ["FaListUl", "خيارات أقل", "Hick's Law", "كل ما زادت الخيارات، بطؤ القرار. قائمة فيها 5 روابط أحسن من 15"],
    ["FaHandPointer", "أهداف سهلة", "Fitts's Law", "الزر المهم كبير وقريب، مش رابط صغير بالزاوية"],
    ["FaBullhorn", "زر واضح", "CTA", "كل صفحة إلها إجراء رئيسي واحد واضح، زي «شوف المشاريع» بموقع الدورة"],
  ];
  for (let part = 0; part < 2; part++) {
    s = newSlide("CONTENT", "الدورة 1 · مبادئ UX/UI", `8 مبادئ بتغطي أغلب اللي بتحتاجه (${part + 1} من 2)`, S1);
    const { xs, cw } = colsX(2, 0.4);
    for (let j = 0; j < 4; j++) {
      const p = P[part * 4 + j];
      await card(s, xs[j % 2], j < 2 ? 1.8 : 4.25, cw, 2.3, { icon: p[0], num: String(part * 4 + j + 1) + " · " + p[2], title: p[1], body: p[3], titleSize: 19, bodySize: 15 });
    }
    s.addNotes(part === 0 ? "دقيقة لكل مبدأ، واللي عنده خبرة اطلب منه هو يعطي المثال: الفكرة بجملة، ومثال من موقع الدورة أو من جوالهم." : "Jakob و Hick و Fitts قوانين معروفة، تفاصيلها بموقع Laws of UX. اربط الـ CTA بالإجراء الرئيسي اللي حددوه امبارح.");
  }

  s = newSlide("CONTENT", "الدورة 1 · التحليل · 6 دقائق", "نفس المجال، تصميمين مختلفين", S1);
  {
    const { xs, cw } = colsX(2, 0.4);
    await card(s, xs[0], 1.8, cw, 2.0, { icon: "FaApple", iconFill: C.accent2, title: "apple.com", body: "منتجات إلكترونية، بتصميم مرتب وواضح", titleSize: 22, bodySize: 16 });
    await card(s, xs[1], 1.8, cw, 2.0, { icon: "FaRandom", iconFill: C.text2, title: "arngren.net", body: "منتجات إلكترونية، كل شي محشور بصفحة وحدة", titleSize: 22, bodySize: 16 });
  }
  box(s, M, 4.05, CW, 2.45, C.background2);
  s.addText("جاوبوا عن كل موقع (3 دقائق للموقعين)", R({ x: M + 0.3, y: 4.2, w: CW - 0.6, h: 0.45, fontSize: 18, bold: true, color: C.text2 }));
  s.addText(bullets(["وين راحت عينك أول شي؟", "شو الإجراء الرئيسي اللي الموقع بده ياك تعمله؟", "كم ثانية احتجت لحتى لقيت القائمة؟", "أي مبدأ من الثمانية مطبّق أو مكسور؟"], { space: 4 }), R({ x: M + 0.3, y: 4.7, w: CW - 0.6, h: 1.7, fontSize: 16, color: "3E5266" }));
  s.addNotes("الفرق بتفتح الموقعين، 3 دقائق للاثنين، ودقيقتين نقاش سريع، وبتجاوب الأسئلة الأربعة. تأكد قبل الدورة إن الموقعين لسا بنفس الشكل، وخذ صور شاشة كخطة بديلة.");

  s = newSlide("CONTENT", "الدورة 1 · نقاش القاعة", "شو بيساعد الزائر، وشو بيضيّعه؟", S1);
  {
    const { xs, cw } = colsX(2, 0.4);
    await card(s, xs[0], 1.8, cw, 3.7, { icon: "FaThumbsUp", iconFill: C.accent2, title: "بيساعد الزائر", body: bullets(["نقطة بداية واضحة للعين", "مسافات بتفصل الأقسام", "قائمة قصيرة ومعروفة المكان", "زر واحد واضح لكل صفحة"]), titleSize: 22, bodySize: 16 });
    await card(s, xs[1], 1.8, cw, 3.7, { icon: "FaThumbsDown", iconFill: "C0392B", title: "بيضيّع الزائر", body: bullets(["كل شي بنفس الحجم والأهمية", "منتجات وأسعار وروابط محشورة", "ما في نقطة واضحة تبدأ منها العين", "روابط كثيرة بدون ترتيب"]), titleSize: 22, bodySize: 16 });
  }
  callout(s, M, 5.75, CW, 0.75, "سؤال لكل واحد: شو مبدأ واحد بدك تطبقه على موقع فريقك؟", { size: 16 });
  s.addNotes("اسمع من 3 أو 4 فرق واكتب على السبورة عمودين. هاي النتيجة المتوقعة، بس خلي الكلام يطلع منهم. انتقال: «عرفنا شو بيخلي التصميم جيد. هلأ بنبني هيكل صفحاتكم قبل الألوان.»");

  // ===== Cycle 2 =====
  const S2 = "الدورة 2: الـ Wireframes";
  pres.addSection({ title: S2 });
  divider("الدورة 2 · 25 دقيقة", "الـ Wireframes والمكونات", "مراحل التصميم · مكتبة المكونات · wireframe لكل صفحة", S2, "7 دقائق شرح و18 دقيقة تطبيق.");

  s = newSlide("CONTENT", "الدورة 2 · الـ Wireframes", "من الرسم الأولي للتصميم الملون", S2);
  await stepsFlow(s, [
    { icon: "FaPencilAlt", num: "امبارح", title: "Sketch", body: "رسم سريع على ورقة، فكرة عامة" },
    { icon: "FaBorderAll", num: "هلأ", title: "Wireframe", body: "الهيكل العظمي: وين كل شي بيروح، بدون ألوان", dark: true },
    { icon: "FaPalette", num: "بعد شوي", title: "Hi-fi Mockup", body: "التصميم الملون النهائي" },
  ], 1.9, 3.1, { bodySize: 16, titleSize: 20 });
  callout(s, M, 5.35, CW, 1.1, "ليش الـ Wireframe بدون ألوان؟ عشان نركز على الترتيب أول، ونغير بسهولة قبل ما نضيع وقت على الشكل", { size: 16 });
  s.addNotes("3 دقائق. اعرض wireframe رئيسية موقع الدورة كمثال.");

  s = newSlide("CONTENT", "الدورة 2 · المكونات", "أغلب المواقع مبنية من نفس القطع، زي الليغو", S2);
  {
    const Cp = [["FaBars", "Header / Navbar", "الشعار والقائمة، متكرر بكل الصفحات"], ["FaFlag", "Hero", "عنوان كبير + جملة + زر CTA"], ["FaIdCard", "Card", "صورة وعنوان ووصف، للمنتجات أو الخدمات"], ["FaHandPointer", "Button", "أساسي للـ CTA، وثانوي للباقي"], ["FaWpforms", "Form", "حقول وزر إرسال"], ["FaGripLines", "Footer", "التواصل والسوشال ميديا، متكرر بكل الصفحات"]];
    const { xs, cw } = colsX(3, 0.3);
    for (let i = 0; i < 6; i++) await card(s, xs[i % 3], i < 3 ? 1.8 : 4.05, cw, 2.05, { icon: Cp[i][0], iconFill: i % 2 ? C.accent2 : C.accent1, title: Cp[i][1], body: Cp[i][2], titleSize: 19, bodySize: 15 });
  }
  s.addText("والميزات التفاعلية اللي اخترتوها بتنرسم كمكونات كمان، زي Accordion و Tabs والفلترة", R({ x: M, y: 6.2, w: CW, h: 0.4, fontSize: 15, bold: true, color: C.accent1 }));
  s.addNotes("ارسم كل مكون بشكل بسيط على السبورة. 5 دقائق.");

  s = newSlide("CONTENT", "الدورة 2 · قواعد الرسم", "كيف ترسم Wireframe صح؟", S2);
  {
    const x0 = M, y0 = 1.8, w0 = 4.8;
    const parts = [["Header", 0.5], ["Hero", 1.2], ["Card · Card · Card", 0.95], ["Form", 0.75], ["Footer", 0.5]];
    let y = y0;
    for (const [t, h] of parts) {
      s.addShape(pres.shapes.RECTANGLE, { x: x0, y, w: w0, h, fill: { color: C.background1 }, line: { color: HEX.dk2, width: 1.5 }, objectName: "wire" });
      s.addText(t, { x: x0, y, w: w0, h, fontSize: 14, bold: true, color: HEX.dk2, align: "center", valign: "middle", margin: 0, isTextBox: true });
      y += h + 0.1;
    }
  }
  await iconRows(s, [["FaSquare", "مربعات وخطوط بس", "بدون ألوان، وبدون رسم فني"], ["FaTag", "كل مربع مكتوب اسمه", "Hero، Card، Form... عشان الكل يفهم"], ["FaTimes", "X مكان الصور", "وخطوط مكان النصوص"], ["FaCopy", "نفس الـ Header والـ Footer", "بكل الصفحات، متفقين عليهم كفريق"]], 6.0, 6.73, 1.8, 1.15);
  s.addNotes("دقيقتين. الرسمة على اليسار مثال على wireframe بسيط بأسماء المكونات.");

  s = newSlide("CONTENT", "الدورة 2 · التطبيق · 18 دقيقة", "ارسموا wireframe لكل صفحة", S2);
  await stepsFlow(s, [
    { icon: "FaFileAlt", num: "1", title: "ورقة لكل صفحة", body: "A4، وابدأوا من رسم الرئيسية تبع امبارح" },
    { icon: "FaHandshake", num: "2", title: "قسّموا الشغل", body: "اتفقوا على Header و Footer، والصفحات من خطة الفريق" },
    { icon: "FaStopwatch", num: "3", title: "3–4 دقائق للصفحة", body: "6 صفحات؟ ركزوا على الأقسام الرئيسية بس" },
    { icon: "FaMagic", num: "4", title: "الميزات التفاعلية", body: "ارسموها بمكانها واكتبوا اسمها" },
    { icon: "FaCamera", num: "5", title: "صوّروا", body: "كل ورقة بالجوال، لأنها رح تنرفع لـ Stitch", dark: true },
  ], 1.85, 3.4, { bodySize: 13 });
  callout(s, M, 5.6, CW, 0.85, "رح أمر وأسأل: وين الـ CTA بهاي الصفحة؟ والـ Header نفسه بكل الصفحات؟", { size: 16 });
  s.addNotes("مر على الفرق بالسؤالين. انتقال: «عندكم الهيكل. بعد الاستراحة بنعطيه ألوان وخطوط.»");

  // ===== Cycle 3 =====
  const S3 = "الدورة 3: الألوان والخطوط";
  pres.addSection({ title: S3 });
  divider("الدورة 3 · 25 دقيقة", "الألوان والخطوط", "قاعدة 60-30-10 · دلالات الألوان · الخطوط العربية · دليل التصميم", S3, "10 دقائق شرح و15 دقيقة تطبيق.");

  s = newSlide("CONTENT", "الدورة 3 · الألوان", "قاعدة 60-30-10", S3);
  {
    const bx = M, by = 1.9, bw = CW, bh = 1.3;
    const segs = [[0.6, "F1F4F8", "60% أساسي (غالباً خلفية فاتحة)", HEX.dk2], [0.3, HEX.dk2, "30% ثانوي", HEX.lt1], [0.1, HEX.accent1, "10%", HEX.dk2]];
    let x = bx + bw;
    for (const [f, hex, t, tc] of segs) {
      const w = bw * f;
      x -= w;
      s.addShape(pres.shapes.RECTANGLE, { x, y: by, w, h: bh, fill: { color: hex }, line: { color: "D5DCE4", width: 1 }, objectName: "ratio-seg" });
      s.addText(t, { x, y: by, w, h: bh, fontSize: 16, bold: true, color: tc, align: "center", valign: "middle", margin: 0, rtlMode: true, isTextBox: true });
    }
  }
  {
    const { xs, cw } = colsX(3, 0.3);
    await card(s, xs[0], 3.5, cw, 2.4, { title: "60% اللون الأساسي", body: "أغلب مساحة الصفحة، وغالباً خلفية فاتحة مريحة", titleSize: 18, bodySize: 15 });
    await card(s, xs[1], 3.5, cw, 2.4, { title: "30% اللون الثانوي", body: "الـ Header والأقسام والبطاقات", titleSize: 18, bodySize: 15 });
    await card(s, xs[2], 3.5, cw, 2.4, { title: "10% اللون المميز", body: "Accent: للأزرار والأشياء المهمة بس، عشان تلفت النظر", titleSize: 18, bodySize: 15, dark: true });
  }
  s.addText("وين الـ 10% بموقعكم؟ على الـ CTA", R({ x: M, y: 6.15, w: CW, h: 0.4, fontSize: 15, bold: true, color: C.accent1 }));
  s.addNotes("أشر على القاعدة بموقع الدورة. 3 دقائق.");

  s = newSlide("CONTENT", "الدورة 3 · الألوان", "دلالات الألوان: اختار حسب جمهورك", S3);
  {
    const Cl = [["2563EB", "الأزرق", "الثقة والهدوء", "عيادات، شركات"], ["2E8B57", "الأخضر", "الصحة والطبيعة", "منتجات طبيعية، مبادرات بيئية"], ["E07A2F", "البرتقالي والأحمر", "الطاقة والشهية", "مطاعم، مخابز، عروض"], ["1B2430", "الأسود", "الفخامة والأناقة", "متاجر راقية، تصوير"]];
    const { xs, cw } = colsX(4, 0.3);
    for (let i = 0; i < 4; i++) {
      box(s, xs[i], 1.8, cw, 3.6, C.background2);
      s.addShape(pres.shapes.OVAL, { x: xs[i] + cw / 2 - 0.6, y: 2.05, w: 1.2, h: 1.2, fill: { color: Cl[i][0] }, line: { color: Cl[i][0], width: 0 }, objectName: "color-dot" });
      s.addText(Cl[i][1], { x: xs[i], y: 3.4, w: cw, h: 0.45, fontSize: 19, bold: true, color: HEX.dk2, align: "center", margin: 0, rtlMode: true, isTextBox: true });
      s.addText(Cl[i][2], { x: xs[i] + 0.2, y: 3.9, w: cw - 0.4, h: 0.4, fontSize: 15, bold: true, color: HEX.accent2, align: "center", margin: 0, rtlMode: true, isTextBox: true });
      s.addText(Cl[i][3], { x: xs[i] + 0.2, y: 4.35, w: cw - 0.4, h: 0.8, fontSize: 14, color: "3E5266", align: "center", margin: 0, rtlMode: true, isTextBox: true, valign: "top" });
    }
  }
  callout(s, M, 5.7, CW, 0.8, "اللون بينختار حسب الجمهور والشعور اللي بدك يوصل، مش حسب اللون اللي بتحبه أنت", { size: 16 });
  s.addNotes("دلالات الألوان مش قوانين ثابتة، وبتختلف حسب الثقافة. 3 دقائق.");

  s = newSlide("CONTENT", "الدورة 3 · الخطوط", "الخطوط: خطين كحد أقصى", S3);
  {
    const F = [["Cairo", "عناوين قوية وواضحة"], ["Tajawal", "نصوص ناعمة ومقروءة"], ["IBM Plex Sans Arabic", "رسمي وتقني"], ["Almarai", "بسيط وحديث"]];
    box(s, 6.9, 1.8, 5.83, 4.7, C.background2);
    s.addText("خطوط عربية مجانية من Google Fonts", R({ x: 7.2, y: 1.95, w: 5.23, h: 0.45, fontSize: 18, bold: true, color: C.text2 }));
    for (let i = 0; i < 4; i++) {
      const y = 2.6 + i * 0.9;
      s.addText(F[i][0], { x: 7.2, y, w: 5.23, h: 0.42, fontSize: 18, bold: true, color: HEX.accent1, align: "right", margin: 0, isTextBox: true });
      s.addText(F[i][1], R({ x: 7.2, y: y + 0.42, w: 5.23, h: 0.4, fontSize: 14, color: "3E5266" }));
    }
    await iconRows(s, [["FaFont", "خطين بس", "واحد للعناوين وواحد للنص"], ["FaTextHeight", "مسافة أسطر أكبر للعربي", "line-height تقريباً 1.6 لـ 1.8"], ["FaRulerHorizontal", "أحجام ثابتة", "مثلاً 32 للعنوان، و24 للفرعي، و16 للنص"]], M, 5.9, 1.8, 1.5, { bs: 15 });
  }
  s.addNotes("افتح Google Fonts واعرض الخطوط الأربعة. 4 دقائق.");

  s = newSlide("CONTENT", "الدورة 3 · دليل التصميم", "شو فيه دليل التصميم (Style Guide)؟", S3);
  {
    const sw = [["13293D", "أساسي", HEX.lt1], ["2A9D8F", "ثانوي", HEX.lt1], ["E07A2F", "مميز", HEX.dk2], ["F7F5EF", "خلفية", HEX.dk2], ["1B2430", "نص", HEX.lt1]];
    s.addText("الألوان (HEX)", R({ x: M, y: 1.8, w: CW, h: 0.4, fontSize: 18, bold: true, color: C.text2 }));
    for (let i = 0; i < 5; i++) {
      const x = W - M - (i + 1) * 2.32 + 0.12;
      swatch(s, x, 2.3, 2.2, 1.0, sw[i][0], sw[i][1], sw[i][2]);
      s.addText("#" + sw[i][0], { x, y: 3.35, w: 2.2, h: 0.35, fontSize: 13, color: "3E5266", align: "center", margin: 0, isTextBox: true });
    }
    const { xs, cw } = colsX(2, 0.4);
    box(s, xs[0], 4.05, cw, 2.45, C.background2);
    s.addText("الخطوط والأحجام", R({ x: xs[0] + 0.3, y: 4.2, w: cw - 0.6, h: 0.4, fontSize: 18, bold: true, color: C.text2 }));
    s.addText(bullets(["العناوين: Cairo · 32 و 24", "النص: Tajawal · 16", "مسافة الأسطر: 1.7"], { space: 4 }), R({ x: xs[0] + 0.3, y: 4.7, w: cw - 0.6, h: 1.6, fontSize: 16, color: "3E5266" }));
    box(s, xs[1], 4.05, cw, 2.45, C.background2);
    s.addText("شكل الزر الأساسي", R({ x: xs[1] + 0.3, y: 4.2, w: cw - 0.6, h: 0.4, fontSize: 18, bold: true, color: C.text2 }));
    s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: xs[1] + cw / 2 - 1.3, y: 4.85, w: 2.6, h: 0.7, rectRadius: 0.12, fill: { color: "E07A2F" }, line: { color: "E07A2F", width: 0 }, objectName: "sample-button" });
    s.addText("شوف المشاريع", { x: xs[1] + cw / 2 - 1.3, y: 4.85, w: 2.6, h: 0.7, fontSize: 17, bold: true, color: HEX.dk2, align: "center", valign: "middle", margin: 0, rtlMode: true, isTextBox: true });
    s.addText("خلفية مميزة، نص غامق، زوايا مستديرة", R({ x: xs[1] + 0.3, y: 5.75, w: cw - 0.6, h: 0.5, fontSize: 14, color: "3E5266", align: "center" }));
  }
  s.addNotes("هاد مثال لدليل تصميم. استبدله بدليل تصميم موقع الدورة الحقيقي لما تبنيه. دقيقتين.");

  s = newSlide("CONTENT", "الدورة 3 · التطبيق 1 · 8 دقائق", "دليل التصميم بمساعدة الـ AI", S3);
  prompt(s, 4.9, 1.8, 7.83, 4.7, "أنا بصمم موقع [الفكرة] لـ [الجمهور].\nالشعور اللي بدي يوصل للزائر: [3 كلمات، مثلاً: دافئ، موثوق، بسيط].\nاقترح 3 لوحات ألوان، كل وحدة فيها: لون أساسي، ثانوي، مميز للأزرار، خلفية، لون نص، بصيغة HEX، مع سبب مناسبة كل لوحة للجمهور.\nتأكد إن تباين لون النص مع الخلفية على الأقل 4.5:1.\nواقترح خطين عربيين من Google Fonts: واحد للعناوين وواحد للنص.\nواقترح شكل الزر الأساسي: لونه ولون النص فيه ودرجة استدارة الزوايا.", 15);
  await iconRows(s, [["FaPaste", "الصقوا الـ prompt", "وعبّوا الفكرة والجمهور والشعور"], ["FaHandPointer", "اختاروا لوحة وحدة", "اللي بتناسب جمهوركم أكثر"], ["FaFileAlt", "اكتبوا دليل التصميم", "بملف أو على ورقة"]], M, 4.0, 1.8, 1.2, { bs: 14 });
  callout(s, M, 5.55, 4.0, 0.95, "الـ AI ممكن يغلط بالتباين، ورح نفحصه بأداة حقيقية", { size: 14 });
  s.addNotes("الفريق بيختار لوحة وحدة وبيكتب دليل التصميم. نبّههم إن فحص التباين جاي بالدورة 4.");

  s = newSlide("CONTENT", "الدورة 3 · التطبيق 2 · 7 دقائق", "طبّقوا ألوانكم على بطاقة التعريف", S3);
  prompt(s, 4.9, 1.8, 7.83, 2.6, "هاد كود بطاقة التعريف تبعي: [الصق الكود]\nبدي أغير ألوانها لهاي الألوان: [HEX]، والخط لـ [اسم الخط] من Google Fonts.\nقلي بالضبط شو أضيف وشو أغير، بدون ما تعيد كتابة الملف كله.", 16);
  callout(s, 4.9, 4.65, 7.83, 1.0, "النتيجة: البطاقة صارت بهوية مشروعكم، وشفتوا دليل التصميم شغال بكود حقيقي", { size: 15 });
  await iconRows(s, [["FaIdBadge", "افتحوا my-card", "من VS Code مع Live Server"], ["FaWifi", "الخط بده إنترنت", "إذا الشبكة ضعيفة بيظهر Tahoma بداله"]], M, 4.0, 1.8, 1.3, { bs: 14 });
  s.addText("تأكد إنهم فهموا: «وين الـ 10% بموقعكم؟»", R({ x: M, y: 6.0, w: CW, h: 0.45, fontSize: 15, bold: true, color: C.accent1 }));
  s.addNotes("الجواب على سؤال التأكد: اللون المميز اللي على الـ CTA. انتقال: «الألوان حلوة، بس هل كل الناس بتقدر تقرأها؟»");

  // ===== Cycle 4 =====
  const S4 = "الدورة 4: إمكانية الوصول";
  pres.addSection({ title: S4 });
  divider("الدورة 4 · 15 دقيقة", "إمكانية الوصول (Accessibility)", "موقع بيشتغل لكل الناس · 6 قواعد · فحص الألوان بـ WebAIM", S4, "7 دقائق شرح و8 دقائق تطبيق. اختصر القواعد على التباين وحجم الخط والعناوين.");

  s = newSlide("CONTENT", "الدورة 4 · إمكانية الوصول", "مين بيستفيد؟", S4);
  {
    const G = [["FaGlasses", "ضعاف النظر وكبار السن", "بيحتاجوا نص أكبر وتباين أوضح"], ["FaAdjust", "عمى الألوان", "ما بيقدروا يفرقوا بين بعض الألوان"], ["FaAssistiveListeningSystems", "المكفوفين", "بيستخدموا قارئ الشاشة (Screen Reader)"], ["FaSun", "وكلنا", "لما نفتح الجوال تحت الشمس"]];
    const { xs, cw } = colsX(4, 0.3);
    for (let i = 0; i < 4; i++) await card(s, xs[i], 1.85, cw, 3.2, { icon: G[i][0], iconFill: i === 3 ? C.text2 : C.accent2, title: G[i][1], body: G[i][2], titleSize: 18, bodySize: 15, titleH: 0.75 });
  }
  callout(s, M, 5.35, CW, 1.1, "التصميم اللي بيساعد أصحاب الاحتياجات الخاصة، بيساعد الكل", { size: 18 });
  s.addNotes("اسأل القاعة أول: «مين بيستفيد؟» وخليهم يوصلوا للفئات. 3 دقائق.");

  s = newSlide("CONTENT", "الدورة 4 · القواعد (1 من 2)", "التباين والخط واللون", S4);
  {
    const { xs, cw } = colsX(3, 0.3);
    await card(s, xs[0], 1.75, cw, 2.4, { icon: "FaAdjust", num: "1", title: "تباين كافي", bodySize: 13, body: "النص العادي 4.5:1 على الأقل، والنص الكبير 3:1 (معيار WCAG بمستوى AA)", titleSize: 18 });
    await card(s, xs[1], 1.75, cw, 2.4, { icon: "FaTextHeight", num: "2", title: "خط مقروء", bodySize: 13, body: "16 بكسل للنص كبداية شائعة، ومسافة أسطر مريحة", titleSize: 18 });
    await card(s, xs[2], 1.75, cw, 2.4, { icon: "FaExclamationTriangle", num: "3", title: "مش اللون لحاله", bodySize: 13, body: "حقل الخطأ مش بس أحمر، معه رسالة «الإيميل غلط»", titleSize: 18 });
    // contrast samples
    const ex = [["FFFFFF", "A3A3A3", "نص رمادي فاتح على أبيض", "2.5:1 · يفشل"], ["FFFFFF", "595959", "نص رمادي غامق على أبيض", "7:1 · ينجح"], ["F4A261", "FFFFFF", "زر برتقالي ونص أبيض", "2.1:1 · يفشل"], ["F4A261", "13293D", "زر برتقالي ونص كحلي", "7.2:1 · ينجح"]];
    const r4 = colsX(4, 0.25);
    for (let i = 0; i < 4; i++) {
      const x = r4.xs[i], w = r4.cw;
      s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x, y: 4.3, w, h: 1.2, rectRadius: 0.1, fill: { color: ex[i][0] }, line: { color: "D5DCE4", width: 1 }, objectName: "contrast-sample" });
      s.addText(ex[i][2], { x: x + 0.15, y: 4.3, w: w - 0.3, h: 1.2, fontSize: 15, bold: true, color: ex[i][1], align: "center", valign: "middle", margin: 0, rtlMode: true, isTextBox: true });
      s.addText(ex[i][3], { x, y: 5.6, w, h: 0.4, fontSize: 14, bold: true, color: i % 2 ? "1E7A4C" : "B42318", align: "center", margin: 0, rtlMode: true, isTextBox: true });
    }
  }
  s.addText("الأمثلة تحت محسوبة بنفس معادلة WCAG", R({ x: M, y: 6.15, w: CW, h: 0.4, fontSize: 13, color: "3E5266" }));
  s.addNotes("3.5 دقيقة للقواعد الثلاث. أمثلة التباين: النص الرمادي الفاتح بيفشل (2.5:1) والغامق بينجح (7:1). والزر البرتقالي بنص أبيض بيفشل (2.1:1) بس بنص كحلي بينجح (7.2:1).");

  s = newSlide("CONTENT", "الدورة 4 · القواعد (2 من 2)", "الصور والحقول والأزرار", S4);
  {
    const { xs, cw } = colsX(3, 0.3);
    await card(s, xs[0], 1.8, cw, 3.4, { icon: "FaImage", num: "4", title: "نص بديل للصور (alt)", body: "وصف قصير بيقرأه قارئ الشاشة: «كيكة شوكولاتة بالفراولة» بدل «image1»", titleSize: 18, bodySize: 15 });
    await card(s, xs[1], 1.8, cw, 3.4, { icon: "FaTag", num: "5", title: "عنوان لكل حقل (label)", body: "اسم ظاهر فوق الحقل، مش بس كلمة باهتة جوا الحقل بتختفي لما تكتب", titleSize: 18, bodySize: 15 });
    await card(s, xs[2], 1.8, cw, 3.4, { icon: "FaKeyboard", num: "6", title: "أزرار وروابط واضحة", body: "«احجز موعد» بدل «اضغط هنا»، والموقع بيشتغل بالكيبورد (Tab)", titleSize: 18, bodySize: 15 });
  }
  callout(s, M, 5.5, CW, 0.95, "عرض حي: WebAIM Contrast Checker. لون رمادي فاتح بيفشل، بنغمّقه لحد ما ينجح، ونشرح Pass و Fail ومستوى AA", { size: 15, bold: false });
  s.addNotes("3.5 دقيقة للقواعد، ودقيقتين للعرض الحي على WebAIM.");

  s = newSlide("CONTENT", "الدورة 4 · التطبيق · 8 دقائق", "افحصوا ألوانكم", S4);
  await stepsFlow(s, [
    { icon: "FaSearch", num: "4 دقائق", title: "افحصوا 3 أزواج", body: "النص مع الخلفية، ونص الزر مع الزر، والروابط مع الخلفية" },
    { icon: "FaWrench", num: "3 دقائق", title: "صلّحوا اللي فشل", body: "غمّقوا أو فتّحوا اللون، أو اسألوا الـ AI عن لون قريب بينجح" },
    { icon: "FaClipboardList", num: "دقيقة", title: "أضيفوا ملاحظتين", body: "«كل صورة إلها وصف» و«كل حقل إله عنوان» لدليل التصميم", dark: true },
  ], 1.85, 3.0, { bodySize: 15, titleSize: 19 });
  prompt(s, M, 5.1, CW, 1.4, "هاد اللون [HEX] فشل بالتباين مع [HEX]. اقترح لون قريب منه بينجح بنسبة 4.5:1 على الأقل.", 16);
  s.addNotes("ملاحظات الوصول رح تروح لـ prompt الـ Stitch بالدورة 6. سؤال التأكد: «ليش حقل الخطأ الأحمر لحاله مش كافي؟» انتقال: «كثير من زوار مواقعكم رح يفتحوها من الجوال.»");

  // ===== Cycle 5 =====
  const S5 = "الدورة 5: التصميم للجوال";
  pres.addSection({ title: S5 });
  divider("الدورة 5 · 10 دقائق", "التصميم للجوال", "Mobile-first · شو بيتغير على الشاشة الصغيرة · wireframe الجوال", S5, "5 دقائق شرح و5 دقائق تطبيق.");

  s = newSlide("CONTENT", "الدورة 5 · الجوال", "Mobile-first: صمم للجوال أول", S5);
  {
    // desktop wireframe
    const dx = 6.9, dy = 1.9, dw = 5.83;
    s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: dx, y: dy, w: dw, h: 3.6, rectRadius: 0.08, fill: { color: C.background2 }, line: { color: HEX.dk2, width: 1.5 }, objectName: "desktop" });
    s.addShape(pres.shapes.RECTANGLE, { x: dx + 0.2, y: dy + 0.2, w: dw - 0.4, h: 0.4, fill: { color: C.background1 }, line: { color: HEX.dk2, width: 1 }, objectName: "d-header" });
    s.addText("الشعار   ·   الرئيسية   ·   البرنامج   ·   المشاريع   ·   تواصل", { x: dx + 0.2, y: dy + 0.2, w: dw - 0.4, h: 0.4, fontSize: 11, color: HEX.dk2, align: "center", valign: "middle", margin: 0, rtlMode: true, isTextBox: true });
    s.addShape(pres.shapes.RECTANGLE, { x: dx + 0.2, y: dy + 0.75, w: dw - 0.4, h: 1.1, fill: { color: C.background1 }, line: { color: HEX.dk2, width: 1 }, objectName: "d-hero" });
    s.addText("Hero", { x: dx + 0.2, y: dy + 0.75, w: dw - 0.4, h: 1.1, fontSize: 14, bold: true, color: HEX.dk2, align: "center", valign: "middle", margin: 0, isTextBox: true });
    for (let i = 0; i < 3; i++) {
      const cw = (dw - 0.4 - 0.4) / 3;
      s.addShape(pres.shapes.RECTANGLE, { x: dx + 0.2 + i * (cw + 0.2), y: dy + 2.0, w: cw, h: 1.3, fill: { color: C.background1 }, line: { color: HEX.dk2, width: 1 }, objectName: "d-card" });
      s.addText("Card", { x: dx + 0.2 + i * (cw + 0.2), y: dy + 2.0, w: cw, h: 1.3, fontSize: 13, color: HEX.dk2, align: "center", valign: "middle", margin: 0, isTextBox: true });
    }
    s.addText("الحاسوب: 3 بطاقات جنب بعض", R({ x: dx, y: 5.6, w: dw, h: 0.4, fontSize: 14, bold: true, color: C.text2, align: "center" }));
    // phone
    const px = 2.6, py = 1.75, pw = 2.3;
    s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: px, y: py, w: pw, h: 4.1, rectRadius: 0.2, fill: { color: C.background2 }, line: { color: HEX.dk2, width: 2 }, objectName: "phone" });
    s.addShape(pres.shapes.RECTANGLE, { x: px + 0.15, y: py + 0.2, w: pw - 0.3, h: 0.35, fill: { color: C.background1 }, line: { color: HEX.dk2, width: 1 }, objectName: "m-header" });
    s.addText("☰        الشعار", { x: px + 0.15, y: py + 0.2, w: pw - 0.3, h: 0.35, fontSize: 11, color: HEX.dk2, align: "center", valign: "middle", margin: 0, rtlMode: true, isTextBox: true });
    const blocks = [["Hero", 0.85], ["Card", 0.65], ["Card", 0.65], ["Card", 0.65]];
    let yy = py + 0.65;
    for (const [t, h] of blocks) {
      s.addShape(pres.shapes.RECTANGLE, { x: px + 0.15, y: yy, w: pw - 0.3, h, fill: { color: C.background1 }, line: { color: HEX.dk2, width: 1 }, objectName: "m-block" });
      s.addText(t, { x: px + 0.15, y: yy, w: pw - 0.3, h, fontSize: 12, color: HEX.dk2, align: "center", valign: "middle", margin: 0, isTextBox: true });
      yy += h + 0.1;
    }
    s.addText("الجوال: تحت بعض + Hamburger", R({ x: 1.6, y: 5.95, w: 4.3, h: 0.4, fontSize: 14, bold: true, color: C.text2, align: "center" }));
  }
  s.addText("الشاشة الصغيرة بتجبرك تختار المهم بس", R({ x: M, y: 6.4, w: CW, h: 0.4, fontSize: 15, bold: true, color: C.accent1 }));
  s.addNotes("«نصمم للجوال أول، بعدين نكبّر للحاسوب.» دقيقتين.");

  s = newSlide("CONTENT", "الدورة 5 · الجوال", "شو بيتغير على الجوال؟", S5);
  {
    const Ch = [["FaGripLinesVertical", "عمود واحد", "البطاقات اللي جنب بعض بتصير تحت بعض"], ["FaBars", "قائمة Hamburger", "الروابط بتختفي ورا أيقونة الثلاث خطوط"], ["FaHandPointer", "أزرار بحجم الإصبع", "تقريباً 44 بكسل كقاعدة شائعة، ومسافة بينهم"], ["FaSearchPlus", "نص مقروء بدون تكبير", "ما حدا بده يعمل zoom عشان يقرأ"], ["FaExchangeAlt", "RTL", "القائمة والأسهم بتنعكس، بس الأرقام والشعارات الإنجليزية لا"]];
    const { xs, cw } = colsX(5, 0.25);
    for (let i = 0; i < 5; i++) await card(s, xs[i], 1.85, cw, 3.4, { icon: Ch[i][0], iconFill: i === 4 ? C.text2 : C.accent1, title: Ch[i][1], body: Ch[i][2], titleSize: 16, bodySize: 13, titleH: 0.75 });
  }
  callout(s, M, 5.55, CW, 0.9, "عرض حي: موقع الدورة بـ Chrome ← F12 ← أيقونة الجوال (Device Toolbar)، وشوفوا كيف بتتغير الصفحة", { size: 15, bold: false });
  s.addNotes("4 دقائق للتغييرات، ودقيقتين للعرض الحي.");

  s = newSlide("CONTENT", "الدورة 5 · التطبيق · 5 دقائق", "ارسموا wireframe الجوال للرئيسية", S5);
  await iconRows(s, [["FaMobileAlt", "ورقة طولية", "نص A4 مطوية بالطول"], ["FaBars", "Header فيه الشعار وأيقونة Hamburger", "بدل القائمة الكاملة"], ["FaLayerGroup", "الأقسام تحت بعض", "بنفس ترتيب نسخة الحاسوب"], ["FaBullhorn", "الـ CTA باين من أول شاشة", "بدون ما الزائر يعمل scroll"], ["FaCamera", "صوّروها", "رح تنرفع لـ Stitch"]], M, CW, 1.85, 0.95, { bs: 14 });
  s.addNotes("سؤال التأكد: «شو بيصير لـ 3 بطاقات جنب بعض لما نفتح الموقع من الجوال؟» الجواب: بتصير تحت بعض. انتقال: «عندكم كل المكونات. هلأ بنحولهم لتصميم حقيقي.»");

  // ===== Cycle 6 =====
  const S6 = "الدورة 6: Google Stitch";
  pres.addSection({ title: S6 });
  divider("الدورة 6 · 50 دقيقة", "التصميم بـ Google Stitch", "من الـ wireframe ودليل التصميم لتصميم ملون لكل الصفحات", S6, "10 دقائق عرض حي و40 دقيقة تطبيق. ابدأ الاعتماد من الدقيقة 25.");

  s = newSlide("CONTENT", "الدورة 6 · Google Stitch", "الفكرة: ChatGPT بيكتب، و Stitch بيصمم", S6);
  await stepsFlow(s, [
    { icon: "FaFileAlt", title: "معلوماتكم بالعربي", body: "الوثيقة والـ wireframes ودليل التصميم" },
    { icon: "FaRobot", title: "ChatGPT", body: "بيحولها لـ prompt إنجليزي جاهز" },
    { icon: "FaMagic", title: "Google Stitch", body: "بيولّد الصفحات، ومعه صور الـ wireframes" },
    { icon: "FaDesktop", title: "تصميم ملون", body: "كل الصفحات + نسخة الجوال", dark: true },
  ], 1.9, 3.1, { bodySize: 15, titleSize: 19 });
  callout(s, M, 5.3, CW, 1.15, "Stitch بيشتغل أحسن بالـ prompts الإنجليزية، فـ ChatGPT بيترجم ويرتب. بهيك اللغة مش عائق، والورقة اللي رسمتوها ما راحت عبث", { size: 16 });
  s.addNotes("اشرح الفكرة قبل العرض الحي. Stitch بيقبل صور الرسومات كمرجع.");

  s = newSlide("CONTENT", "الدورة 6 · عرض حي · 10 دقائق", "خلونا نصمم موقع الدورة سوا", S6);
  await stepsFlow(s, [
    { icon: "FaRobot", num: "3 دقائق", title: "الـ prompt", body: "الصق الـ prompt العربي بـ ChatGPT، وشوفوا الإنجليزي اللي طلع" },
    { icon: "FaMagic", num: "3 دقائق", title: "التوليد", body: "مشروع جديد ← Web ← الصق الـ prompt ← ارفع صورة الـ wireframe" },
    { icon: "FaSlidersH", num: "3 دقائق", title: "التحسين", body: "تعديلين محددين قدامكم" },
    { icon: "FaSave", num: "1 دقيقة", title: "الحفظ", body: "صور الشاشات أو التصدير، والمشروع محفوظ بحسابكم", dark: true },
  ], 1.9, 3.5, { bodySize: 14 });
  s.addNotes("جهّز تصميم Stitch جاهز لموقع الدورة قبل الدورة، عشان العرض الحي ما يعتمد على الحظ.");

  s = newSlide("CONTENT", "الدورة 6 · التطبيق · 40 دقيقة", "صمموا كل صفحات موقعكم", S6);
  table(s, ["الخطوة", "الوقت", "المطلوب"], [
    ["تجهيز الـ prompt", "10 دقائق", "عبّوا الـ prompt العربي بمعلوماتكم، وخذوا الإنجليزي من ChatGPT"],
    ["التوليد", "15 دقيقة", "Stitch بيولّد الصفحات. 6 صفحات؟ قسّموها على طلبين"],
    ["التحسين", "15 دقيقة", "تعديلات محددة، وفحص الاتساق بين الصفحات، ونسخة الجوال للرئيسية"],
  ], { y: 1.85, colW: [3.0, 1.8, 7.333], rowH: 0.75, fs: 16 });
  callout(s, M, 5.0, CW, 1.4, "Stitch إله حد يومي للاستخدام: ما تعيدوا توليد المشروع كله من أول وجديد، عدّلوا الموجود. وكل فريق بيشتغل من حساب عضو واحد، والثاني احتياط", { size: 15 });
  s.addNotes("من الدقيقة 25 ابدأ تمر وتعتمد الرئيسية لكل فريق، أو تعطي ملاحظة وحدة. هيك ما بتتراكم الاعتمادات.");

  s = newSlide("CONTENT", "الدورة 6 · الـ Prompt لـ ChatGPT", "الصقوا هاد بـ ChatGPT وعبّوه", S6);
  prompt(s, M, 1.75, CW, 4.85, "أنا بدي أصمم موقع باستخدام Google Stitch.\nاكتبلي prompt بالإنجليزي لـ Stitch بناءً على هاي المعلومات:\n- الفكرة والجمهور والإجراء الرئيسي: [من وثيقة المتطلبات]\n- الصفحات وأقسام كل صفحة بالترتيب: [من الـ wireframes]\n- الميزات التفاعلية ومكانها: [الميزتين أو أكثر]\n- دليل التصميم: الألوان [HEX]، الخطوط [أسماء الخطوط]، شكل الزر [الوصف]\n- قواعد الوصول: تباين ناجح، كل حقل إله عنوان ظاهر، نص الأزرار واضح\nالموقع لازم يكون كل نصوصه بالعربي، واتجاهه من اليمين لليسار (RTL)، ومتوافق مع الجوال، وكل الصفحات بنفس الـ Header والـ Footer.\nاطلب تصميم كل صفحة كشاشة Desktop منفصلة.\nخلي الـ prompt واضح ومرتب بنقاط.", 16);
  s.addNotes("ابعت الـ prompt بمجموعة WhatsApp عشان ينسخوه بسهولة.");

  s = newSlide("CONTENT", "الدورة 6 · التحسين", "طلبات التحسين داخل Stitch", S6);
  code(s, M, 1.8, 6.3, 3.4, "Make the CTA button bigger\n  and use the accent color.\n\nUse the same header and footer\n  on all pages.\n\nAll text must be in Arabic,\n  right-to-left.\n\nShow the mobile version of the\n  home page with a hamburger menu.", "أمثلة جاهزة");
  await iconRows(s, [["FaDotCircle", "تعديل واحد بكل طلب", "زي ما تعلمنا امبارح"], ["FaPencilRuler", "الـ wireframe ودليل التصميم قدامكم", "إذا Stitch غيّر ألوانكم أو أضاف أقسام مش مطلوبة، رجّعوه"], ["FaLanguage", "نص إنجليزي أو اتجاه غلط؟", "اطلبوا التصحيح بطلب واحد واضح"]], 7.2, 5.53, 1.8, 1.3, { bs: 14 });
  s.addNotes("انتقال: «قبل ما نعتمد أي تصميم، بدنا عيون جديدة تشوفه.»");

  // ===== Cycle 7 =====
  const S7 = "الدورة 7: المراجعة والاعتماد";
  pres.addSection({ title: S7 });
  divider("الدورة 7 · 20 دقيقة", "المراجعة والاعتماد", "مراجعة متبادلة · إصلاح · اعتماد المدرب", S7, "كل تصميم بيمر بمراجعة من فريق ثاني وباعتماد المدرب.");

  s = newSlide("CONTENT", "الدورة 7 · المراجعة", "عيون جديدة على تصميمكم", S7);
  await stepsFlow(s, [
    { icon: "FaExchangeAlt", num: "8 دقائق", title: "تبادلوا", body: "كل فريقين بيراجعوا تصميم بعض بالـ checklist، وبيكتبوا شي ممتاز وشي بده تحسين" },
    { icon: "FaTools", num: "6 دقائق", title: "صلّحوا", body: "أهم ملاحظة وحدة بـ Stitch" },
    { icon: "FaCheckCircle", num: "6 دقائق", title: "اعتماد المدرب", body: "للفرق اللي ما اعتمدت رئيسيتها بالدورة 6", dark: true },
  ], 1.9, 3.2, { bodySize: 15, titleSize: 19 });
  callout(s, M, 5.4, CW, 1.05, "الاعتماد السريع بـ 3 أسئلة: الـ CTA واضح؟ الألوان من دليل التصميم؟ الصفحات متسقة؟", { size: 17 });
  s.addNotes("اطبع الـ checklist واعطي نسخة لكل فريق.");

  s = newSlide("CONTENT", "الدورة 7 · Checklist المراجعة", "10 أسئلة لمراجعة أي تصميم", S7);
  {
    const items = ["الـ CTA واضح بكل صفحة", "العنوان هو أوضح شي بالصفحة", "الألوان من دليل التصميم، وخطين كحد أقصى", "النص مقروء والتباين مريح", "نفس الـ Header والـ Footer بكل الصفحات", "الميزتين التفاعليتين باينين بالتصميم", "النصوص بالعربي والاتجاه من اليمين", "نسخة الجوال: عمود واحد و Hamburger", "مطابق لوثيقة المتطلبات", "ما في تسجيل دخول أو دفع ظاهر كأنه شغال"];
    const { xs, cw } = colsX(2, 0.4);
    for (let i = 0; i < 10; i++) {
      const col = i < 5 ? 0 : 1, row = i % 5;
      const y = 1.8 + row * 0.95;
      box(s, xs[col], y, cw, 0.8, C.background2);
      s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: xs[col] + cw - 0.65, y: y + 0.18, w: 0.44, h: 0.44, rectRadius: 0.06, fill: { color: C.background1 }, line: { color: HEX.dk2, width: 1.5 }, objectName: "checkbox" });
      s.addText(`${i + 1}. ${items[i]}`, R({ x: xs[col] + 0.25, y, w: cw - 1.1, h: 0.8, fontSize: 15, bold: true, color: C.text2, valign: "middle" }));
    }
  }
  s.addNotes("هاي نفس الـ checklist المطبوعة.");

  // ===== Closing =====
  const S8 = "الختام";
  pres.addSection({ title: S8 });
  s = newSlide("CONTENT", "الختام · 10 دقائق", "التسليم على موقع الدورة", S8);
  {
    const D = [["FaClipboardCheck", "خطة الفريق", "نص منسوخ بزر النسخ تبع الـ AI"], ["FaPencilRuler", "الـ wireframes", "صور من الجوال"], ["FaDesktop", "تصميم Stitch", "صور الشاشات"], ["FaRocket", "شغل إضافي", "اختياري، لكل واحد"]];
    const { xs, cw } = colsX(4, 0.3);
    for (let i = 0; i < 4; i++) await card(s, xs[i], 1.85, cw, 2.6, { icon: D[i][0], num: String(i + 1), title: D[i][1], body: D[i][2], titleSize: 17, bodySize: 14 });
  }
  callout(s, M, 4.75, CW, 0.9, "سؤال الفهم اليوم (اختار واحد): «اشرح بكلماتك قاعدة 60-30-10» أو «ليش التباين مهم؟»", { size: 16, bold: false });
  callout(s, M, 5.8, CW, 0.75, "مشروع Stitch بيضل محفوظ بحسابكم، ومجلد my-card بيضل على الجهاز", { size: 15, fill: C.background2, bold: false });
  s.addNotes("6 دقائق للتسليم. شغل الفريق مرة وحدة من أي عضو، وكل واحد بيجاوب سؤال الفهم بكلماته. الملفات مش إجبارية، فما حدا يرفع صور عشوائية. واللي فاته تسليم امبارح بيقدر يسلّم من تبويب «اليوم 1».");

  s = newSlide("DIVIDER", "ملخص اليوم", "شو تعلمنا اليوم؟", S8);
  {
    const pts = ["UX كيف بيشتغل، و UI كيف بيبين", "Wireframe قبل الألوان", "60-30-10 والتباين 4.5:1", "صمّم للجوال أول"];
    const { xs, cw } = colsX(4, 0.25);
    for (let i = 0; i < 4; i++) {
      s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: xs[i], y: 4.25, w: cw, h: 1.1, rectRadius: 0.12, fill: { color: "2C4A66" }, line: { color: "2C4A66", width: 0 }, objectName: "summary-card" });
      s.addText(pts[i], { x: xs[i] + 0.2, y: 4.25, w: cw - 0.4, h: 1.1, fontSize: 15, bold: true, color: HEX.lt1, align: "center", valign: "middle", margin: 0, rtlMode: true, isTextBox: true });
    }
    s.addText("بكرا: بنحوّل هالتصميم لموقع حقيقي بيشتغل على جهازكم · جيب اللابتوب مشحون", R({ x: M, y: 5.7, w: CW, h: 0.8, fontSize: 16, color: "C9D6E0" }));
  }
  s.addNotes("«بكرا بنحول هالتصميم لموقع حقيقي بيشتغل على جهازكم.» دقيقتين.");

  await pres.writeFile({ fileName: "day2-ar.pptx" });
  await applyTheme("day2-ar.pptx", THEME);
  console.log("done");
}
build().catch((e) => { console.error(e); process.exit(1); });
