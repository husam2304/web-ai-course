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
      </div>`;
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

render(items);
