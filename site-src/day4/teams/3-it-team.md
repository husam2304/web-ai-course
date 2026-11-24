# ورقة تصليح: IT Team

الهدف اليوم: 4 صفحات بموقع واحد (الرئيسية، المأكولات، المشروبات، التواصل). القائمة عندكم صح أصلاً، بس أسماء الملفات عشوائية (`bb.html` و `a.css` و `mail.js`)، والـ JS مش مربوط، وصفحة المأكولات ما إلها JS، والرئيسية مش موجودة. الموقع اللي بـ «الشغل الإضافي» بيضل لحاله، وما بندمجه.

## خطوة 1: نسخة احتياطية

اعملوا zip لمجلد `IT Team` زي ما هو، وارفعوه على «ملفات فريقي».

## خطوة 2: الهيكل الجديد

```text
it-team/
├── index.html      ← الرئيسية (جديدة، خطوة 5)
├── food.html
├── drinks.html
├── contact.html
├── css/
│   ├── style.css       ← المشترك (خطوة 6)
│   ├── home.css, food.css, drinks.css, contact.css
├── js/
│   ├── main.js         ← المشترك (خطوة 7)
│   ├── food.js, drinks.js, contact.js
└── images/
```

## خطوة 3: انقلوا الملفات وغيّروا أسماءهم

| الملف هلأ | يروح لـ | شو هو |
| --- | --- | --- |
| `index.html` | `drinks.html` | صفحة المشروبات |
| `css/main.css` | `css/drinks.css` |  |
| `javasc/mail.js` | `js/drinks.js` | السلة بالمشروبات |
| `about us/about.html` | `food.html` | صفحة المأكولات |
| `about us/a.css` | `css/food.css` |  |
| `3/bb.html` | `contact.html` | التقييم والموقع والتواصل |
| `3/b.css` | `css/contact.css` |  |
| `bbb.js` | `js/contact.js` | نجوم التقييم |
| `aa.js` | احذفوه | فاضي |

## خطوة 4: صلّحوا الأسلاك

| الصفحة | بدل | اكتبوا |
| --- | --- | --- |
| `drinks.html` | `href="css/main.css"` | `href="css/drinks.css"` |
| `drinks.html` | `src="drinks.js"` | `src="js/drinks.js"` |
| `food.html` | `href="a.css"` | `href="css/food.css"` |
| `food.html` | `src="food.js"` | `src="js/food.js"` |
| `contact.html` | `href="b.css"` | `href="css/contact.css"` |
| `contact.html` | `src="contact.js"` | `src="js/contact.js"` |

روابط القائمة عندكم صح (`index.html` و `food.html` و `drinks.html` و `contact.html`)، ما بدها تغيير.

**جرّبوا هلأ:** افتحوا `drinks.html` وجربوا السلة، و `contact.html` وجربوا النجوم.

## خطوة 5: الصفحة الرئيسية

انسخوا هاد الـ prompt، والصقوا تحته محتوى `drinks.html` كامل:

```text
هاد ملف drinks.html من موقع مطعمنا الإيطالي. بدي صفحة رئيسية index.html بنفس الـ header ونفس الـ footer بالضبط (انسخهم زي ما هم).
بالنص:
1. hero فيه اسم المطعم وجملة ترحيب.
2. 3 بطاقات: المأكولات (رابط food.html)، المشروبات (رابط drinks.html)، التقييم والتواصل (رابط contact.html).
3. قسم صغير «مين إحنا» عن فريق IT Team اللي عمل الموقع.
الشروط:
- استخدم الـ classes الموجودة قد ما بتقدر. أي CSS جديد حطه بملف css/home.css.
- الصفحة بتربط css/style.css وبعده css/home.css، وبآخر الـ body بتربط js/main.js بس.
- بدون JavaScript جوا الصفحة.
اعطيني index.html و home.css كاملين، كل واحد بـ code block لحاله.

drinks.html:
```

عادي إن الرئيسية تبين بدون تنسيق هلأ، وإن الـ Console يحكي إن `main.js` مش موجود: `style.css` بيطلع بخطوة 6، و `main.js` بخطوة 7.

