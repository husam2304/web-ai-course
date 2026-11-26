
// one slide: code (left), reading + a box (right)
async function stepSlide(sec, kicker, title, codes, reading, boxLabel, boxText, tip, notes) {
  const s = newSlide("CONTENT", `JavaScript · ${kicker}`, title, sec);
  const cw = 7.0;
  let y = 1.75;
  for (const [label, text, h, fs] of codes) {
    codeBox(s, M, y, cw, h, text, label, fs || 13);
    y += h + 0.15;
  }
  const x = M + cw + 0.35, w = W - M - x;
  box(s, x, 1.75, w, 2.75, C.background2);
  s.addText("بتنقرأ", R({ x: x + 0.25, y: 1.85, w: w - 0.5, h: 0.4, fontSize: 16, bold: true, color: C.accent1 }));
  s.addText(reading, R({ x: x + 0.25, y: 2.3, w: w - 0.5, h: 2.1, fontSize: 14, color: C.text2 }));
  box(s, x, 4.65, w, 0.95, C.text2);
  s.addText(boxLabel, R({ x: x + 0.25, y: 4.7, w: w - 0.5, h: 0.35, fontSize: 13, bold: true, color: HEX.accent6 }));
  s.addText(boxText, R({ x: x + 0.25, y: 5.05, w: w - 0.5, h: 0.45, fontSize: 15, bold: true, color: C.background1 }));
  if (tip) callout(s, x, 5.75, w, 0.8, tip, { size: 13, bold: false });
  if (notes) s.addNotes(notes);
  return s;
}

