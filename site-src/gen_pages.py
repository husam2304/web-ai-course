import os
import os
HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.join(HERE, "..", "site")
NAV = [("index.html", "الرئيسية"), ("program.html", "البرنامج"), ("projects.html", "المشاريع"), ("trainer.html", "المدرب"), ("resources.html", "ملفات الدورة"), ("submit.html", "التسليم"), ("team-files.html", "ملفات فريقي"), ("contact.html", "تواصل")]
SITE = "دورة تطوير المواقع بمساعدة الذكاء الاصطناعي"

def page(fname, title, desc, css, main, scripts=()):
    nav = "\n".join(
        f'          <li><a href="{h}"{" class=\"active\"" if h == fname else ""}>{t}</a></li>' for h, t in NAV)
    flinks = "\n".join(f'        <li><a href="{h}">{t}</a></li>' for h, t in NAV)
    extra = "".join(f'\n  <script src="js/{s}" defer></script>' for s in scripts)
    return f'''<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>{title}</title>
  <meta name="description" content="{desc}">
  <link rel="icon" href="images/favicon.png">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Cairo:wght@600;700;800&family=Tajawal:wght@400;500;700&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="style.css">
  <link rel="stylesheet" href="css/{css}.css">
  <script src="js/main.js" defer></script>{extra}
</head>
<body>
  <!-- رأس الصفحة: نفسه بكل الصفحات -->
  <header class="site-header">
    <div class="container header-inner">
      <a href="index.html" class="logo">ويب <span>AI</span></a>
      <button class="menu-btn" aria-label="فتح القائمة" aria-expanded="false">☰</button>
      <nav class="main-nav">
        <ul>
{nav}
        </ul>
      </nav>
    </div>
  </header>

  <main>
{main}
  </main>

  <!-- ذيل الصفحة: نفسه بكل الصفحات -->
  <footer class="site-footer">
    <div class="container">
      <ul class="footer-links">
{flinks}
      </ul>
      <p>{SITE} · مؤسسة ولي العهد · 2026</p>
    </div>
  </footer>
</body>
</html>
'''

def inner_hero(h1, p):
    return f'''    <section class="page-hero">
      <div class="container">
        <h1>{h1}</h1>
        <p>{p}</p>
      </div>
    </section>
'''

# ---------- index ----------
learn = [
    ("🧭", "تخطيط الموقع", "تحليل الاحتياج، الجمهور، وخريطة الموقع قبل أي كود"),
    ("🎨", "تصميم الواجهة", "مبادئ UX/UI والألوان والخطوط، وتصميم كامل بـ Google Stitch"),
    ("🧱", "HTML وCSS", "هيكل الصفحة والتنسيق والتوافق مع الجوال"),
    ("⚡", "JavaScript", "المتغيرات والشروط والتكرار، وميزات تفاعلية حقيقية"),
    ("🤖", "العمل مع الـ AI", "prompts واضحة، وفهم الكود قبل ما تستعمله"),
    ("🚀", "الاختبار والنشر", "تلاقي الأخطاء وتصلحها، وتنشر موقعك برابط حقيقي"),
]
learn_html = "\n".join(f'''          <article class="learn-card">
            <span class="learn-icon" aria-hidden="true">{i}</span>
            <h3>{t}</h3>
            <p>{d}</p>
          </article>''' for i, t, d in learn)
days = [("1", "التخطيط", "وثيقة تخطيط المشروع"), ("2", "التصميم", "تصميم ملون لكل الصفحات"), ("3", "البناء", "موقع شغال على جهازك"), ("4", "الاختبار", "نسخة نهائية بدون أخطاء"), ("5", "النشر", "رابط حقيقي وعرض المشروع")]
days_html = "\n".join(f'''          <li class="journey-step">
            <span class="journey-num">{n}</span>
            <h3>اليوم {n}: {t}</h3>
            <p>{o}</p>
          </li>''' for n, t, o in days)
