const pptxgen = require("pptxgenjs");
const React = require("react");
const RDS = require("react-dom/server");
const sharp = require("sharp");
const fa = require("react-icons/fa");
const { applyTheme } = require("./lib/apply_theme.js");

const THEME = {
  name: "Web with AI Day 1",
  headFontFace: "Arial",
  bodyFontFace: "Arial",
  colors: {
    dk1: "1B2430", lt1: "FFFFFF", dk2: "13293D", lt2: "F1F4F8",
    accent1: "E07A2F", accent2: "2A9D8F", accent3: "E9C46A", accent4: "8D99AE",
    accent5: "264653", accent6: "F4A261", hlink: "2A9D8F", folHlink: "8D99AE",
  },
};
const HEX = THEME.colors;

const pres = new pptxgen();
pres.layout = "LAYOUT_WIDE"; // 13.333 x 7.5
pres.theme = { headFontFace: THEME.headFontFace, bodyFontFace: THEME.bodyFontFace };
pres.title = "اليوم الأول: تحليل الاحتياج وتخطيط المشروع";
pres.author = "Husam Elayyan";
pres.rtlMode = true;
const C = pres.SchemeColor;
const W = 13.333;
const M = 0.6;
const CW = W - 2 * M;

// ---------- layouts ----------
pres.defineSlideMaster({
  title: "CONTENT",
  background: { color: C.background1 },
  objects: [
    { text: { text: "اليوم الأول · تطوير المواقع الإلكترونية بمساعدة الذكاء الاصطناعي", options: { x: 5.2, y: 6.95, w: 7.53, h: 0.35, fontSize: 10, color: C.accent4 ? HEX.accent4 : "8D99AE", align: "right", rtlMode: true, margin: 0 } } },
    { placeholder: { options: { name: "kicker", type: "body", x: M, y: 0.32, w: CW, h: 0.4, fontSize: 14, bold: true, color: C.accent1, align: "right", rtlMode: true, margin: 0 }, text: "" } },
    { placeholder: { options: { name: "title", type: "title", x: M, y: 0.72, w: CW, h: 0.85, fontSize: 32, bold: true, color: C.text2, align: "right", rtlMode: true, valign: "middle", margin: 0 }, text: "" } },
  ],
  slideNumber: { x: M, y: 6.95, w: 0.6, h: 0.35, fontSize: 10, color: HEX.accent4 },
});
pres.defineSlideMaster({
  title: "DIVIDER",
  background: { color: C.text2 },
  objects: [
    { placeholder: { options: { name: "kicker", type: "body", x: M, y: 2.35, w: CW, h: 0.5, fontSize: 18, bold: true, color: C.accent6, align: "right", rtlMode: true, margin: 0 }, text: "" } },
    { placeholder: { options: { name: "title", type: "title", x: M, y: 2.9, w: CW, h: 1.2, fontSize: 44, bold: true, color: C.background1, align: "right", rtlMode: true, valign: "middle", margin: 0 }, text: "" } },
  ],
  slideNumber: { x: M, y: 6.95, w: 0.6, h: 0.35, fontSize: 10, color: "C9D6E0" },
});
pres.defineSlideMaster({
  title: "STATEMENT",
  background: { color: C.accent6 },
  objects: [
    { placeholder: { options: { name: "kicker", type: "body", x: M, y: 1.9, w: CW, h: 0.5, fontSize: 18, bold: true, color: C.text2, align: "right", rtlMode: true, margin: 0 }, text: "" } },
    { placeholder: { options: { name: "title", type: "title", x: M, y: 2.45, w: CW, h: 2.0, fontSize: 40, bold: true, color: C.text2, align: "right", rtlMode: true, valign: "middle", margin: 0 }, text: "" } },
  ],
  slideNumber: { x: M, y: 6.95, w: 0.6, h: 0.35, fontSize: 10, color: HEX.dk2 },
});

// ---------- helpers ----------
const R = (o = {}) => Object.assign({ rtlMode: true, align: "right", isTextBox: true, margin: 0, valign: "top", fontSize: 16, color: C.text1 }, o);
let iconCache = {};
async function icon(name, color = "#FFFFFF") {
  const key = name + color;
  if (iconCache[key]) return iconCache[key];
  const svg = RDS.renderToStaticMarkup(React.createElement(fa[name], { color, size: "256" }));
  const buf = await sharp(Buffer.from(svg)).png().toBuffer();
  iconCache[key] = "image/png;base64," + buf.toString("base64");
  return iconCache[key];
}
async function iconCircle(s, name, x, y, d, fill = C.accent1, iconColor = "#FFFFFF") {
  s.addShape(pres.shapes.OVAL, { x, y, w: d, h: d, fill: { color: fill }, line: { color: fill, width: 0 }, objectName: "icon-circle" });
  const pad = d * 0.25;
  s.addImage({ data: await icon(name, iconColor), x: x + pad, y: y + pad, w: d - 2 * pad, h: d - 2 * pad, altText: name });
}
function box(s, x, y, w, h, fill = C.background2, line) {
  s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x, y, w, h, rectRadius: 0.12, fill: { color: fill }, line: line ? { color: line, width: 1 } : { color: fill, width: 0 }, objectName: "card" });
}
// card: icon at top-right, title, body
async function card(s, x, y, w, h, o) {
  const fill = o.dark ? C.text2 : C.background2;
  box(s, x, y, w, h, fill);
  let ty = y + 0.25;
  if (o.icon) {
    await iconCircle(s, o.icon, x + w - 0.25 - 0.6, y + 0.25, 0.6, o.iconFill || C.accent1);
    ty = y + 1.0;
  }
  if (o.num) {
    s.addText(o.num, R({ x: x + 0.25, y: ty, w: w - 0.5, h: 0.35, fontSize: 14, bold: true, color: o.dark ? C.accent6 : C.accent1 }));
    ty += 0.38;
  }
  const th = o.titleH || 0.45;
  s.addText(o.title, R({ x: x + 0.25, y: ty, w: w - 0.5, h: th, fontSize: o.titleSize || 18, bold: true, color: o.dark ? C.background1 : C.text2, valign: "top" }));
  if (o.body) s.addText(o.body, R({ x: x + 0.25, y: ty + th + 0.05, w: w - 0.5, h: y + h - (ty + th + 0.05) - 0.2, fontSize: o.bodySize || 14, color: o.dark ? "C9D6E0" : "3E5266", paraSpaceAfter: 4 }));
  if (o.tag) {
    s.addText(o.tag, R({ x: x + 0.25, y: y + h - 0.5, w: w - 0.5, h: 0.3, fontSize: 12, bold: true, color: o.dark ? C.accent6 : C.accent2 }));
  }
}
// columns from right to left
function colsX(n, gap = 0.3, left = M, width = CW) {
  const cw = (width - gap * (n - 1)) / n;
  const xs = [];
  for (let i = 0; i < n; i++) xs.push(left + width - (i + 1) * cw - i * gap);
  return { xs, cw };
}
function prompt(s, x, y, w, h, text, size = 14) {
  box(s, x, y, w, h, C.text2);
  s.addText(text, R({ x: x + 0.3, y: y + 0.22, w: w - 0.6, h: h - 0.44, fontSize: size, color: C.background1, paraSpaceAfter: 3 }));
}
function code(s, x, y, w, h, text, label) {
  box(s, x, y, w, h, C.text2);
  if (label) s.addText(label, { x: x + 0.3, y: y + 0.15, w: w - 0.6, h: 0.35, fontSize: 13, bold: true, color: HEX.accent6, fontFace: "Arial", align: "left", margin: 0, isTextBox: true });
  s.addText(text, { x: x + 0.3, y: y + (label ? 0.55 : 0.25), w: w - 0.6, h: h - (label ? 0.75 : 0.45), fontSize: 13, color: "F1F4F8", fontFace: "Courier New", align: "left", valign: "top", margin: 0, isTextBox: true });
}
function callout(s, x, y, w, h, text, o = {}) {
  box(s, x, y, w, h, o.fill || C.accent3);
  s.addText(text, R({ x: x + 0.3, y: y + 0.12, w: w - 0.6, h: h - 0.24, fontSize: o.size || 15, bold: o.bold !== false, color: C.text2, valign: "middle" }));
}
function bullets(items, o = {}) {
  return items.map((t, i) => ({ text: "• " + t, options: { breakLine: i < items.length - 1, paraSpaceAfter: o.space || 8, rtlMode: true } }));
}
function table(s, header, rows, o) {
  // header/rows given in reading order (right to left); reverse for layout
  const rev = (r) => r.slice().reverse();
  const hdr = rev(header).map((t) => ({ text: t, options: { bold: true, color: HEX.lt1, fill: { color: HEX.dk2 }, align: "right", rtlMode: true, fontSize: o.fs || 14 } }));
  const body = rows.map((r, ri) => rev(r).map((t) => ({ text: t, options: { color: HEX.dk1, fill: { color: ri % 2 ? "FFFFFF" : HEX.lt2 }, align: "right", rtlMode: true, fontSize: o.fs || 14 } })));
  s.addTable([hdr, ...body], { x: o.x || M, y: o.y, w: o.w || CW, colW: rev(o.colW), border: { type: "solid", pt: 0.5, color: "D5DCE4" }, margin: 0.08, valign: "middle", rowH: o.rowH, fontFace: "Arial" });
}
function newSlide(layout, kicker, title, section) {
  const s = pres.addSlide({ masterName: layout, sectionTitle: section });
  if (kicker) s.addText(kicker, { placeholder: "kicker", rtlMode: true, align: "right" });
  if (title) s.addText(title, { placeholder: "title", rtlMode: true, align: "right" });
  return s;
}
async function stepsFlow(s, steps, y, h, o = {}) {
  const n = steps.length;
  const aw = 0.35, gap = 0.15;
  const cw = (CW - (n - 1) * (aw + 2 * gap)) / n;
  for (let i = 0; i < n; i++) {
    const x = M + CW - (i + 1) * cw - i * (aw + 2 * gap);
    const st = steps[i];
    await card(s, x, y, cw, h, { icon: st.icon, num: st.num, title: st.title, body: st.body, dark: st.dark, titleSize: o.titleSize || 17, bodySize: o.bodySize || 13 });
    if (i < n - 1) {
      s.addShape(pres.shapes.LEFT_ARROW, { x: x - gap - aw, y: y + h / 2 - 0.18, w: aw, h: 0.36, fill: { color: C.accent1 }, line: { color: C.accent1, width: 0 }, objectName: "arrow" });
    }
  }
}

