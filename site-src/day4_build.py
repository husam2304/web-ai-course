"""Day 4 «ملفات الدورة» section, rendered from Claude Docs content (verbatim).

Sources (refresh these when the Docs change, then run gen_pages.py):
- day4/reference.xml   «ورقة المرجع» tab, as the Docs read tool returns it
- day4/teams/*.md      «أوراق التصليح: اليوم 4» team tabs, copied as Markdown
                       (the trainer overview tab and the trainer note in the sun sheet are left out)
"""
import glob, html, os, re
import xml.etree.ElementTree as ET

HERE = os.path.dirname(os.path.abspath(__file__))
DIR = os.path.join(HERE, "day4")

# ---------- block model ----------
# inline: list of (text, bold, code)
# block: ("h", level, inl) ("p", inl) ("code", lang, text) ("table", header_row, rows) ("list", kind, [inl]) ("quote", [blocks])

def esc(s):
    return html.escape(s, quote=False)

def render_inline(inl):
    out = []
    for text, bold, code in inl:
        s = esc(text)
        if code:
            s = f'<code dir="ltr">{s}</code>'
        if bold:
            s = f"<strong>{s}</strong>"
        out.append(s)
    return "".join(out)

def plain(inl):
    return "".join(t for t, _, _ in inl)

def code_only(inl):
    """A cell that is only code (and spaces / ← arrows): render it LTR."""
    return any(c for _, _, c in inl) and all(c or not t.strip() or t.strip() in ("←", "و") for t, _, c in inl)

_ids = {"n": 0}
def next_id(prefix):
    _ids["n"] += 1
    return f"{prefix}-{_ids['n']}"

def is_tree(text):
    return "├──" in text or "└──" in text

def render_code(lang, text, prefix):
    bid = next_id(prefix)
    if is_tree(text):
        label, cls, d = "المجلدات", "code-block tree", "ltr"
    elif lang in ("html", "css", "js", "javascript"):
        label, cls, d = "كود", "code-block", "ltr"
    elif re.search(r"[؀-ۿ]", text) and lang == "text":
        label, cls, d = "Prompt", "code-block prompt", "auto"
    else:
        label, cls, d = "كود", "code-block", "ltr"
    return (f'<div class="{cls}"><div class="code-head"><span>{label}</span>'
            f'<button class="copy-btn" data-target="{bid}">نسخ</button></div>'
            f'<pre id="{bid}" dir="{d}">{esc(text)}</pre></div>')

def render_blocks(blocks, prefix, hshift=0, after_h2=None):
    out = []
    for b in blocks:
        k = b[0]
        if k == "h":
            lvl = min(6, b[1] + hshift)
            out.append(f"<h{lvl}>{render_inline(b[2])}</h{lvl}>")
            continue
        if k == "p":
            out.append(f"<p>{render_inline(b[1])}</p>")
        elif k == "code":
            out.append(render_code(b[1], b[2], prefix))
        elif k == "quote":
            out.append('<div class="doc-note">' + render_blocks(b[1], prefix) + "</div>")
        elif k == "list":
            if b[1] == "check":
                items = "".join(f'<li><label><input type="checkbox"> <span>{render_inline(i)}</span></label></li>' for i in b[2])
                out.append(f'<ul class="checklist">{items}</ul>')
            else:
                tag = "ol" if b[1] == "ordered" else "ul"
                out.append(f"<{tag}>" + "".join(f"<li>{render_inline(i)}</li>" for i in b[2]) + f"</{tag}>")
        elif k == "table":
            head, rows = b[1], b[2]
            def cell(tag, c):
                ltr = ' class="ltr-cell"' if code_only(c) else ""
                return f"<{tag}{ltr}>{render_inline(c)}</{tag}>"
            h = "<thead><tr>" + "".join(cell("th", c) for c in head) + "</tr></thead>" if head else ""
            body = "".join("<tr>" + "".join(cell("td", c) for c in r) + "</tr>" for r in rows)
            out.append(f'<div class="table-wrap"><table class="doc-table">{h}<tbody>{body}</tbody></table></div>')
        if after_h2 and k != "h":
            pass
    return "\n".join(out)