index_main = f'''    <!-- قسم الـ hero -->
    <section class="hero">
      <div class="container hero-inner">
        <div class="hero-text">
          <p class="hero-kicker">5 أيام · بدون خبرة سابقة</p>
          <h1 class="hero-title">ابنِ موقعك الأول بمساعدة الذكاء الاصطناعي</h1>
          <p class="hero-desc">من فكرة على ورقة لموقع حقيقي منشور على الإنترنت، خطوة بخطوة، وإنت فاهم كل سطر بموقعك.</p>
          <div class="hero-actions">
            <a href="projects.html" class="btn">شوف المشاريع</a>
            <a href="program.html" class="btn btn-outline">البرنامج</a>
          </div>
        </div>
      </div>
    </section>

    <!-- قسم: شو رح تتعلم -->
    <section class="section">
      <div class="container">
        <div class="section-title">
          <h2>شو رح تتعلم؟</h2>
          <p>كل مهارة بتتعلمها بتطبّقها مباشرة على مشروعك</p>
        </div>
        <div class="learn-grid">
{learn_html}
        </div>
      </div>
    </section>

    <!-- قسم: رحلة الأيام الخمسة -->
    <section class="section journey">
      <div class="container">
        <div class="section-title">
          <h2>رحلة الأيام الخمسة</h2>
          <p>كل يوم إله مخرج واضح</p>
        </div>
        <ol class="journey-list">
{days_html}
        </ol>
        <div class="journey-cta">
          <a href="program.html" class="btn">تفاصيل كل يوم</a>
        </div>
      </div>
    </section>
'''

# ---------- program ----------
prog = [
    ("1", "تحليل الاحتياج وتخطيط المشروع", "أنواع المواقع، الواجهة الأمامية والخلفية، أدوات الـ AI، كتابة prompts احترافية، وأول كود: بطاقة تعريف شخصية.", "وثيقة تخطيط + خريطة الموقع"),
    ("2", "تصميم الواجهة وتجربة المستخدم", "مبادئ UX/UI، الـ Wireframes، الألوان والخطوط، إمكانية الوصول، التصميم للجوال، والتصميم بـ Google Stitch.", "تصميم ملون معتمد لكل الصفحات"),
    ("3", "بناء الموقع", "HTML وCSS والمتغيرات، البناء قسم قسم بالـ AI، التوافق مع الجوال، أساسيات JavaScript والميزات التفاعلية، والعمل كفريق.", "موقع شغال على Live Server"),
    ("4", "الاختبار والإصلاح", "الـ Debugging بالـ AI، فحص Lighthouse، اختبار تبادلي بين الفرق، والتجهيز للنشر.", "نسخة نهائية جاهزة للنشر"),
    ("5", "النشر والعرض", "نشر الموقع على الإنترنت، تجربته على الجوال، ربطه ببطاقة التعريف، وعرض المشروع.", "رابط حقيقي + عرض المشروع"),
]
prog_html = "\n".join(f'''          <article class="day-card">
            <span class="day-num">اليوم {n}</span>
            <h3>{t}</h3>
            <p>{d}</p>
            <p class="day-output"><strong>المخرج:</strong> {o}</p>
          </article>''' for n, t, d, o in prog)
faq = [
    ("هل لازم يكون عندي خبرة برمجة؟", "لأ. الدورة مصممة للمبتدئين من خلفيات غير تقنية، وبنبلش من الصفر."),
    ("شو لازم أجيب معي؟", "لابتوب مشحون وشاحنه، وحساب على ChatGPT أو Claude. باقي الأدوات مجانية وبنجهزها مع بعض."),
    ("هل بشتغل لحالي ولا بفريق؟", "بفريق صغير. كل عضو بيبني صفحات على جهازه، وبتدمجوا الشغل آخر كل يوم."),
    ("شو بطلع معي آخر الدورة؟", "موقع منشور برابط حقيقي، مربوط ببطاقة تعريف شخصية، وبتقدر تشرح كل سطر فيه."),
    ("هل الموقع إله لوحة تحكم أو تسجيل دخول؟", "لأ. بنبني مواقع ثابتة بدون backend، وهاد بيخليها سريعة وسهلة النشر."),
]
faq_html = "\n".join(f'''          <div class="faq-item">
            <button class="faq-question" aria-expanded="false">{q}<span class="faq-icon" aria-hidden="true">+</span></button>
            <div class="faq-answer"><p>{a}</p></div>
          </div>''' for q, a in faq)
program_main = inner_hero("برنامج الدورة", "5 أيام، 4 ساعات كل يوم، شرح قصير وتطبيق مباشر") + f'''
    <!-- قسم: الأيام الخمسة -->
    <section class="section">
      <div class="container days-grid">
{prog_html}
      </div>
    </section>

    <!-- قسم: أسئلة شائعة (accordion) -->
    <section class="section faq">
      <div class="container narrow">
        <div class="section-title">
          <h2>أسئلة شائعة</h2>
          <p>اكبس على السؤال عشان يظهر الجواب</p>
        </div>
        <div class="faq-list">
{faq_html}
        </div>
      </div>
    </section>
'''