// ---------- slides ----------
async function build() {
  // ===== Opening =====
  pres.addSection({ title: "الافتتاح" });
  let s = pres.addSlide({ masterName: "DIVIDER", sectionTitle: "الافتتاح" });
  s.addText("دورة تطوير المواقع الإلكترونية بمساعدة الذكاء الاصطناعي", { placeholder: "kicker", rtlMode: true, align: "right" });
  s.addText("اليوم الأول: تحليل الاحتياج وتخطيط المشروع", { placeholder: "title", rtlMode: true, align: "right" });
  s.addText("من فكرة لخطة واضحة، والـ AI مساعدك", R({ x: M, y: 4.2, w: CW, h: 0.5, fontSize: 22, color: "C9D6E0" }));
  s.addText("المدرب: حسام عليان", R({ x: M, y: 4.8, w: CW, h: 0.45, fontSize: 18, color: C.background1, bold: true }));
  // day dots
  for (let i = 0; i < 5; i++) {
    const x = W - M - 0.55 - i * 0.75;
    s.addShape(pres.shapes.OVAL, { x, y: 1.3, w: 0.55, h: 0.55, fill: { color: i === 0 ? C.accent1 : "2C4A66" }, line: { color: i === 0 ? C.accent1 : "2C4A66", width: 0 }, objectName: "day-dot" });
    s.addText(String(i + 1), { x, y: 1.3, w: 0.55, h: 0.55, fontSize: 16, bold: true, color: HEX.lt1, align: "center", valign: "middle", margin: 0, isTextBox: true });
  }
  s.addNotes("رحّب بالمشاركين. الدورة 5 أيام × 4 ساعات، وكل يوم إله مخرج بيتسلّم آخر اليوم. الدوائر الخمسة فوق هي أيام الدورة، واليوم الأول هو البرتقالي.");

  s = newSlide("CONTENT", "افتتاح", "أهلاً، أنا حسام", "الافتتاح");
  s.addText("مطور Full-Stack. بشتغل على بناء مواقع وتطبيقات، وبستخدم الذكاء الاصطناعي بشغلي كل يوم. هاد الأسبوع رح أعلمكم نفس الطريقة.", R({ x: M, y: 1.8, w: CW, h: 0.9, fontSize: 18, color: "3E5266" }));
  {
    const { xs, cw } = colsX(3);
    await card(s, xs[0], 3.0, cw, 2.6, { icon: "FaLaptopCode", title: "مواقع وتطبيقات ويب", body: "واجهات وأنظمة كاملة لشركات ومشاريع حقيقية" });
    await card(s, xs[1], 3.0, cw, 2.6, { icon: "FaRobot", title: "أنظمة بالذكاء الاصطناعي", body: "تطبيقات بتستخدم الـ AI للبحث والإجابة على الأسئلة" });
    await card(s, xs[2], 3.0, cw, 2.6, { icon: "FaUsers", dark: true, title: "وأنتم؟", body: "اسمك، شو بتشتغل أو بتدرس، وهل عمرك استخدمت ChatGPT أو أداة شبهه؟" });
  }
  s.addNotes("عرّف بنفسك بدقيقتين. جولة التعارف: 20 ثانية لكل واحد. مع 40 شخص بتاخذ حوالي 13 دقيقة، فلو العدد كبير اكتفِ بالاسم وسؤال الـ AI برفع الإيد. سجّل مين عنده خبرة عشان توزعهم على الفرق بعدين.");

  s = newSlide("CONTENT", "خطة الأسبوع", "خمس أيام، كل يوم إله مخرج", "الافتتاح");
  await stepsFlow(s, [
    { icon: "FaClipboardList", num: "اليوم 1", title: "التخطيط", body: "وثيقة المتطلبات", dark: true },
    { icon: "FaPalette", num: "اليوم 2", title: "التصميم", body: "تصميم أولي معتمد" },
    { icon: "FaCode", num: "اليوم 3", title: "البناء", body: "نسخة بتشتغل على جهازك" },
    { icon: "FaVial", num: "اليوم 4", title: "الاختبار", body: "نسخة محسّنة وتقرير اختبار" },
    { icon: "FaRocket", num: "اليوم 5", title: "النشر", body: "موقع منشور وعرض المشروع" },
  ], 1.9, 3.2);
  callout(s, M, 5.5, CW, 0.8, "كل يوم بيبني على اللي قبله، فالغياب يوم واحد بيأخر فريقك كله");
  s.addNotes("«كل يوم إله مخرج، وكل مخرج بيبني على اللي قبله: نخطط، نصمم، نبني، نختبر، ننشر. الغياب يوم بيأخر فريقك كله.» 3 دقائق.");

  s = newSlide("STATEMENT", "الهدف النهائي", "بعد خمس أيام، كل فريق رح يكون عنده موقع منشور على رابط حقيقي", "الافتتاح");
  s.addText("من 3 لـ 6 صفحات · ميزتين تفاعليتين على الأقل · بيشتغل على الجوال", R({ x: M, y: 4.6, w: CW, h: 0.5, fontSize: 20, bold: true, color: C.text2 }));
  s.addText("شوفوا موقع الدورة: هيك رح تطلعوا", R({ x: M, y: 5.2, w: CW, h: 0.5, fontSize: 18, color: C.text2 }));
  s.addNotes("افتح موقع الدورة على الشاشة وبعدين من جوالك. «بعد خمس أيام كل فريق رح يكون عنده موقع زي هاد، منشور على رابط حقيقي بيقدر يبعته لأي حدا.» افتح صفحة المشاريع: «هون رح تكون مشاريعكم. هلأ كلها قريباً، ويوم 5 رح نحط روابطها سوا.» إذا بنيته بمساعدة الـ AI احكيلهم هيك.");

  s = newSlide("CONTENT", "التقييم", "العلامة اليومية من 10", "الافتتاح");
  {
    const items = [["2", "الحضور والالتزام بالوقت"], ["5", "مخرج اليوم"], ["2", "الفهم الفردي"], ["1", "المشاركة والتعاون"]];
    const { xs, cw } = colsX(4);
    items.forEach(([n, t], i) => {
      box(s, xs[i], 2.0, cw, 2.6, i === 1 ? C.text2 : C.background2);
      s.addText(n, { x: xs[i], y: 2.2, w: cw, h: 1.3, fontSize: 66, bold: true, color: i === 1 ? HEX.accent6 : HEX.accent1, align: "center", valign: "middle", margin: 0, isTextBox: true });
      s.addText(t, { x: xs[i] + 0.2, y: 3.6, w: cw - 0.4, h: 0.7, fontSize: 17, bold: true, color: i === 1 ? HEX.lt1 : HEX.dk2, align: "center", valign: "top", margin: 0, rtlMode: true, isTextBox: true });
    });
  }
  callout(s, M, 5.0, CW, 0.9, "آخر كل يوم: بتسلّم مخرج اليوم وبتجاوب سؤال «اشرح بكلماتك» على Google Form. السؤال فردي، كل واحد بيجاوبه لحاله.", { bold: false });
  s.addNotes("اشرح توزيع العلامة: الحضور 2، المخرج 5 (حسب بنود checklist اليوم)، الفهم الفردي 2 (سؤال اشرح بكلماتك)، المشاركة 1. المخرج مشترك للفريق، بس سؤال الفهم بيفرّق بين اللي اشتغل واللي اتكل على زميله.");

  s = newSlide("CONTENT", "قواعد القاعة", "لما تعلق: 3 خطوات قبل المدرب", "الافتتاح");
  {
    const steps = [["FaRobot", "اسأل الـ AI", "انسخ الخطأ أو اوصف المشكلة"], ["FaListUl", "شوف ورقة الأخطاء الشائعة", "أغلب المشاكل حلها مكتوب"], ["FaUserFriends", "اسأل زميلك", "بالفريق أو الفريق اللي جنبك"], ["FaHandPaper", "ارفع الإشارة الحمرا", "المدرب جاي"]];
    for (let i = 0; i < 4; i++) {
      const y = 1.85 + i * 1.05;
      await iconCircle(s, steps[i][0], W - M - 0.75, y, 0.75, i === 3 ? C.text2 : C.accent1);
      s.addText(`${i + 1}. ${steps[i][1]}`, R({ x: 5.6, y: y + 0.02, w: 6.25, h: 0.4, fontSize: 19, bold: true, color: C.text2 }));
      s.addText(steps[i][2], R({ x: 5.6, y: y + 0.42, w: 6.25, h: 0.35, fontSize: 14, color: "3E5266" }));
    }
    box(s, M, 1.85, 4.5, 4.1, C.background2);
    s.addText("نظام الإشارات", R({ x: M + 0.3, y: 2.05, w: 3.9, h: 0.45, fontSize: 19, bold: true, color: C.text2 }));
    s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: M + 3.3, y: 2.8, w: 0.9, h: 0.9, rectRadius: 0.1, fill: { color: "2A9D8F" }, line: { color: "2A9D8F", width: 0 }, objectName: "green-card" });
    s.addText("أخضر: ماشيين", R({ x: M + 0.3, y: 2.95, w: 2.8, h: 0.6, fontSize: 17, bold: true, valign: "middle" }));
    s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: M + 3.3, y: 4.0, w: 0.9, h: 0.9, rectRadius: 0.1, fill: { color: "C0392B" }, line: { color: "C0392B", width: 0 }, objectName: "red-card" });
    s.addText("أحمر: عالقين بعد الخطوات الثلاث", R({ x: M + 0.3, y: 4.0, w: 2.8, h: 0.9, fontSize: 17, bold: true, valign: "middle" }));
    s.addText("ورقة على الطاولة، بشوف القاعة كلها بنظرة", R({ x: M + 0.3, y: 5.15, w: 3.9, h: 0.6, fontSize: 13, color: "3E5266" }));
  }
  s.addNotes("قاعدة «3 قبل المدرب»: اسأل الـ AI، شوف ورقة الأخطاء، اسأل زميلك، بعدين ارفع الإشارة الحمرا. كل فريق معه ورقتين أخضر وأحمر فوق اللابتوب. هيك بتشوف حالة القاعة بنظرة، ومع 40 شخص بدون مساعد هاد ضروري.");

  s = newSlide("CONTENT", "أجندة اليوم", "شو رح نعمل اليوم؟", "الافتتاح");
  table(s, ["الوقت", "الجزء", "الموضوع"], [
    ["0:00", "افتتاح", "تعارف، خطة الأسبوع، التقييم"],
    ["0:20", "تجهيز", "فحص الأجهزة والبرامج"],
    ["0:35", "الدورة 1", "كيف بيشتغل الويب"],
    ["0:55", "الدورة 2", "الذكاء الاصطناعي وأدواته وحدوده"],
    ["1:10", "الدورة 3", "أول صفحة ويب: بطاقة التعريف"],
    ["1:35", "استراحة", "15 دقيقة"],
    ["1:50", "الدورة 4", "أنواع المواقع واختيار الفكرة"],
    ["2:15", "الدورة 5", "فن الـ Prompt"],
    ["2:45", "الدورة 6", "تخطيط الموقع"],
    ["3:30", "الختام", "إكمال الوثيقة، العروض، التسليم"],
  ], { y: 1.8, colW: [1.6, 2.2, 8.333], rowH: 0.44, fs: 14 });
  s.addNotes("اعرض الأجندة بسرعة. كل دورة فيها شرح قصير وبعده تطبيق مباشر على مشروعكم، فوثيقة المتطلبات بتنبني قطعة قطعة خلال اليوم.");

  s = newSlide("CONTENT", "تجهيز · 15 دقيقة", "جهّز جهازك قبل ما نبلش", "الافتتاح");
  {
    const items = [["FaChrome", "Google Chrome", "مثبت وبيفتح"], ["FaCode", "Visual Studio Code", "مثبت وبيفتح"], ["FaPlug", "إضافة Live Server", "من قائمة Extensions داخل VS Code"], ["FaRobot", "حساب AI مجاني", "ChatGPT أو Claude أو Gemini، مفتوح بتبويب"], ["FaWhatsapp", "مجموعة WhatsApp الدورة", "فيها الملفات والروابط"]];
    const { xs, cw } = colsX(5, 0.25);
    for (let i = 0; i < 5; i++) await card(s, xs[i], 1.9, cw, 2.9, { icon: items[i][0], title: items[i][1], body: items[i][2], titleSize: 16, bodySize: 13, titleH: 0.7 });
  }
  callout(s, M, 5.2, CW, 0.9, "خلصت؟ ارفع الورقة الخضرا وساعد جارك. الجهاز اللي ما اشتغل بعد 10 دقايق بيشتغل صاحبه مع زميله، وبنرجعله بالاستراحة.", { bold: false });
  s.addNotes("اعرض القائمة واطلب من كل واحد يرفع الأخضر لما يخلص. اللي بيخلص بكّير بيساعد جاره. ما توقف القاعة كلها على جهاز واحد.");

  // ===== Cycle 1 =====
  pres.addSection({ title: "الدورة 1: كيف بيشتغل الويب" });
  const S1 = "الدورة 1: كيف بيشتغل الويب";
  s = newSlide("DIVIDER", "الدورة 1 · 20 دقيقة", "كيف بيشتغل الويب؟", S1);
  s.addText("الموقع ملفات · رحلة الرابط · Frontend و Backend · ثابت وديناميكي · الدومين والاستضافة", R({ x: M, y: 4.3, w: CW, h: 0.5, fontSize: 18, color: "C9D6E0" }));
  s.addNotes("الهدف: المشارك بيفهم إن الموقع ملفات، وبيفرّق بين Frontend و Backend وبين الثابت والديناميكي، وبيعرف شو الدومين والاستضافة.");

  s = newSlide("CONTENT", "الدورة 1 · كيف بيشتغل الويب", "الموقع = ملفات", S1);
  s.addText("أي موقع شفتوه هو بالنهاية ملفات: نصوص وصور وأكواد، محطوطة على كمبيوتر شغال 24 ساعة. ومتصفحك بيجيب هاي الملفات وبيرتبها قدامك.", R({ x: M, y: 1.8, w: CW, h: 0.9, fontSize: 19, color: "3E5266" }));
  {
    const files = [["FaFileCode", "index.html"], ["FaPaintBrush", "style.css"], ["FaBolt", "script.js"], ["FaImage", "photo.jpg"]];
    for (let i = 0; i < 4; i++) {
      const x = W - M - 1.9 - i * 2.15;
      box(s, x, 3.1, 1.9, 1.6, C.background2);
      await iconCircle(s, files[i][0], x + 0.6, 3.25, 0.7, C.accent2);
      s.addText(files[i][1], { x, y: 4.05, w: 1.9, h: 0.45, fontSize: 14, bold: true, color: HEX.dk2, align: "center", margin: 0, isTextBox: true });
    }
    s.addShape(pres.shapes.LEFT_ARROW, { x: 3.45, y: 3.65, w: 0.9, h: 0.5, fill: { color: C.accent1 }, line: { color: C.accent1, width: 0 }, objectName: "arrow" });
    box(s, M, 3.1, 2.7, 1.6, C.text2);
    await iconCircle(s, "FaDesktop", M + 1.0, 3.25, 0.7, C.accent1);
    s.addText("المتصفح بيعرض الصفحة", { x: M, y: 4.05, w: 2.7, h: 0.45, fontSize: 14, bold: true, color: HEX.lt1, align: "center", margin: 0, rtlMode: true, isTextBox: true });
  }
  callout(s, M, 5.2, CW, 0.8, "سؤال للقاعة: شو آخر موقع فتحتوه اليوم؟");
  s.addNotes("ابدأ بالسؤال: شو آخر موقع فتحتوه اليوم؟ بعدين: «أي موقع شفتوه هو بالنهاية ملفات... ومتصفحك بيجيب هاي الملفات وبيرتبها قدامك.» دقيقتين.");

  s = newSlide("CONTENT", "الدورة 1 · كيف بيشتغل الويب", "رحلة الرابط: من الضغطة للصفحة", S1);
  await stepsFlow(s, [
    { icon: "FaUser", title: "أنت", body: "بتكتب الرابط أو بتضغط عليه" },
    { icon: "FaChrome", title: "المتصفح", body: "Browser بيبدأ الطلب" },
    { icon: "FaAddressBook", title: "DNS", body: "بيحوّل الاسم لعنوان IP" },
    { icon: "FaServer", title: "الخادم", body: "Server بيبعت الملفات" },
    { icon: "FaDesktop", title: "الشاشة", body: "المتصفح بيعرض الصفحة", dark: true },
  ], 1.85, 2.6, { bodySize: 13 });
  {
    const { xs, cw } = colsX(2);
    await card(s, xs[0], 4.75, cw, 1.75, { title: "DNS زي دليل الهاتف", body: "أنت بتعرف الاسم (google.com)، والدليل بيعطي المتصفح الرقم (عنوان IP) عشان يوصل للخادم.", titleH: 0.4 });
    await card(s, xs[1], 4.75, cw, 1.75, { title: "الملفات بتيجي بالترتيب", body: "الخادم بيبعت ملف HTML أول، وبعدين المتصفح بيطلب الملفات المذكورة فيه: CSS و JavaScript والصور.", titleH: 0.4 });
  }
  s.addNotes("ارسمها على السبورة بأسهم. تشبيه DNS: دليل الهاتف. النقطة المهمة: الخادم بيبعت HTML أول، وبعدين المتصفح بيطلب CSS و JavaScript والصور. 4 دقائق.");

  s = newSlide("CONTENT", "الدورة 1 · كيف بيشتغل الويب", "Frontend و Backend: الصالة والمطبخ", S1);
  {
    const { xs, cw } = colsX(2, 0.4);
    await card(s, xs[0], 1.85, cw, 3.6, { icon: "FaChair", title: "Frontend = الصالة", body: bullets(["اللي بتشوفه: القائمة، الطاولات، الديكور", "مبني بـ HTML و CSS و JavaScript", "بيشتغل داخل المتصفح"]), bodySize: 16, titleSize: 22, titleH: 0.55 });
    await card(s, xs[1], 1.85, cw, 3.6, { icon: "FaUtensils", iconFill: C.text2, title: "Backend = المطبخ", body: bullets(["اللي ما بتشوفه: تحضير الطلبات، المخزن، الفواتير", "برامج على الخادم + قاعدة بيانات", "تسجيل الدخول، حفظ الطلبات، الدفع"]), bodySize: 16, titleSize: 22, titleH: 0.55 });
  }
  callout(s, M, 5.75, CW, 0.75, "هاد الأسبوع رح نبني Frontend فقط");
  s.addNotes("تشبيه المطعم: الصالة اللي بتشوفها هي الـ Frontend، والمطبخ اللي ما بتشوفه هو الـ Backend. «هاد الأسبوع رح نبني Frontend فقط.» 4 دقائق.");

  s = newSlide("CONTENT", "الدورة 1 · كيف بيشتغل الويب", "موقع ثابت ولا ديناميكي؟", S1);
  {
    const { xs, cw } = colsX(2, 0.4);
    await card(s, xs[0], 1.85, cw, 3.5, { icon: "FaBookOpen", iconFill: C.accent2, title: "ثابت (Static)", body: bullets(["نفس الملفات بتوصل لكل الزوار، زي منيو مطبوع", "المحتوى ما بيتغير إلا لما صاحب الموقع يعدّل الملفات", "مثال: موقع مطعم فيه المنيو وساعات الدوام"]), bodySize: 16, titleSize: 22, titleH: 0.55 });
    await card(s, xs[1], 1.85, cw, 3.5, { icon: "FaUserCog", iconFill: C.text2, title: "ديناميكي (Dynamic)", body: bullets(["الصفحة بتتجهز خصيصاً إلك، وبدها Backend", "أمثلة: صفحتك على Facebook أو Instagram، تطبيق البنك", "متجر فيه سلة ودفع، البريد الإلكتروني"]), bodySize: 16, titleSize: 22, titleH: 0.55 });
  }
  callout(s, M, 5.65, CW, 0.85, "ثابت مش يعني بدون حركة: الموقع الثابت بيقدر يكون فيه أزرار وقوائم وفلترة وحركات بـ JavaScript");
  s.addNotes("ثابت: نفس الملفات للكل زي منيو مطبوع. ديناميكي: الصفحة بتتجهز إلك وبدها Backend. صحح الفكرة الشائعة: ثابت مش يعني بدون حركة. «مواقعنا رح تكون ثابتة، وهاد مش ضعف.» 5 دقائق مع الشريحة الجاية.");

  s = newSlide("CONTENT", "الدورة 1 · كيف بيشتغل الويب", "10 أمثلة على مواقع ثابتة", S1);
  {
    const ex = [["FaQrcode", "منيو مطعم بالـ QR", "الأصناف والأسعار"], ["FaHeart", "دعوة عرس أو حفلة", "الموعد والمكان وعداد تنازلي"], ["FaIdCard", "سيرة ذاتية إلكترونية", "الخبرات والمهارات ورابط الـ PDF"], ["FaCamera", "ملف أعمال مصوّر", "معرض صور لشغله"], ["FaMicrophone", "صفحة فعالية أو مؤتمر", "البرنامج والمتحدثين والموعد"],
      ["FaClinicMedical", "موقع عيادة أو صالون", "الخدمات وساعات الدوام"], ["FaHandsHelping", "حملة توعية أو مبادرة", "الرسالة وطرق المشاركة"], ["FaMobileAlt", "صفحة تطبيق جوال", "المميزات وأزرار التحميل"], ["FaQuestionCircle", "دليل أو أسئلة شائعة", "صفحات شرح منظمة"], ["FaChalkboardTeacher", "موقع دورة تدريبية", "زي موقع دورتنا"]];
    const { xs, cw } = colsX(5, 0.25);
    for (let i = 0; i < 10; i++) {
      const y = i < 5 ? 1.8 : 4.05;
      await card(s, xs[i % 5], y, cw, 2.0, { icon: ex[i][0], iconFill: C.accent2, title: ex[i][1], body: ex[i][2], titleSize: 14, bodySize: 12, titleH: 0.5 });
    }
  }
  s.addText("شو المشترك بينهم؟ الكل بيشوف نفس المحتوى، وما حدا بيسجل دخول.", R({ x: M, y: 6.25, w: CW, h: 0.4, fontSize: 15, bold: true, color: C.accent1 }));
  s.addNotes("اعرض الأمثلة بسرعة، واسألهم بالنهاية: شو المشترك بينهم؟ الجواب: الكل بيشوف نفس المحتوى وما حدا بيسجل دخول. «شوفوا قديش أنواع مواقع بتنفع تكون ثابتة.»");

  s = newSlide("CONTENT", "الدورة 1 · كيف بيشتغل الويب", "الدومين والاستضافة: العنوان والبيت", S1);
  {
    const { xs, cw } = colsX(2, 0.4);
    await card(s, xs[0], 1.85, cw, 3.0, { icon: "FaSignature", title: "الدومين (Domain) = العنوان", body: bullets(["اسم موقعك على الإنترنت، مثل mybakery.com", "الدومين الخاص اشتراك سنوي مدفوع"]), bodySize: 16, titleSize: 20, titleH: 0.55 });
    await card(s, xs[1], 1.85, cw, 3.0, { icon: "FaHome", iconFill: C.accent2, title: "الاستضافة (Hosting) = البيت", body: bullets(["الكمبيوتر اللي ساكنة فيه ملفات موقعك", "للمواقع الثابتة في خدمات مجانية زي Netlify"]), bodySize: 16, titleSize: 20, titleH: 0.55 });
  }
  box(s, 3.2, 5.15, 6.9, 0.8, C.text2);
  s.addText("my-bakery.netlify.app", { x: 3.2, y: 5.15, w: 6.9, h: 0.8, fontSize: 24, bold: true, color: HEX.accent6, align: "center", valign: "middle", margin: 0, isTextBox: true });
  s.addText("يوم 5 رح ننشر على Netlify وناخد رابط مجاني بهاد الشكل، بس باسم موقعكم", R({ x: M, y: 6.15, w: CW, h: 0.4, fontSize: 15, color: "3E5266", align: "center" }));
  s.addNotes("الدومين هو العنوان، والاستضافة هي البيت اللي ساكن فيه موقعك. الدومين الخاص مدفوع سنوياً، والاستضافة للمواقع الثابتة فيها خدمات مجانية زي Netlify. 3 دقائق.");

  s = newSlide("CONTENT", "الدورة 1 · اختبر نفسك", "سؤالين سريعين", S1);
  {
    const { xs, cw } = colsX(2, 0.4);
    await card(s, xs[0], 1.9, cw, 3.4, { icon: "FaLock", title: "تسجيل الدخول بكلمة سر: Frontend ولا Backend؟", body: "الجواب: الاثنين. النموذج اللي بتكتب فيه Frontend، والتحقق من كلمة السر Backend.", titleSize: 20, titleH: 1.0, bodySize: 16 });
    await card(s, xs[1], 1.9, cw, 3.4, { icon: "FaBreadSlice", iconFill: C.accent2, title: "موقع مخبز فيه المنتجات ورقم التلفون: ثابت ولا ديناميكي؟", body: "الجواب: ثابت. نفس المحتوى للكل.", titleSize: 20, titleH: 1.0, bodySize: 16 });
  }
  callout(s, M, 5.6, CW, 0.8, "عرفنا شو بدنا نبني. هلأ خلونا نتعرف على الأداة اللي رح تساعدنا نبنيه");
  s.addNotes("سؤالين برفع الإيد قبل ما تكشف الجواب. السؤال الأول جوابه «الاثنين» عن قصد، عشان يفهموا إن الطبقتين بيشتغلوا مع بعض. دقيقتين.");

  // ===== Cycle 2 =====
  const S2 = "الدورة 2: الذكاء الاصطناعي";
  pres.addSection({ title: S2 });
  s = newSlide("DIVIDER", "الدورة 2 · 15 دقيقة", "الذكاء الاصطناعي: مساعدك، مش بديلك", S2);
  s.addText("شو هو · خريطة الأدوات · حدوده · القاعدة الذهبية", R({ x: M, y: 4.3, w: CW, h: 0.5, fontSize: 18, color: "C9D6E0" }));
  s.addNotes("الهدف: المشارك بيفهم شو الـ AI التوليدي بشكل مبسط، وبيعرف 4 أنواع من أدواته، وبيعرف حدوده.");

  s = newSlide("CONTENT", "الدورة 2 · الذكاء الاصطناعي", "شو هو الـ AI التوليدي؟", S2);
  s.addText("برنامج اتدرب على كمية ضخمة من النصوص والأكواد، فتعلم الأنماط. لما تسأله، بيكتب الجواب كلمة بعد كلمة حسب اللي تعلمه.", R({ x: M, y: 1.85, w: CW, h: 1.0, fontSize: 20, color: "3E5266" }));
  {
    const { xs, cw } = colsX(2, 0.4);
    await card(s, xs[0], 3.15, cw, 2.2, { icon: "FaKeyboard", title: "تشبيه", body: "زي الإكمال التلقائي بكيبورد جوالك، بس أذكى بملايين المرات.", bodySize: 17, titleSize: 20 });
    await card(s, xs[1], 3.15, cw, 2.2, { icon: "FaExclamationTriangle", iconFill: C.text2, dark: true, title: "النتيجة المهمة", body: "بيكتب اللي بيبين صح، مش دايماً اللي هو صح.", bodySize: 17, titleSize: 20 });
  }
  s.addNotes("اشرح الفكرة ببساطة: تدرّب على نصوص وأكواد وتعلّم الأنماط. التشبيه: الإكمال التلقائي بالجوال. النتيجة المهمة: بيكتب اللي بيبين صح، مش دايماً اللي هو صح. 3 دقائق.");

  s = newSlide("CONTENT", "الدورة 2 · الذكاء الاصطناعي", "خريطة أدوات الـ AI لتطوير المواقع", S2);
  {
    const tools = [
      ["FaComments", "مساعدات المحادثة", "ChatGPT · Claude · Gemini", "تخطيط، كتابة كود، شرح، حل أخطاء", "الأداة الأساسية طول الأسبوع", true],
      ["FaCode", "مساعدات الكود", "GitHub Copilot داخل VS Code", "بتقترح كود وانت بتكتب", "نذكرها فقط، للتعلم بعد الدورة"],
      ["FaPalette", "أدوات التصميم", "v0 · ميزات AI في Figma و Canva", "بتولّد واجهات وتصاميم من وصف", "ممكن نجرب وحدة يوم 2"],
      ["FaMagic", "منشئات المواقع", "Wix · Framer", "بتبني موقع كامل من جملة وحدة", "مش رح نستخدمها"],
    ];
    const { xs, cw } = colsX(4, 0.25);
    for (let i = 0; i < 4; i++) {
      const t = tools[i];
      await card(s, xs[i], 1.8, cw, 3.55, { icon: t[0], dark: t[5], title: t[1], body: [{ text: t[2], options: { bold: true, breakLine: true, rtlMode: true } }, { text: t[3], options: { rtlMode: true } }], titleSize: 17, bodySize: 13, tag: t[4] });
    }
  }
  callout(s, M, 5.6, CW, 0.9, "ليش مش Wix؟ لأنها بتعطيك نتيجة بدون ما تفهم، وموقعك بيضل مربوط بمنصتها. هدفنا نفهم ونتحكم، وهاد بيفيدك حتى لو استخدمت Wix بعدين.", { bold: false, size: 14 });
  s.addNotes("اشرح الأنواع الأربعة ومتى نستخدم كل وحدة. السؤال المتوقع: ليش ما نستخدم Wix؟ الجواب على الشريحة. قبل الدورة تأكد إن الأدوات لسا متاحة ونسخها المجانية شغالة. 5 دقائق.");

  s = newSlide("CONTENT", "الدورة 2 · الذكاء الاصطناعي", "5 أشياء لازم تعرفها عن حدوده", S2);
  {
    const lim = [["FaTimesCircle", "بيغلط بثقة", "ممكن يعطيك كود ما بيشتغل وهو مقتنع إنه صح"], ["FaGhost", "بيخترع (Hallucination)", "أحياناً بيذكر أداة أو معلومة مش موجودة"], ["FaFolderOpen", "ما بيعرف مشروعك", "بيعرف بس اللي بتحكيله، والمحادثة الجديدة بتبدأ من الصفر"], ["FaCalendarAlt", "معلوماته إلها تاريخ", "ممكن ما يعرف أحدث الأدوات والتغييرات"], ["FaUserShield", "الخصوصية", "لا تحط معلومات شخصية حساسة أو كلمات سر بالمحادثة"]];
    for (let i = 0; i < 5; i++) {
      const y = 1.8 + i * 0.95;
      box(s, M, y, CW, 0.8, C.background2);
      await iconCircle(s, lim[i][0], W - M - 0.7, y + 0.1, 0.6, i === 4 ? C.text2 : C.accent1);
      s.addText(lim[i][1], R({ x: 7.6, y: y, w: 4.3, h: 0.8, fontSize: 18, bold: true, color: C.text2, valign: "middle" }));
      s.addText(lim[i][2], R({ x: M + 0.3, y: y, w: 6.7, h: 0.8, fontSize: 15, color: "3E5266", valign: "middle" }));
    }
  }
  s.addNotes("عرض حي اختياري: اسأله عن شي محلي صغير (مطعم صغير بحيك) وشوف إذا بيخترع. جربه قبل الدورة. 4 دقائق.");

  s = newSlide("STATEMENT", "القاعدة الذهبية", "إذا ما بتقدر تشرح الكود بجملة وحدة، لا تحطه بموقعك", S2);
  s.addText("اطلب من الـ AI يشرحلك قبل ما تنسخ. وسؤال الفهم بالتقييم اليومي مبني على هاي القاعدة.", R({ x: M, y: 4.7, w: CW, h: 0.8, fontSize: 20, color: C.text2 }));
  s.addNotes("هاي القاعدة رح نرجعلها كل يوم. سؤال للتأكد: «الـ AI قلك إن في أداة اسمها كذا بتعمل موقعك بضغطة، شو بتعمل؟» الجواب: بتتأكد ببحث على Google قبل ما تصدق. انتقال: «كفاية نظري، هلأ كل واحد رح يعمل أول صفحة ويب إله.»");

  // ===== Cycle 3 =====
  const S3 = "الدورة 3: أول صفحة ويب";
  pres.addSection({ title: S3 });
  s = newSlide("DIVIDER", "الدورة 3 · 25 دقيقة", "أول صفحة ويب: بطاقة التعريف", S3);
  s.addText("7 دقائق عرض من المدرب · 10 دقائق تطبيق · 6 دقائق تحديات بالـ AI · 2 دقيقة تأكد", R({ x: M, y: 4.3, w: CW, h: 0.5, fontSize: 18, color: "C9D6E0" }));
  s.addNotes("جهّز قبل الدورة: الكود منشور بمجموعة WhatsApp كملف نصي، وملف index.html جاهز على فلاشة كخطة بديلة.");

  s = newSlide("CONTENT", "الدورة 3 · أول صفحة ويب", "الطبقات الثلاث: تشبيه البيت", S3);
  {
    const L = [["FaHtml5", "HTML", "الجدران والغرف", "شو موجود بالصفحة: عناوين، نصوص، صور، أزرار"], ["FaCss3Alt", "CSS", "الدهان والديكور", "كيف شكلها: ألوان، خطوط، مسافات، ترتيب"], ["FaJs", "JavaScript", "الكهرباء", "شو بيصير لما تضغط: رسالة، قائمة بتنفتح، فلترة"]];
    const { xs, cw } = colsX(3, 0.35);
    for (let i = 0; i < 3; i++) await card(s, xs[i], 1.9, cw, 3.2, { icon: L[i][0], iconFill: [C.accent1, C.accent2, C.text2][i], title: L[i][1], body: [{ text: L[i][2], options: { bold: true, breakLine: true, rtlMode: true, fontSize: 18, color: HEX.dk2 } }, { text: L[i][3], options: { rtlMode: true } }], titleSize: 26, titleH: 0.6, bodySize: 15 });
  }
  s.addNotes("«HTML هو الجدران والغرف (شو موجود)، CSS هو الدهان والديكور (كيف شكله)، JavaScript هو الكهرباء (شو بيصير لما تضغط).» رح تشوفوا الثلاثة بملف واحد صغير.");

  s = newSlide("CONTENT", "الدورة 3 · أول صفحة ويب", "شو فيها بطاقة التعريف؟", S3);
  {
    // mock card on the left
    const x0 = 1.3, y0 = 1.75, w0 = 3.6, h0 = 4.85;
    s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: x0, y: y0, w: w0, h: h0, rectRadius: 0.15, fill: { color: C.background1 }, line: { color: "D5DCE4", width: 1 }, shadow: { type: "outer", color: "000000", blur: 8, offset: 2, angle: 90, opacity: 0.15 }, objectName: "mock-card" });
    s.addText("😊", { x: x0, y: y0 + 0.15, w: w0, h: 0.6, fontSize: 30, align: "center", margin: 0, isTextBox: true });
    s.addText("اسمي هنا", { x: x0, y: y0 + 0.8, w: w0, h: 0.45, fontSize: 20, bold: true, color: HEX.dk2, align: "center", margin: 0, rtlMode: true, isTextBox: true });
    s.addText("بحب: القراءة والرياضة", { x: x0, y: y0 + 1.25, w: w0, h: 0.35, fontSize: 13, color: "555555", align: "center", margin: 0, rtlMode: true, isTextBox: true });
    s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: x0 + 1.1, y: y0 + 1.75, w: 1.4, h: 0.42, rectRadius: 0.08, fill: { color: "E07A2F" }, line: { color: "E07A2F", width: 0 }, objectName: "mock-button" });
    s.addText("سلّم علي", { x: x0 + 1.1, y: y0 + 1.75, w: 1.4, h: 0.42, fontSize: 13, bold: true, color: HEX.lt1, align: "center", valign: "middle", margin: 0, rtlMode: true, isTextBox: true });
    s.addShape(pres.shapes.LINE, { x: x0 + 0.4, y: y0 + 2.5, w: w0 - 0.8, h: 0, line: { color: "E5E5E5", width: 1 } });
    s.addText("مشروعي القادم", { x: x0, y: y0 + 2.7, w: w0, h: 0.35, fontSize: 13, color: "555555", align: "center", margin: 0, rtlMode: true, isTextBox: true });
    s.addText("اسم المشروع", { x: x0, y: y0 + 3.05, w: w0, h: 0.45, fontSize: 18, bold: true, color: HEX.dk2, align: "center", margin: 0, rtlMode: true, isTextBox: true });
    s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: x0 + 1.25, y: y0 + 3.6, w: 1.1, h: 0.36, rectRadius: 0.18, fill: { color: HEX.dk2 }, line: { color: HEX.dk2, width: 0 }, objectName: "mock-badge" });
    s.addText("قريباً", { x: x0 + 1.25, y: y0 + 3.6, w: 1.1, h: 0.36, fontSize: 12, bold: true, color: HEX.lt1, align: "center", valign: "middle", margin: 0, rtlMode: true, isTextBox: true });
    s.addText("زور الموقع ←", { x: x0, y: y0 + 4.1, w: w0, h: 0.4, fontSize: 13, color: "999999", align: "center", margin: 0, rtlMode: true, isTextBox: true });
  }
  {
    const pts = [["FaIdBadge", "قسم التعريف", "إيموجي، اسمك، هواياتك، وزر بيسلّم عليك (JavaScript)"], ["FaHourglassHalf", "مشروعي القادم: قريباً", "بتحطوا اسم مشروع الفريق بعد ما تختاروا الفكرة بالدورة 4"], ["FaLink", "يوم 5: الزر بيشتغل", "بتشيلوا «قريباً» وبتحطوا رابط موقعكم المنشور بالزر"]];
    for (let i = 0; i < 3; i++) {
      const y = 1.85 + i * 1.6;
      await iconCircle(s, pts[i][0], W - M - 0.75, y, 0.75, i === 2 ? C.text2 : C.accent1);
      s.addText(pts[i][1], R({ x: 5.6, y: y, w: 6.25, h: 0.45, fontSize: 19, bold: true, color: C.text2 }));
      s.addText(pts[i][2], R({ x: 5.6, y: y + 0.48, w: 6.25, h: 0.8, fontSize: 15, color: "3E5266" }));
    }
  }
  s.addNotes("اعرض البطاقة شغالة على Live Server. اشرح قسم «مشروعي القادم»: «هاد الزر معطّل هلأ. يوم 5 رح نشغله ويفتح موقعكم الحقيقي.»");

  s = newSlide("CONTENT", "الدورة 3 · أول صفحة ويب", "الطبقات الثلاث بالكود", S3);
  {
    const { xs, cw } = colsX(3, 0.3);
    code(s, xs[0], 1.8, cw, 3.7, '<div class="card">\n  <h1>اسمي هنا</h1>\n  <p>بحب: القراءة</p>\n  <span class="badge">\n    قريباً\n  </span>\n</div>', "HTML: المحتوى");
    code(s, xs[1], 1.8, cw, 3.7, ".card {\n  background: white;\n  border-radius: 16px;\n}\nbutton {\n  background: #e07a2f;\n  color: white;\n}", "CSS: الشكل");
    code(s, xs[2], 1.8, cw, 3.7, "<button\n  onclick=\"alert(\n  'أهلاً وسهلاً!')\">\n  سلّم علي\n</button>", "JavaScript: التفاعل");
  }
  callout(s, M, 5.8, CW, 0.75, "الملف الكامل بمجموعة WhatsApp. كل واحد بيلصقه بملف index.html", { bold: false });
  s.addNotes("هاي مقتطفات من الكود الكامل. أشر على التعليقات داخل الملف اللي بتبيّن كل طبقة.");

  s = newSlide("CONTENT", "الدورة 3 · أول صفحة ويب", "خطوات التمرين", S3);
  await stepsFlow(s, [
    { icon: "FaFolderPlus", num: "1", title: "أنشئ مجلد", body: "my-card على سطح المكتب، وافتحه من File ← Open Folder" },
    { icon: "FaFileCode", num: "2", title: "أنشئ الملف", body: "index.html من داخل VS Code، والصق الكود واحفظ Ctrl+S" },
    { icon: "FaPlay", num: "3", title: "شغّله", body: "كليك يمين على الملف ← Open with Live Server" },
    { icon: "FaEdit", num: "4", title: "عدّل", body: "حط اسمك وهواياتك وغيّر الإيموجي، واحفظ" },
    { icon: "FaEye", num: "5", title: "شوف", body: "Live Server بيحدّث الصفحة لحاله", dark: true },
  ], 1.85, 3.4, { bodySize: 13 });
  callout(s, M, 5.6, CW, 0.85, "«اسم المشروع» بيضل مثل ما هو هلأ. بنعبيه بعد ما نختار الأفكار بالدورة 4");
  s.addNotes("المدرب بيعرض الخطوات أولاً (7 دقائق)، وبعدين المشاركين بيطبقوا (10 دقائق). «شوفوا: الملف صار صفحة ويب. هاد اللي حكيناه قبل شوي: الموقع ملفات.»");

  s = newSlide("CONTENT", "الدورة 3 · أول صفحة ويب", "تحديات بالـ AI: عدّل بطاقتك", S3);
  prompt(s, 6.9, 1.85, 5.83, 2.0, "هاد كود صفحة بطاقة تعريف: [الصق الكود]\nبدي [التعديل]. قلي بالضبط أي سطر أغيّر، واشرحلي ليش بجملة وحدة.", 16);
  s.addText("الـ Prompt", R({ x: 6.9, y: 1.45, w: 5.83, h: 0.35, fontSize: 14, bold: true, color: C.accent1 }));
  {
    const ch = [["FaFillDrip", "غيّر لون الزر للون بتحبه"], ["FaCommentDots", "غيّر رسالة الترحيب"], ["FaPlusCircle", "أضف سطر: «مدينتي: ...»"], ["FaQuestion", "اسأله شو بيعمل border-radius وجرب تغير قيمته"]];
    for (let i = 0; i < 4; i++) {
      const y = 1.85 + i * 0.95;
      box(s, M, y, 5.9, 0.8, C.background2);
      await iconCircle(s, ch[i][0], M + 5.9 - 0.7, y + 0.1, 0.6, C.accent2);
      s.addText(ch[i][1], R({ x: M + 0.25, y, w: 4.85, h: 0.8, fontSize: 16, bold: true, color: C.text2, valign: "middle" }));
    }
  }
  callout(s, 6.9, 4.1, 5.83, 1.55, "اطلب تعديل محدد، مش إعادة كتابة الملف كله. إعادة الكتابة بتضيّع اسمك وتعديلاتك.", { size: 15 });
  s.addText("تأكد إنهم فهموا: «أشر على الشاشة: وين الـ HTML؟ وين الـ CSS؟ وين الـ JavaScript؟»", R({ x: M, y: 5.95, w: CW, h: 0.5, fontSize: 15, bold: true, color: C.accent1 }));
  s.addNotes("كل واحد بيختار تحدي أو تحديين (6 دقائق). بعدها سؤالين للتأكد: وين HTML و CSS و JavaScript؟ وشو بيصير إذا عدّلت وما حفظت؟ (الجواب: التعديل ما بيظهر).");

  s = newSlide("CONTENT", "الدورة 3 · أول صفحة ويب", "مشاكل متوقعة وحلها", S3);
  table(s, ["المشكلة", "الحل"], [
    ["Live Server مش باين بالقائمة", "افتح المجلد كامل من File ← Open Folder، مش الملف لحاله"],
    ["الملف انحفظ باسم index.html.txt", "أنشئ الملف من داخل VS Code نفسه، مش من Notepad"],
    ["العربي طالع رموز غريبة", "تأكد إن سطر meta charset=\"UTF-8\" موجود وما انحذف"],
    ["التعديل ما بيظهر بالمتصفح", "احفظ بـ Ctrl+S، أو فعّل Auto Save من قائمة File"],
  ], { y: 1.85, colW: [4.6, 7.533], rowH: 0.8, fs: 16 });
  callout(s, M, 5.75, CW, 0.75, "عندكم هلأ أول صفحة. بعد الاستراحة رح نختار شو الموقع الكامل اللي رح تبنوه");
  s.addNotes("هاي أكثر 4 مشاكل رح تشوفها. حطها بورقة الأخطاء الشائعة.");

  // ===== Cycle 4 =====
  const S4 = "الدورة 4: أنواع المواقع";
  pres.addSection({ title: S4 });
  s = newSlide("DIVIDER", "الدورة 4 · 25 دقيقة", "أنواع المواقع واختيار الفكرة", S4);
  s.addText("15 دقيقة شرح · 10 دقائق تشكيل الفرق واختيار الفكرة", R({ x: M, y: 4.3, w: CW, h: 0.5, fontSize: 18, color: "C9D6E0" }));
  s.addNotes("جهّز قبل الدورة: مثال حقيقي لكل نوع من الأنواع الخمسة الرئيسية (يفضل مواقع أردنية بيعرفوها) مفتوح بتبويبات. «قبل ما تختاروا فكرتكم، خلونا نشوف شو أنواع المواقع الموجودة.»");

  s = newSlide("CONTENT", "الدورة 4 · أنواع المواقع", "الأنواع الخمسة الرئيسية", S4);
  {
    const T5 = [["FaBullseye", "صفحة هبوط", "Landing Page", "صفحة وحدة إلها هدف واحد: تسجيل بفعالية، تحميل تطبيق", "مناسب، بنوسعه لـ 3 صفحات"], ["FaUserTie", "ملف أعمال", "Portfolio", "شخص بيعرض شغله: مصوّر، مصمم، مدرب", "مناسب"], ["FaStore", "موقع تعريفي", "Business Website", "من نحن، خدماتنا، تواصل: مخبز، عيادة، جيم", "الأنسب للدورة"], ["FaShoppingCart", "متجر إلكتروني", "E-commerce", "منتجات وسلة ودفع، وبده Backend", "النسخة التعريفية فقط"], ["FaPenNib", "مدونة", "Blog", "مقالات بتنضاف باستمرار، غالباً بنظام إدارة محتوى", "نسخة بمقالات ثابتة"]];
    const { xs, cw } = colsX(5, 0.25);
    for (let i = 0; i < 5; i++) await card(s, xs[i], 1.8, cw, 4.6, { icon: T5[i][0], dark: i === 2, title: T5[i][1], body: [{ text: T5[i][2], options: { bold: true, breakLine: true, rtlMode: true, color: i === 2 ? HEX.accent6 : HEX.accent2 } }, { text: T5[i][3], options: { rtlMode: true } }], titleSize: 18, bodySize: 13, tag: T5[i][4] });
  }
  s.addNotes("دقيقة ونص لكل نوع مع فتح المثال الحقيقي. 7 دقائق.");

  s = newSlide("CONTENT", "الدورة 4 · أنواع المواقع", "أنواع ثانية، وكلها بتنفع تكون ثابتة", S4);
  {
    const T6 = [["FaMicrophone", "موقع فعالية أو مؤتمر", "البرنامج والمتحدثين والموعد"], ["FaHandsHelping", "موقع منظمة أو مبادرة", "الرسالة والأنشطة وطرق التطوع"], ["FaIdCard", "سيرة ذاتية إلكترونية", "Online CV: الخبرات والمهارات والتعليم"], ["FaMobileAlt", "صفحة منتج أو تطبيق", "مميزات منتج واحد وصوره وأسعاره"], ["FaGraduationCap", "موقع تعليمي أو دورة", "الدورات والبرنامج والمدربين، زي موقع دورتنا"], ["FaBook", "دليل أو أسئلة شائعة", "Documentation / FAQ: صفحات شرح منظمة"]];
    const { xs, cw } = colsX(3, 0.3);
    for (let i = 0; i < 6; i++) await card(s, xs[i % 3], i < 3 ? 1.8 : 4.15, cw, 2.15, { icon: T6[i][0], iconFill: C.accent2, title: T6[i][1], body: T6[i][2], titleSize: 17, bodySize: 14 });
  }
  s.addNotes("جملة وحدة لكل نوع بدون فتح أمثلة. «كل هاي الأنواع بتنفع تكون مواقع ثابتة، زي ما شفنا الصبح.» 3 دقائق.");

  s = newSlide("CONTENT", "الدورة 4 · نطاق المشروع", "شو حجم مشروعكم؟", S4);
  {
    const st = [["3–6", "صفحات", "3 أساسية: الرئيسية، من نحن أو الخدمات، تواصل معنا. والباقي حسب فكرتكم"], ["+2", "ميزات تفاعلية", "على الأقل ميزتين، زي فلترة أو قائمة جوال أو أسئلة بتنفتح وبتسكّر"], ["0", "Backend", "لا تسجيل دخول، لا دفع، لا قاعدة بيانات"]];
    const { xs, cw } = colsX(3, 0.35);
    for (let i = 0; i < 3; i++) {
      box(s, xs[i], 1.8, cw, 3.1, i === 0 ? C.text2 : C.background2);
      s.addText(st[i][0], { x: xs[i], y: 1.95, w: cw, h: 1.1, fontSize: 60, bold: true, color: i === 0 ? HEX.accent6 : HEX.accent1, align: "center", valign: "middle", margin: 0, isTextBox: true });
      s.addText(st[i][1], { x: xs[i], y: 3.05, w: cw, h: 0.45, fontSize: 20, bold: true, color: i === 0 ? HEX.lt1 : HEX.dk2, align: "center", margin: 0, rtlMode: true, isTextBox: true });
      s.addText(st[i][2], { x: xs[i] + 0.3, y: 3.55, w: cw - 0.6, h: 1.2, fontSize: 14, color: i === 0 ? "C9D6E0" : "3E5266", align: "center", margin: 0, rtlMode: true, isTextBox: true, valign: "top" });
    }
  }
  callout(s, M, 5.15, CW, 0.65, "ليش أكثر من 3 صفحات؟ الـ AI بيسرّع البناء، وإذا فهمت أول صفحة، الباقي بيمشي على نفس النمط", { size: 15 });
  callout(s, M, 5.95, CW, 0.65, "فكرتك متجر؟ صفحة منتجات مع فلترة وزر «اطلب الآن» بيودّي لصفحة التواصل. السلة والدفع لخطة التطوير", { size: 15, fill: C.background2, bold: false });
  s.addNotes("هاي قاعدة النطاق لكل الفرق. ارجع لموقع الدورة كمثال: «موقعنا فيه 5 صفحات و3 ميزات تفاعلية.» 4 دقائق مع الشريحة الجاية.");

  s = newSlide("CONTENT", "الدورة 4 · نطاق المشروع", "أمثلة على ميزات تفاعلية بسيطة", S4);
  {
    const F = [["FaBars", "قائمة جوال", "Hamburger menu"], ["FaFilter", "فلترة", "حسب النوع أو التصنيف"], ["FaImages", "معرض صور بيكبر", "Lightbox"], ["FaChevronDown", "أسئلة بتنفتح وبتسكّر", "Accordion"], ["FaMoon", "وضع ليلي", "Dark mode"], ["FaStopwatch", "عداد تنازلي", "لفعالية أو عرض"], ["FaFolder", "تبويبات", "Tabs"], ["FaCheckDouble", "تحقق من النموذج", "Form validation"]];
    const { xs, cw } = colsX(4, 0.3);
    for (let i = 0; i < 8; i++) await card(s, xs[i % 4], i < 4 ? 1.8 : 4.05, cw, 2.0, { icon: F[i][0], iconFill: i % 2 ? C.accent2 : C.accent1, title: F[i][1], body: F[i][2], titleSize: 17, bodySize: 14 });
  }
  s.addText("موقع الدورة فيه 3 منهم: قائمة جوال، أكورديون البرنامج، فلترة المشاريع", R({ x: M, y: 6.2, w: CW, h: 0.4, fontSize: 15, bold: true, color: C.accent1 }));
  s.addNotes("كل هاي الميزات بتنعمل بـ JavaScript بسيط وبدون Backend.");

  const ideas = [
    ["1", "مخبز عائلي", "تعريفي", "الرئيسية، المنيو، من نحن، تواصل", "فلترة المنيو، قائمة جوال"],
    ["2", "مطعم شعبي", "تعريفي", "الرئيسية، المنيو، معرض الصور، من نحن، تواصل", "تبويبات المنيو، معرض صور بيكبر"],
    ["3", "نادي رياضي (جيم)", "تعريفي", "الرئيسية، الاشتراكات، المدربين، جدول الحصص، تواصل", "جدول بتبويبات، حاسبة سعر الاشتراك"],
    ["4", "عيادة أسنان", "تعريفي", "الرئيسية، الخدمات، الأطباء، أسئلة شائعة، تواصل", "أكورديون الأسئلة، قائمة جوال"],
    ["5", "صالون", "تعريفي", "الرئيسية، الخدمات والأسعار، معرض الأعمال، تواصل", "فلترة الخدمات، معرض صور"],
    ["6", "مبادرة تطوعية", "منظمة", "الرئيسية، عن المبادرة، الأنشطة، تطوع معنا، تواصل", "عداد إنجازات، نموذج مع تحقق"],
    ["7", "حملة توعية", "حملة", "الرئيسية، الحقائق، النصائح، شارك", "اختبار قصير (Quiz)، أكورديون"],
    ["8", "ملف أعمال مصوّر", "Portfolio", "الرئيسية، الأعمال، عني، تواصل", "معرض بيكبر، فلترة حسب النوع"],
    ["9", "ملف أعمال مصمم", "Portfolio", "الرئيسية، المشاريع، الخدمات، عني، تواصل", "فلترة المشاريع، وضع ليلي"],
    ["10", "سيرة ذاتية إلكترونية", "Online CV", "الرئيسية، الخبرات، المهارات، المشاريع، تواصل", "أشرطة مهارات متحركة، وضع ليلي"],
    ["11", "مؤتمر أو فعالية شبابية", "فعالية", "الرئيسية، البرنامج، المتحدثين، أسئلة شائعة، تواصل", "عداد تنازلي، تبويبات البرنامج"],
    ["12", "بطولة رياضية بالحي", "فعالية", "الرئيسية، الفرق، الجدول، النتائج، تواصل", "فلترة المباريات، تبويبات"],
    ["13", "مشروع منزلي (حلويات أو إكسسوارات)", "متجر تعريفي", "الرئيسية، المنتجات، عن المشروع، تواصل", "فلترة المنتجات، نافذة تفاصيل (Modal)"],
    ["14", "مركز تعليمي", "تعليمي", "الرئيسية، الدورات، المدربين، أسئلة شائعة، تواصل", "فلترة الدورات، أكورديون"],
    ["15", "نادي قراءة أو مكتبة", "تعريفي", "الرئيسية، الكتب المقترحة، الفعاليات، انضم إلينا، تواصل", "بحث بالكتب، فلترة حسب التصنيف"],
    ["16", "فكرة تطبيق جوال", "صفحة منتج", "الرئيسية، المميزات، الأسعار، أسئلة شائعة، تواصل", "تبويبات المميزات، أكورديون"],
  ];
  for (let part = 0; part < 2; part++) {
    s = newSlide("CONTENT", "الدورة 4 · بنك الأفكار", `بنك الأفكار (${part + 1} من 2)`, S4);
    table(s, ["#", "الفكرة", "النوع", "الصفحات المقترحة", "ميزات تفاعلية"], ideas.slice(part * 8, part * 8 + 8), { y: 1.75, colW: [0.5, 2.6, 1.6, 4.4, 3.033], rowH: 0.56, fs: 13 });
    s.addNotes(part === 0 ? "اعرض بنك الأفكار على الشاشة أو ابعته بمجموعة WhatsApp. كل فكرة ملتزمة بالنطاق: 3 لـ 6 صفحات، وميزتين تفاعليتين على الأقل، بدون Backend. اللي بياخد فكرة من البنك بيعدّل عليها براحته." : "الأفكار من 9 لـ 16.");
  }

  s = newSlide("CONTENT", "الدورة 4 · التطبيق · 10 دقائق", "شكّلوا فرقكم واختاروا فكرتكم", S4);
  await stepsFlow(s, [
    { icon: "FaUserFriends", num: "2 دقيقة", title: "شكّلوا الفرق", body: "فرق ثنائية، وكل فريق بياخد رقم" },
    { icon: "FaLightbulb", num: "6 دقائق", title: "الفكرة والنطاق", body: "الفكرة ونوع الموقع، وأسماء الصفحات (3 لـ 6)، والميزتين" },
    { icon: "FaIdBadge", num: "2 دقيقة", title: "حدّثوا البطاقة", body: "حطوا اسم مشروعكم بدل «اسم المشروع» واحفظوا", dark: true },
  ], 1.85, 3.2, { bodySize: 15, titleSize: 19 });
  callout(s, M, 5.4, CW, 1.05, "رح أمر على كل فريق وأسأل: شو نوع موقعكم؟ كم صفحة مبدئياً؟ وشو الميزتين؟", { size: 17 });
  s.addNotes("وزّع اللي عندهم خبرة على فرق مختلفة. بعد تحديث البطاقة: «هيك صار مشروعك رسمياً: قريباً.» انتقال: «عندكم فكرة ونطاق مبدئي. هلأ بدنا نحولهم لخطة واضحة، والـ AI رح يساعدنا. بس أول لازم نتعلم كيف نطلب منه صح.»");

  // ===== Cycle 5 =====
  const S5 = "الدورة 5: فن الـ Prompt";
  pres.addSection({ title: S5 });
  s = newSlide("DIVIDER", "الدورة 5 · 30 دقيقة", "فن الـ Prompt", S5);
  s.addText("الـ Prompt هو الطلب اللي بتكتبه للـ AI، وهو أهم مهارة بالدورة", R({ x: M, y: 4.3, w: CW, h: 0.5, fontSize: 18, color: "C9D6E0" }));
  s.addNotes("«نفس الأداة بتعطي نتيجة ضعيفة أو ممتازة حسب طلبك.» 15 دقيقة شرح و15 دقيقة تطبيق.");

  s = newSlide("CONTENT", "الدورة 5 · فن الـ Prompt", "نفس الفكرة، نتيجتين مختلفتين", S5);
  {
    const { xs, cw } = colsX(2, 0.4);
    box(s, xs[0], 1.8, cw, 4.6, C.background2);
    s.addText("طلب ضعيف", R({ x: xs[0] + 0.3, y: 2.0, w: cw - 0.6, h: 0.45, fontSize: 20, bold: true, color: C.text2 }));
    prompt(s, xs[0] + 0.3, 2.6, cw - 0.6, 0.9, "اعملي موقع لمخبز", 17);
    s.addText("النتيجة: صفحة عامة ما بتشبه فكرتك", R({ x: xs[0] + 0.3, y: 5.6, w: cw - 0.6, h: 0.5, fontSize: 16, bold: true, color: "C0392B" }));
    box(s, xs[1], 1.8, cw, 4.6, C.background2);
    s.addText("طلب قوي", R({ x: xs[1] + 0.3, y: 2.0, w: cw - 0.6, h: 0.45, fontSize: 20, bold: true, color: C.text2 }));
    prompt(s, xs[1] + 0.3, 2.6, cw - 0.6, 2.75, "اعملي الصفحة الرئيسية لموقع مخبز عائلي صغير في عمّان، للعائلات. فيها عنوان، صور 3 منتجات، وزر «اطلب الآن». بالعربي، ألوان دافئة، ومناسبة للجوال.", 17);
    s.addText("النتيجة: صفحة قريبة جداً من اللي ببالك", R({ x: xs[1] + 0.3, y: 5.6, w: cw - 0.6, h: 0.5, fontSize: 16, bold: true, color: C.accent2 }));
  }
  s.addNotes("شغّل الطلبين قدامهم وقارن النتيجتين. اسأل القاعة: شو الفرق بين الطلبين؟ وخليهم يكتشفوا العناصر بأنفسهم. 3 دقائق.");

  s = newSlide("CONTENT", "الدورة 5 · فن الـ Prompt", "قالب الـ Prompt: 6 أجزاء", S5);
  {
    const P = [["الدور", "«أنت مطور مواقع بتساعد مبتدئ»"], ["السياق", "الفكرة والجمهور"], ["المطلوب", "شو بدك بالضبط، بجملة واضحة"], ["الشكل", "الألوان، الخط، الترتيب"], ["القيود", "بالعربي، مناسب للجوال، بدون تسجيل دخول"], ["النتيجة", "كود كامل، تعديل محدد، أو شرح"]];
    const { xs, cw } = colsX(3, 0.3);
    for (let i = 0; i < 6; i++) await card(s, xs[i % 3], i < 3 ? 1.8 : 4.15, cw, 2.15, { num: String(i + 1), title: P[i][0], body: P[i][1], titleSize: 22, bodySize: 16, dark: i === 2 });
  }
  s.addNotes("اربط كل جزء بالطلب القوي اللي شافوه. وزّع ورقة القالب المطبوعة، رح يستخدموها طول الأسبوع. 4 دقائق.");

  s = newSlide("CONTENT", "الدورة 5 · فن الـ Prompt", "3 تقنيات بترفع مستوى الجواب", S5);
  {
    const T = [["FaQuestionCircle", "اسألني قبل ما تجاوب", "«قبل ما تقترح أي شي، اسألني 5 أسئلة عن مشروعي.»", "الـ AI بيجمع المعلومات الناقصة بدل ما يخمّنها"], ["FaClone", "أعطِه مثال", "«بدي الأهداف بهاد الشكل: زيادة الطلبات من سكان الحي.»", "المثال بيوضح المستوى والشكل أكثر من أي وصف"], ["FaListOl", "قسّم المهمة", "«خلينا نشتغل خطوة خطوة. أول شي الجمهور بس.»", "الطلب الكبير بيعطي جواب سطحي، والخطوات الصغيرة بتعطي جودة أعلى"]];
    const { xs, cw } = colsX(3, 0.3);
    for (let i = 0; i < 3; i++) await card(s, xs[i], 1.8, cw, 3.9, { icon: T[i][0], title: T[i][1], body: [{ text: T[i][2], options: { bold: true, breakLine: true, rtlMode: true, color: HEX.dk2 } }, { text: "ليش؟ " + T[i][3], options: { rtlMode: true } }], titleSize: 19, bodySize: 15 });
  }
  callout(s, M, 5.95, CW, 0.6, "وتذكّر: أول جواب مسودة. اطلب تعديلات لحد ما يناسبك", { size: 15 });
  s.addNotes("5 دقائق للتقنيات الثلاث. بعدها اعرض الـ prompt الجاهز للتطبيق واشرح إنه بيستخدم التقنيات الثلاث.");

  s = newSlide("CONTENT", "الدورة 5 · التطبيق · 15 دقيقة", "حددوا جمهوركم وأهدافكم مع الـ AI", S5);
  prompt(s, 5.4, 1.8, 7.33, 4.65, "أنت مستشار مواقع بتساعد فريق مبتدئين.\nفكرتنا: [الفكرة بجملة].\nقبل ما تقترح أي شي، اسألنا 5 أسئلة، سؤال سؤال، عشان تفهم مشروعنا.\nبعد ما نجاوب، لخّصلنا:\n1) الفئة المستهدفة وليش بتزور الموقع\n2) هدفين أو ثلاثة للموقع، زي هاد المثال: «زيادة الطلبات من سكان الحي»\n3) الإجراء الرئيسي اللي بدنا الزائر يعمله\nالموقع بدون تسجيل دخول أو قاعدة بيانات.", 16);
  {
    const st = [["FaPaste", "الصقوا الـ prompt", "وحطوا فكرتكم مكان [الفكرة]"], ["FaReply", "جاوبوا أسئلته", "سؤال سؤال، بتفاصيل حقيقية"], ["FaFileAlt", "اكتبوا النتيجة", "بأول قسمين من وثيقة المتطلبات"]];
    for (let i = 0; i < 3; i++) {
      const y = 1.8 + i * 1.2;
      await iconCircle(s, st[i][0], 4.55, y, 0.7, C.accent2);
      s.addText(st[i][1], R({ x: M, y: y, w: 3.8, h: 0.4, fontSize: 18, bold: true, color: C.text2 }));
      s.addText(st[i][2], R({ x: M, y: y + 0.42, w: 3.8, h: 0.5, fontSize: 14, color: "3E5266" }));
    }
    callout(s, M, 5.45, 4.65, 1.0, "الجمهور «كل الناس»؟ قولوا للـ AI: «هاد عام كتير، ركّز على فئة وحدة»", { size: 14 });
  }
  s.addNotes("مر على الفرق خلال التطبيق. إذا شفت جمهور عام زيادة علّمهم يردوا على الـ AI. تأكد إنهم فهموا: كل فريق بيقلك الإجراء الرئيسي لموقعه بجملة وحدة. انتقال: «عرفنا مين رح يزور موقعكم وليش. هلأ شو رح يلاقي جواه؟»");

  // ===== Cycle 6 =====
  const S6 = "الدورة 6: تخطيط الموقع";
  pres.addSection({ title: S6 });
  s = newSlide("DIVIDER", "الدورة 6 · 45 دقيقة", "تخطيط الموقع", S6);
  s.addText("الصفحات والأقسام · الأولويات والميزات · خريطة الموقع · الرسم الأولي", R({ x: M, y: 4.3, w: CW, h: 0.5, fontSize: 18, color: "C9D6E0" }));
  s.addNotes("15 دقيقة شرح و30 دقيقة تطبيق. هاي الدورة هي مخرج اليوم، فما تقصّها إذا تأخرت.");

  s = newSlide("CONTENT", "الدورة 6 · تخطيط الموقع", "الصفحات والأقسام", S6);
  {
    // wireframe on left
    const x0 = M, y0 = 1.8, w0 = 4.6;
    const parts = [["Header: الشعار والقائمة", 0.55, C.background2], ["Hero: عنوان كبير + جملة + زر CTA", 1.35, C.text2], ["قسم: الخدمات أو المميزات", 0.85, C.background2], ["قسم: لمحة أو آراء", 0.85, C.background2], ["Footer: التواصل والسوشال ميديا", 0.6, C.background2]];
    let y = y0;
    for (const [t, h, f] of parts) {
      s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: x0, y, w: w0, h, rectRadius: 0.06, fill: { color: f }, line: { color: "D5DCE4", width: 1 }, objectName: "wire-block" });
      s.addText(t, { x: x0 + 0.2, y, w: w0 - 0.4, h, fontSize: 13, bold: true, color: f === C.text2 ? HEX.lt1 : HEX.dk2, align: "center", valign: "middle", margin: 0, rtlMode: true, isTextBox: true });
      y += h + 0.08;
    }
  }
  s.addText("موقعكم من 3 لـ 6 صفحات: الرئيسية، من نحن أو الخدمات، تواصل معنا، والباقي حسب فكرتكم. كل صفحة مقسومة لأقسام من فوق لتحت، والأهم فوق.", R({ x: 5.6, y: 1.8, w: 7.13, h: 1.2, fontSize: 17, color: "3E5266" }));
  {
    const D = [["Hero", "أول شي بتشوفه: عنوان كبير + جملة قصيرة + زر"], ["CTA (Call to Action)", "الزر اللي بيخلي الزائر يعمل الإجراء الرئيسي اللي حددناه بالدورة 5"], ["Footer", "آخر الصفحة: معلومات التواصل وروابط السوشال ميديا"]];
    for (let i = 0; i < 3; i++) {
      const y = 3.2 + i * 1.1;
      box(s, 5.6, y, 7.13, 0.95, C.background2);
      s.addText(D[i][0], { x: 10.2, y, w: 2.3, h: 0.95, fontSize: 17, bold: true, color: HEX.accent1, align: "right", valign: "middle", margin: 0, isTextBox: true });
      s.addText(D[i][1], R({ x: 5.85, y, w: 4.2, h: 0.95, fontSize: 14, color: "3E5266", valign: "middle" }));
    }
  }
  s.addNotes("عرّفهم بثلاث مصطلحات بس: Hero و CTA و Footer. افتح رئيسية موقع الدورة وأشر عليهم. موقع الدورة فيه 5 صفحات: الرئيسية، البرنامج، المشاريع، المدرب، تواصل. 4 دقائق.");

  s = newSlide("CONTENT", "الدورة 6 · تخطيط الموقع", "الأولويات: مش كل فكرة بتنعمل هلأ", S6);
  {
    const P = [["FaStar", "ضروري", "Must have", "لازم يكون جاهز يوم 5، وفيه الميزتين التفاعليتين", true], ["FaPlusSquare", "مهم", "Nice to have", "إذا ضل وقت: صفحة إضافية أو ميزة ثالثة"], ["FaArchive", "لاحقاً", "Later", "لخطة التطوير يوم 5، وهون بيروح أي شي بده Backend"]];
    const { xs, cw } = colsX(3, 0.3);
    for (let i = 0; i < 3; i++) await card(s, xs[i], 1.8, cw, 2.75, { icon: P[i][0], dark: P[i][4], title: P[i][1], body: [{ text: P[i][2], options: { bold: true, breakLine: true, rtlMode: true, color: P[i][4] ? HEX.accent6 : HEX.accent2 } }, { text: P[i][3], options: { rtlMode: true } }], titleSize: 22, bodySize: 15 });
  }
  box(s, M, 4.8, CW, 1.7, C.background2);
  s.addText("سؤالين لتصنيف أي ميزة", R({ x: M + 0.3, y: 4.95, w: CW - 0.6, h: 0.4, fontSize: 17, bold: true, color: C.text2 }));
  s.addText(bullets(["بيخدم الهدف الرئيسي؟", "بنقدر نخلصه بالوقت المتاح بـ HTML و CSS و JavaScript؟", "إذا الجوابين نعم، ضروري. وموقع مكتمل أحسن من موقع كبير ناقص."], { space: 4 }), R({ x: M + 0.3, y: 5.4, w: CW - 0.6, h: 1.0, fontSize: 15, color: "3E5266" }));
  s.addNotes("شدّد: «موقع مكتمل أحسن من موقع كبير ناقص. ابدأوا بالصفحات الأساسية، وزيدوا لما تخلصوا.» 4 دقائق.");

  s = newSlide("CONTENT", "الدورة 6 · تخطيط الموقع", "خريطة الموقع: كيف الصفحات مربوطة ببعض؟", S6);
  {
    const rootX = W / 2 - 1.5, rootY = 1.85;
    box(s, rootX, rootY, 3.0, 1.0, C.text2);
    s.addText([{ text: "الرئيسية", options: { bold: true, fontSize: 20, color: HEX.lt1, breakLine: true, rtlMode: true } }, { text: "index.html", options: { fontSize: 13, color: "C9D6E0" } }], { x: rootX, y: rootY, w: 3.0, h: 1.0, align: "center", valign: "middle", margin: 0, isTextBox: true });
    const kids = [["البرنامج", "program.html"], ["المشاريع", "projects.html"], ["المدرب", "trainer.html"], ["تواصل", "contact.html"]];
    const { xs, cw } = colsX(4, 0.4, 1.2, W - 2.4);
    s.addShape(pres.shapes.LINE, { x: W / 2, y: rootY + 1.0, w: 0, h: 0.5, line: { color: HEX.dk2, width: 2 } });
    s.addShape(pres.shapes.LINE, { x: xs[3] + cw / 2, y: rootY + 1.5, w: (xs[0] + cw / 2) - (xs[3] + cw / 2), h: 0, line: { color: HEX.dk2, width: 2 } });
    for (let i = 0; i < 4; i++) {
      const cx = xs[i] + cw / 2;
      s.addShape(pres.shapes.LINE, { x: cx, y: rootY + 1.5, w: 0, h: 0.5, line: { color: HEX.dk2, width: 2, endArrowType: "triangle" } });
      box(s, xs[i], rootY + 2.0, cw, 1.0, C.background2, "D5DCE4");
      s.addText([{ text: kids[i][0], options: { bold: true, fontSize: 18, color: HEX.dk2, breakLine: true, rtlMode: true } }, { text: kids[i][1], options: { fontSize: 12, color: "3E5266" } }], { x: xs[i], y: rootY + 2.0, w: cw, h: 1.0, align: "center", valign: "middle", margin: 0, isTextBox: true });
    }
  }
  callout(s, M, 5.3, CW, 1.1, "كل صفحة ملف، والقائمة بتربطهم كلهم ببعض. الصفحة الرئيسية اسمها دايماً index.html، زي بطاقتكم. هاي خريطة موقع الدورة: 5 صفحات", { size: 15, bold: false });
  s.addNotes("ارسم خريطة موقع الدورة على السبورة كمان. كل فريق بيرسم خريطته على ورقة وبيصورها بالجوال. 3 دقائق.");

  s = newSlide("CONTENT", "الدورة 6 · تخطيط الموقع", "الرسم الأولي (Sketch) للصفحة الرئيسية", S6);
  {
    const x0 = M, y0 = 1.8, w0 = 4.8, h0 = 4.7;
    s.addShape(pres.shapes.RECTANGLE, { x: x0, y: y0, w: w0, h: h0, fill: { color: C.background1 }, line: { color: HEX.dk2, width: 2, dashType: "dash" }, objectName: "sketch-frame" });
    s.addShape(pres.shapes.RECTANGLE, { x: x0 + 0.3, y: y0 + 0.25, w: w0 - 0.6, h: 0.4, fill: { color: C.background1 }, line: { color: HEX.dk2, width: 1.5 }, objectName: "sketch-header" });
    s.addShape(pres.shapes.RECTANGLE, { x: x0 + 0.3, y: y0 + 0.85, w: w0 - 0.6, h: 1.4, fill: { color: C.background1 }, line: { color: HEX.dk2, width: 1.5 }, objectName: "sketch-hero" });
    s.addShape(pres.shapes.LINE, { x: x0 + 0.3, y: y0 + 0.85, w: w0 - 0.6, h: 1.4, line: { color: HEX.accent4, width: 1 } });
    s.addShape(pres.shapes.LINE, { x: x0 + 0.3, y: y0 + 0.85, w: w0 - 0.6, h: 1.4, flipV: true, line: { color: HEX.accent4, width: 1 } });
    for (let i = 0; i < 3; i++) {
      const bx = x0 + 0.3 + i * ((w0 - 0.6 - 0.4) / 3 + 0.2);
      s.addShape(pres.shapes.RECTANGLE, { x: bx, y: y0 + 2.5, w: (w0 - 1.0) / 3, h: 1.1, fill: { color: C.background1 }, line: { color: HEX.dk2, width: 1.5 }, objectName: "sketch-box" });
    }
    for (let i = 0; i < 3; i++) s.addShape(pres.shapes.LINE, { x: x0 + 0.5, y: y0 + 3.85 + i * 0.22, w: w0 - 1.0 - i * 0.6, h: 0, line: { color: HEX.accent4, width: 1.5 } });
  }
  {
    const pts = [["FaPencilAlt", "مش رسم فني", "ورقة وقلم بس، وما في صح وغلط"], ["FaSquare", "مربعات للأقسام", "بنفس ترتيبها من فوق لتحت"], ["FaTimes", "X مكان الصورة، وخطوط مكان النص", "بتوضح الفكرة بثواني"], ["FaCameraRetro", "صوّره بالجوال", "وبكرا رح نحوله لتصميم حقيقي"]];
    for (let i = 0; i < 4; i++) {
      const y = 1.8 + i * 1.18;
      await iconCircle(s, pts[i][0], W - M - 0.7, y, 0.7, i === 3 ? C.text2 : C.accent1);
      s.addText(pts[i][1], R({ x: 6.0, y, w: 5.85, h: 0.42, fontSize: 18, bold: true, color: C.text2 }));
      s.addText(pts[i][2], R({ x: 6.0, y: y + 0.44, w: 5.85, h: 0.4, fontSize: 14, color: "3E5266" }));
    }
  }
  s.addNotes("ارسم رئيسية موقع الدورة بـ 30 ثانية قدامهم عشان يشوفوا قديش بسيط. 3 دقائق.");

  s = newSlide("CONTENT", "الدورة 6 · تخطيط الموقع", "قبل ما تعتمد جواب الـ AI، اسأل حالك", S6);
  {
    const Q = [["FaLightbulb", "بيناسب فكرتنا؟", "الـ AI بيقترح، وأنتم بتقرروا شو بيضل"], ["FaClock", "بنقدر نخلصه بالوقت المتاح؟", "إذا لا، صغّروه أو انقلوه لـ «لاحقاً»"], ["FaRulerCombined", "ملتزم بالنطاق؟", "3 لـ 6 صفحات، وبدون Backend"], ["FaComments", "بنقدر نشرحه؟", "القاعدة الذهبية بتنطبق على الخطط كمان"]];
    const { xs, cw } = colsX(2, 0.4);
    for (let i = 0; i < 4; i++) await card(s, xs[i % 2], i < 2 ? 1.8 : 4.2, cw, 2.15, { icon: Q[i][0], num: String(i + 1), title: Q[i][1], body: Q[i][2], titleSize: 20, bodySize: 15 });
  }
  s.addNotes("هاي الأسئلة الأربعة بتستخدمها لما تمر على الفرق خلال التطبيق. أكثر مشكلة رح تشوفها: فريق حاطط تسجيل دخول أو دفع بـ «ضروري»، فانقله لـ «لاحقاً» معهم. دقيقة.");

  s = newSlide("CONTENT", "الدورة 6 · التطبيق · 30 دقيقة", "خططوا موقعكم بأربع خطوات", S6);
  await stepsFlow(s, [
    { icon: "FaLayerGroup", num: "10 دقائق", title: "الصفحات والأقسام", body: "استخدموا Prompt 1، واتفقوا على الصفحات (3 لـ 6)، واحذفوا أي قسم ما بيخدم الهدف" },
    { icon: "FaSortAmountDown", num: "7 دقائق", title: "الأولويات والميزات", body: "صنّفوا الميزات بـ Prompt 2، واختاروا ميزتين تفاعليتين على الأقل" },
    { icon: "FaSitemap", num: "6 دقائق", title: "خريطة الموقع", body: "ارسموها على ورقة وصوروها بالجوال" },
    { icon: "FaPencilRuler", num: "7 دقائق", title: "الرسم الأولي", body: "مربعات بترتيب أقسام الرئيسية، وصوروه", dark: true },
  ], 1.85, 4.1, { bodySize: 14, titleSize: 18 });
  s.addNotes("مر على الفرق بالأسئلة الأربعة لمراجعة جواب الـ AI.");

  s = newSlide("CONTENT", "الدورة 6 · التطبيق", "الـ Prompts الجاهزة", S6);
  {
    const { xs, cw } = colsX(2, 0.4);
    s.addText("Prompt 1: الصفحات والأقسام", R({ x: xs[0], y: 1.75, w: cw, h: 0.4, fontSize: 17, bold: true, color: C.accent1 }));
    prompt(s, xs[0], 2.2, cw, 4.3, "موقعنا فيه 3 صفحات أساسية: الرئيسية، من نحن، تواصل معنا.\nوممكن نضيف صفحات حسب الفكرة، بحيث المجموع ما يزيد عن 6.\nالفكرة: [الفكرة]. الجمهور: [الجمهور]. الإجراء الرئيسي: [الإجراء].\nاقترح الصفحات الإضافية اللي بتفيد مشروعنا (إذا في)، مع سبب كل صفحة.\nبعدين اقترح الأقسام اللي بتحتاجها كل صفحة، مرتبة حسب الأهمية، مع سطر واحد بيوصف محتوى كل قسم.", 14);
    s.addText("Prompt 2: الأولويات والميزات", R({ x: xs[1], y: 1.75, w: cw, h: 0.4, fontSize: 17, bold: true, color: C.accent1 }));
    prompt(s, xs[1], 2.2, cw, 4.3, "صنّف هاي الميزات لثلاث مجموعات:\nضروري (بنقدر نبنيه بالوقت المتاح بـ HTML و CSS و JavaScript، بدون Backend)، مهم، لاحقاً.\nاشرح بجملة ليش حطيت كل ميزة بمجموعتها.\nبعدين اقترح علينا 4 ميزات تفاعلية بسيطة بتناسب فكرتنا، عشان نختار منها اثنتين على الأقل.\nالميزات: [الصق القائمة].", 14);
  }
  s.addNotes("نبّههم إن Prompt 1 بيعيد السياق من الدورة 5 (الفكرة والجمهور والإجراء)، لأن المحادثة الجديدة بتبدأ من الصفر. انتقال: «عندكم كل أجزاء الوثيقة. خلونا نجمعها ونسمع من كم فريق.»");

  // ===== Closing =====
  const S7 = "العروض والختام";
  pres.addSection({ title: S7 });
  s = newSlide("CONTENT", "مخرج اليوم", "وثيقة المتطلبات: كل اللي عملناه اليوم", S7);
  {
    const D = [["FaLightbulb", "الفكرة", "اسم الموقع وفكرته بجملة"], ["FaUsers", "الجمهور والأهداف", "الفئة، 2–3 أهداف، الإجراء الرئيسي"], ["FaLayerGroup", "الصفحات والأقسام", "3 لـ 6 صفحات وأقسام كل صفحة"], ["FaSortAmountDown", "الميزات والأولويات", "ميزتين تفاعليتين، وضروري ومهم ولاحقاً"], ["FaSitemap", "خريطة الموقع", "صورة الرسمة"], ["FaPencilRuler", "الرسم الأولي", "صورة رسم الرئيسية"]];
    const { xs, cw } = colsX(3, 0.3);
    for (let i = 0; i < 6; i++) await card(s, xs[i % 3], i < 3 ? 1.8 : 4.1, cw, 2.05, { icon: D[i][0], num: String(i + 1), title: D[i][1], body: D[i][2], titleSize: 18, bodySize: 14 });
  }
  s.addNotes("8 دقائق: الفرق بتجمع الأقسام بملف واحد (Word أو Google Docs أو حتى ورقة مصورة).");

  s = newSlide("CONTENT", "الختام · 30 دقيقة", "العروض والتسليم", S7);
  await stepsFlow(s, [
    { icon: "FaFileSignature", num: "8 دقائق", title: "إكمال الوثيقة", body: "جمّعوا الأقسام الستة بملف واحد" },
    { icon: "FaChalkboard", num: "7 دقائق", title: "عروض سريعة", body: "فريقين أو ثلاثة، دقيقة لكل فريق: الفكرة، الجمهور، الصفحات، الميزتين" },
    { icon: "FaClipboardCheck", num: "8 دقائق", title: "Google Form", body: "ارفعوا الوثيقة، وجاوبوا سؤال الفهم الفردي" },
    { icon: "FaFlagCheckered", num: "7 دقائق", title: "ملخص وبكرا", body: "شو تعلمنا، وشو جاي", dark: true },
  ], 1.85, 3.2, { bodySize: 14 });
  callout(s, M, 5.35, CW, 1.1, "سؤال الفهم اليوم (اختار واحد): «اشرح بكلماتك: شو الفرق بين HTML و CSS؟» أو «ليش موقعنا ما بده Backend؟»", { size: 16, bold: false });
  s.addNotes("بعد كل عرض ملاحظة وحدة منك (قوة + اقتراح). اختار فرق مختلفة كل يوم عشان الكل يعرض مرة على الأقل قبل يوم 5.");

  s = newSlide("DIVIDER", "ملخص اليوم", "شو تعلمنا اليوم؟", S7);
  {
    const pts = ["الموقع ملفات، والمتصفح بيعرضها", "الـ AI مساعد، مش بديل", "الطلب الواضح بيعطي نتيجة واضحة", "مكتمل أحسن من كبير ناقص"];
    const { xs, cw } = colsX(4, 0.25);
    for (let i = 0; i < 4; i++) {
      s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: xs[i], y: 4.25, w: cw, h: 1.1, rectRadius: 0.12, fill: { color: "2C4A66" }, line: { color: "2C4A66", width: 0 }, objectName: "summary-card" });
      s.addText(pts[i], { x: xs[i] + 0.2, y: 4.25, w: cw - 0.4, h: 1.1, fontSize: 15, bold: true, color: HEX.lt1, align: "center", valign: "middle", margin: 0, rtlMode: true, isTextBox: true });
    }
    s.addText("بكرا: بنحوّل رسمكم لتصميم حقيقي، بألوان وخطوط وشكل على الجوال · خلّي مجلد my-card على جهازك · جيب اللابتوب مشحون", R({ x: M, y: 5.7, w: CW, h: 0.8, fontSize: 16, color: "C9D6E0" }));
  }
  s.addNotes("اسأل القاعة بدل ما تلخص إنت: «شو أهم شغلة تعلمتوها اليوم؟» خذ 3 أجوبة وكمّل الناقص من النقاط الأربعة. اختياري: يتصفحوا 3 مواقع بنفس مجال فكرتهم ويجيبوا صور شاشة للشي اللي عجبهم، لأنها بتفيدهم بتصميم بكرا.");

  await pres.writeFile({ fileName: "day1-ar.pptx" });
  await applyTheme("day1-ar.pptx", THEME);
  console.log("done");
}
build().catch((e) => { console.error(e); process.exit(1); });
