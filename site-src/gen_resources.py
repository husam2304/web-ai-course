# Builds the resources page content (Day 1) and appends it to gen_pages PAGES
import html, os, shutil, subprocess, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import day4_build

KIT = os.path.join(HERE, "..", "day1-kit")
code = open(os.path.join(HERE, "day1_code.txt"), encoding="utf-8").read().split("\n=====\n")
card_code = code[0].strip()
esc = lambda s: html.escape(s, quote=False)

def copy_block(title, text, note="", bid=""):
    return f'''          <div class="code-block">
            <div class="code-head">
              <span>{title}</span>
              <button class="copy-btn" data-target="{bid}">نسخ</button>
            </div>
            <pre id="{bid}" dir="auto">{esc(text)}</pre>
          </div>''' + (f'\n          <p class="note">{note}</p>' if note else "")

prompts = [
    ("p-card", "① تعديل البطاقة", "الدورة 3: أول صفحة ويب", code[1].strip(),
     "أفكار: غيّر لون الزر · غيّر رسالة الترحيب · أضف سطر «مدينتي: ...» · اسأله شو بيعمل border-radius. واطلب تعديل محدد، مش الملف كله."),
    ("p-audience", "② الجمهور والأهداف", "الدورة 5: فن الـ Prompt", code[2].strip(),
     "جاوبوا على أسئلة الـ AI سؤال سؤال، واكتبوا النتيجة بأول قسمين من وثيقة المتطلبات."),
    ("p-pages", "③ الصفحات والأقسام", "الدورة 6: تخطيط الموقع", code[3].strip(),
     "المجموع من 3 لـ 6 صفحات. احذفوا أي قسم ما بيخدم الهدف."),
    ("p-priority", "④ الأولويات", "الدورة 6: تخطيط الموقع", code[4].strip(),
     "اختاروا ميزتين تفاعليتين على الأقل بـ «ضروري». تسجيل الدخول والدفع بيروحوا لـ «لاحقاً»."),
]
prompts_html = "\n".join(f'''        <article class="res-card">
          <p class="res-when">{when}</p>
          <h3>{t}</h3>
{copy_block("Prompt", txt, note, bid)}
        </article>''' for bid, t, when, txt, note in prompts)

template_rows = [("الدور", "مين بدك الـ AI يكون؟", "«أنت مطور مواقع بتساعد مبتدئ»"),
    ("السياق", "الفكرة والجمهور", "«مخبز عائلي صغير في عمّان، زبائنه العائلات بالحي»"),
    ("المطلوب", "شو بدك بالضبط، بجملة واضحة", "«اعملي الصفحة الرئيسية فيها عنوان وصور 3 منتجات وزر اطلب الآن»"),
    ("الشكل", "الألوان، الخط، الترتيب", "«ألوان دافئة، والزر واضح فوق»"),
    ("القيود", "الحدود اللي لازم يلتزم فيها", "«بالعربي، مناسب للجوال، بدون تسجيل دخول»"),
    ("النتيجة", "شو بدك يرجعلك", "«كود كامل» أو «تعديل محدد بس» أو «شرح بجملتين»")]
template_html = "\n".join(f'''            <tr><th scope="row">{a}</th><td>{b}</td><td class="ex">{c}</td></tr>''' for a, b, c in template_rows)

ideas = []
for block in open(f"{KIT}/whatsapp/04-بنك-الأفكار.txt", encoding="utf-8").read().split("\n\n")[1:]:
    lines = [l.strip() for l in block.strip().splitlines()]
    if len(lines) == 3 and lines[0][0].isdigit():
        head = lines[0].split(". ", 1)[1]
        name, typ = head.rsplit(" (", 1)
        ideas.append((name, typ.rstrip(")"), lines[1].replace("الصفحات: ", ""), lines[2].replace("الميزات: ", "")))
ideas_html = "\n".join(f'''          <article class="idea-card">
            <span class="idea-num">{i}</span>
            <h3>{n}</h3>
            <p class="idea-type">{t}</p>
            <p><strong>الصفحات:</strong> {p}</p>
            <p><strong>الميزات:</strong> {f}</p>
          </article>''' for i, (n, t, p, f) in enumerate(ideas, 1))