# ---------- projects ----------
types = [("all", "الكل"), ("store", "متجر"), ("restaurant", "مطعم وكافيه"), ("portfolio", "شخصي"), ("services", "خدمات"), ("education", "تعليمي")]
filters_html = "\n".join(f'          <button class="filter-btn{" active" if k == "all" else ""}" data-type="{k}">{t}</button>' for k, t in types)
projects_main = inner_hero("مشاريع المشاركين", "كل فريق بيبني موقع حقيقي، والروابط بتنضاف هون يوم النشر") + f'''
    <!-- قسم: الفلتر وبطاقات المشاريع -->
    <section class="section">
      <div class="container">
        <div class="filter-bar" id="filter-bar" role="group" aria-label="تصفية حسب نوع الموقع">
{filters_html}
        </div>
        <div class="projects-grid" id="projects-grid">
          <!-- البطاقات بتنبني من ملف js/projects.js -->
        </div>
        <p class="empty-msg" id="empty-msg" hidden>ما في مشاريع من هالنوع لسا.</p>

        <!-- بيظهر لما ما يكون في ولا مشروع بقائمة js/projects.js -->
        <div class="coming-soon" id="coming-soon" hidden>
          <span class="soon-icon" aria-hidden="true">🚀</span>
          <h2>قريباً</h2>
          <p>مشاريعكم رح تكون هون.</p>
          <p>يوم النشر، كل فريق بيضيف موقعه لهالصفحة برابط حقيقي بيقدر أي حدا يفتحه.</p>
        </div>
      </div>
    </section>
'''

# ---------- trainer ----------
trainer_main = inner_hero("المدرب", "مين رح يرافقك بالأيام الخمسة") + '''
    <!-- قسم: نبذة عن المدرب -->
    <section class="section">
      <div class="container trainer">
        <img class="trainer-photo" src="images/trainer-husam.jpg" alt="حسام عليان، مدرب الدورة" width="280" height="350">
        <div class="trainer-info">
          <h2>حسام عليان</h2>
          <p class="trainer-role">مطوّر Full-Stack · عمّان</p>
          <p>مطوّر بيبني منصات ومواقع ويب من الواجهة للسيرفر، بشتغل بـ ASP.NET Core وReact، وبستعمل أدوات الذكاء الاصطناعي بشغلي اليومي.</p>
          <p>بهالدورة هدفي مش بس إنك تطلع بموقع، هدفي إنك تفهم كيف انبنى، وتعرف تستعمل الـ AI كمساعد ذكي مش كبديل عن فهمك.</p>
          <ul class="skills">
            <li dir="ltr">HTML · CSS · JavaScript</li>
            <li dir="ltr">React · TypeScript</li>
            <li dir="ltr">.NET · ASP.NET Core</li>
            <li>الذكاء الاصطناعي بالتطوير</li>
          </ul>
          <a href="contact.html" class="btn">تواصل معي</a>
        </div>
      </div>
    </section>
'''

