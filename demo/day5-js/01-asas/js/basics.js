// افتح F12 ← Console وشوف النتائج

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
});