req_text = """وثيقة متطلبات المشروع
رقم الفريق:
أسماء الأعضاء:
اسم المشروع:

1. الفكرة (شو الموقع ونوعه):

2. الجمهور (فئة وحدة محددة، وليش بيزوروا الموقع):

3. الأهداف (هدفين أو ثلاثة):

4. الإجراء الرئيسي (CTA):

5. الصفحات والأقسام (من 3 لـ 6 صفحات):
   - الرئيسية:
   - صفحة ثانية:
   - (صفحات إضافية حسب الفكرة):
   - تواصل معنا:

6. الميزات والأولويات:
   ضروري:
   مهم:
   لاحقاً:

7. الميزتين التفاعليتين:
   1.
   2.

8. خريطة الموقع والرسم الأولي: (صور مرفقة)"""

tools = [("Google Chrome", "https://www.google.com/chrome/", "المتصفح"),
         ("VS Code", "https://code.visualstudio.com/", "محرر الكود"),
         ("ChatGPT", "https://chatgpt.com/", "أداة AI"),
         ("Claude", "https://claude.ai/", "أداة AI"),
         ("Gemini", "https://gemini.google.com/", "أداة AI")]
tools_html = "\n".join(f'            <a class="tool-link" href="{u}" target="_blank" rel="noopener"><strong>{n}</strong><span>{d}</span></a>' for n, u, d in tools)

plan_prompt = """أنا بفريق ببني موقع بسيط (Frontend فقط، بدون Backend) بدورة للمبتدئين.
هاي فكرتنا وتقرير الجمهور والأهداف اللي طلع معنا امبارح:
[الصق التقرير هون، أو اكتب الفكرة بجملتين إذا ما عندكم تقرير]

عبّيلي «خطة الفريق» بالعربي، بنقاط قصيرة، وبهالترتيب:
1. الفكرة بجملة وحدة.
2. الجمهور (فئة وحدة محددة، مش «كل الناس») و3 أهداف للموقع.
3. الإجراء الرئيسي: الزر الأهم بالموقع.
4. الصفحات: من 3 لـ 6 صفحات، ولكل صفحة أقسامها بالترتيب.
5. ضروري ولاحقاً: شو بيدخل بالنسخة الأولى، وشو بيتأجل.
6. ميزتين تفاعليتين على الأقل بـ JavaScript. أي ميزة بدها Backend (تسجيل دخول، حجز، دفع، حفظ تقييمات) اكتب جنبها «واجهة عرض فقط».
7. خريطة الموقع كشجرة نصية.
8. الإحساس العام للتصميم: 3 كلمات بتوصف الأسلوب (مثلاً: هادئ، عصري، دافئ) واقتراح ألوان.

قبل ما تكتب: إذا في شي ناقص أو مش واضح، اسألني 3 أسئلة بالكثير."""

plan_template = """خطة الفريق
اسم الفريق: ............

1. الفكرة بجملة:
2. الجمهور: ............
   الأهداف: (1) ............ (2) ............ (3) ............
3. الإجراء الرئيسي (الزر الأهم):
4. الصفحات (3 لـ 6) وأقسام كل صفحة:
   - الرئيسية: ............
   - ............: ............
   - ............: ............
5. ضروري (النسخة الأولى): ............
   لاحقاً: ............
6. الميزات التفاعلية (اثنتين على الأقل):
   - ............
   - ............
   واجهة عرض فقط (بدها Backend): ............
7. خريطة الموقع:
   الرئيسية
   ├── ............
   └── ............
8. الإحساس العام للتصميم: ............ (3 كلمات + ألوان مقترحة)"""

stitch_prompt = """أنا بدي أصمم موقع باستخدام Google Stitch.
اكتبلي prompt بالإنجليزي لـ Stitch بناءً على هاي المعلومات:
- الفكرة والجمهور والإجراء الرئيسي: [من خطة الفريق]
- الصفحات وأقسام كل صفحة بالترتيب: [من الـ wireframes]
- الميزات التفاعلية ومكانها: [الميزتين أو أكثر]
- دليل التصميم: الألوان [HEX]، الخطوط [أسماء الخطوط]، شكل الزر [الوصف]
- قواعد الوصول: تباين ناجح، كل حقل إله عنوان ظاهر، نص الأزرار واضح
الموقع لازم يكون كل نصوصه بالعربي، واتجاهه من اليمين لليسار (RTL)، ومتوافق مع الجوال، وكل الصفحات بنفس الـ Header والـ Footer.
اطلب تصميم كل صفحة كشاشة Desktop منفصلة.
خلي الـ prompt واضح ومرتب بنقاط."""

stitch_fixes = """Make the CTA button bigger and use the accent color.
Use the same header and footer on all pages.
All text must be in Arabic, right-to-left.
Show the mobile version of the home page with a hamburger menu."""