# ---------- contact ----------
contact_main = inner_hero("تواصل", "عندك سؤال أو ملاحظة على الدورة؟ ابعتلي") + '''
    <!-- قسم: نموذج التواصل -->
    <section class="section">
      <div class="container narrow">
        <!-- تواصل مباشر -->
        <a class="wa-card" href="https://wa.me/962780671815?text=%D9%85%D8%B1%D8%AD%D8%A8%D8%A7%20%D8%AD%D8%B3%D8%A7%D9%85%D8%8C%20%D8%A3%D9%86%D8%A7%20%D9%85%D9%86%20%D8%AF%D9%88%D8%B1%D8%A9%20%D8%AA%D8%B7%D9%88%D9%8A%D8%B1%20%D8%A7%D9%84%D9%85%D9%88%D8%A7%D9%82%D8%B9" target="_blank" rel="noopener">
          <span class="wa-icon" aria-hidden="true">
            <svg viewBox="0 0 32 32" width="30" height="30"><path fill="currentColor" d="M16 3a13 13 0 0 0-11.2 19.6L3 29l6.6-1.7A13 13 0 1 0 16 3zm0 23.6c-2 0-3.9-.5-5.6-1.5l-.4-.2-3.9 1 1-3.8-.3-.4A10.6 10.6 0 1 1 16 26.6zm5.8-7.9c-.3-.2-1.9-.9-2.2-1s-.5-.2-.7.2-.8 1-1 1.2-.4.2-.7.1a8.7 8.7 0 0 1-4.3-3.8c-.3-.6.3-.5.9-1.6.1-.2 0-.4 0-.5l-1-2.4c-.3-.6-.5-.5-.7-.5h-.6c-.2 0-.5.1-.8.4s-1 1-1 2.4 1 2.8 1.2 3c.1.2 2 3.1 4.9 4.3 1.8.8 2.5.8 3.4.7.6-.1 1.9-.8 2.1-1.5s.3-1.4.2-1.5-.3-.2-.6-.3z"/></svg>
          </span>
          <span class="wa-text">
            <strong>تواصل مباشر عالواتساب</strong>
            <span dir="ltr">0780 671 815</span>
          </span>
        </a>
        <p class="or-line"><span>أو ابعت رسالة من هون</span></p>

        <form class="contact-form" id="contact-form" novalidate>
          <div class="form-field">
            <label for="kind">نوع الرسالة</label>
            <select id="kind" name="kind">
              <option value="question">سؤال تقني</option>
              <option value="absence">غياب أو تأخير</option>
              <option value="feedback">ملاحظة على الدورة</option>
              <option value="other">غير هيك</option>
            </select>
          </div>
          <label class="anon"><input type="checkbox" id="anonymous"> ابعتها بدون اسم</label>
          <div id="who">
            <div class="form-field">
              <label for="name">الاسم</label>
              <input type="text" id="name" name="name" autocomplete="name">
              <p class="error-msg" id="name-error"></p>
            </div>
            <div class="form-field">
              <label for="team">الفريق <span class="optional">(اختياري)</span></label>
              <select id="team" name="team"><option value="">بدون</option></select>
            </div>
            <div class="form-field">
              <label for="phone">رقم الهاتف <span class="optional">(اختياري، إذا بدك أرد عليك عالواتساب)</span></label>
              <input type="tel" id="phone" name="phone" autocomplete="tel" dir="ltr" placeholder="07XXXXXXXX">
              <p class="error-msg" id="phone-error"></p>
            </div>
          </div>
          <div class="form-field">
            <label for="message">رسالتك</label>
            <textarea id="message" name="message" rows="5"></textarea>
            <p class="error-msg" id="message-error"></p>
          </div>
          <!-- حقل مخفي ضد البوتات -->
          <div class="hp" aria-hidden="true"><label>Website <input type="text" id="website" tabindex="-1" autocomplete="off"></label></div>
          <button type="submit" class="btn" id="contact-btn">إرسال</button>
          <p class="success-msg" id="success-msg" hidden>وصلت رسالتك، شكراً! 🌟</p>
          <p class="form-error" id="form-error" hidden></p>
        </form>
      </div>
    </section>
'''


submit_main = inner_hero("تسليم اليوم", "عبّي النموذج وارفع ملفاتك آخر كل يوم") + '''
    <section class="section">
      <div class="container narrow">
        <nav class="day-tabs" id="day-tabs" aria-label="اختار اليوم"></nav>
        <form class="submit-form" id="submit-form" novalidate>
          <h2 id="form-title"></h2>
          <div id="form-fields"></div>
          <!-- حقل مخفي ضد البوتات: الناس ما بيعبّوه -->
          <div class="hp" aria-hidden="true"><label>Website <input type="text" name="website" tabindex="-1" autocomplete="off"></label></div>
          <div class="progress" id="progress" hidden><div class="progress-bar" id="progress-bar"></div></div>
          <p class="form-msg" id="form-msg" hidden></p>
          <button type="submit" class="btn" id="submit-btn">تسليم</button>
        </form>
      </div>
    </section>
'''

