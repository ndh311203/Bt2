let products = [];
let filteredProducts = [];

fetch("db.json")
  .then(response => response.json())
  .then(data => {
    products = data;
    filteredProducts = data;
    renderTable(filteredProducts);
  })
  .catch(error => console.error("Lỗi load dữ liệu:", error));

function renderTable(data) {
  const table = document.getElementById("productTable");
  table.innerHTML = "";

  data.forEach(p => {
    table.innerHTML += `
      <tr>
        <td>${p.id}</td>
        <td>${p.name}</td>
        <td>${p.price.toLocaleString()}</td>
      </tr>
    `;
  });
}

function onSearchChanged(keyword) {
  filteredProducts = products.filter(p =>
    p.name.toLowerCase().includes(keyword.toLowerCase())
  );
  renderTable(filteredProducts);
}

function sortByName(isAsc) {
  filteredProducts.sort((a, b) =>
    isAsc
      ? a.name.localeCompare(b.name)
      : b.name.localeCompare(a.name)
  );
  renderTable(filteredProducts);
}

function sortByPrice(isAsc) {
  filteredProducts.sort((a, b) =>
    isAsc ? a.price - b.price : b.price - a.price
  );
  renderTable(filteredProducts);
}