# ---------- Docs XML (reference sheet) ----------
def xml_inline(par):
    inl = []
    for t in par.findall("text"):
        bold = code = False
        node = t
        while len(node):
            child = node[0]
            if child.tag == "bold": bold = True
            elif child.tag == "code": code = True
            node = child
        s = "".join(t.itertext())
        if s:
            inl.append((s, bold, code))
    return inl

def xml_blocks(elems):
    blocks = []
    for el in elems:
        if el.tag == "paragraph":
            if el.get("heading"):
                blocks.append(("h", int(el.get("heading")), xml_inline(el)))
            else:
                blocks.append(("p", xml_inline(el)))
        elif el.tag == "codeBlock":
            blocks.append(("code", el.get("language") or "text", "".join(el.itertext())))
        elif el.tag == "list":
            blocks.append(("list", el.get("kind"), [xml_inline(li.find("paragraph")) for li in el.findall("listItem")]))
        elif el.tag == "table":
            rows = []
            head = None
            for r in el.findall("row"):
                cells = [xml_inline(c.find("paragraph")) if c.find("paragraph") is not None else [] for c in r.findall("cell")]
                if r[0].get("header") == "true" and head is None:
                    head = cells
                else:
                    rows.append(cells)
            blocks.append(("table", head, rows))
        elif el.tag == "blockquote":
            blocks.append(("quote", xml_blocks(list(el))))
    return blocks

# ---------- Markdown (team sheets) ----------
INL = re.compile(r"\*\*`([^`]+)`\*\*|\*\*(.+?)\*\*|`([^`]+)`")
def md_inline(s):
    inl, pos = [], 0
    for m in INL.finditer(s):
        if m.start() > pos:
            inl.append((s[pos:m.start()], False, False))
        if m.group(1) is not None:
            inl.append((m.group(1), True, True))
        elif m.group(2) is not None:
            for t, b, c in md_inline(m.group(2)):
                inl.append((t, True, c))
        else:
            inl.append((m.group(3), False, True))
        pos = m.end()
    if pos < len(s):
        inl.append((s[pos:], False, False))
    return inl

def split_row(line):
    cells, cur, in_code = [], "", False
    for ch in line.strip()[1:-1]:
        if ch == "`": in_code = not in_code
        if ch == "|" and not in_code:
            cells.append(cur.strip()); cur = ""
        else:
            cur += ch
    cells.append(cur.strip())
    return cells

def md_blocks(text):
    lines = text.split("\n")
    blocks, i = [], 0
    while i < len(lines):
        ln = lines[i]
        if ln.startswith("```"):
            lang = ln[3:].strip() or "text"
            j = i + 1
            while not lines[j].startswith("```"):
                j += 1
            blocks.append(("code", lang, "\n".join(lines[i + 1:j])))
            i = j + 1
        elif ln.startswith("#"):
            lvl = len(ln) - len(ln.lstrip("#"))
            blocks.append(("h", lvl, md_inline(ln[lvl:].strip())))
            i += 1
        elif ln.startswith("|"):
            rows = []
            while i < len(lines) and lines[i].startswith("|"):
                rows.append(lines[i]); i += 1
            head = [md_inline(c) for c in split_row(rows[0])]
            body = [[md_inline(c) for c in split_row(r)] for r in rows[2:]]
            blocks.append(("table", head, body))
        elif ln.startswith("> "):
            blocks.append(("quote", [("p", md_inline(ln[2:]))]))
            i += 1
        elif ln.startswith("- [ ] "):
            items = []
            while i < len(lines) and lines[i].startswith("- [ ] "):
                items.append(md_inline(lines[i][6:])); i += 1
            blocks.append(("list", "check", items))
        elif ln.startswith("- "):
            items = []
            while i < len(lines) and lines[i].startswith("- "):
                items.append(md_inline(lines[i][2:])); i += 1
            blocks.append(("list", "bullet", items))
        elif ln.strip():
            blocks.append(("p", md_inline(ln)))
            i += 1
        else:
            i += 1
    return blocks

# ---------- assemble ----------
def locked(key, title, when, body, cls="res-card"):
    return (f'<article class="{cls} is-locked" id="{key}" data-lock="{key}" data-lock-title="{esc(title)}">'
            f'<p class="res-when">{when}</p><h3>{esc(title)}</h3><div class="lock-body">\n{body}\n</div></article>')