admin_main = '''    <section class="page-hero">
      <div class="container">
        <h1>لوحة المدرب</h1>
        <p>التسليمات، الفرق والمتدربين، والتقييم اليومي</p>
      </div>
    </section>

    <section class="section">
      <div class="container">
        <!-- الدخول -->
        <form class="admin-login" id="login-form">
          <label for="admin-key">مفتاح الأدمن</label>
          <input type="password" id="admin-key" autocomplete="current-password" dir="ltr">
          <button type="submit" class="btn">دخول</button>
          <p class="error-msg" id="login-error"></p>
        </form>

        <!-- اللوحة -->
        <div id="dashboard" hidden>
          <div class="admin-bar">
            <nav class="view-tabs" id="view-tabs" aria-label="أقسام اللوحة">
              <button type="button" class="view-tab active" data-view="subs">التسليمات</button>
              <button type="button" class="view-tab" data-view="roster">الحضور والتقييم</button>
              <button type="button" class="view-tab" data-view="teams">الفرق والمتدربين</button>
              <button type="button" class="view-tab" data-view="messages">الرسائل <span class="tab-badge" id="msg-badge" hidden></span></button>
              <button type="button" class="view-tab" data-view="trash">المحذوفات</button>
            </nav>
            <button class="link-btn" id="logout-btn" type="button">خروج</button>
          </div>

          <nav class="day-tabs" id="day-tabs" aria-label="الأيام"></nav>

          <!-- 1) التسليمات -->
          <div class="view" id="view-subs">
            <div class="admin-actions">
              <input type="search" id="search" placeholder="بحث بالاسم أو الفريق">
              <button class="btn" id="upload-open" type="button">+ رفع ملف لمتدرب</button>
              <button class="btn btn-light" id="auto-link" type="button">ربط تلقائي</button>
            </div>
            <div class="admin-actions">
              <button class="btn btn-dark" id="export-day" type="button">Excel لهاليوم</button>
              <button class="btn btn-dark" id="export-all" type="button">Excel لكل الأيام + التقييم</button>
              <button class="btn btn-light" id="zip-day" type="button">كل ملفات اليوم ZIP</button>
            </div>
            <div class="merge-bar" id="merge-bar" hidden>
              <span id="merge-count"></span>
              <button class="btn" type="button" id="merge-open">دمج المحدد</button>
              <button class="link-btn" type="button" id="merge-clear">إلغاء التحديد</button>
            </div>
            <div class="report" id="link-report" hidden></div>
            <p class="admin-count" id="admin-count"></p>
            <div class="table-wrap">
              <table class="admin-table subs-table">
                <thead>
                  <tr><th>#</th><th>المتدرب</th><th>الفريق</th><th>تعديل</th><th>الملفات</th><th>الوقت</th><th>الإجابات</th></tr>
                </thead>
                <tbody id="rows"></tbody>
              </table>
            </div>
          </div>

          <!-- 2) الحضور والتقييم -->
          <div class="view" id="view-roster" hidden>
            <p class="admin-count" id="roster-count"></p>
            <div id="roster"></div>
          </div>

          <!-- 4) الرسائل -->
          <div class="view" id="view-messages" hidden>
            <div class="admin-actions">
              <select id="msg-filter" aria-label="فلترة الرسائل">
                <option value="all">كل الرسائل</option>
                <option value="new">الجديدة بس</option>
                <option value="replied">اللي انرد عليها</option>
              </select>
            </div>
            <div id="messages"></div>
          </div>

          <!-- 5) المحذوفات -->
          <div class="view" id="view-trash" hidden>
            <p class="muted">التسليمات والملفات المحذوفة أو المدموجة بتضل هون. بتقدر ترجّعها، أو تحذفها نهائياً (الحذف النهائي بيمسح الملف من السيرفر).</p>
            <div id="trash"></div>
          </div>

          <!-- 3) الفرق والمتدربين -->
          <div class="view" id="view-teams" hidden>
            <div class="admin-actions">
              <button class="btn btn-dark" id="print-tents" type="button">طباعة لافتات الفرق</button>
              <button class="btn btn-dark" id="print-codes" type="button">طباعة أكواد الملاحظات</button>
            </div>
            <p class="muted">كل متدرب إله كود من 4 أرقام، بيستخدمه بصفحة «ملفات فريقي» ليشوف ملاحظاته الشخصية. ملاحظات الفريق ما بدها كود.</p>
            <form class="inline-form" id="team-form">
              <input type="text" id="team-name" placeholder="اسم فريق جديد" maxlength="100" required>
              <button class="btn" type="submit">+ إضافة فريق</button>
            </form>
            <div class="teams-grid" id="teams"></div>
          </div>
        </div>
      </div>
    </section>

    <!-- ربط التسليم بالمتدربين -->
    <dialog class="modal" id="link-dialog">
      <form method="dialog" id="link-form">
        <h2 id="link-title">ربط التسليم</h2>
        <p class="muted" id="link-typed"></p>
        <div class="pick" id="link-pick"></div>
        <div class="modal-actions">
          <button class="btn" type="submit" value="save">حفظ</button>
          <button class="btn btn-light" type="submit" value="cancel" formnovalidate>إلغاء</button>
        </div>
      </form>
    </dialog>

    <!-- تعديل تسليم -->
    <dialog class="modal modal-wide" id="edit-dialog">
      <form method="dialog" id="edit-form">
        <h2 id="edit-title">تعديل التسليم</h2>
        <label class="label" for="edit-day">اليوم</label>
        <select id="edit-day" class="day-select"></select>
        <p class="label">الإجابات</p>
        <div id="edit-answers"></div>
        <div class="inline-form">
          <input type="text" id="edit-newkey" placeholder="اسم حقل جديد (مثلاً: خطة الفريق)" maxlength="100">
          <button type="button" class="btn btn-light" id="edit-addkey">+ حقل</button>
        </div>
        <p class="label">الملفات</p>
        <div id="edit-files"></div>
        <label class="label" for="edit-newfiles">إضافة ملفات (لحد 3 بالمرة)</label>
        <input type="file" id="edit-newfiles" multiple accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.webp,.zip">
        <p class="error-msg" id="edit-error"></p>
        <div class="modal-actions">
          <button class="btn" type="submit" value="save" id="edit-save">حفظ</button>
          <button class="btn btn-light" type="submit" value="cancel" formnovalidate>إلغاء</button>
        </div>
      </form>
    </dialog>

    <!-- دمج تسليمات -->
    <dialog class="modal modal-wide" id="merge-dialog">
      <form method="dialog" id="merge-form">
        <h2 id="merge-title">دمج التسليمات</h2>
        <p class="muted">لكل حقل اختار القيمة اللي بتنعتمد، أو عدّلها بإيدك. التسليمات الثانية بتروح للمحذوفات (بتقدر ترجعها).</p>
        <div class="merge-top">
          <label>بيضل رقم التسليم: <select id="merge-target"></select></label>
          <label>اليوم: <select id="merge-day" class="day-select"></select></label>
        </div>
        <div id="merge-fields"></div>
        <p class="label">الملفات اللي بتضل (اللي مش معلّم بروح للمحذوفات)</p>
        <div id="merge-files"></div>
        <p class="muted" id="merge-people"></p>
        <p class="error-msg" id="merge-error"></p>
        <div class="modal-actions">
          <button class="btn" type="submit" value="save" id="merge-save">دمج</button>
          <button class="btn btn-light" type="submit" value="cancel" formnovalidate>إلغاء</button>
        </div>
      </form>
    </dialog>

    <!-- الملاحظات على تسليم -->
    <dialog class="modal" id="fb-dialog">
      <form method="dialog" id="fb-form">
        <h2 id="fb-title">ملاحظات</h2>
        <div id="fb-existing"></div>
        <p class="label" id="fb-form-title">ملاحظة جديدة</p>
        <div class="fb-row" id="fb-target"></div>
        <div class="fb-row fb-kinds">
          <label class="kind good"><input type="radio" name="fb-kind" value="good"> ممتاز</label>
          <label class="kind improve"><input type="radio" name="fb-kind" value="improve" checked> تحسين</label>
          <label class="kind fix"><input type="radio" name="fb-kind" value="fix"> مطلوب تصليح</label>
        </div>
        <div class="fb-templates" id="fb-templates"></div>
        <textarea id="fb-text" rows="4" maxlength="2000" placeholder="اكتب الملاحظة..." dir="auto"></textarea>
        <button type="button" class="link-btn" id="fb-save-template">+ احفظها كملاحظة جاهزة</button>
        <p class="error-msg" id="fb-error"></p>
        <div class="modal-actions">
          <button class="btn" type="submit" value="save" id="fb-save">إضافة</button>
          <button class="btn btn-light" type="button" id="fb-cancel-edit" hidden>إلغاء التعديل</button>
          <button class="btn btn-light" type="submit" value="cancel" formnovalidate>إغلاق</button>
        </div>
      </form>
    </dialog>

    <!-- رفع ملف لمتدرب -->
    <dialog class="modal" id="upload-dialog">
      <form method="dialog" id="upload-form">
        <h2 id="upload-title">رفع ملف</h2>
        <p class="label">لمين الملف؟</p>
        <div class="pick" id="upload-pick"></div>
        <label class="label" for="upload-files">الملفات (لحد 3، كل واحد لحد 20MB)</label>
        <input type="file" id="upload-files" multiple accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.webp,.zip">
        <label class="label" for="upload-note">ملاحظة (اختياري)</label>
        <input type="text" id="upload-note" maxlength="500" placeholder="مثلاً: بعتها عالواتساب">
        <p class="error-msg" id="upload-error"></p>
        <div class="modal-actions">
          <button class="btn" type="submit" value="save" id="upload-save">رفع</button>
          <button class="btn btn-light" type="submit" value="cancel" formnovalidate>إلغاء</button>
        </div>
      </form>
    </dialog>
'''

