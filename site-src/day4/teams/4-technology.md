# ورقة تصليح: تكنولوجيا (نقطة AI)

الهدف اليوم: الصفحات الأربع (الرئيسية، التصنيفات، المقارنة، عن الموقع) موقع واحد مربوط. المشكلة عندكم بالمسارات: كل صفحة بمجلد، والمسار مكتوب كأنه من برّا (`SH3/css/main3.css` من جوا `SH3` نفسه)، فولا ملف CSS أو JS مربوط. وكمان في أسطر بتدوّر على ملفات مش موجودة أصلاً (`style.css` و `script.js`).

## خطوة 1: نسخة احتياطية

اعملوا zip لمجلد `All folder` زي ما هو، وارفعوه على «ملفات فريقي».

## خطوة 2: الهيكل الجديد

```text
noqta-ai/
├── index.html
├── category.html
├── compare.html
├── about.html
├── tool.html        ← بعدين (خطوة 8)
├── css/
│   ├── style.css    ← المشترك (خطوة 5)
│   ├── home.css, category.css, compare.css, about.css
├── js/
│   ├── home.js, category.js, compare.js, about.js
└── images/
```

**مهم:** أسماء المجلدات والملفات كلها أحرف صغيرة: `js` مش `JS`، و `.js` مش `.JS`. على جهازكم بتمشي، بس يوم 5 لما ننشر بتخرب.

## خطوة 3: انقلوا الملفات وغيّروا أسماءهم

| الملف هلأ | يروح لـ |
| --- | --- |
| `index.html` | `index.html` (بضل مكانه) |
| `css/main.css` | `css/home.css` |
| `JS/main.JS` | `js/home.js` |
| `sh2/index2.html` | `category.html` |
| `sh2/css/main2.css` | `css/category.css` |
| `sh2/JS/main2.JS` | `js/category.js` |
| `SH3/index3.html` | `about.html` |
| `SH3/css/main3.css` | `css/about.css` |
| `SH3/JS/M.js` | `js/about.js` |
| `SH4/index4.html` | `compare.html` |
| `SH4/css/main4.css` | `css/compare.css` |
| `SH4/JS/main4.JS` | `js/compare.js` |
| `sh5/index5.html` | `tool.html` (لسا Tailwind، خطوة 8) |

## خطوة 4: صلّحوا الأسلاك

كل صفحة فيها سطرين CSS وسطرين JS. واحد منهم بيدوّر على ملف مش موجود: **احذفوه**. والثاني **صلّحوه**:

| الصفحة | احذفوا السطر اللي فيه | بدل | اكتبوا |
| --- | --- | --- | --- |
| `index.html` | `style.css` و `script.js` | `css/main.css` | `css/home.css` |
| `index.html` |  | `JS/main.JS` | `js/home.js` |
| `category.html` | `category.css` و `category.js` | `sh2/css/main2.css` | `css/category.css` |
| `category.html` |  | `sh2/JS/main2.JS` | `js/category.js` |
| `about.html` | `about.css` و `about.js` | `SH3/css/main3.css` | `css/about.css` |
| `about.html` |  | `SH3/JS/M.js` | `js/about.js` |
| `compare.html` | `compare.css` و `compare.js` | `SH4/css/main4.css` | `css/compare.css` |
| `compare.html` |  | `SH4/JS/main4.JS` | `js/compare.js` |

**القائمة (nav):** القائمة الصح بـ `compare.html` (فيها الرئيسية والتصنيفات والمقارنة وعن الموقع). انسخوا الـ `<nav class="main-nav" ...>` كاملة من هناك لحد `</nav>`، والصقوها مكان الـ nav بـ `index.html` و `category.html` و `about.html`.

**جرّبوا هلأ:** افتحوا `index.html` وتنقلوا بين الصفحات الأربع، وجربوا البحث والفلترة بالرئيسية.

## خطوة 5: طلّعوا الـ CSS المشترك

> إذا الـ AI وقف بنص الملف، اكتبوا: «كمّل من وين وقفت». وإذا كتب «باقي الكود زي ما هو»، اكتبوا: «اعطيني الملف كامل بدون اختصار».

**5أ. من `home.css`:** انسخوا هاد الـ prompt، والصقوا تحته محتوى `css/home.css` كامل:

```text
بدي أرتب ملفات CSS لموقعي. الموقع فيه 4 صفحات، وكل صفحة إلها ملف CSS، والـ header والـ footer والخلفية مكررين فيهم.
تحت ملف home.css تبع الصفحة الرئيسية. قسّمه لملفين:

1. style.css فيه القواعد المشتركة بس، وهي:
   - :root و * و body و a و ::-webkit-scrollbar
   - .container و .main-content
   - الخلفية: .bg-effects وكل قاعدة بتبلش بـ .orb، والـ @keyframes اللي بتستعملها
   - كل قاعدة الـ selector تبعها بيبلش بـ: .site-header أو .header- أو .logo- أو .main-nav أو .nav-link
   - كل قاعدة الـ selector تبعها بيبلش بـ: .site-footer أو .footer- أو .legal-links
2. home.css فيه كل القواعد الباقية.

قواعد مهمة:
- انقل كل قاعدة زي ما هي حرف بحرف. لا تعدّل ولا تحذف ولا تضيف أي قيمة.
- إذا في @media فيها قواعد من النوعين، اعمل نفس الـ @media بالملفين، وكل قاعدة بملفها.
- اعطيني الملفين كاملين بدون اختصار، كل ملف بـ code block لحاله وفوقه اسمه.

home.css:
```