## خطوة 6: طلّعوا الـ CSS المشترك

> إذا الـ AI وقف بنص الملف، اكتبوا: «كمّل من وين وقفت». وإذا كتب «باقي الكود زي ما هو»، اكتبوا: «اعطيني الملف كامل بدون اختصار».

**6أ. من `drinks.css`:** انسخوا هاد الـ prompt، والصقوا تحته محتوى `css/drinks.css` كامل:

```text
بدي أرتب ملفات CSS لموقعي. الموقع فيه 4 صفحات، وكل صفحة إلها ملف CSS، والـ header والـ footer مكررين فيهم.
تحت ملف drinks.css تبع صفحة المشروبات. قسّمه لملفين:

1. style.css فيه القواعد المشتركة بس، وهي:
   - :root و *, *::before, *::after و body و a و img و button
   - .material-symbols-outlined و .text-primary و .text-tertiary و .container و .main-content و .sep و .copyright
   - كل قاعدة الـ selector تبعها بيبلش بـ: .site-header أو .header- أو .brand- أو .main-nav أو .nav-link أو .phone-pill أو .mobile-menu-btn أو .lang-btn
   - كل قاعدة الـ selector تبعها بيبلش بـ: .site-footer أو .footer-
2. drinks.css فيه كل القواعد الباقية.

قواعد مهمة:
- انقل كل قاعدة زي ما هي حرف بحرف. لا تعدّل ولا تحذف ولا تضيف أي قيمة.
- إذا في @media فيها قواعد من النوعين، اعمل نفس الـ @media بالملفين، وكل قاعدة بملفها.
- اعطيني الملفين كاملين بدون اختصار، كل ملف بـ code block لحاله وفوقه اسمه.

drinks.css:
```

حطوا الناتج بـ `css/style.css` و `css/drinks.css`. بعدين بـ `food.html` و `drinks.html` و `contact.html` ضيفوا هاد السطر **قبل** سطر ملف الصفحة (`index.html` بتكون رابطته أصلاً):

```html
<link rel="stylesheet" href="css/style.css">
```

**6ب. لـ `food.css` وبعدين `contact.css`:** انسخوا هاد الـ prompt. المثال لـ food، ولـ contact غيّروا الاسم بس:

```text
تحت ملفين من موقعي: style.css (المشترك بين كل الصفحات) و food.css (تبع صفحة المأكولات).
style.css بينربط بالصفحة قبل food.css.
احذف من food.css كل قاعدة موجودة بـ style.css بنفس الـ selector وبنفس الخصائص والقيم بالضبط.
إذا نفس الـ selector بس في أي قيمة مختلفة، خلّي القاعدة بـ food.css زي ما هي.
لا تعدّل ولا تضيف أي اشي ثاني، ولا تلمس style.css.
اعطيني food.css كامل بدون اختصار بـ code block واحد، وقلي بسطر كم قاعدة حذفت.

style.css:
(الصق style.css هون)

food.css:
(الصق food.css هون)
```

بعد كل صفحة: افتحوها وتأكدوا إن شكلها زي قبل.

## خطوة 7: الـ JS المشترك وملف المأكولات

**7أ. `main.js`:** كود قائمة الجوال وزر اللغة مكرر بـ `drinks.js` و `contact.js`. انسخوا هاد الـ prompt:

```text
تحت ملفين من موقعي: drinks.js و contact.js. الاثنين فيهم نفس الكود لقائمة الجوال (mobileMenuBtn و mainNav) ولزر تبديل اللغة (langToggle).
بدي:
1. ملف جديد js/main.js فيه هاد الكود المشترك بس، مرة وحدة، جوا DOMContentLoaded. كل جزء بيتأكد إن العنصر موجود قبل ما يستخدمه (if)، لأن main.js رح ينربط بكل الصفحات.
2. drinks.js و contact.js بدون هاد الكود. باقي الكود ما بيتغير ولا سطر.
مهم: لو ضل الكود مكرر، زر القائمة رح يفتح ويسكّر بنفس الكبسة.
اعطيني الملفات الثلاثة كاملة بدون اختصار، كل واحد بـ code block لحاله.

drinks.js:
(الصق هون)

contact.js:
(الصق هون)
```