async function build() {
  // ===== Opening =====
  const S0 = "الافتتاح";
  pres.addSection({ title: S0 });
  let s = pres.addSlide({ masterName: "DIVIDER", sectionTitle: S0 });
  s.addText("دورة تطوير المواقع الإلكترونية بمساعدة الذكاء الاصطناعي", { placeholder: "kicker", rtlMode: true, align: "right" });
  s.addText("اليوم الخامس: نخلّص، وننشر، ونعرض", { placeholder: "title", rtlMode: true, align: "right" });
  s.addText("آخر يوم: موقع كل فريق شغال 100%، ومنشور على الإنترنت، وبيتعرض", R({ x: M, y: 4.2, w: CW, h: 0.5, fontSize: 22, color: "C9D6E0" }));
  s.addText("المدرب: حسام عليان", R({ x: M, y: 4.8, w: CW, h: 0.45, fontSize: 18, color: C.background1, bold: true }));
  for (let i = 0; i < 5; i++) {
    const x = W - M - 0.55 - i * 0.75;
    const fill = i === 4 ? C.accent1 : "4A6B88";
    s.addShape(pres.shapes.OVAL, { x, y: 1.3, w: 0.55, h: 0.55, fill: { color: fill }, line: { color: fill, width: 0 }, objectName: "day-dot" });
    s.addText(String(i + 1), { x, y: 1.3, w: 0.55, h: 0.55, fontSize: 16, bold: true, color: HEX.lt1, align: "center", valign: "middle", margin: 0, isTextBox: true });
  }
  s.addNotes("5 دقائق للافتتاح كله: مبارح كل الفرق صار عندها مجلد واحد وصفحات مربوطة وما في أخطاء JS. اليوم بنفهم الـ JS اللي عندنا، وبنخلّص، وبننشر.");

  s = newSlide("CONTENT", "أجندة اليوم", "240 دقيقة", S0);
  table(s, ["الوقت", "الجزء", "شو بيصير"], [
    ["0:00", "الافتتاح", "وين وصلنا، وشو اليوم"],
    ["0:05", "JavaScript", "الأساس (15) وبعدين الميزات (25)"],
    ["0:45", "تطبيق", "مهام فريقكم بصفحة «اليوم 5» (الضروري أول)"],
    ["2:00", "استراحة", "15 دقيقة"],
    ["2:15", "النشر", "Netlify: حساب، وسحب المجلد، واسم"],
    ["2:45", "جوال وتصليح", "الرابط على جوالاتكم، وتصليح اللي بيطلع"],
    ["3:10", "تحضير العرض", "مين بيحكي شو"],
    ["3:25", "عروض الفرق", "5 دقايق لكل فريق"],
    ["3:55", "الختام", "رحلة الخمس أيام"],
  ], { y: 1.8, colW: [1.5, 3.0, 7.633], rowH: 0.5, fs: 15 });

  // ===== JS =====
  const S1 = "JavaScript";
  pres.addSection({ title: S1 });
  divider("0:05 · شرح 40 دقيقة", "JavaScript: الأساس أول، وبعدين الميزات", "الأساس: 7 أفكار بالـ Console (15 دقيقة) · الميزات: منيو مقهى بيكبر (25 دقيقة)", S1, "الأمثلة بمجلد demo/day5-js: 01-asas للأساس، وبعدين مجلد لكل ميزة (كل مجلد = اللي قبله + ميزة). افتح كل واحد بـ Live Server، و F12 ← Console مفتوح.");

  s = newSlide("CONTENT", "JavaScript · الخريطة", "الأساس أول، وبعدين كيف كل ميزة بتشتغل", S1);
  {
    const { xs, cw } = colsX(2, 0.4);
    box(s, xs[0], 1.75, cw, 4.7, C.background2);
    s.addText("الأساس (15 دقيقة) · مجلد 01-asas", R({ x: xs[0] + 0.3, y: 1.9, w: cw - 0.6, h: 0.45, fontSize: 18, bold: true, color: C.accent1 }));
    numList(s, ["المتغيرات وأنواع القيم", "الشرط: if / else", "المصفوفة", "الـ loop: forEach", "الـ object", "الـ function", "JS والصفحة: امسك ← استنى ← غيّر"], xs[0] + 0.3, 2.45, cw - 0.6, 3.9, 16);
    box(s, xs[1], 1.75, cw, 4.7, C.text2);
    s.addText("الميزات (25 دقيقة) · منيو مقهى بيكبر", R({ x: xs[1] + 0.3, y: 1.9, w: cw - 0.6, h: 0.45, fontSize: 18, bold: true, color: C.accent6 }));
    s.addText([
      { text: "1. البيانات والرسم (02-data-render)", options: { breakLine: true, paraSpaceAfter: 8, rtlMode: true } },
      { text: "2. الفلترة (03-filter)", options: { breakLine: true, paraSpaceAfter: 8, rtlMode: true } },
      { text: "3. صفحة التفاصيل (04-details)", options: { breakLine: true, paraSpaceAfter: 8, rtlMode: true } },
      { text: "4. الحفظ واللون (05-save)", options: { breakLine: true, paraSpaceAfter: 8, rtlMode: true } },
      { text: "5. الحركة (06-animation)", options: { rtlMode: true } },
    ], R({ x: xs[1] + 0.3, y: 2.45, w: cw - 0.6, h: 3.9, fontSize: 16, color: C.background1 }));
  }
  s.addNotes("دقيقة. «الأساس هو الحروف، والميزات هي الجمل. أي كود بيكتبه الـ AI مركّب من هالسبع أفكار».");

  // ---- Basics ----
  await stepSlide(S1, "الأساس · 1 من 7", "المتغيرات: علبة عليها اسم", [
    ["js/basics.js", 'let name = "سارة";     // نص\nconst price = 2.5;     // رقم\nlet isOpen = true;     // صح أو غلط\n\nconsole.log(name, price, isOpen);', 2.6, 15],
    ["Console", "سارة 2.5 true", 0.95, 15],
  ], "«حط سارة بعلبة اسمها name، وحط 2.5 بعلبة اسمها price، واطبعهم بالـ Console».\nconst للي ما بيتغير، و let للي بيتغير. النص بين علامتين \"\"، والرقم بدونهم.", "جرّب بالـ Console", "اكتب name = \"علي\" وبعدين name", "غيّر price = 3: «شو رح يصير؟» (خطأ: const ما بيتغير)",
    "2 دقيقة. افتح 01-asas بـ Live Server، و F12 ← Console. console.log هو «اطبع لأشوف»: أهم أداة لفهم أي كود.");

  await stepSlide(S1, "الأساس · 2 من 7", "الشرط: if / else", [
    ["js/basics.js", 'if (price > 2) {\n  console.log("غالي شوي");\n} else {\n  console.log("سعره منيح");\n}', 2.4, 15],
    ["مقارنات", ">   <   >=   <=   ===   !==", 0.95, 16],
  ], "«إذا السعر أكبر من 2، اطبع غالي شوي. وإلا، اطبع سعره منيح».\nإشارة المرور: إذا هيك اعمل هيك، وإلا اعمل غيره. === يعني بيساوي بالضبط.", "بموقعكم", "الفلترة، والتنبيه اللوني، وصفحة «مش موجود»", "غيّر price لـ 1.5: «شو رح يطبع؟»",
    "2 دقيقة.");

  await stepSlide(S1, "الأساس · 3 من 7", "المصفوفة: قائمة بالترتيب", [
    ["js/basics.js", 'const drinks = ["لاتيه", "موكا", "شاي"];\n\nconsole.log(drinks[0]);       // لاتيه\nconsole.log(drinks.length);   // 3', 2.4, 15],
  ], "«drinks قائمة فيها 3 مشروبات. أول واحد رقمه 0، وطولها 3».\nالعد بيبلش من 0: [0] الأول، و [1] الثاني.", "بموقعكم", "كل البيانات: المنيو، والأدوات، والكتب، والمبدعين", "«شو بيطبع drinks[2]؟»",
    "2 دقيقة.");

  await stepSlide(S1, "الأساس · 4 من 7", "الـ loop: لكل عنصر اعمل هالشي", [
    ["js/basics.js", 'drinks.forEach(d => {\n  console.log("عنا " + d);\n});', 1.9, 16],
    ["Console", "عنا لاتيه\nعنا موكا\nعنا شاي", 1.6, 15],
  ], "«لكل مشروب بالقائمة (سمّيه d)، اطبع عنا وبعدها اسمه».\nالموظف اللي بيمرق عالطابور واحد واحد. بدل ما نكتب 3 أسطر، سطر واحد بيتكرر.", "بموقعكم", "رسم البطاقات من data.js", "ضيف «عصير» للقائمة: الـ loop بيطبعه لحاله",
    "2 دقيقة. بتلاقوا كمان for (let i = 0; i < drinks.length; i++): نفس الفكرة، كتابة أقدم.");

  await stepSlide(S1, "الأساس · 5 من 7", "الـ object: بطاقة معلومات", [
    ["js/basics.js", 'const latte = { name: "لاتيه", price: 2.5 };\n\nconsole.log(latte.name + " بـ " + latte.price + " دينار");', 2.0, 14],
    ["Console", "لاتيه بـ 2.5 دينار", 0.95, 15],
  ], "«latte بطاقة فيها اسم وسعر. اطبع اسمه، وبـ، وسعره، ودينار».\nمفتاح: قيمة. والنقطة بتجيب القيمة: latte.name.\nمصفوفة objects = جدول Excel.", "بموقعكم", "كل منتج بـ data.js هو object", "ضيف category: \"coffee\" للبطاقة",
    "2 دقيقة.");

  await stepSlide(S1, "الأساس · 6 من 7", "الـ function: وصفة باسم", [
    ["js/basics.js", 'function withTax(p) {\n  return p * 1.16;\n}\n\nconsole.log(withTax(10));     // 11.6', 2.6, 15],
  ], "«withTax وصفة: بتاخد سعر (p)، وبترجّعه مع ضريبة 16%. وناديناها على 10 فطلعت 11.6».\nبنكتبها مرة، وبنناديها كل ما بدنا.", "بموقعكم", "render و addToCart و showCart", "«شو بيطبع withTax(20)؟»",
    "2 دقيقة. IT Team عندهم ضريبة 16% بالمنيو.");

  await stepSlide(S1, "الأساس · 7 من 7", "JS والصفحة: امسك ← استنى ← غيّر", [
    ["index.html", '<button id="addBtn">أضف</button>\n<p id="msg"></p>', 1.2, 15],
    ["js/basics.js", 'const btn = document.getElementById("addBtn");\nconst msg = document.getElementById("msg");\n\nbtn.addEventListener("click", () => {\n  btn.textContent = "تمت الإضافة";\n  msg.textContent = "لاتيه انضاف للسلة";\n  msg.style.color = "green";\n});', 3.4, 13],
  ], "«امسك الزر والفقرة. لما حدا يكبس على الزر: غيّر نص الزر، واكتب بالفقرة، ولوّنها أخضر».\nجرس الباب: الجرس (امسك)، حدا كبس (استنى)، الضو اشتغل (غيّر).", "للكل", "كل ميزة بمواقعكم هيك", "اكتب addbtn بحرف صغير: Cannot read properties of null",
    "3 دقائق. هاي القاعدة: كل الميزات الجاية هي نفس الخطوات الثلاث، والأساس من 1 لـ 6 جواها.");

  // ---- Features ----
  await stepSlide(S1, "الميزات · 1 من 5 · 02-data-render", "البيانات بـ data.js: مصفوفة objects", [
    ["js/data.js", 'const items = [\n  { id: 1, name: "لاتيه", category: "coffee",\n    price: 2.5, image: "images/latte.jpg" },\n  { id: 2, name: "موكا", category: "coffee",\n    price: 3, image: "images/mocha.jpg" },\n  { id: 3, name: "تشيز كيك", category: "sweets",\n    price: 3.5, image: "images/cake.jpg" }\n];', 3.15, 13],
    ["index.html · آخر الـ body", '<script src="js/data.js"></script>\n<script src="js/main.js"></script>', 1.2, 14],
  ], "«items مصفوفة (الأساس 3) فيها 3 objects (الأساس 5): كل منتج رقمه واسمه وتصنيفه وسعره وصورته».\nجدول Excel: كل سطر منتج. والترتيب: data.js قبل main.js، عشان البيانات تكون جاهزة.", "مين بحاجتها", "AI · DSA · IT · تكنولوجيا", "«لو حطينا data.js بعد main.js؟» ← items is not defined",
    "3 دقائق. افتح 02-data-render.");

  await stepSlide(S1, "الميزات · 1 من 5 · 02-data-render", "الرسم: render بـ forEach", [
    ["index.html", '<div id="list" class="cards"></div>', 0.95, 15],
    ["js/main.js", 'const list = document.getElementById("list");\n\nfunction render(arr) {\n  list.innerHTML = "";\n  arr.forEach(item => {\n    list.innerHTML += `\n      <div class="card">\n        <img src="${item.image}" alt="${item.name}">\n        <h3>${item.name}</h3>\n        <p>${item.price} دينار</p>\n      </div>`;\n  });\n}\nrender(items);', 3.85, 12],
  ], "«امسك list (الأساس 7). render وصفة (6): فضّي list، ولكل منتج (4) ضيف بطاقة فيها صورته واسمه وسعره».\n${item.name} = حط اسم المنتج هون، جوا الـ backticks.", "مين بحاجتها", "AI · DSA · IT · تكنولوجيا", "سطر رابع بـ data.js = بطاقة جديدة، بدون ما نلمس الـ HTML",
    "4 دقائق. أهم لحظة: ضيف منتج رابع بـ data.js واحفظ.");

  await stepSlide(S1, "الميزات · 2 من 5 · 03-filter", "الفلترة: filter و if", [
    ["index.html", '<button class="filter" data-cat="all">الكل</button>\n<button class="filter" data-cat="coffee">قهوة</button>\n<button class="filter" data-cat="sweets">حلويات</button>', 1.35, 12.5],
    ["js/main.js", 'document.querySelectorAll(".filter").forEach(btn => {\n  btn.addEventListener("click", () => {\n    const cat = btn.dataset.cat;\n    if (cat === "all") {\n      render(items);\n    } else {\n      render(items.filter(item => item.category === cat));\n    }\n  });\n});', 3.4, 12],
  ], "«امسك كل أزرار الفلترة. لما ينكبس زر: اقرأ تصنيفه. إذا الكل، ارسم الكل. وإلا، ارسم بس اللي تصنيفهم نفسه».\nامسك، استنى، و«غيّر» صارت: ارسم من جديد. filter = مصفاة القهوة.", "مين بحاجتها", "AI · DSA · تكنولوجيا · آفاق", "render نفسها، بس بمصفوفة أصغر",
    "5 دقائق. data-cat معلومة مخبّاة على الزر، و JS بيقرأها بـ dataset.cat.");

  await stepSlide(S1, "الميزات · 3 من 5 · 04-details", "صفحة التفاصيل: ?id= و find", [
    ["js/main.js · بالبطاقة", '<a class="btn" href="details.html?id=${item.id}">التفاصيل</a>', 0.95, 12.5],
    ["js/details.js", 'const id = Number(new URLSearchParams(location.search).get("id"));\nconst item = items.find(i => i.id === id);\nconst box = document.getElementById("details");\n\nif (item) {\n  box.innerHTML = `<h1>${item.name}</h1> ...`;\n} else {\n  box.textContent = "المنتج مش موجود";\n}', 3.2, 11.5],
  ], "«اقرأ الرقم من الرابط، ودوّر بالمصفوفة على المنتج اللي رقمه نفسه. إذا لقيته اعرضه، وإلا: المنتج مش موجود».\nصفحة وحدة لكل المنتجات. find بترجّع واحد، و filter بترجّع كلهم.", "مين بحاجتها", "DSA · تكنولوجيا", "جرّب بالرابط: ?id=2 بعدين ?id=9",
    "4 دقائق. DSA: portfolio.html?id=3. تكنولوجيا: tool-details.html?tool= عندهم أصلاً.");

  await stepSlide(S1, "الميزات · 4 من 5 · 05-save", "الحفظ بـ localStorage، واللون حسب السقف", [
    ["js/main.js", 'let cart = JSON.parse(localStorage.getItem("cart")) || [];\n\nfunction addToCart(item) {\n  cart.push(item);\n  localStorage.setItem("cart", JSON.stringify(cart));\n  showTotal();\n}\n\nfunction showTotal() {\n  let total = 0;\n  cart.forEach(i => { total += i.price; });\n  const bar = document.getElementById("total");\n  bar.textContent = total + " دينار";\n  if (total > 10) bar.style.color = "red";\n  else if (total >= 8) bar.style.color = "orange";\n  else bar.style.color = "green";\n}', 4.85, 11.5],
  ], "«السلة من ذاكرة المتصفح، وإذا فاضية مصفوفة فاضية. كل إضافة بتنحفظ. المجموع: فوق 10 أحمر، من 8 (80%) برتقالي، غير هيك أخضر».\nJSON بيحوّل المصفوفة لنص عشان تنحفظ، وبيرجّعها.", "مين بحاجتها", "the sun بالأساس", "أضف، refresh، المجموع ضل. وبس على نفس الجهاز",
    "5 دقائق. F12 ← Application ← Local Storage. زر «فضّي السلة» للتجربة من جديد. the sun: نفس الفكرة، المفتاح wazen، والسقف لكل بند.");

  await stepSlide(S1, "الميزات · 5 من 5 · 06-animation", "الحركة: @keyframes و animation", [
    ["css/style.css", "@keyframes fadeUp {\n  from { opacity: 0; transform: translateY(20px); }\n  to   { opacity: 1; transform: translateY(0); }\n}\n.show { animation: fadeUp 0.6s ease; }", 2.3, 13],
    ["js/main.js · آخر render", 'document.querySelectorAll(".card").forEach(card => {\n  card.classList.add("show");\n});', 1.4, 13],
  ], "«@keyframes بتوصف الحركة: من شفاف ونازل لظاهر بمكانه. animation بتشغّلها نص ثانية. و JS بيضيف class اسمه show لكل بطاقة».\nالحركة بالـ CSS، و JS بس بيحط الـ class.", "مين بحاجتها", "تكنولوجيا", "كبسة فلترة = البطاقات بتتحرك من جديد",
    "3 دقائق. زي الـ hamburger: CSS بيحضّر الشكل، و JS بيحط الـ class.");

  s = newSlide("CONTENT", "JavaScript · وين هاد بموقعكم؟", "نفس الأفكار، بأسماء موقعكم", S1);
  table(s, ["الفريق", "الميزات", "بموقعكم"], [
    ["AI", "1 · 2", "menuItems بـ data.js و render بـ menu.js، والفلترة موجودة"],
    ["DSA", "1 · 3", "creatives بـ data.js، و portfolio.html?id="],
    ["IT Team", "الأساس 7 · 1", "السلة والأحجام والنجوم (food.js و drinks.js)، و drinks بـ data.js"],
    ["تكنولوجيا", "1 · 3 · 5", "tools بـ data.js، و tool-details.html?tool=، و animation للـ hero"],
    ["آفاق", "1 · 2", "عندكم أصلاً: books بـ data.js، و loop، وفلترة. افهموه واشرحوه"],
    ["the sun", "4", "المفتاح wazen بـ localStorage، والشريط أخضر وبرتقالي وأحمر"],
  ], { y: 1.75, colW: [1.8, 2.2, 8.133], rowH: 0.62, fs: 14 });
  callout(s, M, 6.05, CW, 0.55, "الـ prompts جاهزة بصفحة «اليوم 5» بـ«ملفات الدورة»، تبويب فريقكم", { size: 14 });
  s.addNotes("دقيقتين. اربط كل ميزة بمهمة بتبويب الفريق.");

  s = newSlide("CONTENT", "0:45 · تطبيق 75 دقيقة", "مهام فريقكم بصفحة «اليوم 5»", S1);
  practice(s, "الخطوات", [
    "ملفات الدورة ← اليوم 5 ← تبويب فريقكم",
    "قبل أي تعديل: zip نسخة احتياطية",
    "المهام بالترتيب: «ضروري» أول، بعدين الباقي",
    "انسخوا الـ prompt والصقوا ملفاتكم مكان «(الصق هون)»",
    "بعد كل prompt: افتحوا الصفحة وجربوا، والـ Console نظيف",
  ], ["الضروري كله خلص", "قائمة «شغال 100%» كلها صح", "كل واحد بيشرح ميزة بالخطوات الثلاث"], 1.8, 4.6);
  s.addNotes("لف: IT Team أول (ملفات JS فاضية)، بعدين the sun (localStorage)، بعدين تكنولوجيا و DSA و AI، وآخر شي آفاق.");

  s = newSlide("STATEMENT", "من 2:00 لـ 2:15", "استراحة 15 دقيقة", S1);
  s.addText("قبلها: zip نسخة احتياطية. وبعدها: ننشر", R({ x: M, y: 4.6, w: CW, h: 0.6, fontSize: 20, color: C.text2 }));

  // ===== Publish =====
  const S2 = "النشر";
  pres.addSection({ title: S2 });
  divider("2:15 · 30 دقيقة", "ننشر على Netlify", "حساب ← سحب المجلد ← اسم الموقع", S2, "اعمل الخطوات قدامهم على موقع الدورة أو موقع فريق.");

  s = newSlide("CONTENT", "النشر · 1 من 2", "سجّلوا أول، بعدين اسحبوا", S2);
  {
    const T = [
      ["FaUserPlus", "1", "حساب", "واحد من الفريق يسجّل (Sign up with Google أسرع)"],
      ["FaSignInAlt", "2", "تأكدوا إنكم داخلين", "وبعدين افتحوا صفحة الـ Drop"],
      ["FaFolderOpen", "3", "اسحبوا المجلد", "المجلد اللي جواه index.html مباشرة، مش مجلد فوقه"],
      ["FaLink", "4", "الرابط", "random-name.netlify.app: افتحوه وجربوه"],
    ];
    const { xs, cw } = colsX(4, 0.25);
    for (let i = 0; i < 4; i++) await card(s, xs[i], 1.8, cw, 2.7, { icon: T[i][0], num: T[i][1], title: T[i][2], body: T[i][3], titleSize: 18, bodySize: 14 });
  }
  codeBox(s, M, 4.7, CW, 0.75, "app.netlify.com/signup        app.netlify.com/drop", null, 18);
  callout(s, M, 5.6, CW, 0.85, "تنبيه: النشر بدون تسجيل دخول بينحذف خلال ساعة. سجّلوا أول", { size: 18 });
  s.addNotes("أكثر غلطة: سحب مجلد فوق مجلد الموقع، فالرابط بيفتح على قائمة ملفات أو Page not found.");

  s = newSlide("CONTENT", "النشر · 2 من 2", "اسم الموقع، والتعديل بعد النشر", S2);
  {
    const T = [
      ["FaTag", "5", "غيّروا الاسم", "Site configuration ← Change site name، مثلاً caffeon-aqaba"],
      ["FaMobileAlt", "6", "على جوالاتكم", "افتحوا الرابط وجربوا كل الصفحات"],
      ["FaSyncAlt", "7", "تعديل؟", "صلّحوا على الجهاز، وبعدين Deploys ← اسحبوا المجلد مرة ثانية. الرابط ما بيتغيّر"],
      ["FaPaperPlane", "8", "ابعتوا الرابط", "بفورم اليوم 5 على موقع الدورة"],
    ];
    const { xs, cw } = colsX(4, 0.25);
    for (let i = 0; i < 4; i++) await card(s, xs[i], 1.8, cw, 3.2, { icon: T[i][0], num: T[i][1], title: T[i][2], body: T[i][3], titleSize: 18, bodySize: 14 });
  }
  callout(s, M, 5.3, CW, 1.1, "الاسم بالإنجليزي، أحرف صغيرة، وبدون مسافات (زي أسماء الملفات). وعلى الإنترنت JS غير js: أي حرف كبير بالمسار بيخرب هون", { size: 15, bold: false });

  s = newSlide("CONTENT", "2:45 · جوال وتصليح · 25 دقيقة", "«شغال 100%»: افحصوا على الرابط المنشور", S2);
  {
    const items = ["كل صفحة بتفتح، والقائمة بتوصل لكل الصفحات من كل صفحة", "F12 ← Console: ما في ولا خطأ أحمر بولا صفحة", "كل زر بيعمل اللي مكتوب عليه، أو بيطلّع رسالة واضحة", "على الجوال ما في سكرول لليمين أو الشمال", "كل الصور ظاهرة", "الرابط المنشور بيفتح على جوال حقيقي"];
    for (let i = 0; i < items.length; i++) {
      const y = 1.8 + i * 0.68;
      box(s, M, y, CW, 0.56, i % 2 ? "FFFFFF" : C.background2, "D5DCE4");
      s.addShape(pres.shapes.RECTANGLE, { x: W - M - 0.55, y: y + 0.13, w: 0.3, h: 0.3, fill: { color: "FFFFFF" }, line: { color: HEX.accent1, width: 2 }, objectName: "checkbox" });
      s.addText(items[i], R({ x: M + 0.3, y: y + 0.06, w: CW - 1.1, h: 0.44, fontSize: 16, color: C.text2, valign: "middle" }));
    }
  }
  callout(s, M, 5.95, CW, 0.6, "صلّحتوا؟ Deploys ← اسحبوا المجلد من جديد، وجربوا على الجوال مرة ثانية", { size: 14, bold: false });
  s.addNotes("الصور المكسورة بعد النشر بس = غالباً حرف كبير بالاسم أو مسار بيبلش بـ /.");

  // ===== Presentation =====
  const S3 = "العرض";
  pres.addSection({ title: S3 });
  s = newSlide("CONTENT", "3:10 · تحضير العرض · 15 دقيقة", "جهّزوا عرضكم", S3);
  practice(s, "الخطوات", [
    "وزّعوا الأجزاء الخمسة على الفريق: كل الفريق بيحكي",
    "اختاروا الميزتين اللي رح تعرضوهم، وجربوهم على الرابط المنشور",
    "كل واحد يجهّز يشرح ميزة بالخطوات الثلاث (امسك، استنى، غيّر)",
    "الرابط جاهز بالمتصفح على شاشة العرض",
  ], ["كل واحد عارف جزءه", "الميزتين شغالات على الرابط المنشور"], 1.8, 4.6);

  s = newSlide("CONTENT", "العرض · 5 دقايق لكل فريق", "من الموقع المنشور، والفريق كله بيحكي", S3);
  {
    const T = [["30 ثانية", "الفكرة، ولمين الموقع"], ["دقيقتين", "جولة بالموقع، وميزتين شغالات قدامنا"], ["دقيقة", "أصعب مشكلة واجهتكم، وكيف حليتوها"], ["30 ثانية", "شو بتضيفوا لو عندكم أسبوع زيادة"], ["دقيقة", "أسئلة"]];
    for (let i = 0; i < T.length; i++) {
      const y = 1.8 + i * 0.9;
      box(s, M, y, CW, 0.75, i % 2 ? "FFFFFF" : C.background2, "D5DCE4");
      box(s, W - M - 2.2, y, 2.2, 0.75, i === 1 ? C.accent1 : C.text2);
      s.addText(T[i][0], R({ x: W - M - 2.2, y, w: 2.2, h: 0.75, fontSize: 18, bold: true, color: C.background1, align: "center", valign: "middle" }));
      s.addText(T[i][1], R({ x: M + 0.3, y, w: CW - 2.8, h: 0.75, fontSize: 19, color: C.text2, valign: "middle" }));
    }
  }

  s = newSlide("CONTENT", "3:25 · عروض الفرق · 30 دقيقة", "ترتيب العروض", S3);
  {
    const order = [["1", "آفاق", "اكتشاف الكتب"], ["2", "the sun", "وازن: الميزانية الشخصية"], ["3", "AI", "CAFFEON"], ["4", "IT Team", "منيو المطعم الإيطالي"], ["5", "DSA", "NOVA: أعمال المبدعين"], ["6", "تكنولوجيا", "دليل أدوات الـ AI"]];
    const { xs, cw } = colsX(3, 0.3);
    for (let i = 0; i < 6; i++) {
      const x = xs[i % 3], y = 1.8 + Math.floor(i / 3) * 2.2;
      await card(s, x, y, cw, 2.0, { num: order[i][0], title: order[i][1], body: order[i][2], titleSize: 22, bodySize: 16 });
    }
  }
  callout(s, M, 6.15, CW, 0.5, "5 دقايق لكل فريق. الفريق الجاي بيجهّز الرابط وهو قاعد", { size: 14, bold: false });
  s.addNotes("عدّل الترتيب حسب جاهزية الفرق.");

  // ===== Closing =====
  const S4 = "الختام";
  pres.addSection({ title: S4 });
  s = newSlide("CONTENT", "الختام · رحلة الخمس أيام", "من فكرة على ورقة، لموقع على الإنترنت", S4);
  await stepsFlow(s, [
    { icon: "FaLightbulb", num: "1", title: "تخطيط", body: "الجمهور والأهداف والصفحات" },
    { icon: "FaPalette", num: "2", title: "تصميم", body: "UX/UI و Stitch" },
    { icon: "FaCode", num: "3", title: "بناء", body: "HTML و CSS و JS" },
    { icon: "FaTools", num: "4", title: "تصليح", body: "الملفات والربط والـ Console" },
    { icon: "FaGlobe", num: "5", title: "نشر", body: "رابط حقيقي على Netlify", dark: true },
  ], 1.9, 3.0, { bodySize: 14, titleSize: 19 });
  callout(s, M, 5.2, CW, 1.1, "كل يوم كان خطوة من خطوات أي فريق ويب حقيقي", { size: 18 });

  s = newSlide("STATEMENT", "شو صار عندكم هلأ", "موقع منشور على الإنترنت، باسمكم", S4);
  s.addText("وبتعرفوا تقرأوا كوده، وتصلّحوه، وتنشروه من جديد", R({ x: M, y: 4.6, w: CW, h: 0.6, fontSize: 20, color: C.text2 }));

  s = newSlide("CONTENT", "الختام · كيف تكمّلوا لحالكم", "4 عادات", S4);
  {
    const T = [
      ["FaBook", "ورقة المرجع", "خلّوها جنبكم: أي سطر مش فاهمه، دوّر عليه"],
      ["FaComments", "«اشرحلي سطر سطر»", "قبل ما تلصقوا أي كود من الـ AI"],
      ["FaListOl", "خطوة خطوة", "prompt، احفظ، جرّب، Console نظيف، وبعدين اللي بعده"],
      ["FaFileArchive", "نسخة احتياطية", "قبل أي تعديل كبير. وبعد التعديل: اسحبوا المجلد على Deploys"],
    ];
    const { xs, cw } = colsX(4, 0.25);
    for (let i = 0; i < 4; i++) await card(s, xs[i], 1.8, cw, 3.3, { icon: T[i][0], iconFill: i % 2 ? C.accent2 : C.accent1, title: T[i][1], body: T[i][2], titleSize: 18, bodySize: 14 });
  }
  callout(s, M, 5.4, CW, 1.0, "الخطوات الثلاث (امسك، استنى، غيّر) موجودة بأي موقع بتشوفوه. افتحوا F12 على أي موقع وشوفوا بنفسكم", { size: 16 });

  s = pres.addSlide({ masterName: "DIVIDER", sectionTitle: S4 });
  s.addText("شكراً", { placeholder: "title", rtlMode: true, align: "right" });
  s.addText("دورة تطوير المواقع الإلكترونية بمساعدة الذكاء الاصطناعي · مؤسسة ولي العهد", { placeholder: "kicker", rtlMode: true, align: "right" });
  s.addText("ابعتوا رابط موقعكم بفورم اليوم 5، وخلّيكم على تواصل", R({ x: M, y: 4.3, w: CW, h: 0.5, fontSize: 20, color: "C9D6E0" }));
  s.addText("المدرب: حسام عليان", R({ x: M, y: 4.9, w: CW, h: 0.45, fontSize: 18, color: C.background1, bold: true }));

  await pres.writeFile({ fileName: "day5-ar.pptx" });
  await applyTheme("day5-ar.pptx", THEME);
  console.log("done");
}
build().catch((e) => { console.error(e); process.exit(1); });
