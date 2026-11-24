# ورقة تصليح: DSA (NOVA)

الهدف اليوم: الصفحات الست موقع واحد مربوط. إنتو أقرب فريق: كل الصفحات بمجلد واحد، وعندكم ملف CSS مشترك أصلاً (`main.css`). الناقص: أسماء ملفات، وروابط بتودي على `#` بدل الصفحات، وكود قائمة الجوال مكرر بـ 5 ملفات JS.

## خطوة 1: نسخة احتياطية

اعملوا zip لمجلد `web1` زي ما هو، وارفعوه على «ملفات فريقي».

## خطوة 2: الهيكل الجديد

```text
nova/
├── index.html
├── explore.html
├── portfolio.html
├── login.html
├── signup.html
├── dashboard.html
├── css/
│   ├── style.css       ← المشترك (كان main.css)
│   ├── explore.css     ← كان styleexplore.css
│   ├── portfolio.css, login.css, signup.css, dashboard.css
├── js/
│   ├── main.js         ← المشترك (قائمة الجوال)
│   ├── explore.js, portfolio.js, login.js, signup.js, dashboard.js
└── images/
```

## خطوة 3: غيّروا الأسماء

| الاسم هلأ | الاسم الجديد | ليش |
| --- | --- | --- |
| مجلد `web1` | `nova` | اسم بيعني اشي |
| `explore portfolios.html` | `explore.html` | المسافة بتخرب الرابط، والقائمة أصلاً بتدوّر على `explore.html` |
| `profiledetails.html` | `portfolio.html` | نفس اسم ملفاتها `portfolio.css` و `portfolio.js` |
| `css/main.css` | `css/style.css` | الاسم الموحد للملف المشترك |
| `css/styleexplore.css` | `css/explore.css` | نفس اسم الصفحة |

## خطوة 4: صلّحوا الأسلاك

استعملوا «بحث واستبدال» بالمحرر (Ctrl+H) بكل صفحة:

| وين | بدل | اكتبوا |
| --- | --- | --- |
| كل الصفحات الست | `css/main.css` | `css/style.css` |
| `explore.html` | `css/styleexplore.css` | `css/explore.css` |
| `portfolio.html` | `src="portfolio.js"` | `src="js/portfolio.js"` |
| `index.html` و `explore.html` | `href="#home"` | `href="index.html"` |
| `index.html` و `explore.html` | `href="#creatives"` | `href="explore.html"` |
| `index.html` و `explore.html` | `href="#login"` | `href="login.html"` |
| `index.html` و `explore.html` | `href="#signup"` | `href="signup.html"` |
| `index.html` و `explore.html` | أي رابط «View Portfolio» (مثل `#portfolio-layla` أو `#layla-portfolio`) | `href="portfolio.html"` |

**من الدخول للوحة التحكم:** هلأ ما في طريق لـ `dashboard.html`. اسألوا الـ AI:

```text
هاد ملف login.js تبع صفحة الدخول بموقعي. بعد ما تظهر رسالة النجاح، بدي الصفحة تنتقل لـ dashboard.html بعد ثانية وحدة.
ما في سيرفر، الدخول واجهة عرض بس.
اعطيني السطر الجديد بس، وقلي بالضبط بعد أي سطر أحطه، واشرحلي شو بيعمل بالعربي.

login.js:
(الصق هون)
```

**جرّبوا هلأ:** افتحوا `index.html` وتنقلوا بين كل الصفحات.

## خطوة 5: الـ CSS

المشترك عندكم جاهز (`style.css`)، وكل صفحة بتربطه قبل ملفها. ما في شغل هون، بس تأكدوا إن سطر `style.css` فوق سطر ملف الصفحة بكل صفحة.

## خطوة 6: الـ JS المشترك

كود قائمة الجوال موجود بـ `main.js`، ومكرر بأول `explore.js` و `portfolio.js` و `login.js` و `signup.js`.

