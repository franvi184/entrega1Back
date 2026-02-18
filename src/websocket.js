import productModel from "./model/Product.model.js";

export function initSocket(serverSocket){
  serverSocket.on('connection', async (socket) => {
    console.log('nuevo cliente conectado', socket.id)
    const products = await productModel.find()
    socket.emit("products", products)

    socket.on("newProduct", async (product) => {
      try {
        const newProduct = await productModel.create(product)
        const products = await productModel.find()
        serverSocket.emit("products", products)
      } catch (error) {
        console.log("Error al crear producto:", error.message)
      }
    })

    socket.on("deleteProduct", async (id) => {
      try {
        await productModel.findByIdAndDelete(id)
        const products = await productModel.find()
        serverSocket.emit("products", products)
        console.log("producto eliminado:", id)
      } catch (error) {
        console.log("Error al eliminar:", error.message)
      }
    })
  })
}