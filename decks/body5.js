
// one step of the growing example: code (left), reading + who needs it (right)
async function stepSlide(sec, n, title, codes, reading, teams, tip, notes) {
  const s = newSlide("CONTENT", `JavaScript · الخطوة ${n} من 7`, title, sec);
  const cw = 7.0;
  let y = 1.75;
  for (const [label, text, h, fs] of codes) {
    codeBox(s, M, y, cw, h, text, label, fs || 13);
    y += h + 0.15;
  }
  const x = M + cw + 0.35, w = W - M - x;
  box(s, x, 1.75, w, 2.75, C.background2);
  s.addText("بتنقرأ", R({ x: x + 0.25, y: 1.85, w: w - 0.5, h: 0.4, fontSize: 16, bold: true, color: C.accent1 }));
  s.addText(reading, R({ x: x + 0.25, y: 2.3, w: w - 0.5, h: 2.1, fontSize: 15, color: C.text2 }));
  box(s, x, 4.65, w, 0.95, C.text2);
  s.addText("مين بحاجتها", R({ x: x + 0.25, y: 4.7, w: w - 0.5, h: 0.35, fontSize: 13, bold: true, color: HEX.accent6 }));
  s.addText(teams, R({ x: x + 0.25, y: 5.05, w: w - 0.5, h: 0.45, fontSize: 16, bold: true, color: C.background1 }));
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
    ["0:05", "JavaScript بمثال واحد", "7 خطوات، مثال بيكبر"],
    ["0:45", "تطبيق", "مهام فريقكم بصفحة «اليوم 5» (الضروري أول)"],
    ["2:00", "استراحة", "15 دقيقة"],
    ["2:15", "النشر", "Netlify: حساب، وسحب المجلد، واسم"],
    ["2:45", "جوال وتصليح", "الرابط على جوالاتكم، وتصليح اللي بيطلع"],
    ["3:10", "تحضير العرض", "مين بيحكي شو"],
    ["3:25", "عروض الفرق", "5 دقايق لكل فريق"],
    ["3:55", "الختام", "رحلة الخمس أيام"],
  ], { y: 1.8, colW: [1.5, 3.0, 7.633], rowH: 0.5, fs: 15 });

  // ===== JS =====
  const S1 = "JavaScript بمثال واحد";
  pres.addSection({ title: S1 });
  divider("0:05 · شرح 40 دقيقة", "JavaScript بمثال واحد", "منيو مقهى صغير بيكبر خطوة خطوة: من زر لموقع كامل", S1, "قاعدة الشرح: كل خطوة بتكتبها بـ demo وبتشغّلها قدامهم، وبتقرأ السطر بالعربي بصوت عالي. بعدين بتسأل: «مين عنده هاد بموقعه؟»");

  s = newSlide("CONTENT", "JavaScript · الخريطة", "مثال واحد، 7 خطوات، وكل خطوة بتبني على اللي قبلها", S1);
  table(s, ["#", "الخطوة", "الأوامر", "مين بحاجتها"], [
    ["1", "زر بيغيّر نص", "getElementById · addEventListener · textContent", "الكل"],
    ["2", "البيانات", "data.js · [ ] · { } · <script>", "AI · DSA · IT · تكنولوجيا"],
    ["3", "الرسم", "function · forEach · ${ }", "AI · DSA · IT · تكنولوجيا"],
    ["4", "الفلترة", "filter · if / else · data-cat", "AI · DSA · تكنولوجيا · آفاق"],
    ["5", "صفحة التفاصيل", "?id= · URLSearchParams · find", "DSA · تكنولوجيا"],
    ["6", "الحفظ واللون", "localStorage · JSON · if / else if", "the sun"],
    ["7", "الحركة", "@keyframes · animation · classList.add", "تكنولوجيا"],
  ], { ltr: [2], y: 1.75, colW: [0.6, 2.2, 6.0, 3.333], rowH: 0.5, fs: 13 });
  callout(s, M, 6.05, CW, 0.55, "الخطوة 1 للكل. بعدها كل فريق بيركّز على خطواته، وكلها بتنفع لما تقرأوا كود الـ AI", { size: 14, bold: false });
  s.addNotes("دقيقة. الخطوة 1 هي أساس كل الباقي: امسك، استنى، غيّر.");

  await stepSlide(S1, 1, "امسك ← استنى ← غيّر: زر بيغيّر نص", [
    ["HTML", '<button id="addBtn">أضف</button>', 0.95, 15],
    ["js/menu.js", 'const btn = document.getElementById("addBtn");\n\nbtn.addEventListener("click", () => {\n  btn.textContent = "تمت الإضافة";\n});', 2.6, 15],
  ], "«امسك العنصر اللي الـ id تبعه addBtn وسميه btn. لما حدا يكبس عليه، غيّر النص المكتوب عليه».\nجرس الباب: الجرس (امسك)، حدا كبس (استنى)، الضو اشتغل (غيّر).", "الكل", "addBtn بالـ JS لازم يكون نفسه حرف بحرف اللي بالـ HTML",
    "6 دقائق. 1. امسك: getElementById بيدوّر بالصفحة على id. 2. استنى: addEventListener + click. 3. غيّر: textContent. اغلط قدامهم: اكتب addbtn بحرف صغير، وورّيهم الخطأ بالـ Console (Cannot read properties of null). كل ميزة بمواقعهم هيك.");

  await stepSlide(S1, 2, "البيانات بـ data.js: مصفوفة، وكل منتج object", [
    ["js/data.js", 'const items = [\n  { id: 1, name: "لاتيه", category: "coffee",\n    price: 2.5, image: "images/latte.jpg" },\n  { id: 2, name: "موكا", category: "coffee",\n    price: 3, image: "images/mocha.jpg" },\n  { id: 3, name: "تشيز كيك", category: "sweets",\n    price: 3.5, image: "images/cake.jpg" }\n];', 3.15, 13],
    ["menu.html · آخر الـ body", '<script src="js/main.js"></script>\n<script src="js/data.js"></script>\n<script src="js/menu.js"></script>', 1.5, 14],
  ], "«items مصفوفة فيها 3 منتجات. كل منتج بطاقة معلومات: رقمه، واسمه، وتصنيفه، وسعره، وصورته».\n[ ] = المصفوفة، و { } = المنتج. الترتيب: data.js قبل ملف الصفحة، عشان البيانات تكون جاهزة قبل ما ينرسموا.", "AI · DSA · IT · تكنولوجيا", "منتج جديد = سطر جديد بـ data.js. ما بنلمس الـ HTML",
    "6 دقائق. التشبيه: جدول Excel. كل سطر منتج، وكل عمود معلومة. المكونات عالطاولة قبل ما الطباخ يبلّش: data.js قبل menu.js.");

  await stepSlide(S1, 3, "الرسم: بطاقة لكل منتج بـ forEach", [
    ["menu.html", '<div id="list" class="cards"></div>', 0.95, 15],
    ["js/menu.js", 'const list = document.getElementById("list");\n\nfunction render(arr) {\n  list.innerHTML = "";\n  arr.forEach(item => {\n    list.innerHTML += `\n      <div class="card">\n        <img src="${item.image}" alt="${item.name}">\n        <h3>${item.name}</h3>\n        <p>${item.price} دينار</p>\n      </div>`;\n  });\n}\n\nrender(items);', 3.85, 12],
  ], "«render وصفة: فضّي list، وبعدين لكل منتج بالمصفوفة ضيف بطاقة فيها صورته واسمه وسعره».\n${item.name} = حط اسم المنتج هون. والوصفة بنناديها بـ render(items).", "AI · DSA · IT · تكنولوجيا", "جرّب قدامهم: سطر رابع بـ data.js، احفظ، بطاقة جديدة طلعت",
    "7 دقائق. function = وصفة بإسم، بنكتبها مرة وبنناديها كل ما بدنا (رح نناديها كمان بالفلترة). forEach = الموظف اللي بيمرق عالطابور واحد واحد. الـ backticks بتسمح نحط ${ } جوا النص. ليش list.innerHTML = \"\" بالأول؟ عشان لما نرسم من جديد ما تتكرر البطاقات.");

  await stepSlide(S1, 4, "الفلترة: filter و if", [
    ["menu.html", '<button class="filter" data-cat="all">الكل</button>\n<button class="filter" data-cat="coffee">قهوة</button>\n<button class="filter" data-cat="sweets">حلويات</button>', 1.35, 13],
    ["js/menu.js", 'document.querySelectorAll(".filter").forEach(btn => {\n  btn.addEventListener("click", () => {\n    const cat = btn.dataset.cat;\n    if (cat === "all") {\n      render(items);\n    } else {\n      render(items.filter(item => item.category === cat));\n    }\n  });\n});', 3.45, 12],
  ], "«لكل زر فلترة: لما ينكبس، اقرأ تصنيفه. إذا الكل، ارسم كل المنتجات. وإلا، ارسم بس المنتجات اللي تصنيفها نفس تصنيف الزر».\nfilter = مصفاة القهوة. و === = بيساوي بالضبط.", "AI · DSA · تكنولوجيا · آفاق", "نفس الخطوات الثلاث، بس «غيّر» صار: ارسم من جديد",
    "6 دقائق. data-cat معلومة مخبّاة على الزر، و JS بيقرأها بـ dataset.cat. لاحظوا: render نفسها من الخطوة 3، بس بنعطيها مصفوفة أصغر.");

  await stepSlide(S1, 5, "صفحة التفاصيل: ?id= و find", [
    ["بالبطاقة (الخطوة 3)", '<a href="details.html?id=${item.id}">التفاصيل</a>', 0.95, 14],
    ["js/details.js", 'const id = Number(new URLSearchParams(location.search).get("id"));\nconst item = items.find(i => i.id === id);\nconst box = document.getElementById("details");\n\nif (item) {\n  box.innerHTML = `<h1>${item.name}</h1><p>${item.price} دينار</p>`;\n} else {\n  box.textContent = "المنتج مش موجود";\n}', 3.1, 11.5],
  ], "«اقرأ الرقم من الرابط (details.html?id=2)، ودوّر بالمصفوفة على المنتج اللي رقمه نفسه. إذا لقيته، اعرض اسمه وسعره. وإلا: المنتج مش موجود».\nصفحة وحدة لكل المنتجات، بدل صفحة لكل منتج.", "DSA · تكنولوجيا", "find بترجّع أول عنصر الشرط صح عليه. filter بترجّع كلهم",
    "5 دقائق. DSA: portfolio.html?id=3. تكنولوجيا عندهم tool-details.html?tool= أصلاً: «هاد اللي عندكم». details.html لازم تربط data.js قبل details.js.");

  await stepSlide(S1, 6, "الحفظ بـ localStorage، واللون حسب السقف", [
    ["js/menu.js", 'let cart = JSON.parse(localStorage.getItem("cart")) || [];\n\nfunction addToCart(item) {\n  cart.push(item);\n  localStorage.setItem("cart", JSON.stringify(cart));\n  showTotal();\n}\n\nfunction showTotal() {\n  let total = 0;\n  cart.forEach(i => { total += i.price; });\n  const bar = document.getElementById("total");\n  bar.textContent = total + " دينار";\n  if (total > 10) bar.style.color = "red";\n  else if (total >= 8) bar.style.color = "orange";\n  else bar.style.color = "green";\n}', 4.85, 11.5],
  ], "«السلة من ذاكرة المتصفح، وإذا فاضية مصفوفة فاضية. كل إضافة بتنحفظ. المجموع: فوق 10 أحمر، من 8 (80%) برتقالي، غير هيك أخضر».\nJSON بيحوّل المصفوفة لنص عشان تنحفظ، وبيرجّعها مصفوفة.", "the sun بالأساس", "بتضل بعد الـ refresh، بس على نفس الجهاز ونفس المتصفح",
    "6 دقائق. the sun: نفس الفكرة بالضبط، بس المفتاح اسمه wazen، والسقف لكل بند (أخضر تحت 80%، برتقالي من 80%، أحمر فوق السقف). جرّب: ضيف، refresh، المجموع ضل. F12 ← Application ← Local Storage وورّيهم البيانات.");

  await stepSlide(S1, 7, "الحركة: @keyframes و animation", [
    ["css/style.css", "@keyframes fadeUp {\n  from { opacity: 0; transform: translateY(20px); }\n  to   { opacity: 1; transform: translateY(0); }\n}\n\n.show { animation: fadeUp 0.6s ease; }", 2.4, 13],
    ["js/menu.js · آخر render", 'document.querySelectorAll(".card").forEach(card => {\n  card.classList.add("show");\n});', 1.4, 13],
  ], "«@keyframes بتوصف الحركة: من شفاف ونازل 20 بكسل، لظاهر بمكانه. animation بتشغّلها نص ثانية. و JS بيضيف class اسمه show لكل بطاقة، فبتتحرك».\nالحركة بالـ CSS، و JS بس بيحط الـ class.", "تكنولوجيا", "زي الـ hamburger: الـ CSS بيحضّر الشكل، و JS بيحط الـ class",
    "4 دقائق. تكنولوجيا: الـ hero بالرئيسية، والـ prompt بصفحة اليوم 5 بيطلب prefers-reduced-motion للي مطفّي الحركة.");

  s = newSlide("CONTENT", "JavaScript · وين هاد بموقعكم؟", "نفس الخطوات، بأسماء موقعكم", S1);
  table(s, ["الفريق", "الخطوات", "بموقعكم"], [
    ["AI", "2 · 3 · 4", "menuItems بـ data.js و render بـ menu.js، والفلترة موجودة"],
    ["DSA", "2 · 3 · 5", "creatives بـ data.js، و portfolio.html?id="],
    ["IT Team", "1 · 2 · 3", "السلة والأحجام والنجوم (food.js و drinks.js)، و drinks بـ data.js"],
    ["تكنولوجيا", "2 · 3 · 5 · 7", "tools بـ data.js، و tool-details.html?tool=، و animation للـ hero"],
    ["آفاق", "3 · 4", "عندكم أصلاً: books بـ data.js، وloop، وفلترة. افهموه واشرحوه"],
    ["the sun", "6", "المفتاح wazen بـ localStorage، والشريط أخضر وبرتقالي وأحمر"],
  ], { y: 1.75, colW: [1.8, 2.2, 8.133], rowH: 0.62, fs: 14 });
  callout(s, M, 6.05, CW, 0.55, "الـ prompts جاهزة بصفحة «اليوم 5» بـ«ملفات الدورة»، تبويب فريقكم", { size: 14 });
  s.addNotes("دقيقة. اربط كل خطوة بمهمة بتبويب الفريق.");

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