def acc(title, body, open_=False):
    return f'<details class="acc"{" open" if open_ else ""}><summary>{esc(title)}</summary><div class="acc-body">\n{body}\n</div></details>'

BACKUP_BTN = '<p><a class="btn btn-light" href="submit.html#backup">ارفع نسخة احتياطية (zip)</a></p>'

def build():
    root = ET.parse(os.path.join(DIR, "reference.xml")).getroot()
    ref = xml_blocks(list(root))
    # sections by h2
    intro, sections, cur = [], {}, None
    for b in ref[1:]:                      # skip the h1 title
        if b[0] == "h" and b[1] == 2:
            cur = plain(b[2]); sections[cur] = []
        elif cur is None:
            intro.append(b)
        else:
            sections[cur].append(b)

    def split_at(blocks, label):
        for n, b in enumerate(blocks):
            if b[0] == "p" and plain(b[1]).strip() == label:
                return blocks[:n], blocks[n:]
        raise ValueError(label)

    html_sec = sections["HTML: الهيكل"]
    css_sec = sections["CSS: الشكل"]
    html_a, html_b = split_at(html_sec, "أهم الخصائص:")
    css_a, css_b = split_at(css_sec, "أهم الخصائص:")
    console_key = next(k for k in sections if k.startswith("أخطاء الـ Console"))
    ref_parts = [
        ("HTML: التاجات", html_a),
        ("HTML: الخصائص", html_b),
        ("CSS: الـ selectors", css_a),
        ("CSS: الخصائص", css_b),
        ("JavaScript: الحركة", sections["JavaScript: الحركة"]),
        ("البيانات بـ JavaScript", sections["البيانات بـ JavaScript"]),
        (console_key, sections[console_key]),
    ]
    rules_body = render_blocks(sections["الملفات والربط"], "d4-rules")
    ref_body = render_blocks(intro, "d4-ref") + "\n" + "\n".join(acc(t, render_blocks(b, "d4-ref")) for t, b in ref_parts)

    teams = []
    for path in sorted(glob.glob(os.path.join(DIR, "teams", "*.md"))):
        slug = os.path.basename(path)[2:-3]
        blocks = md_blocks(open(path, encoding="utf-8").read())
        title = plain(blocks[0][2])
        rest = blocks[1:]
        # backup button right after the body of «خطوة 1: نسخة احتياطية»
        parts, inserted = [], False
        for n, b in enumerate(rest):
            parts.append(render_blocks([b], f"d4-{slug}", hshift=2))
            if not inserted and b[0] == "p" and n > 0 and rest[n - 1][0] == "h" and "نسخة احتياطية" in plain(rest[n - 1][2]):
                parts.append(BACKUP_BTN); inserted = True
        teams.append((slug, title, "\n".join(parts)))

    rules = locked("d4-rules", "قواعد اليوم: الملفات والربط", "أول اليوم", rules_body)
    reference = locked("d4-ref", "ورقة المرجع: HTML و CSS و JavaScript", "خليها جنبك وإنت بتشتغل", ref_body)
    team_cards = "\n".join(locked(f"d4-team-{s}", t, "ورقة فريقكم", acc("افتح الورقة", body), "res-card team-sheet") for s, t, body in teams)

    return f'''
        <div class="day-panel" data-day="4">
        <h2 class="day-title" id="day4">اليوم الرابع: التجميع والفحص</h2>
        <p class="block-sub">البطاقات بتنفتح لما نوصلها بالشرح. الصفحة بتتحدّث لحالها.</p>
        <ol class="toc">
          <li><a href="#d4-rules">قواعد اليوم</a></li>
          <li><a href="#d4-ref">ورقة المرجع</a></li>
          <li><a href="#d4-teams">أوراق الفرق</a></li>
        </ol>
{rules}
{reference}
        <h2 class="block-title" id="d4-teams">أوراق الفرق</h2>
        <p class="block-sub">كل فريق إله ورقة: امشوا على الخطوات بالترتيب، وانسخوا الـ prompts بزر «نسخ».</p>
{team_cards}
        </div>
'''

if __name__ == "__main__":
    print(build()[:3000])
