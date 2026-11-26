"""Day 5 «ملفات الدورة» section, from the day5.html worksheet (verbatim).
- day5/teams.js: the worksheet's own script (teams array, read through Node)
- the checklist, publish steps and presentation below are copied from the same page
"""
import html, json, os, re, subprocess

HERE = os.path.dirname(os.path.abspath(__file__))

def esc(s):
    return html.escape(s, quote=False)

# Latin "code-ish" tokens inside Arabic sentences get an isolated LTR <code> (same text, no rewording)
TOKEN = re.compile(r"(\.[\w-]+\s*\{[^{}]*\}|</?[A-Za-z][^<>]*>|\b[\w-]+=\"[^\"]*\")|(?<![\w.#])((?:[#.][A-Za-z][\w-]*|[A-Za-z0-9_'*-]+)(?:[./?=+][A-Za-z0-9_#'*-]+)+|[#.][A-Za-z][\w-]*|\?[A-Za-z]\w*=)")
def iso(text):
    out, pos = [], 0
    for m in TOKEN.finditer(text):
        out.append(esc(text[pos:m.start()]))
        tok = m.group(1) or m.group(2)
        # كود طويل (tag أو قاعدة CSS) بسطر لحاله عشان ما يلتف ويتلخبط مع العربي
        cls = ' class="code-line"' if len(tok) > 28 else ""
        out.append(f'<code{cls} dir="ltr">{esc(tok)}</code>')
        pos = m.end()
    out.append(esc(text[pos:]))
    return "".join(out)

_n = {"i": 0}
def prompt_block(text, prefix):
    _n["i"] += 1
    bid = f"{prefix}-{_n['i']}"
    return (f'<div class="code-block prompt"><div class="code-head"><span>Prompt</span>'
            f'<button class="copy-btn" data-target="{bid}">نسخ</button></div>'
            f'<pre id="{bid}" dir="auto">{esc(text)}</pre></div>')

def locked(key, title, when, body, cls="res-card"):
    return (f'<article class="{cls} is-locked" id="{key}" data-lock="{key}" data-lock-title="{esc(title)}">'
            f'<p class="res-when">{when}</p><h3>{esc(title)}</h3><div class="lock-body">\n{body}\n</div></article>')

DONE = """<p>قبل ما تنشروا، كل نقطة لازم تكون صح:</p>
<ul class="checklist">
<li><label><input type="checkbox"> <span>كل صفحة بتفتح، والقائمة بتوصل لكل الصفحات من كل صفحة.</span></label></li>
<li><label><input type="checkbox"> <span>F12 ← Console: ما في ولا خطأ أحمر بولا صفحة.</span></label></li>
<li><label><input type="checkbox"> <span>كل زر بيعمل اللي مكتوب عليه، أو بيطلّع رسالة واضحة (للميزات اللي بدها Backend).</span></label></li>
<li><label><input type="checkbox"> <span>على عرض الجوال (F12 ← أيقونة الجوال) ما في سكرول لليمين أو الشمال.</span></label></li>
<li><label><input type="checkbox"> <span>كل الصور ظاهرة.</span></label></li>
<li><label><input type="checkbox"> <span>الرابط المنشور بيفتح على جوال حقيقي.</span></label></li>
</ul>
<div class="doc-note"><p>قبل أي تعديل: zip للمجلد على «ملفات فريقي». وبعد كل prompt: افتحوا الصفحة وجربوا قبل ما تكمّلوا.</p></div>
<p><a class="btn btn-light" href="submit.html#backup">ارفع نسخة احتياطية (zip)</a></p>"""