بكل الصفحات الأربع، ضيفوا `<script src="js/main.js"></script>` **قبل** سطر ملف الصفحة.

**7ب. `food.js`:** صفحة المأكولات فيها أزرار بس ما إلها ملف JS. انسخوا هاد الـ prompt، والصقوا تحته `food.html` كامل:

```text
هاد ملف food.html (صفحة المأكولات بموقع مطعمنا). فيها عناصر تفاعلية بس ما إلها JavaScript. اكتبلي js/food.js بـ JavaScript عادي بيشغّل:
1. أزرار الحجم (.size-pill) بكل صنف: لما ينكبس زر، بيصير active وبيتغيّر سعر نفس الصنف (العناصر اللي الـ id تبعها بيبلش بـ price-).
2. صينية الطلب: إضافة أصناف، والعدد بـ #trayCount، والمجموع بـ #trayTotal، والصينية نفسها #stickyOrderTray، وزر التصفير #resetOrderBtn، وزر التأكيد #confirmOrderBtn (رسالة بس، ما في سيرفر).
3. الإشعار #toastNotification مع النص #toastText.
4. النجوم #starRatingRow والرد #ratingFeedback و #ratingThankTitle.
الشروط:
- استخدم الـ ids والـ classes والـ data-* الموجودة بالـ HTML بالضبط.
- في ids مكررة مرتين بالصفحة (مثل price-margherita). قلي وين، واعطيني الأسطر المصلّحة بس.
- لا تكتب كود قائمة الجوال ولا زر اللغة، موجودين بـ main.js.
- الكود جوا DOMContentLoaded، وكل جزء بـ function لحاله فوقها تعليق عربي بسطر.
- إذا اشي مش واضح كيف لازم يشتغل، اسألني قبل ما تكتب.
اعطيني food.js كامل.

food.html:
```

## خطوة 8: افحصوا

- [ ] القائمة بتودي على الصفحات الأربع، من كل صفحة.
- [ ] F12 ← Console: ما في أحمر بولا صفحة.
- [ ] زر القائمة عالجوال وزر اللغة شغالين بكل الصفحات.
- [ ] السلة (مشروبات)، والأحجام والصينية (مأكولات)، والنجوم (تواصل) شغالين.
- [ ] zip جديد لمجلد `it-team` على «ملفات فريقي».

## خطوة 9: تحسين

**المشروبات من بيانات JS.** انسخوا هاد الـ prompt:

```text
بدي أحوّل بطاقات المشروبات (.drink-card) لبيانات بـ JavaScript. تحت شغلتين: drinks.html و drinks.js.
المطلوب:
1. ملف js/data.js فيه مصفوفة اسمها drinks. كل بطاقة = object فيه كل معلوماتها (الاسم بالعربي والإنجليزي، الوصف، الأسعار، الصورة، والقسم: بارد أو ساخن). خد القيم من البطاقات بالضبط.
2. كل قسم إله شبكة .cards-grid. ضيف id لكل شبكة (cold-grid و hot-grid).
3. بـ drinks.js: function اسمها renderDrinks بترسم كل مشروب بشبكة قسمه بنفس الـ HTML والـ classes والـ data-* بالضبط (بما فيها data-ar و data-en). بتنادى أول سطر جوا DOMContentLoaded، قبل ما الكود يدوّر على .drink-card.
4. لا تغيّر السلة ولا الفلترة.
اعطيني الملفات كاملة بدون اختصار، كل ملف بـ code block لحاله. وبالآخر اشرحلي بالعربي بـ 3 أسطر كيف الـ loop بيرسم بطاقة.

drinks.html:
(الصق هون)

drinks.js:
(الصق هون)
```

بـ `drinks.html` الترتيب بآخر الـ body: `js/main.js` بعدين `js/data.js` بعدين `js/drinks.js`.

**الصور:** روابط Stitch، نزّلوها على `images/` وغيّروا الـ `src`.