team_files_main = inner_hero("ملفات فريقي", "اختار فريقك ونزّل آخر ملفات رفعتوها، من أي جهاز") + '''
    <section class="section">
      <div class="container narrow">
        <div class="tf-box">
          <label for="tf-team">فريقك</label>
          <select id="tf-team"><option value="">عم يتحمّل...</option></select>
          <p class="tf-msg" id="tf-msg" hidden></p>
        </div>
        <div id="tf-feedback"></div>
        <div class="tf-box tf-personal" id="tf-personal" hidden>
          <h2>ملاحظاتي الشخصية</h2>
          <p class="muted-s">اختار اسمك واكتب الكود اللي أعطاك ياه المدرب.</p>
          <form class="tf-code-form" id="tf-code-form">
            <select id="tf-me" aria-label="اسمك"></select>
            <input type="text" id="tf-code" inputmode="numeric" maxlength="6" placeholder="الكود" dir="ltr" autocomplete="off" aria-label="الكود">
            <button class="btn" type="submit">عرض</button>
          </form>
          <p class="tf-msg" id="tf-code-msg" hidden></p>
          <div id="tf-personal-list"></div>
        </div>
        <div id="tf-list"></div>
        <p class="tf-note">بدك ترفع ملف جديد؟ <a href="submit.html">صفحة التسليم</a></p>
      </div>
    </section>
'''
exec(open(os.path.join(HERE, "gen_resources.py"), encoding="utf-8").read())
PAGES = [
    ("admin.html", "لوحة المدرب | " + SITE, "لوحة المدرب.", "admin", admin_main, ("md.js", "admin.js")),
    ("team-files.html", "ملفات فريقي | " + SITE, "نزّل ملفات فريقك المرفوعة من أي جهاز.", "team-files", team_files_main, ("md.js", "team-files.js")),
    ("submit.html", "التسليم | " + SITE, "تسليم مخرجات كل يوم من أيام الدورة.", "submit", submit_main, ("submit.js",)),
    ("resources.html", "ملفات الدورة | " + SITE, "كل أكواد وprompts وقوالب الدورة، جاهزة للنسخ والتحميل.", "resources", resources_main, ("copy.js", "days.js")),
    ("index.html", f"{SITE}", "دورة 5 أيام للمبتدئين: خطط، صمم، ابنِ، اختبر وانشر موقعك الأول بمساعدة الذكاء الاصطناعي.", "index", index_main, ()),
    ("program.html", "البرنامج | " + SITE, "برنامج الأيام الخمسة: التخطيط، التصميم، البناء، الاختبار والنشر، مع مخرج واضح لكل يوم.", "program", program_main, ("accordion.js",)),
    ("projects.html", "المشاريع | " + SITE, "مشاريع فرق الدورة: مواقع حقيقية بناها المشاركين، مع تصفية حسب نوع الموقع.", "projects", projects_main, ("projects.js",)),
    ("trainer.html", "المدرب | " + SITE, "تعرّف على مدرب الدورة، مطوّر Full-Stack من عمّان.", "trainer", trainer_main, ()),
    ("contact.html", "تواصل | " + SITE, "تواصل معنا بخصوص دورة تطوير المواقع بمساعدة الذكاء الاصطناعي.", "contact", contact_main, ("form.js",)),
]
for fname, title, desc, css, main, scripts in PAGES:
    with open(os.path.join(ROOT, fname), "w", encoding="utf-8") as f:
        html = page(fname, title, desc, css, main, scripts)
        if fname == "admin.html":
            html = html.replace('<meta name="description"', '<meta name="robots" content="noindex, nofollow">\n  <meta name="description"', 1)
        f.write(html)
print("ok")