tools2 = [("Google Stitch", "https://stitch.withgoogle.com/", "التصميم"),
          ("WebAIM Contrast", "https://webaim.org/resources/contrastchecker/", "فحص التباين"),
          ("Google Fonts", "https://fonts.google.com/?subset=arabic", "خطوط عربية"),
          ("Laws of UX", "https://lawsofux.com/", "مبادئ UX")]
tools2_html = "\n".join(f'            <a class="tool-link" href="{u}" target="_blank" rel="noopener"><strong>{n}</strong><span>{d}</span></a>' for n, u, d in tools2)

# ---------- Day 3 (cards locked until the trainer opens them from the admin page) ----------
d3 = open(os.path.join(HERE, "day3_content.txt"), encoding="utf-8").read().split("\n=====\n")
d3_tree = d3[0].rstrip("\n")
d3_prompts = [
    ("d3-p1", "Prompt 1: الهيكل", "أول prompt، مع إرفاق DESIGN.md أو صورة الرئيسية", d3[1].strip()),
    ("d3-p2", "Prompt 2: بناء صفحة من الصفر", "لكل صفحة، مع إرفاق صورة الشاشة", d3[2].strip()),
    ("d3-p3", "Prompt 3: ميزة JavaScript خطوة خطوة", "لكل ميزة", d3[3].strip()),
    ("d3-p4", "Prompt 4: اشرحلي", "بعد كل ميزة، وقبل سؤال الفهم", d3[4].strip()),
    ("d3-p5", "Prompt 5: تصليح خطأ", "لما ميزة ما تشتغل", d3[5].strip()),
    ("d3-p6", "Prompt 6: موقع بلغتين", "للفرق اللي بدها تبديل لغة", d3[6].strip()),
]
d3_rules = ["كود Stitch ممنوع: بناخد منه صورة الشاشة و DESIGN.md بس.",
    "بدون Tailwind: CSS عادي بملف style.css.",
    "أي سطر بالموقع، أي حدا بالفريق لازم يقدر يشرحه.",
    "الفريق على جهاز واحد، و zip كل ساعة على «ملفات فريقي»."]
d3_check = ["كل روابط الـ nav شغالة، من كل صفحة.",
    "الـ Console نظيف (بدون أحمر) بكل صفحة.",
    "الصور كلها محلية بمجلد images/.",
    "ميزة JS وحدة على الأقل شغالة (غير الـ hamburger).",
    "الـ zip فيه المجلد كامل، مش index.html لحاله."]

def locked(key, title, when, body, extra_cls=""):
    """A card that stays hidden (class is-locked) until /api/unlocks lists its key."""
    return f'''        <article class="res-card is-locked{extra_cls}" id="{key}" data-lock="{key}" data-lock-title="{esc(title)}">
          <p class="res-when">{when}</p>
          <h3>{title}</h3>
          <div class="lock-body">
{body}
          </div>
        </article>'''

d3_rules_html = locked("d3-rules", "قواعد اليوم", "أول اليوم",
    '          <ul class="steps">\n' + "\n".join(f"            <li>{esc(r)}</li>" for r in d3_rules) + "\n          </ul>\n"
    '          <a class="btn btn-light" href="submit.html#backup">ارفع نسخة احتياطية (zip)</a>')
d3_tree_html = locked("d3-tree", "هيكل المجلدات", "مع Prompt 1",
    copy_block("project/", d3_tree, "", "d3-tree-code").replace('<pre id="d3-tree-code" dir="auto">', '<pre id="d3-tree-code" dir="ltr">'))
d3_prompts_html = "\n".join(locked(k, t, w, copy_block("Prompt", txt, "", k + "-text")) for k, t, w, txt in d3_prompts)
d3_check_html = locked("d3-check", "الفحص آخر اليوم (checklist)", "قبل التسليم",
    '          <ul class="checklist">\n' + "\n".join(f'            <li><label><input type="checkbox"> {esc(c)}</label></li>' for c in d3_check) + "\n          </ul>\n"
    '          <a class="btn" href="submit.html">صفحة التسليم</a>')

day3_panel = f'''
        <div class="day-panel" data-day="3">
        <h2 class="day-title" id="day3">اليوم الثالث: البناء بـ HTML و CSS و JavaScript</h2>
        <p class="block-sub">البطاقات بتنفتح وحدة وحدة لما نوصلها بالشرح. الصفحة بتتحدّث لحالها.</p>
        <ol class="toc">
          <li><a href="#d3-rules">قواعد اليوم</a></li>
          <li><a href="#d3-tree">هيكل المجلدات</a></li>
          <li><a href="#d3-prompts">الـ Prompts الست</a></li>
          <li><a href="#d3-check">الفحص آخر اليوم</a></li>
        </ol>
{d3_rules_html}
{d3_tree_html}
        <h2 class="block-title" id="d3-prompts">الـ Prompts الست</h2>
        <p class="block-sub">اكبس «نسخ»، الصق بالمحادثة، وعبّي اللي بين [ ] بس.</p>
        <div class="prompts-grid">
{d3_prompts_html}
        </div>
{d3_check_html}
        </div>
'''

