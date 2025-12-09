import express from 'express';
import path from 'node:path'
import viewRoute from "./routes/view.route.js"
import Handlebars from "express-handlebars"
import { Server} from 'socket.io';
import productModel from './model/Product.model.js';
import CartModel from './model/Cart.model.js';
import mongoose from 'mongoose';
import { pid } from 'node:process';

const app = express();
//con esta linea de abajo le decimos a express que pueda interpretar json
app.use(express.json());

//conexion con mongo
const mongoUrl = "mongodb+srv://thefrancogamer72:AMFKHjTztarcnkc1@codercluster.oikhjpm.mongodb.net/coderEco";

mongoose.connect(mongoUrl)
.then(() => console.log("conectado a MongoDB"))
  .catch(err => console.error("error de conexión a MongoDB:", err));


//configuracion de handlebars
app.engine("handlebars", Handlebars.engine())
app.set("view engine", "handlebars")
app.set("views", path.join(process.cwd(), "src", "views"))

app.use(express.static(path.join(process.cwd(), "src", "public")))
app.use('/', viewRoute)


//creamos el get que trae todos los productos
app.get('/api/products', async (req, res) => {
    try {
        const productos = await productModel.find()
        res.json(productos)
    }
    catch(err){
        console.log("error al traer los productos", err)
    }
})

 //get que trae producto por id
app.get('/api/products/:pid', async (req, res) => {
    try {
        const { pid } = req.params
        if(!mongoose.Types.ObjectId.isValid(pid)){
            return res.status(400).json({
                error: "id invalido"
            })
        }
        const producto = await productModel.findById(pid)
        if(!producto){
            return res.status(404).json({
                error: "no existe el producto"
            })
        }
        res.send(JSON.stringify(producto, null, 2))

    }
    catch (err){
        console.log("error del servidor", err)
    }
})

//metodo post para crear nuevo producto


app.post('/api/products', async (req, res) => {
    try {
        const {title, price, code, description, category} = req.body
        if(!title || !price){
            return res.status(400).json({
                message: "campos incompletos"
            })
        }
        const newProduct = await productModel.create({
            title,
            price,
            code,
            description,
            category
        })
        res.status(201).json({
            message: "producto creado exitosamente"
        })
    }
    catch (err){
        console.log("error al agregar producto", err)
        res.status(500).json({
            message: "no se pudo agregar el producto"
        })
    }
})


//metodo put que permita modificar el producto sin tocar su id

app.put('/api/products/:pid', async(req, res) => {
    try{
       const { pid } = req.params
        const producto = await productModel.findById(pid)
        if(!producto) {
            return res.status(404).json({
                message: "no existe el producto"
            })
        }
        const { _id, ...camposActualizar} = req.body
        const productoActualizado = await productModel.findByIdAndUpdate(
            pid,
            camposActualizar,
            {new: true}
        )
        res.status(200).json({
            message: "producto actualizado correctamente"
        })
    }   
    catch (err) {
        console.log("Error al actualizar el producto", err);
        res.status(500).json({ message: "No se pudo actualizar el producto" });
    }
})

//metodo delete 

app.delete('/api/products/:pid', async (req, res) => {
    try {
        const { pid } = req.params
        const producto = await productModel.findById(pid)
        if(!producto){
            return res.status(404).json({
                message:"no se puede eliminar el producto porque no existe"
            })
        }
        const productoPorEliminar = await productModel.findByIdAndDelete(pid)

        return res.status(200).json({
            message: "se elimino el producto"
        })
    }
    catch (err){
        console.log("error al eliminar el producto", err)
        res.status(500).json({
            message: "no se pudo eliminar el producto"
        })
    }
})

//metodo para poder crear un carrito nuevo

app.post('/api/carts', async (req, res) => {
    try {
        const nuevoCarrito = new CartModel({
            products: []
        })
        await nuevoCarrito.save()
        res.status(201).json({ message: 'Carrito creado', carrito: nuevoCarrito });
    } catch (error) {
        res.status(500).json({ message: 'Error al crear carrito' });
    }
});

//metodo para agregar un producto al carrito

app.get('/api/carts/:cid', async (req, res) => {
    try {
    const { cid } = req.params
    const carrito = await CartModel.findById(cid)
    if(!carrito){
        console.log("no existe determinado carrito")
        return res.status(404).json({
            message: "no existe el carrito"
        })
    }
        res.status(200).json({
            message: "carrito encontrado",
            productos: carrito.products
        })
    }
    catch (err) {
        console.log("Error al obtener el carrito:", err);
        res.status(500).json({
            message: "No se pudo obtener el carrito"
        });
    }
})

//metodo post para traer el producto de un array

app.post('/api/carts/:cid/products/:pid', async (req, res) => {
    try {
        const { cid, pid } = req.params
        const carrito = await CartModel.findById(cid)
        const producto = await productModel.findById(pid)
        if(!carrito){
            return res.status(404).json({
                message: "no existe el carrito con tal id"
            })
        }
        if(!producto){
            return res.status(404).json({
                message: "no existe el producto con tal id"
            })
        }
        const productIndex = carrito.products.findIndex(
            p => p.product.toString() === pid
        )
        if(productIndex !== -1){
            carrito.products[productIndex].quantity += 1
        } else {
            carrito.products.push({
                product: pid,
                quantity: 1
            })
        }
        await carrito.save()
    }
    catch {

    }
}) 

app.post("/crearCarrito", async (req, res) => {
  try {
    const newCart = await CartModel.create({ products: [] })

    res.json({
      status: "success",
      payload: newCart
    })
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message })
    console.log(error)
  }
})


const serverHttp = app.listen(8080, () => {
    console.log("servidor escuchando en el puerto 8080")
})

//configuracion de socket
const serverSocket = new Server(serverHttp)


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

    })

    /* socket.on("deleteProduct", async (id) => {
        let products = await productModel.find()
        const productsActualizados = products.filter(p => p.id !== id)
        await guardarProductos(productsActualizados)
        serverSocket.emit("products", productsActualizados)
        console.log('product eliminado')
    }) */
/* }) */


