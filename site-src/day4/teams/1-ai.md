# ورقة تصليح: AI (CAFFEON)

الهدف اليوم: الصفحات الأربع تصير موقع واحد، تنتقلوا بينهم بالقائمة، والفلترة والسلة يشتغلوا. الكود تبعكم موجود، بس الأسلاك مش مربوطة: مثلاً صفحة المنيو بتدوّر على `menu.js` والملف اسمه `js/main.js`، فالـ JS ولا مرة اشتغل.

## خطوة 1: نسخة احتياطية

اعملوا zip لمجلد `CAFFEON` زي ما هو، وارفعوه على «ملفات فريقي» بموقع الدورة. إذا اشي خرب، بترجعوا لهاي النسخة.

## خطوة 2: الهيكل الجديد

اعملوا مجلد جديد اسمه `caffeon` (أحرف صغيرة)، وجواه 3 مجلدات: `css` و `js` و `images`.

```text
caffeon/
├── index.html
├── menu.html
├── workspace.html
├── about.html
├── css/
│   ├── style.css      ← بيطلع بخطوة 5
│   ├── home.css
│   ├── menu.css
│   ├── workspace.css
│   └── about.css
├── js/
│   ├── home.js
│   ├── menu.js
│   ├── workspace.js
│   └── about.js
└── images/
```

## خطوة 3: انقلوا الملفات وغيّروا أسماءهم

| الملف هلأ | يروح لـ |
| --- | --- |
| `home/index.html` | `index.html` |
| `home/css/main.css` | `css/home.css` |
| `home/js/main.js` | `js/home.js` |
| `menu/indx.html` | `menu.html` |
| `menu/css/main.css` | `css/menu.css` |
| `menu/js/main.js` | `js/menu.js` |
| `workspace/index.html` | `workspace.html` |
| `workspace/css/main.css` | `css/workspace.css` |
| `workspace/js/main.js` | `js/workspace.js` |
| `about&contact/index.html` | `about.html` |
| `about&contact/css/main.css` | `css/about.css` |
| `about&contact/js/main.js` | `js/about.js` |

## خطوة 4: صلّحوا الأسلاك

افتحوا كل صفحة بالمحرر، وغيّروا هاي القيم بس:

| الصفحة | بدل | اكتبوا |
| --- | --- | --- |
| `index.html` | `href="css/main.css"` | `href="css/home.css"` |
| `index.html` | `src="script.js"` | `src="js/home.js"` |
| `menu.html` | `href="css/main.css"` | `href="css/menu.css"` |
| `menu.html` | `src="menu.js"` | `src="js/menu.js"` |
| `workspace.html` | `href="css/main.css"` | `href="css/workspace.css"` |
| `workspace.html` | `src="workspace.js"` | `src="js/workspace.js"` |
| `about.html` | `href="css/main.css"` | `href="css/about.css"` |
| `about.html` | `src="about.js"` | `src="js/about.js"` |

**القائمة (nav):** القائمة الصح موجودة بـ `about.html`. انسخوا الـ `<nav class="main-nav" ...>` كاملة من هناك (لحد `</nav>`)، والصقوها مكان الـ nav بالصفحات الثلاث الباقية. بعدين بكل صفحة انقلوا `active` للرابط تبع الصفحة نفسها.

**جرّبوا هلأ:** افتحوا `index.html`، وتنقلوا بين الصفحات الأربع. بالمنيو جربوا الفلترة و«أضف للسلة». هلأ الـ JS رح يشتغل لأول مرة.

## خطوة 5: طلّعوا الـ CSS المشترك

الـ header والـ footer والألوان مكررين بالملفات الأربعة. بنطلّعهم لملف واحد `style.css`.

> إذا الـ AI وقف بنص الملف، اكتبوا: «كمّل من وين وقفت». وإذا كتب «باقي الكود زي ما هو»، اكتبوا: «اعطيني الملف كامل بدون اختصار».

**5أ. من `home.css`:** انسخوا هاد الـ prompt، والصقوا تحته محتوى `css/home.css` كامل:

```text
بدي أرتب ملفات CSS لموقعي. الموقع فيه 4 صفحات، وكل صفحة إلها ملف CSS، والـ header والـ footer مكررين فيهم.
تحت ملف home.css تبع الصفحة الرئيسية. قسّمه لملفين:

1. style.css فيه القواعد المشتركة بس، وهي:
   - :root و *, *::before, *::after و html, body و a و img و button و ::-webkit-scrollbar
   - .container و .main-content و .icon-sm و .icon-md
   - كل قاعدة الـ selector تبعها بيبلش بـ: .site-header أو .header- أو .brand- أو .main-nav أو .nav-link أو .whatsapp- أو .cart-btn أو .cart-badge أو .user-avatar
   - كل قاعدة الـ selector تبعها بيبلش بـ: .site-footer أو .footer-
2. home.css فيه كل القواعد الباقية.

قواعد مهمة:
- انقل كل قاعدة زي ما هي حرف بحرف. لا تعدّل ولا تحذف ولا تضيف أي قيمة.
- إذا في @media فيها قواعد من النوعين، اعمل نفس الـ @media بالملفين، وكل قاعدة بملفها.
- اعطيني الملفين كاملين بدون اختصار، كل ملف بـ code block لحاله وفوقه اسمه.

home.css:
```

