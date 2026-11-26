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

render(items);
