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

**5أ. الملف المشترك `style.css`:** افتحوا شات جديد، وارفقوا ملفات الـ CSS (`home.css` و `menu.css` و `workspace.css` و `about.css`)، وانسخوا هاد الـ prompt:

```text
مرفق 4 ملفات CSS من موقعنا CAFFEON: home.css و menu.css و workspace.css و about.css. كل ملف تبع صفحة، وكل واحد فيه :root خاص فيه بأسماء متغيرات متشابهة وألوان قريبة من بعض.
بهاد الرد بدي ملف style.css بس، وما بدي ملفات الصفحات هلأ.

1. :root واحد بس:
   - وحّد المتغيرات المتشابهة: إذا في متغيرين بيعملوا نفس الشغلة (لون أساسي، خلفية، نص، حدود...) حتى لو الاسم أو درجة اللون مختلفة شوي، خليهم متغير واحد باسم واضح، وقيمته من home.css.
   - الهدف 8 لـ 12 متغير بالكثير.
2. القواعد المشتركة كلها بـ style.css، مرة وحدة: * و *::before و *::after و html و body و a و img و button و ::-webkit-scrollbar، و .container و .main-content و .icon-sm و .icon-md، والـ header (.site-header و .header- و .brand- و .main-nav و .nav-link و .whatsapp- و .cart-btn و .cart-badge و .user-avatar)، والـ footer (.site-footer و .footer-)، و @media تبعهم.
   - إذا القاعدة مختلفة شوي بين الملفات: خد نسخة home.css. الاختلافات البسيطة بتنحذف.
   - كل var() جوا style.css لازم يستعمل الأسماء الجديدة بس.
3. بعد الملف اعطيني جدول «خريطة المتغيرات»: كل متغير قديم من كل ملف ← المتغير الجديد اللي صار مكانه. هاد الجدول رح نستعمله بالخطوات الجاية.

اعطيني style.css كامل بدون اختصار بـ code block واحد، وبعده الجدول.
```

حطوا الناتج بـ `css/style.css`. بعدين بالصفحات الأربع، ضيفوا هاد السطر **قبل** سطر ملف الصفحة:

```html
<link rel="stylesheet" href="css/style.css">
```

**5ب. ملفات الصفحات، وحدة وحدة (بنفس الشات):** انسخوا هاد الـ prompt لأول ملف:

```text
هلأ home.css. اعمله من home.css الأصلي اللي بعتتلك إياه، بهالشروط:
- ممنوع يكون فيه :root، ولا * ولا html ولا body ولا a ولا img ولا button ولا scrollbar، ولا أي قاعدة من القواعد المشتركة اللي حطيتها بـ style.css. هدول كلهم بـ style.css وبس، حتى لو القيم هون مختلفة شوي.
- كل var(--اسم-قديم) بدّله بالاسم الجديد حسب «خريطة المتغيرات».
- إذا في لون مكتوب مباشرة (مثل #00e5ff) وهو نفس أو قريب من متغير بالـ :root، بدّله بـ var() تبع المتغير.
- القواعد الخاصة بالصفحة خليها زي ما هي، وما تغيّر غير أسماء المتغيرات.
اعطيني home.css كامل بدون اختصار بـ code block واحد. وبالآخر سطر: «فحص: ما في :root ولا body ولا header ولا footer بهاد الملف».
```

وللملفات الباقية بنفس الشات (`menu.css`، بعدين `workspace.css`، بعدين `about.css`)، غيّروا الاسم بس:

```text
نفس الشي لـ menu.css.
```

بعد كل ملف: بدّلوه، وافتحوا الصفحة، وتأكدوا إن شكلها زي قبل (فرق بسيط بدرجة لون عادي). F12 ← Elements ← `<html>` ← Styles: لازم تشوفوا `:root` واحد بس، جاي من `style.css`. إذا اشي خرب، رجّعوا الملف القديم ونادوا حسام.

**5ج. صلّحوا الـ classes بالصفحات (بنفس الشات، صفحة صفحة):** ارفقوا الصفحة وملف الـ JS تبعها، وانسخوا:

```text
هلأ صار عندنا style.css وملف CSS لكل صفحة (اللي بعتتهم فوق). مرفق صفحة index.html وملف الـ JS تبعها home.js.
بدي تفحص كل class بالـ HTML:
- إذا الـ class موجود بـ style.css أو home.css: خليه زي ما هو.
- إذا مش موجود بولا ملف، وفي class موجود بيعمل نفس الشغلة (مثلاً زر أو بطاقة أو عنوان بنفس الشكل): بدّله بالموجود.
- إذا مش موجود وما في إشي مناسب: خليه زي ما هو، وحطه بالقائمة تحت.
- وإذا في style="..." بالـ HTML أو بالـ JS فيه var(--اسم-قديم): بدّل الاسم حسب «خريطة المتغيرات».
ممنوع:
- تغيّر أي class أو id مستعمل بملف الـ JS (querySelector أو getElementById أو classList)، حتى لو مش موجود بالـ CSS، لأنه الـ JS بيعتمد عليه.
- تغيّر النصوص أو الصور أو الروابط أو ترتيب العناصر.
- تعدّل ملفات الـ CSS.
اعطيني:
1. جدول: الـ class القديم ← الجديد، وبأي عنصر.
2. قائمة الـ classes اللي ما لقيتلها بديل.
3. إذا تغيّر إشي: index.html كامل بدون اختصار بـ code block واحد. وإذا ما تغيّر ولا إشي: لا تبعت الكود، اكتب بس «ما في تغيير على index.html».
```

وللصفحات الباقية بنفس الشات (`menu.html`، بعدين `workspace.html`، بعدين `about.html`):

```text
نفس الشي لـ menu.html، ومرفق menu.js.
```

إذا الـ AI حكى «ما في تغيير»، الصفحة بتضل زي ما هي. وإذا عطاكم كود: بدّلوا الصفحة، وافتحوها، وجربوا الميزات اللي فيها.

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
