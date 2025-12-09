//aca creamos todo el html con los productos que recibimos desde el server
const socket = io();
console.log('intentando conectar')

socket.on("products", (products) => {
    const container = document.getElementById("products");
    container.innerHTML = "";

    products.forEach(prod => {
        const div = document.createElement("div");
        div.innerHTML = `
          <h2>${prod.title}</h2>
          <h3>Id: ${prod._id}</h3>
          <p>$${prod.price}</p>
          <button type="button" onclick="deleteProduct('${prod._id}')">
          Eliminar producto
          </button>
        `
        container.appendChild(div);
    });
});

//creamos la logica de los formularios
const form = document.getElementById("formProduct")
form.addEventListener("submit", (e) => {
  e.preventDefault()

  const title = document.getElementById("title").value;
  const price = document.getElementById("price").value;

  socket.emit("newProduct", {
    title,
    price
  })

  form.reset();
})

/* const deleteProduct = (id) => {
  socket.emit("deleteProduct", id)
  console.log("ME LLEGÓ EL DELETE:", id)
} */

/* const deleteForm = document.getElementById("formDelete")
deleteForm.addEventListener("submit", (e) => {
  e.preventDefault()

  const id = document.getElementById("productId").value;

  socket.emit("deleteProduct", id)

  deleteForm.reset()
}) */