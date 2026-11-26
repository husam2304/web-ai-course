#!/usr/bin/env python3
"""Builds demo/day5-js/: the example files for the Day 5 JS explanation.
01-asas = basics in the Console + one button; 02..06 = the café menu growing one feature per folder."""
import os, shutil
from PIL import Image, ImageDraw
ROOT = os.path.join(os.path.dirname(__file__), "..", "demo", "day5-js")
shutil.rmtree(ROOT, ignore_errors=True)

def w(path, text):
    os.makedirs(os.path.dirname(path), exist_ok=True)
    open(path, "w", encoding="utf-8").write(text.strip("\n") + "\n")

def images(folder):
    for name, col in [("latte", (196, 154, 108)), ("mocha", (110, 72, 46)), ("cake", (238, 214, 170))]:
        im = Image.new("RGB", (400, 300), (250, 245, 238))
        d = ImageDraw.Draw(im)
        d.ellipse((120, 70, 280, 230), fill=col)
        d.rectangle((0, 260, 400, 300), fill=(30, 60, 90))
        os.makedirs(os.path.join(folder, "images"), exist_ok=True)
        im.save(os.path.join(folder, "images", name + ".jpg"), quality=80)

PAGE = """<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>{title}</title>
  <link rel="stylesheet" href="css/style.css">
</head>
<body>
  <header><h1>مقهى الدورة</h1><a href="index.html">المنيو</a></header>
  <main>
{body}
  </main>
{scripts}
</body>
</html>"""

CSS = """:root {
  --bg: #f8f5f0;
  --primary: #1e3c5a;
  --accent: #e2711d;
  --radius: 12px;
}
body { margin: 0; background: var(--bg); color: #222; font-family: "Cairo", Tahoma, sans-serif; }
header { display: flex; justify-content: space-between; align-items: center; padding: 16px 24px; background: var(--primary); color: white; }
header a { color: white; }
main { max-width: 900px; margin: 0 auto; padding: 24px; }
.cards { display: grid; grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); gap: 16px; }
.card { background: white; border-radius: var(--radius); padding: 12px; box-shadow: 0 2px 8px rgba(0,0,0,.08); }
.card img { width: 100%; border-radius: 8px; }
.card h3 { margin: 8px 0 4px; }
button, .btn { font: inherit; border: 0; border-radius: 8px; padding: 6px 14px; background: var(--accent); color: white; cursor: pointer; text-decoration: none; display: inline-block; }
.filters { display: flex; gap: 8px; margin-bottom: 16px; }
.filter { background: var(--primary); }
.total { font-size: 22px; font-weight: 700; margin-top: 20px; }"""

ANIM_CSS = """
/* الحركة */
@keyframes fadeUp {
  from { opacity: 0; transform: translateY(20px); }
  to   { opacity: 1; transform: translateY(0); }
}
.show { animation: fadeUp 0.6s ease; }"""

DATA = """const items = [
  { id: 1, name: "لاتيه", category: "coffee",
    price: 2.5, image: "images/latte.jpg" },
  { id: 2, name: "موكا", category: "coffee",
    price: 3, image: "images/mocha.jpg" },
  { id: 3, name: "تشيز كيك", category: "sweets",
    price: 3.5, image: "images/cake.jpg" }
];"""

FILTER_HTML = """    <div class="filters">
      <button class="filter" data-cat="all">الكل</button>
      <button class="filter" data-cat="coffee">قهوة</button>
      <button class="filter" data-cat="sweets">حلويات</button>
    </div>"""

def main_js(step):
    card = ['        <img src="${item.image}" alt="${item.name}">',
            '        <h3>${item.name}</h3>',
            '        <p>${item.price} دينار</p>']
    if step >= 4: card.append('        <a class="btn" href="details.html?id=${item.id}">التفاصيل</a>')
    if step >= 5: card.append('        <button class="add" data-id="${item.id}">أضف</button>')
    after = []
    if step >= 5:
        after += ['  // زر «أضف» بكل بطاقة: امسك، استنى، غيّر',
                  '  document.querySelectorAll(".add").forEach(btn => {',
                  '    btn.addEventListener("click", () => {',
                  '      const item = items.find(i => i.id === Number(btn.dataset.id));',
                  '      addToCart(item);',
                  '    });',
                  '  });']
    if step >= 6:
        after += ['  // الحركة: كل بطاقة بتاخد class اسمه show',
                  '  document.querySelectorAll(".card").forEach(card => {',
                  '    card.classList.add("show");',
                  '  });']
    js = ['// الرسم: بطاقة لكل منتج',
          'const list = document.getElementById("list");',
          '',
          'function render(arr) {',
          '  list.innerHTML = "";',
          '  arr.forEach(item => {',
          '    list.innerHTML += `',
          '      <div class="card">',
          *card,
          '      </div>`;',
          '  });',
          *after,
          '}',
          '']
    if step >= 3:
        js += ['// الفلترة',
               'document.querySelectorAll(".filter").forEach(btn => {',
               '  btn.addEventListener("click", () => {',
               '    const cat = btn.dataset.cat;',
               '    if (cat === "all") {',
               '      render(items);',
               '    } else {',
               '      render(items.filter(item => item.category === cat));',
               '    }',
               '  });',
               '});',
               '']
    if step >= 5:
        js += ['// السلة: بتنحفظ بـ localStorage',
               'let cart = JSON.parse(localStorage.getItem("cart")) || [];',
               '',
               'function addToCart(item) {',
               '  cart.push(item);',
               '  localStorage.setItem("cart", JSON.stringify(cart));',
               '  showTotal();',
               '}',
               '',
               'function showTotal() {',
               '  let total = 0;',
               '  cart.forEach(i => { total += i.price; });',
               '  const bar = document.getElementById("total");',
               '  bar.textContent = total + " دينار";',
               '  if (total > 10) bar.style.color = "red";',
               '  else if (total >= 8) bar.style.color = "orange";',
               '  else bar.style.color = "green";',
               '}',
               '',
               '// زر تفريغ السلة (للتجربة)',
               'const clearBtn = document.getElementById("clearBtn");',
               'clearBtn.addEventListener("click", () => {',
               '  cart = [];',
               '  localStorage.removeItem("cart");',
               '  showTotal();',
               '});',
               '',
               'showTotal();']
    js += ['render(items);']
    return "\n".join(js)