days_nav = '''        <nav class="day-tabs" aria-label="أيام الدورة">
          <a href="#day1" class="day-tab" data-day="1">اليوم 1</a>
          <a href="#day2" class="day-tab" data-day="2">اليوم 2</a>
          <a href="#day3" class="day-tab" data-day="3">اليوم 3</a>
          <a href="#day4" class="day-tab active" data-day="4">اليوم 4</a>
          <span class="day-tab soon">اليوم 5 · قريباً</span>
        </nav>'''

resources_main = '''    <section class="page-hero">
      <div class="container">
        <h1>ملفات الدورة</h1>
        <p>كل الأكواد والـ prompts والقوالب، جاهزة للنسخ والتحميل</p>
      </div>
    </section>

    <section class="section">
      <div class="container">
''' + days_nav + f'''

        <div class="alert">
          <strong>شغّال على جهاز القاعة؟</strong>
          آخر اليوم ابعت مجلد <code>my-card</code> لنفسك (إيميل أو WhatsApp)، لأن أجهزة القاعة ممكن تنمسح. ورح نرجعله يوم 5.
        </div>
        <div class="alert">
          <strong>بدك ملفات فريقك؟</strong>
          كل شي رفعتوه بصفحة التسليم موجود بـ <a href="team-files.html">ملفات فريقي</a>: اختار فريقك ونزّل.
        </div>

        <div class="day-panel" data-day="1">
        <h2 class="day-title" id="day1">اليوم الأول: تحليل الاحتياج وتخطيط المشروع</h2>
        <ol class="toc">
          <li><a href="#setup">تجهيز الجهاز</a></li>
          <li><a href="#card">كود بطاقة التعريف</a></li>
          <li><a href="#template">قالب الـ Prompt</a></li>
          <li><a href="#prompts">الـ Prompts</a></li>
          <li><a href="#ideas">بنك الأفكار</a></li>
          <li><a href="#requirements">وثيقة المتطلبات</a></li>
        </ol>

        <!-- 1. التجهيز -->
        <article class="res-card" id="setup">
          <p class="res-when">الافتتاح</p>
          <h3>1. تجهيز الجهاز</h3>
          <div class="tools">
{tools_html}
          </div>
          <ol class="steps">
            <li>ثبّت Chrome وVS Code (إذا مش موجودين).</li>
            <li>إضافة Live Server: افتح VS Code ← أيقونة Extensions على الجنب ← ابحث عن <strong>Live Server</strong> ← اختار اللي من Ritwick Dey ← Install.</li>
            <li>سجّل دخول على أداة AI وحدة على الأقل، وخليها مفتوحة بتبويب.</li>
          </ol>
        </article>

        <!-- 2. البطاقة -->
        <article class="res-card" id="card">
          <p class="res-when">الدورة 3: أول صفحة ويب</p>
          <h3>2. كود بطاقة التعريف</h3>
          <ol class="steps">
            <li>اعمل مجلد اسمه <code>my-card</code> على سطح المكتب، وافتحه بـ VS Code من File ← Open Folder.</li>
            <li>اعمل ملف جديد من جوا VS Code اسمه <code>index.html</code>.</li>
            <li>انسخ الكود والصقه، واحفظ بـ Ctrl + S. (أو نزّل الملف جاهز وحطه بالمجلد.)</li>
            <li>كليك يمين على الملف ← Open with Live Server.</li>
          </ol>
          <a class="btn" href="files/day1/index.html" download="index.html">تحميل index.html</a>
{copy_block("index.html", card_code, "", "card-code")}
        </article>

        <!-- 3. القالب -->
        <article class="res-card" id="template">
          <p class="res-when">الدورة 5: فن الـ Prompt</p>
          <h3>3. قالب الـ Prompt الثابت</h3>
          <table class="tpl">
{template_html}
          </table>
          <p class="note"><strong>3 تقنيات أعلى مستوى:</strong> «اسألني قبل ما تجاوب» · أعطِه مثال · قسّم المهمة خطوة خطوة. وأول جواب مسودة: اطلب تعديلات لحد ما يناسبك.</p>
        </article>

        <!-- 4. الـ Prompts -->
        <h2 class="block-title" id="prompts">4. الـ Prompts</h2>
        <p class="block-sub">اكبس «نسخ»، الصق بالمحادثة، وعبّي اللي بين [ ] بس.</p>
        <div class="prompts-grid">
{prompts_html}
        </div>

        <!-- 5. بنك الأفكار -->
        <h2 class="block-title" id="ideas">5. بنك الأفكار</h2>
        <p class="block-sub">كل فكرة من 3 لـ 6 صفحات وفيها ميزتين تفاعليتين على الأقل، بدون Backend. اختار وعدّل براحتك، أو جيب فكرتك.</p>
        <div class="ideas-grid">
{ideas_html}
        </div>

        <!-- 6. وثيقة المتطلبات -->
        <article class="res-card" id="requirements">
          <p class="res-when">الدورات 5 و6 والختام</p>
          <h3>6. وثيقة المتطلبات</h3>
          <p>انسخ القالب لـ Word أو Google Docs وعبّيه مع فريقك، أو نزّل نسخة PDF للطباعة.</p>
          <a class="btn" href="files/day1/requirements-template.pdf" download>تحميل القالب PDF</a>
{copy_block("قالب الوثيقة", req_text, "", "req-text")}
        </article>

        </div>

        <div class="day-panel" data-day="2">
        <h2 class="day-title" id="day2">اليوم الثاني: تصميم الواجهة وتجربة المستخدم</h2>
        <ol class="toc">
          <li><a href="#plan">خطة الفريق</a></li>
          <li><a href="#tools2">أدوات اليوم</a></li>
          <li><a href="#stitch">Prompt الـ Stitch</a></li>
          <li><a href="#submit2">التسليم</a></li>
        </ol>

        <article class="res-card" id="plan">
          <p class="res-when">أول اليوم · 25 دقيقة</p>
          <h3>1. خطة الفريق</h3>
          <ol class="steps">
            <li>انسخ الـ prompt والصقه بالـ AI، ومعه تقرير الجمهور والأهداف تبع امبارح.</li>
            <li>جاوب على أسئلته، وعدّل بإيدك اللي مش عاجبك. القالب تحت إذا بدكم تعبّوه بإيدكم.</li>
            <li>ورّوا المدرب الخطة قبل ما تبلشوا الـ Wireframes.</li>
            <li>انسخ الخطة <strong>بزر النسخ تبع الـ AI</strong> (مش بالتظليل) والصقها بخانة «خطة الفريق» بصفحة التسليم، عشان يضل تنسيقها. واحد من الفريق بكفي.</li>
          </ol>
{copy_block("Prompt خطة الفريق", plan_prompt, "", "plan-prompt")}
{copy_block("قالب الخطة (نص)", plan_template, "", "plan-template")}
        </article>

        <article class="res-card" id="tools2">
          <p class="res-when">الدورات 1 و3 و4 و6</p>
          <h3>2. أدوات اليوم</h3>
          <div class="tools">
{tools2_html}
          </div>
        </article>

        <article class="res-card" id="stitch">
          <p class="res-when">الدورة 6: Google Stitch</p>
          <h3>3. Prompt الـ Stitch</h3>
          <p>الصقه بـ ChatGPT أو Claude وعبّي اللي بين [ ]، وخذ الـ prompt الإنجليزي اللي بيطلع وحطه بـ Stitch مع صور الـ wireframes.</p>
{copy_block("Prompt لـ ChatGPT", stitch_prompt, "", "stitch-prompt")}
{copy_block("طلبات تحسين جاهزة داخل Stitch (طلب واحد بكل مرة)", stitch_fixes, "", "stitch-fixes")}
        </article>

        <article class="res-card" id="submit2">
          <p class="res-when">الختام</p>
          <h3>4. التسليم</h3>
          <ul class="steps">
            <li>اختار فريقك واسمك من القائمة.</li>
            <li>شغل الفريق (الخطة كنص، صور الـ wireframes، تصميم Stitch): أي حد بالفريق بيرفعه، مرة وحدة بكفي.</li>
            <li>كل واحد بيجاوب سؤال الفهم بكلماته وباسمه.</li>
            <li>عملت شغل زيادة لحالك أو موقع جانبي؟ في خانة «شغل إضافي».</li>
            <li>لا تحط ملفات عشوائية، الملفات مش إجبارية.</li>
          </ul>
          <a class="btn" href="submit.html">صفحة التسليم</a>
        </article>
        </div>
''' + day3_panel + day4_build.build() + '''
      </div>
    </section>
'''
