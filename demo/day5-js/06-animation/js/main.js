// الرسم: بطاقة لكل منتج
const list = document.getElementById("list");

function render(arr) {
  list.innerHTML = "";
  arr.forEach(item => {
    list.innerHTML += `
      <div class="card">
        <img src="${item.image}" alt="${item.name}">
        <h3>${item.name}</h3>
        <p>${item.price} دينار</p>
        <a class="btn" href="details.html?id=${item.id}">التفاصيل</a>
        <button class="add" data-id="${item.id}">أضف</button>
      </div>`;
  });
  // زر «أضف» بكل بطاقة: امسك، استنى، غيّر
  document.querySelectorAll(".add").forEach(btn => {
    btn.addEventListener("click", () => {
      const item = items.find(i => i.id === Number(btn.dataset.id));
      addToCart(item);
    });
  });
  // الحركة: كل بطاقة بتاخد class اسمه show
  document.querySelectorAll(".card").forEach(card => {
    card.classList.add("show");
  });
}

// الفلترة
document.querySelectorAll(".filter").forEach(btn => {
  btn.addEventListener("click", () => {
    const cat = btn.dataset.cat;
    if (cat === "all") {
      render(items);
    } else {
      render(items.filter(item => item.category === cat));
    }
  });
});

// السلة: بتنحفظ بـ localStorage
let cart = JSON.parse(localStorage.getItem("cart")) || [];

function addToCart(item) {
  cart.push(item);
  localStorage.setItem("cart", JSON.stringify(cart));
  showTotal();
}

function showTotal() {
  let total = 0;
  cart.forEach(i => { total += i.price; });
  const bar = document.getElementById("total");
  bar.textContent = total + " دينار";
  if (total > 10) bar.style.color = "red";
  else if (total >= 8) bar.style.color = "orange";
  else bar.style.color = "green";
}

// زر تفريغ السلة (للتجربة)
const clearBtn = document.getElementById("clearBtn");
clearBtn.addEventListener("click", () => {
  cart = [];
  localStorage.removeItem("cart");
  showTotal();
});

showTotal();
render(items);