DETAILS_JS = """// صفحة التفاصيل: الرقم من الرابط (details.html?id=2)
const id = Number(new URLSearchParams(location.search).get("id"));
const item = items.find(i => i.id === id);
const box = document.getElementById("details");

if (item) {
  box.innerHTML = `<h1>${item.name}</h1><img src="${item.image}" alt="${item.name}" width="300"><p>${item.price} دينار</p>`;
} else {
  box.textContent = "المنتج مش موجود";
}"""

BASICS_JS = """// افتح F12 ← Console وشوف النتائج

// 1. المتغيرات: علبة عليها اسم
let name = "سارة";        // نص (string)
const price = 2.5;        // رقم (number)
let isOpen = true;        // صح أو غلط (boolean)
console.log(name, price, isOpen);

// 2. الشرط: if / else
if (price > 2) {
  console.log("غالي شوي");
} else {
  console.log("سعره منيح");
}

// 3. المصفوفة: قائمة بالترتيب، والعد من 0
const drinks = ["لاتيه", "موكا", "شاي"];
console.log(drinks[0]);       // لاتيه
console.log(drinks.length);   // 3

// 4. الـ loop: لكل عنصر بالمصفوفة اعمل هالشي
drinks.forEach(d => {
  console.log("عنا " + d);
});

// 5. الـ object: بطاقة معلومات (مفتاح: قيمة)
const latte = { name: "لاتيه", price: 2.5 };
console.log(latte.name + " بـ " + latte.price + " دينار");

// 6. الـ function: وصفة باسم، بتاخد قيمة وبترجّع نتيجة
function withTax(p) {
  return p * 1.16;
}
console.log(withTax(10));     // 11.6

// 7. JS والصفحة: امسك ← استنى ← غيّر
const btn = document.getElementById("addBtn");
const msg = document.getElementById("msg");

btn.addEventListener("click", () => {
  btn.textContent = "تمت الإضافة";
  msg.textContent = "لاتيه انضاف للسلة";
  msg.style.color = "green";
});"""

# 01 basics
d = os.path.join(ROOT, "01-asas")
w(os.path.join(d, "css", "style.css"), CSS)
w(os.path.join(d, "index.html"), PAGE.format(title="الأساس", body="""    <p>افتح F12 ← Console</p>
    <button id="addBtn">أضف</button>
    <p id="msg"></p>""", scripts='  <script src="js/basics.js"></script>'))
w(os.path.join(d, "js", "basics.js"), BASICS_JS)

names = {2: "02-data-render", 3: "03-filter", 4: "04-details", 5: "05-save", 6: "06-animation"}
for step, folder in names.items():
    d = os.path.join(ROOT, folder)
    images(d)
    w(os.path.join(d, "css", "style.css"), CSS + (ANIM_CSS if step >= 6 else ""))
    w(os.path.join(d, "js", "data.js"), DATA)
    w(os.path.join(d, "js", "main.js"), main_js(step))
    body = []
    if step >= 3: body.append(FILTER_HTML)
    body.append('    <div id="list" class="cards"></div>')
    if step >= 5: body.append('    <p class="total">المجموع: <span id="total">0 دينار</span></p>\n    <button id="clearBtn">فضّي السلة</button>')
    scripts = '  <script src="js/data.js"></script>\n  <script src="js/main.js"></script>'
    w(os.path.join(d, "index.html"), PAGE.format(title="المنيو", body="\n".join(body), scripts=scripts))
    if step >= 4:
        w(os.path.join(d, "js", "details.js"), DETAILS_JS)
        w(os.path.join(d, "details.html"), PAGE.format(title="التفاصيل", body='    <div id="details"></div>',
          scripts='  <script src="js/data.js"></script>\n  <script src="js/details.js"></script>'))

w(os.path.join(ROOT, "README.md"), """# أمثلة شرح JavaScript (اليوم 5)

كل مجلد موقع كامل بيشتغل لحاله. افتح index.html بـ Live Server.

| المجلد | الشريحة | شو فيه |
| --- | --- | --- |
| 01-asas | الأساس 1 لـ 7 | basics.js: متغيرات، if، مصفوفة، loop، object، function، وزر (Console مفتوح) |
| 02-data-render | الميزة 1 | data.js بـ 3 منتجات، و render بـ forEach |
| 03-filter | الميزة 2 | أزرار فلترة: filter و if |
| 04-details | الميزة 3 | details.html?id= بـ URLSearchParams و find |
| 05-save | الميزة 4 | السلة بـ localStorage، والمجموع أخضر وبرتقالي وأحمر |
| 06-animation | الميزة 5 | @keyframes و animation و classList.add |

كل مجلد = اللي قبله + ميزة وحدة. قارن main.js بين مجلدين عشان تشوف شو انضاف.
""")
print("ok", ROOT)