**6أ.** بـ `explore.html` و `portfolio.html` و `login.html` و `signup.html`، ضيفوا هاد السطر **قبل** سطر ملف الصفحة:

```html
<script src="js/main.js"></script>
```

بـ `dashboard.html` لا تضيفوه، لأنها ما فيها قائمة جوال.

**6ب.** هلأ الكود المكرر رح يعمل خطأ (نفس الـ const مرتين). لكل ملف من الأربعة، انسخوا هاد الـ prompt. المثال لـ `explore.js`، وللباقي غيّروا الاسم بس:

```text
تحت ملفين من موقعي: main.js (مربوط بكل الصفحات) و explore.js (تبع صفحة الاستكشاف). الصفحة بتربط main.js وبعده explore.js.
explore.js فيه نسخة من كود قائمة الجوال اللي بـ main.js (menuToggle و mainNav وروابط .main-nav a). وجود const بنفس الاسم بملفين بيعمل خطأ وبيوقف كل الـ JS بالصفحة.
احذف من explore.js هاد الكود المكرر بس. لا تغيّر ولا سطر ثاني، ولا تلمس main.js.
اعطيني explore.js كامل بدون اختصار بـ code block واحد، وقلي بسطرين شو حذفت.

main.js:
(الصق هون)

explore.js:
(الصق هون)
```

بعد كل ملف: افتحوا الصفحة على عرض جوال (F12 ← أيقونة الجوال) وجربوا زر القائمة.

## خطوة 7: افحصوا

- [ ] القائمة بتودي على كل الصفحات، من كل صفحة.
- [ ] F12 ← Console: ما في أحمر بولا صفحة.
- [ ] البحث والفلترة بـ explore شغالين.
- [ ] الدخول بيودي على لوحة التحكم.
- [ ] zip جديد لمجلد `nova` على «ملفات فريقي».

## خطوة 8: تحسين

**المبدعين من بيانات JS.** انسخوا هاد الـ prompt:

```text
بدي أحوّل بطاقات المبدعين بصفحة الاستكشاف لبيانات بـ JavaScript. تحت شغلتين: الـ HTML تبع الشبكة (من <div ... id="creativeGrid"> لآخرها)، وملف explore.js.
المطلوب:
1. ملف js/data.js فيه مصفوفة اسمها creatives. كل بطاقة = object فيه id (رقم من 1) وكل المعلومات اللي بالبطاقة (الاسم، التخصص، المدينة، الصورة، وأي data-* موجودة). خد القيم من البطاقات بالضبط.
2. بأول explore.js، قبل سطر const creativeCards: function اسمها renderCreatives بترسم البطاقات جوا #creativeGrid من creatives بنفس الـ HTML والـ classes والـ data-* بالضبط، واناديها فوراً. هيك البحث والفلترة بيضلوا شغالين.
3. زر View Portfolio بكل بطاقة يودي على portfolio.html.
4. بالـ HTML: #creativeGrid يضل موجود بنفس الـ classes، بس فاضي.
5. لا تغيّر البحث ولا الفلترة.
اعطيني الملفات كاملة بدون اختصار، كل ملف بـ code block لحاله. وبالآخر اشرحلي بالعربي بـ 3 أسطر كيف الـ loop بيرسم بطاقة.

الـ HTML:
(الصق هون)

explore.js:
(الصق هون)
```

بـ `explore.html` الترتيب بآخر الـ body: `js/main.js` بعدين `js/data.js` بعدين `js/explore.js`.

**تحدي للسريعين:** صفحة portfolio تعرض المبدع اللي انكبس عليه (`portfolio.html?id=3`). اسألوا حسام قبل ما تبلشوا.

**الصور واللغة:** الصور روابط Stitch، نزّلوها على `images/`. وخطتكم بتحكي الموقع بالعربي، وهو هلأ إنجليزي: قرروا مع حسام.
