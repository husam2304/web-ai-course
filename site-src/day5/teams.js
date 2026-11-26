// Copied verbatim from the <script> of «اليوم 5: نخلّص وننشر» (day5.html).
// day5_build.py runs this with Node and reads the teams array as JSON.
const ASK="\n\nلا تغيّر أي اشي ما طلبته. اعطيني الملفات كاملة بدون اختصار، كل ملف بـ code block لحاله وفوقه اسمه. وبالآخر اشرحلي بالعربي بـ 3 أسطر شو عملت.";
const DATA=(what,arr,fields,file,grid,sel,extra)=>`بدي أحوّل ${what} لبيانات بـ JavaScript. تحت شغلتين: الـ HTML تبع ${grid}، وملف ${file}.
المطلوب:
1. ملف js/data.js فيه مصفوفة اسمها ${arr}. كل بطاقة = object فيه: ${fields}. خد القيم من البطاقات الموجودة بالضبط.
2. بـ ${file}: function اسمها render بترسم البطاقات جوا ${grid} من ${arr}، بنفس الـ HTML والـ classes والـ data-* بالضبط. لازم تنادى قبل السطر اللي بيدوّر على ${sel}، عشان الميزات الموجودة تضل شغالة.
3. بالـ HTML: ${grid} يضل موجود بنفس الـ class، بس فاضي.${extra||""}
4. لا تغيّر الفلترة ولا البحث ولا أي ميزة ثانية.`+ASK+`\n\nالـ HTML:\n(الصق هون)\n\n${file}:\n(الصق هون)`;
const OVER=(page,css)=>`صفحة ${page} بموقعي، على عرض جوال 375px، فيها سكرول جانبي (في اشي أعرض من الشاشة).
هاد ملف ${css}. دوّر على العناصر اللي ممكن تطلع أعرض من الشاشة (عرض ثابت بالـ px، صور، جداول، صفوف flex بدون wrap، grid بأعمدة ثابتة) وصلّحها بـ @media (max-width: 600px).
اعطيني القواعد الجديدة بس، وقلي وين أحطها، وقلي بسطر شو كان السبب.

${css}:
(الصق هون)`;
const teams=[
{id:"ai",name:"AI",state:"موقعكم شغال: 4 صفحات، والفلترة بالمنيو، والطلب على واتساب. بس السلة مخبّاية بآخر المنيو وبتفضى لما تطلعوا من الصفحة، وأزرار الرئيسية مش مربوطة فيها. اليوم: صفحة سلة حقيقية بتتذكر الطلب بكل الصفحات.",tasks:[
 {must:1,t:"صفحة السلة cart.html",d:"بننقل قسم السلة من menu.html لصفحة لحالها. انسخوا الـ prompt، والصقوا menu.html و menu.css.",p:`بدي أعمل صفحة سلة لموقعنا CAFFEON. تحت ملفين: menu.html كامل، و menu.css.
المطلوب:
1. cart.html جديدة: نفس الـ head (بس بتربط css/style.css وبعده css/cart.css)، ونفس الـ header والـ footer بالضبط، وبالنص قسم السلة اللي بـ menu.html (من <section id="cart-section"> لآخره) زي ما هو، مع عنوان صغير فوقه «Your Cart».
2. css/cart.css: كل قواعد الـ CSS اللي بـ menu.css تبع قسم السلة (أي selector فيه cart أو checkout أو order-notes أو subtotal أو total أو summary)، منقولة زي ما هي، ومع الـ @media تبعها. وإذا في عنصر toast بالصفحة، قواعده كمان.
3. بآخر الـ body تبع cart.html: <script src="js/cart.js"><\/script> بس (رح نكتبه بالخطوة الجاية).
لا تغيّر ولا قاعدة ولا class ولا id. اعطيني cart.html و cart.css كاملين بدون اختصار، كل واحد بـ code block وفوقه اسمه.

menu.html:
(الصق هون)

menu.css:
(الصق هون)`},
 {must:1,t:"شيلوا السلة من المنيو، ووحّدوا زر السلة فوق",d:"يدوي، بالمحرر. هيك زر السلة بيصير رابط لصفحة السلة بكل الصفحات، والعدد إله نفس الـ id بكل مكان.",steps:[
   "بـ menu.html: احذفوا من <section id=\"cart-section\"> لحد </section> تبعه (صار بـ cart.html).",
   "بـ menu.html: بدّلوا <button type=\"button\" id=\"nav-cart-btn\" class=\"cart-btn\" aria-label=\"Cart\"> بـ <a href=\"cart.html\" id=\"cart-btn\" class=\"cart-btn\" aria-label=\"Cart\">، و </button> اللي بعده بسطرين بـ </a>، و id=\"nav-cart-badge\" بـ id=\"cart-count\".",
   "بـ index.html و workspace.html و about.html: بدّلوا <button type=\"button\" id=\"cart-btn\" class=\"cart-btn\" aria-label=\"Cart\"> بـ <a href=\"cart.html\" id=\"cart-btn\" class=\"cart-btn\" aria-label=\"Cart\">، و </button> اللي بعده بسطرين بـ </a>.",
   "بالصفحات الأربع: ضيفوا <script src=\"js/cart.js\"><\/script> آخر الـ body، قبل سطر ملف الصفحة.",
   "إذا طلع خط تحت أيقونة السلة أو تغيّر لونها: بـ css/style.css ضيفوا .cart-btn { text-decoration: none; color: inherit; }",
   "ضيفوا cart.html للقائمة (nav) إذا بدكم، أو خلّوها بزر السلة بس."
 ]},
 {must:1,t:"cart.js: سلة مشتركة بتتذكر",d:"هون بتطبقوا localStorage و JSON من شرح اليوم. انسخوا الـ prompt، والصقوا menu.js.",p:`تحت ملف menu.js من موقعنا CAFFEON. فيه سلة بالذاكرة (const cart = []) مع addToCart و changeQuantity و removeFromCart و renderCart و checkoutWhatsApp.
بدي أنقل السلة لملف مشترك js/cart.js مربوط بكل صفحات الموقع (قبل ملف الصفحة)، والسلة تنحفظ بـ localStorage تحت مفتاح اسمه caffeon-cart، بنفس شكل العناصر الحالي ({ title, price, category, quantity }).
cart.js لازم فيه:
1. getCart() و saveCart(cart) بـ JSON.parse و JSON.stringify.
2. addToCart(title, price, categoryName): إذا المنتج موجود بتزيد الكمية، وإلا بتضيفه. بتحفظ، وبتحدّث العدد، وبتطلّع إشعار.
3. updateCartBadge(): بتحط مجموع الكميات بالعنصر #cart-count بأي صفحة.
4. للإشعار: function اسمها showCartToast بتعمل إشعار بسيط لحالها (ما بتعتمد على عناصر الصفحة).
5. addToCart و updateCartBadge لازم يكونوا global (برا DOMContentLoaded) عشان menu.js و home.js يستعملوهم.
6. جوا DOMContentLoaded: updateCartBadge() بكل صفحة. وإذا الصفحة فيها #cart-section (يعني cart.html): بترسم السلة بنفس الـ HTML اللي بـ renderCart بالضبط، مع + و − والحذف والمجموع والملاحظات، وزر الطلب على واتساب بنفس checkoutWhatsApp.
7. كل عنصر بيتأكد إنه موجود قبل الاستخدام (if)، لأن الملف مربوط بكل الصفحات.
وبعدين menu.js: شيل منه كل كود السلة (المتغيرات والـ functions تبعها)، وخلي أزرار «Add to Cart» تنادي addToCart من cart.js بنفس القيم. الفلترة والـ toast تبع المنيو والباقي ما بيتغيروا ولا سطر.
اعطيني cart.js و menu.js كاملين بدون اختصار، كل واحد بـ code block وفوقه اسمه. وبالآخر اشرحلي بالعربي بـ 3 أسطر كيف السلة بتضل لما أنتقل بين الصفحات.

menu.js:
(الصق هون)`},
 {must:1,t:"أزرار الرئيسية بتضيف للسلة",d:"الصقوا home.js، وبطاقات المنتجات الأربعة من الرئيسية (فيها add-cart-btn)، ونفس المنتجات من menu.html (دوّروا عليها بـ Ctrl+F) عشان السعر.",p:`عندنا هلأ ملف مشترك js/cart.js فيه addToCart(title, price, categoryName) و updateCartBadge().
تحت 3 أشياء: home.js، وبطاقات المنتجات الأربعة من index.html (أزرارها class="add-cart-btn" و data-item)، ونفس المنتجات من menu.html (فيها السعر والقسم).
بدي:
1. بالـ HTML: ضيف لكل زر من الأربعة data-price و data-category، والقيم من بطاقات menu.html بالضبط. اعطيني أسطر الأزرار الأربعة بعد التعديل.
2. home.js: شيل العداد القديم (cartCount و cartCountEl و cartBtn وكود الإضافة تبعه)، وخلي الأزرار تنادي addToCart من cart.js بالاسم والسعر والقسم.
3. باقي home.js ما بيتغيّر ولا سطر.
اعطيني home.js كامل بدون اختصار.

home.js:
(الصق هون)

البطاقات من index.html:
(الصق هون)

نفس المنتجات من menu.html:
(الصق هون)`},
 {must:1,t:"جرّبوا السلة",d:"ضيفوا من الرئيسية ومن المنيو، وتنقلوا بين الصفحات: العدد فوق لازم يضل. افتحوا cart.html: غيّروا الكمية، واحذفوا، واكتبوا ملاحظة، وجربوا الطلب على واتساب. اعملوا refresh: السلة لازم تضل. F12 ← Application ← Local Storage: لازم تشوفوا caffeon-cart."},
 {must:1,t:"عرض about على الجوال",d:"صفحة about أعرض شوي من شاشة الجوال.",p:OVER("about.html","about.css")},
 {t:"المنيو من بيانات JS (بعد ما تخلص السلة)",d:"البطاقات الـ 14 بـ menu.html مكتوبة بالـ HTML.",p:DATA("بطاقات المنيو","menuItems","title, price, category, badge, description, meta, image","menu.js","#menu-grid",".menu-card وأزرار الإضافة","\n   مهم: لا تلمس الربط مع cart.js (أزرار Add to Cart لازم تضل تنادي addToCart بنفس القيم).\n   وبـ menu.html الترتيب: js/cart.js ثم js/data.js ثم js/menu.js.")},
 {t:"الصور على الجهاز",d:"الصور لسا روابط Stitch. نزّلوها على images وغيّروا الـ src (ابدأوا بالمنيو)."}
]},
{id:"dsa",name:"DSA",state:"موقعكم شغال: 6 صفحات، البحث، والتسجيل والدخول ولوحة التحكم بـ localStorage. اليوم: البيانات بـ JS والصور.",tasks:[
 {must:1,t:"صور لوحة التحكم",d:"4 صور مش موجودة: images/profile.jpg و images/siq.jpg و images/wadi-rum.jpg و images/weibdeh.jpg. جيبوا صور (Unsplash أو AI) وحطوها بمجلد images بنفس الأسماء بالضبط."},
 {must:1,t:"المبدعين من بيانات JS",d:"بطاقات explore.html الـ 11 مكتوبة بالـ HTML.",p:DATA("بطاقات المبدعين بصفحة الاستكشاف","creatives","id (رقم من 1)، الاسم، التخصص، المدينة، الصورة، وأي data-* موجودة","explore.js","#creativeGrid","const creativeCards","\n   وزر View Portfolio يوديني على portfolio.html?id= ورقم المبدع.\n   وبـ explore.html الترتيب: js/main.js ثم js/data.js ثم js/explore.js.")},
 {t:"صفحة المبدع حسب الرابط",d:"لما تفتحوا portfolio.html?id=3 تطلع معلومات المبدع رقم 3.",p:`صفحة portfolio.html بموقعي بتعرض مبدع واحد مكتوب بالـ HTML. عندي بـ js/data.js مصفوفة creatives (كل عنصر فيه id).
بدي portfolio.js يقرأ الرقم من الرابط (portfolio.html?id=3) بـ URLSearchParams، ويلاقي المبدع بـ find، ويعبّي الاسم والتخصص والمدينة والصورة بالصفحة. إذا ما في id أو مش موجود: رسالة «المبدع مش موجود» ورابط لـ explore.html.
وبـ portfolio.html: js/data.js قبل js/portfolio.js.`+ASK+`\n\nportfolio.html:\n(الصق هون)\n\nportfolio.js:\n(الصق هون)`},
 {t:"باقي الصور",d:"الصور الباقية روابط Stitch. نزّلوها على images وغيّروا الـ src."}
]},
{id:"it",name:"IT Team",state:"الصفحات والقائمة وزر اللغة شغالين. بس ملفات drinks.js و food.js و contact.js فاضية (0 بايت)، فالسلة والأحجام والنجوم ما بتشتغل. اليوم: نرجّع الـ JS.",tasks:[
 {must:1,t:"رجّعوا الـ JS من النسخة الاحتياطية",d:"من «ملفات فريقي» نزّلوا نسخة اليوم 3 (فيها javasc/mail.js و bbb.js).",p:`تحت 3 ملفات من موقعنا: mail.js (سلة المشروبات) و bbb.js (نجوم التقييم) من نسخة قديمة، و main.js الموجود هلأ وفيه كود قائمة الجوال (mobileMenuBtn) وزر اللغة (langToggle).
بدي:
1. js/drinks.js = نفس mail.js بالضبط، بس بدون كود قائمة الجوال وزر اللغة (لأنهم بـ main.js).
2. js/contact.js = نفس bbb.js بالضبط، بس بدون كود قائمة الجوال وزر اللغة.
ما تغيّر ولا سطر ثاني، ولا تلمس main.js.`+ASK+`\n\nmail.js:\n(الصق هون)\n\nbbb.js:\n(الصق هون)\n\nmain.js:\n(الصق هون)`},
 {must:1,t:"تأكدوا من ترتيب الـ scripts",d:"بـ drinks.html و food.html و contact.html: js/main.js بعدين ملف الصفحة، آخر الـ body."},
 {must:1,t:"food.js من جديد",d:"صفحة المأكولات ما إلها JS أبداً.",p:`هاد ملف food.html (صفحة المأكولات بموقع مطعمنا). فيها عناصر تفاعلية بس ما إلها JavaScript. اكتبلي js/food.js بـ JavaScript عادي بيشغّل:
1. أزرار الحجم بكل صنف: لما ينكبس زر بيصير active وبيتغيّر سعر نفس الصنف.
2. صينية الطلب: إضافة أصناف، والعدد، والمجموع، وزر التصفير، وزر التأكيد (رسالة بس، ما في سيرفر).
3. الإشعار (toast) لما ينضاف صنف.
4. نجوم التقييم إذا موجودة بالصفحة.
الشروط:
- استخدم الـ ids والـ classes والـ data-* الموجودة بالـ HTML بالضبط.
- إذا في ids مكررة بالصفحة، قلي وين واعطيني الأسطر المصلّحة بس.
- لا تكتب كود قائمة الجوال ولا زر اللغة (موجودين بـ main.js).
- الكود جوا DOMContentLoaded، وكل جزء بـ function لحاله فوقها تعليق عربي.
- إذا اشي مش واضح، اسألني قبل ما تكتب.
اعطيني food.js كامل.

food.html:
(الصق هون)`},
 {t:"المشروبات من بيانات JS",d:"بعد ما ترجع السلة تشتغل.",p:DATA("بطاقات المشروبات (.drink-card)","drinks","الاسم بالعربي والإنجليزي، الوصف، الأسعار، الصورة، والقسم (بارد أو ساخن)","drinks.js","شبكات .cards-grid (ضيف id لكل شبكة: cold-grid و hot-grid)",".drink-card","\n   وحافظ على data-ar و data-en عشان زر اللغة.\n   وبـ drinks.html الترتيب: js/main.js ثم js/data.js ثم js/drinks.js.")},
 {t:"الصور على الجهاز",d:"الصور روابط Stitch. نزّلوها على images وغيّروا الـ src."}
]},
{id:"tech",name:"تكنولوجيا",state:"موقعكم متقدم: 6 صفحات، بحث وفلترة ومقارنة، وصفحة تفاصيل لكل أداة بـ ?tool=. اليوم: تنظيف، والبيانات بـ JS، والـ animation.",tasks:[
 {must:1,t:"تنظيف المجلد",d:"احذفوا tool.html و js/tool.js و css/tool.css (القديمة) و noqta-ai.zip من جوا مجلد الموقع. صفحة التفاصيل الصح هي tool-details.html."},
 {must:1,t:"أسماء ملفات الـ JS بأحرف صغيرة",d:"غيّروا home.JS ← home.js، و category.JS ← category.js، و compare.JS ← compare.js، و about.JS ← about.js. وبعدين بكل صفحة غيّروا الـ src لنفس الاسم الجديد. على الإنترنت JS غير js."},
 {must:1,t:"عرض التصنيفات على الجوال",d:"category.html أعرض من شاشة الجوال.",p:OVER("category.html","category.css")},
 {t:"Animation للـ hero يتفاعل مع الماوس",d:"إنتو بتختاروا الفكرة. الـ prompt بيطلب من الـ AI 3 أفكار، وإنتو بتختاروا وحدة، وبعدين بينفذها. مسموح مكتبة من الإنترنت (CDN). الصقوا: قسم الـ hero من index.html، والـ head، وآخر الـ body (أسطر الـ script)، و home.css، و home.js.",p:`بدي animation للـ hero بالصفحة الرئيسية بموقعنا «نقطة AI» (دليل أدوات الذكاء الاصطناعي، ثيم داكن، عربي RTL)، **بيتفاعل مع حركة الماوس**.

أول شي: اقترحلي 3 أفكار مختلفة تناسب موقع عن الذكاء الاصطناعي، مثلاً:
- خلفية جزيئات أو نقاط متصلة بتتحرك وبتنجذب للماوس.
- توهج أو ضوء بيلحق الماوس.
- عناصر بتميل أو بتتحرك بعمق (parallax) مع الماوس.
لكل فكرة: وصف بجملتين، وهل بدها مكتبة (مثلاً tsParticles أو GSAP أو Vanta.js) ولا CSS و JS عادي، وقديش ثقيلة على الجهاز.
**استنى أنا أختار** قبل ما تكتب كود.

بعد ما أختار، نفّذها بهالشروط:
1. إذا في مكتبة: من CDN (رابط script بنسخة محددة)، وقلي بالضبط وين أحط السطر (بالـ head ولا آخر الـ body، وقبل أي ملف).
2. الـ CSS الجديد بـ home.css، والـ JS الجديد بـ home.js (أو ملف js/hero.js جديد إذا أرتب، وقلي وين أربطه).
3. الـ animation ورا محتوى الـ hero: العنوان ومربع البحث لازم يضلوا واضحين وقابلين للكبس.
4. على الجوال (ما في ماوس) يضل في حركة هادية لحالها، أو يكون أخف.
5. اللي مطفّي الحركة على جهازه (prefers-reduced-motion) ما يشوف حركة.
6. ما يخرب البحث ولا الفلترة ولا المقارنة اللي موجودين بـ home.js.
7. إذا لازم تعدّل بالـ HTML (class أو عنصر جديد)، قلي السطر بالضبط ووين.
اعطيني كل ملف بيتغيّر كامل بدون اختصار، كل واحد بـ code block وفوقه اسمه، واشرحلي بالعربي بـ 3 أسطر كيف الـ animation بيعرف وين الماوس.

قسم الـ hero من index.html:
(الصق هون، من <section class="container hero-section"> لآخرها)

الـ head من index.html:
(الصق هون)

آخر الـ body من index.html (أسطر الـ script):
(الصق هون)

home.css:
(الصق هون)

home.js:
(الصق هون)`},
 {t:"الأدوات من بيانات JS",d:"بطاقات الأدوات الـ 9 بالرئيسية مكتوبة بالـ HTML.",p:DATA("بطاقات الأدوات بالصفحة الرئيسية","tools","الاسم، الوصف، التصنيف (data-category)، لون --brand-glow، الأيقونة أو الصورة، السعر، رابط التفاصيل (tool-details.html?tool=...)، وأي معلومة ثانية بالبطاقة","home.js","#tools-grid","'.tool-card'","\n   وبـ index.html: js/data.js قبل js/home.js.")}
]},
{id:"afaq",name:"آفاق",state:"موقعكم شغال 100%: الاختبار والمكتبة والاقتراحات، والبيانات أصلاً بـ data.js. اليوم: صور، وصفحة «عن آفاق».",tasks:[
 {must:1,t:"افهموا الكود اللي عندكم",d:"عندكم بالضبط اللي رح ينشرح اليوم (data.js و loop و filter و localStorage). كل واحد لازم يقدر يشرحه بالعرض.",p:`هاد ملف library.js وملف data.js من موقعنا. اشرحلي سطر سطر بالعربي البسيط، كأني أول مرة بشوف JavaScript:
- وين بيمسك العناصر من الصفحة؟
- كيف الـ loop بيرسم بطاقة لكل كتاب؟
- كيف الفلترة بتشتغل؟
وبالآخر اسألني 3 أسئلة عشان أتأكد إني فهمت.

library.js:
(الصق هون)

data.js:
(الصق هون)`},
 {t:"أغلفة للكتب",d:"جيبوا صورة لكل كتاب وحطوها بـ images.",p:`عندي بـ js/data.js مصفوفة books، وبـ library.js function بترسم بطاقة لكل كتاب.
بدي أضيف لكل كتاب خاصية cover فيها مسار صورة (مثلاً "images/book-1.jpg")، والبطاقة تعرض الصورة فوق العنوان مع alt فيه اسم الكتاب. وإذا ما في صورة لكتاب، البطاقة تضل زي ما هي.
اعطيني التعديل على data.js (مثال لكتابين) والتعديل على library.js، وقلي وين بالضبط.

data.js:
(الصق هون)

library.js:
(الصق هون)`},
 {t:"صفحة «عن آفاق»",d:"خطتكم فيها صفحة «تواصل وعن آفاق».",p:`هاد ملف index.html وملف style.css من موقعنا «نادي القراء». بدي صفحة about.html بنفس الـ header والـ footer بالضبط، فيها: مين إحنا (فريق آفاق)، وفكرة الموقع، وطريقة تواصل (فورم بسيط بيطلّع رسالة شكر، ما في سيرفر).
استخدم الـ classes الموجودة بـ style.css. وضيف رابط about.html بالقائمة، وقلي وين أضيفه بباقي الصفحات.`+ASK+`\n\nindex.html:\n(الصق هون)\n\nstyle.css:\n(الصق هون)`}
]},
{id:"sun",name:"the sun",state:"تصميمكم قوي و 6 صفحات مربوطة. بس الأرقام مكتوبة ثابتة بالـ HTML (5,000 وأكتوبر 2025)، وما في حفظ أبداً. اليوم: نخلّي «وازن» أداة حقيقية.",tasks:[
 {must:1,t:"العملة",d:"بكل الصفحات: Ctrl+H ← بدّلوا ر.س بـ د.أ (Replace All)."},
 {must:1,t:"صفحة الإعداد بتحفظ",d:"manage.html: الدخل والبنود والأسقف بينحفظوا بـ localStorage.",p:`هاد manage.html و manage.js من موقعنا «وازن» (صفحة إعداد الميزانية). هلأ ولا اشي بينحفظ.
بدي manage.js يحفظ بـ localStorage تحت مفتاح اسمه wazen بهالشكل بالضبط:
{ income: رقم, categories: [ { name: نص, cap: رقم, spent: رقم } ] }
- أي تغيير بالدخل، أو بسقف بند، أو إضافة بند، أو حذفه: بينحفظ فوراً.
- لما الصفحة تفتح: إذا في بيانات محفوظة بتنعرض. وإذا ما في، بتستعمل الأرقام الموجودة هلأ بالصفحة كبداية.
- أزرار المبالغ السريعة (+500 و +1,000) وزر «استعادة المقترح» لازم يشتغلوا.
- العملة د.أ.
استخدم الـ ids والـ classes الموجودة. وأي سطر لازم يتغيّر بالـ HTML، قلي وينه.`+ASK+`\n\nmanage.html:\n(الصق هون)\n\nmanage.js:\n(الصق هون)`},
 {must:1,t:"لوحة التحكم بتقرأ",d:"dashboard.html: الأرقام والبطاقات من البيانات المحفوظة.",p:`هاد dashboard.html و dashboard.js من موقعنا «وازن». الأرقام بالصفحة مكتوبة ثابتة (5,000 و 3,280 وأكتوبر 2025).
بدي dashboard.js يقرأ البيانات من localStorage (المفتاح wazen، والشكل: { income, categories: [ { name, cap, spent } ] }) ويعرض منها:
1. الدخل، والمصروف (مجموع spent)، والمتبقي، والنسبة.
2. بطاقة لكل بند بـ loop، فيها الاسم والسقف والمصروف وشريط: أخضر تحت 80%، برتقالي من 80%، أحمر إذا تجاوز السقف.
3. اسم الشهر والأيام المتبقية من تاريخ اليوم بـ new Date.
4. زر «إضافة» مصروف: بيزيد spent للبند، وبيحفظ، وبترجع البطاقات تنرسم.
5. إذا ما في بيانات: رسالة «ابدأ من صفحة الإعداد» مع رابط manage.html.
العملة د.أ. استخدم نفس الـ classes الموجودة عشان الشكل يضل نفسه.`+ASK+`\n\ndashboard.html:\n(الصق هون)\n\ndashboard.js:\n(الصق هون)`},
 {t:"التقارير من نفس البيانات",d:"report.html نفس الفكرة: يقرأ wazen من localStorage بدل الأرقام الثابتة. استعملوا prompt لوحة التحكم وغيّروا اسم الصفحة والمطلوب."},
 {t:"صور حقيقية",d:"صور hero-1 و hero-2 و hero-3 placeholders. بدّلوها بصور حقيقية بنفس الأسماء بمجلد assets/images."}
]}
];
if (typeof module !== "undefined") process.stdout.write(JSON.stringify(teams));