حطوا الناتج بـ `css/style.css` و `css/home.css`. بعدين بالصفحات الأربع ضيفوا هاد السطر **قبل** سطر ملف الصفحة:

```html
<link rel="stylesheet" href="css/style.css">
```

**5ب. لـ `category.css` و `compare.css` و `about.css`:** انسخوا هاد الـ prompt. المثال لـ category، وللباقي غيّروا الاسم بس:

```text
تحت ملفين من موقعي: style.css (المشترك بين كل الصفحات) و category.css (تبع صفحة التصنيفات).
style.css بينربط بالصفحة قبل category.css.
احذف من category.css كل قاعدة موجودة بـ style.css بنفس الـ selector وبنفس الخصائص والقيم بالضبط.
إذا نفس الـ selector بس في أي قيمة مختلفة، خلّي القاعدة بـ category.css زي ما هي.
لا تعدّل ولا تضيف أي اشي ثاني، ولا تلمس style.css.
اعطيني category.css كامل بدون اختصار بـ code block واحد، وقلي بسطر كم قاعدة حذفت.

style.css:
(الصق style.css هون)

category.css:
(الصق category.css هون)
```

بعد كل صفحة: افتحوها وتأكدوا إن شكلها زي قبل.

**الـ JS:** كل صفحة إلها ميزات مختلفة، فما بنعمل `main.js` اليوم.

## خطوة 6: افحصوا

- [ ] القائمة بتودي على الصفحات الأربع، من كل صفحة.
- [ ] F12 ← Console: ما في أحمر بولا صفحة.
- [ ] البحث والفلترة والمقارنة شغالين.
- [ ] ما في ولا مجلد أو ملف فيه حرف كبير.
- [ ] zip جديد لمجلد `noqta-ai` على «ملفات فريقي».

## خطوة 7: تحسين: الأدوات من بيانات JS

انسخوا هاد الـ prompt:

```text
بدي أحوّل بطاقات الأدوات بالصفحة الرئيسية لبيانات بـ JavaScript. تحت شغلتين: الـ HTML تبع الشبكة (من <div class="tools-grid" id="tools-grid"> لآخرها)، وملف home.js.
المطلوب:
1. ملف js/data.js فيه مصفوفة اسمها tools. كل بطاقة = object فيه كل معلوماتها (الاسم، الوصف، التصنيف data-category، لون --brand-glow، الصورة، السعر، الرابط، وأي معلومة ثانية بالبطاقة). خد القيم من البطاقات بالضبط.
2. بـ home.js: function اسمها renderTools بترسم البطاقات جوا #tools-grid بنفس الـ HTML والـ classes والـ data-* والـ style بالضبط. لازم تنادى قبل سطر document.querySelectorAll('.tool-card')، عشان البحث والفلترة والمقارنة يضلوا شغالين.
3. بالـ HTML: #tools-grid يضل موجود بنفس الـ class، بس فاضي.
4. لا تغيّر البحث ولا الفلترة ولا المقارنة.
اعطيني الملفات كاملة بدون اختصار، كل ملف بـ code block لحاله. وبالآخر اشرحلي بالعربي بـ 3 أسطر كيف الـ loop بيرسم بطاقة.

الـ HTML:
(الصق هون)

home.js:
(الصق هون)
```

بـ `index.html` الترتيب بآخر الـ body: `js/data.js` بعدين `js/home.js`.

## خطوة 8: صفحة الأداة (آخر شي، إذا ضل وقت)

`tool.html` لسا مكتوبة بـ Tailwind، و Tailwind ممنوع. ما تربطوها بالقائمة قبل ما تخلص. انسخوا هاد الـ prompt، وارفقوا صورة شاشة صفحة ChatGPT من Stitch:

```text
هاي صورة تصميم صفحة تفاصيل أداة (ChatGPT) بموقعنا «نقطة AI». ابنيها بـ HTML و CSS عادي، بدون Tailwind وبدون أي مكتبة.
هاد ملف style.css المشترك عندنا (فيه الألوان والـ header والـ footer)، وتحته الـ header والـ footer من صفحة compare.html.
الشروط:
- استخدم نفس الـ header والـ footer بالضبط، ونفس المتغيرات والـ classes اللي بـ style.css.
- أي CSS جديد حطه بملف css/tool.css. الصفحة بتربط css/style.css وبعده css/tool.css.
- الصفحة عربي RTL.
- ابني الصفحة قسم قسم، وبعد كل قسم اشرح بسطر بالعربي شو عملت.
اعطيني tool.html و tool.css كاملين.

style.css:
(الصق هون)

الـ header والـ footer:
(الصق هون)
```

**الصور:** روابط Stitch، نزّلوها على `images/` وغيّروا الـ `src`.
