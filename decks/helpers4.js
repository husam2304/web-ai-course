
// ---------- Day 3/4 helpers ----------
async function iconRows(s, rows, x, w, y0, step, o = {}) {
  for (let i = 0; i < rows.length; i++) {
    const y = y0 + i * step;
    await iconCircle(s, rows[i][0], x + w - 0.7, y, 0.7, rows[i][3] || C.accent1);
    s.addText(rows[i][1], R({ x, y: y + 0.0, w: w - 0.95, h: 0.42, fontSize: o.ts || 18, bold: true, color: C.text2 }));
    s.addText(rows[i][2], R({ x, y: y + 0.44, w: w - 0.95, h: step - 0.5, fontSize: o.bs || 14, color: "3E5266" }));
  }
}
function divider(kicker, title, sub, section, notes) {
  const s = newSlide("DIVIDER", kicker, title, section);
  if (sub) s.addText(sub, R({ x: M, y: 4.3, w: CW, h: 0.5, fontSize: 18, color: "C9D6E0" }));
  if (notes) s.addNotes(notes);
  return s;
}
function codeBox(s, x, y, w, h, text, label, fs = 14) {
  box(s, x, y, w, h, C.text2);
  if (label) s.addText(label, R({ x: x + 0.3, y: y + 0.15, w: w - 0.6, h: 0.35, fontSize: 13, bold: true, color: HEX.accent6 }));
  s.addText(text, { x: x + 0.3, y: y + (label ? 0.6 : 0.25), w: w - 0.6, h: h - (label ? 0.8 : 0.45), fontSize: fs, color: "F1F4F8", fontFace: "Courier New", align: "left", valign: "top", margin: 0, isTextBox: true });
}
function promptBox(s, x, y, w, h, text, label, fs = 13) {
  box(s, x, y, w, h, C.text2);
  s.addText(label || "Prompt · من ورقة التصليح", R({ x: x + 0.3, y: y + 0.15, w: w - 0.6, h: 0.35, fontSize: 13, bold: true, color: HEX.accent6 }));
  s.addText(text, R({ x: x + 0.3, y: y + 0.6, w: w - 0.6, h: h - 0.8, fontSize: fs, color: C.background1, paraSpaceAfter: 2 }));
}
function numList(s, items, x, y, w, h, fs = 16) {
  s.addText(items.map((t, i) => ({ text: `${i + 1}. ${t}`, options: { breakLine: i < items.length - 1, paraSpaceAfter: 8, rtlMode: true } })), R({ x, y, w, h, fontSize: fs, color: C.text1 }));
}
function practice(s, title, steps, success, y = 1.8, h = 4.0) {
  const { xs, cw } = colsX(2, 0.4);
  box(s, xs[0], y, cw, h, C.background2);
  s.addText(title, R({ x: xs[0] + 0.3, y: y + 0.2, w: cw - 0.6, h: 0.45, fontSize: 18, bold: true, color: C.accent1 }));
  numList(s, steps, xs[0] + 0.3, y + 0.75, cw - 0.6, h - 0.9, 15);
  box(s, xs[1], y, cw, h, C.text2);
  s.addText("مؤشر النجاح", R({ x: xs[1] + 0.3, y: y + 0.2, w: cw - 0.6, h: 0.45, fontSize: 18, bold: true, color: C.accent6 }));
  s.addText(bullets(success, { space: 10 }), R({ x: xs[1] + 0.3, y: y + 0.75, w: cw - 0.6, h: h - 0.9, fontSize: 16, color: C.background1 }));
}
// code on the left, explanation rows on the right
async function codeAndRows(s, codeText, label, rows, o = {}) {
  const cw = o.codeW || 6.4;
  codeBox(s, M, 1.8, cw, o.codeH || 4.7, codeText, label, o.fs || 14);
  const x = M + cw + 0.4;
  await iconRows(s, rows, x, W - M - x, 1.8, o.step || 1.15, { ts: o.ts || 17, bs: o.bs || 14 });
}

// table with optional LTR code columns (o.ltr = reading-order column indexes)
function table(s, header, rows, o) {
  const n = header.length;
  const isL = (ci) => (o.ltr || []).includes(ci);
  const cell = (t, ci, opts) => isL(ci)
    ? { text: t, options: Object.assign({}, opts, { align: "left", rtlMode: false, fontFace: "Courier New" }) }
    : { text: t, options: Object.assign({}, opts, { align: "right", rtlMode: true }) };
  const hdr = header.map((t, ci) => ({ text: t, options: { bold: true, color: HEX.lt1, fill: { color: HEX.dk2 }, align: "right", rtlMode: true, fontSize: o.fs || 14 } })).reverse();
  const body = rows.map((r, ri) => r.map((t, ci) => cell(t, ci, { color: HEX.dk1, fill: { color: ri % 2 ? "FFFFFF" : HEX.lt2 }, fontSize: o.fs || 14 })).reverse());
  s.addTable([hdr, ...body], { x: o.x || M, y: o.y, w: o.w || CW, colW: o.colW.slice().reverse(), border: { type: "solid", pt: 0.5, color: "D5DCE4" }, margin: 0.08, valign: "middle", rowH: o.rowH, fontFace: "Arial" });
}