PUBLISH = """<p>بعد ما يخلص الضروري ويصير الفحص كله صح.</p>
<ol class="steps">
<li><b>حساب:</b> واحد من الفريق يفتح <code dir="ltr">app.netlify.com/signup</code> ويسجّل (Sign up with Google أسرع).</li>
<li><b>تأكدوا إنكم مسجلين دخول</b>، وبعدين افتحوا <code dir="ltr">app.netlify.com/drop</code></li>
<li><b>اسحبوا مجلد موقعكم</b> لجوا المربع. المجلد اللي <b>جواه مباشرة</b> <code dir="ltr">index.html</code>، مش مجلد فوقه.</li>
<li>استنوا ثواني، بيطلعلكم رابط زي <code dir="ltr">random-name.netlify.app</code>. افتحوه وجربوه.</li>
<li><b>غيّروا الاسم:</b> Site configuration ← Change site name، مثلاً <code dir="ltr">caffeon-aqaba</code></li>
<li><b>افتحوا الرابط على جوالاتكم</b> وجربوا كل الصفحات.</li>
<li><b>تعديل بعد النشر:</b> صلّحوا على الجهاز، وبعدين تبويب Deploys ← اسحبوا المجلد مرة ثانية لنفس الموقع. الرابط ما بيتغيّر.</li>
<li><b>ابعتوا الرابط</b> بفورم اليوم 5 على موقع الدورة. وكل واحد بيختار بالفورم إذا موافق تنعرض بطاقته (من اليوم 1) باسمه على موقع الدورة.</li>
</ol>
<div class="doc-note"><p>إذا نشرتوا وإنتو مش مسجلين دخول، الموقع بينحذف خلال ساعة. سجّلوا أول.</p></div>"""

PRESENT = """<p>من الموقع المنشور، على الشاشة الكبيرة. كل الفريق بيحكي.</p>
<div class="talk">
<b>30 ثانية</b><span>الفكرة، ولمين الموقع.</span>
<b>دقيقتين</b><span>جولة بالموقع وميزتين شغالات قدامنا.</span>
<b>دقيقة</b><span>أصعب مشكلة واجهتكم، وكيف حليتوها.</span>
<b>30 ثانية</b><span>شو بتضيفوا لو عندكم أسبوع زيادة.</span>
<b>دقيقة</b><span>أسئلة.</span>
</div>"""

def build():
    teams = json.loads(subprocess.check_output(["node", os.path.join(HERE, "day5", "teams.js")]))
    cards = []
    for t in teams:
        tasks = []
        for i, k in enumerate(t["tasks"]):
            tag = '<span class="must-tag">ضروري</span>' if k.get("must") else ""
            p = prompt_block(k["p"], f"d5-{t['id']}") if k.get("p") else ""
            steps = ('<ol class="task-steps">' + "".join(f"<li>{iso(st)}</li>" for st in k["steps"]) + "</ol>") if k.get("steps") else ""
            tasks.append(f'<div class="task{" must" if k.get("must") else ""}"><h4>{i + 1}. {iso(k["t"])}{tag}</h4><p>{iso(k["d"])}</p>{steps}{p}</div>')
        body = f'<details class="acc"><summary>افتح المهام</summary><div class="acc-body">\n<p class="state">{iso(t["state"])}</p>\n' + "\n".join(tasks) + "\n</div></details>"
        cards.append(locked(f"d5-team-{t['id']}", f"مهام فريق {t['name']}", "مهام فريقكم", body, "res-card team-sheet"))
    return f'''
        <div class="day-panel" data-day="5">
        <h2 class="day-title" id="day5">اليوم الخامس: نخلّص وننشر</h2>
        <p class="block-sub">آخر يوم. الهدف: موقع كل فريق شغال 100%، ومنشور على الإنترنت، وكل فريق بيعرض مشروعه.</p>
        <ol class="toc">
          <li><a href="#d5-done">شو يعني «شغال 100%»</a></li>
          <li><a href="#d5-teams">مهام فريقكم</a></li>
          <li><a href="#d5-publish">النشر</a></li>
          <li><a href="#d5-present">العرض</a></li>
        </ol>
{locked("d5-done", "شو يعني «شغال 100%»؟", "أول اليوم", DONE)}
        <h2 class="block-title" id="d5-teams">مهام فريقكم</h2>
        <p class="block-sub">المهام بالترتيب: <span class="must-tag">ضروري</span> أول، بعدين الباقي. الـ prompts جاهزة: انسخوها، والصقوا ملفاتكم مكان «(الصق هون)».</p>
{chr(10).join(cards)}
{locked("d5-publish", "النشر على Netlify", "بعد الفحص", PUBLISH)}
{locked("d5-present", "العرض: 5 دقايق لكل فريق", "آخر اليوم", PRESENT)}
        </div>
'''
