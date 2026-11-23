const pptxgen = require("pptxgenjs");
const React = require("react");
const RDS = require("react-dom/server");
const sharp = require("sharp");
const fa = require("react-icons/fa");
const { applyTheme } = require("./lib/apply_theme.js");

const THEME = {
  name: "Web with AI Day 2",
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
pres.title = "اليوم الثاني: تصميم الواجهة وتجربة المستخدم";
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
    { text: { text: "اليوم الثاني · تطوير المواقع الإلكترونية بمساعدة الذكاء الاصطناعي", options: { x: 5.2, y: 6.95, w: 7.53, h: 0.35, fontSize: 10, color: C.accent4 ? HEX.accent4 : "8D99AE", align: "right", rtlMode: true, margin: 0 } } },
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

