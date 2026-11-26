// صفحة التفاصيل: الرقم من الرابط (details.html?id=2)
const id = Number(new URLSearchParams(location.search).get("id"));
const item = items.find(i => i.id === id);
const box = document.getElementById("details");

if (item) {
  box.innerHTML = `<h1>${item.name}</h1><img src="${item.image}" alt="${item.name}" width="300"><p>${item.price} دينار</p>`;
} else {
  box.textContent = "المنتج مش موجود";
}