حطوا الناتج بـ `css/style.css` و `css/home.css`. بعدين بالصفحات الأربع، ضيفوا هاد السطر **قبل** سطر ملف الصفحة:

```html
<link rel="stylesheet" href="css/style.css">
```

افتحوا `index.html` وتأكدوا إن الشكل ما تغيّر.

**5ب. لكل صفحة باقية (menu بعدين workspace بعدين about):** انسخوا هاد الـ prompt، والصقوا الملفين مكان العلامات. المثال هون لـ menu، وللصفحات الثانية غيّروا الاسم بس:

```text
تحت ملفين من موقعي: style.css (المشترك بين كل الصفحات) و menu.css (تبع صفحة المنيو).
style.css بينربط بالصفحة قبل menu.css.
احذف من menu.css كل قاعدة موجودة بـ style.css بنفس الـ selector وبنفس الخصائص والقيم بالضبط.
إذا نفس الـ selector بس في أي قيمة مختلفة، خلّي القاعدة بـ menu.css زي ما هي.
لا تعدّل ولا تضيف أي اشي ثاني، ولا تلمس style.css.
اعطيني menu.css كامل بدون اختصار بـ code block واحد، وقلي بسطر كم قاعدة حذفت.

style.css:
(الصق style.css هون)

menu.css:
(الصق menu.css هون)
```

بعد كل صفحة: بدّلوا الملف، وافتحوا الصفحة، وتأكدوا إن شكلها زي قبل. إذا اشي خرب، رجّعوا الملف القديم ونادوا حسام.

## خطوة 6: الـ JS

كل صفحة عندكم إلها JS خاص فيها، وما في كود مكرر يستاهل ينقل. ما بنعمل `main.js` اليوم.

## خطوة 7: افحصوا

- [ ] كل صفحة بتفتح، والقائمة بتودي على الصفحات الأربع من كل صفحة.
- [ ] F12 ← Console: ما في اشي أحمر بولا صفحة.
- [ ] الفلترة والسلة بالمنيو شغالين.
- [ ] الشكل زي ما كان قبل خطوة 5.
- [ ] zip جديد لمجلد `caffeon` على «ملفات فريقي».

## خطوة 8: تحسين (بعد ما يخلص الفحص)

**المنيو من بيانات JS.** انسخوا هاد الـ prompt، والصقوا مكان العلامات:

```text
بدي أحوّل بطاقات المنيو لبيانات بـ JavaScript. تحت شغلتين: الـ HTML تبع شبكة المنيو (من <div id="menu-grid"> لآخرها)، وملف menu.js.
المطلوب:
1. ملف js/data.js فيه مصفوفة اسمها menuItems. كل بطاقة = object فيه: title, price, category, badge, description, meta, image. خد القيم من البطاقات الموجودة بالضبط.
2. بـ menu.js: function اسمها renderMenu بترسم البطاقات جوا #menu-grid من menuItems، بنفس الـ HTML والـ classes والـ data-* attributes بالضبط (data-category و data-add-title و data-add-price و data-add-cat).
3. renderMenu لازم تنادى أول سطر جوا DOMContentLoaded، قبل ما الكود يدوّر على .menu-card وأزرار الإضافة، عشان الفلترة والسلة يضلوا شغالين.
4. بالـ HTML: الـ <div id="menu-grid"> يضل موجود بنفس الـ class، بس فاضي.
5. لا تغيّر الفلترة ولا السلة.
اعطيني الملفات كاملة بدون اختصار، كل ملف بـ code block لحاله. وبالآخر اشرحلي بالعربي بـ 3 أسطر كيف الـ loop بيرسم بطاقة.

الـ HTML:
(الصق هون)

menu.js:
(الصق هون)
```

بـ `menu.html` ضيفوا `<script src="js/data.js"></script>` **قبل** سطر `js/menu.js`.

**الصور:** كل الصور هلأ روابط من Stitch. ابدأوا بصور المنيو: كبسة يمين على الصورة ← «حفظ الصورة باسم» ← مجلد `images` باسم إنجليزي مثل `latte.jpg`، وغيّروا الـ `src` لـ `images/latte.jpg`.
