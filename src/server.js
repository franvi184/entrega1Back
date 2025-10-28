import express from 'express';
import { v4 as uuidv4} from 'uuid';
import { leerProductos, guardarProductos } from './filesProductos.js'
import { leerCarritos, guardarCarritos, crearCarrito } from './filesCarritos.js';

const app = express();
//con la linea 7 le decimos a express que interpretar en formato json
app.use(express.json());


//creamos el get que trae todos los productos
app.get('/api/products', async (req, res) => {
    try {
        const productos = await leerProductos()
        res.json(productos)
    }
    catch(err){
        console.log("error al traer los productos", err)
    }
})

//get que trae producto por id
app.get('/api/products/:pid', async (req, res) => {
    try {
        const productos = await leerProductos()
        const producto = productos.find(p => p.id === req.params.pid)

        if(!producto) {
            return res.status(404).json({err: "producto no encontrado"})
        }
        res.json(producto)
    }
    catch (err){
        console.log("error del servidor", err)
    }
})

//metodo post para crear nuevo producto

app.post('/api/products', async (req, res) => {
    try {
        const productos = await leerProductos();
        const nuevoProducto = {
            id:uuidv4(),
            ...req.body
        }
        productos.push(nuevoProducto)
        
        await guardarProductos(productos)

        res.status(200).json({
            message: "Producto agregado correctamente",
            producto: nuevoProducto
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

app.post('/api/products/:pid', async(req, res) => {
    try{
        const productos = await leerProductos();
        const producto = productos.find(p => p.id === req.params.pid)
        if(!producto) {
            console.log("no existe este producto")
            return res.status(404).json({
                message:"no existe este producto"
            })
        }
        const { id, ...campoActualizar } = req.body
        Object.assign(producto, campoActualizar);

        await guardarProductos(productos)

         res.status(200).json({
            message: "Producto actualizado correctamente",
            producto
        });
    }   
    catch (err) {
        console.log("Error al actualizar el producto", err);
        res.status(500).json({ message: "No se pudo actualizar el producto" });
    }
})

//metodo delete 

app.delete('/api/products/:pid', async (req, res) => {
    try {
        const productos = await leerProductos()
        const productoExistente = productos.find(p => p.id === req.params.pid)
        if(!productoExistente) {
            console.log("no existe tal producto")
            return res.status(404).json({
                message: "no existe el producto"
            })
        }
        const productosActualizados = productos.filter(p => p.id !== req.params.pid)
        await guardarProductos(productosActualizados)
        res.status(200).json({ message: "Producto eliminado correctamente" });
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
        const nuevoCarrito = await crearCarrito();
        res.status(201).json({ message: 'Carrito creado', carrito: nuevoCarrito });
    } catch (error) {
        res.status(500).json({ message: 'Error al crear carrito' });
    }
});

//metodo para agregar un producto al carrito

app.get('/api/carts/:cid', async (req, res) => {
    try {
    const carritos = await leerCarritos();
    const carrito = carritos.find(c => c.id === req.params.cid)
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

//el metodo no funciona como deberia. cosas por corregir
/* 
app.post('/api/carts/:cid/products/:pid', async (req, res) => {
    const { cid, pid } = req.params
    const carritos = await leerCarritos();
    const carrito = carritos.find(c => c.id === req.params.cid)
    if(!carrito){
        console.log("no existe tal carrito")
        return res.status(404).json({
            message: "no existe el carrito"
        })
    }
    res.status(200).json({
        message: "existe el carrito"
    })
    console.log(`el carrito con id ${cid} existe`)
    const productos = await leerProductos();
    const productoCarrito = carrito.products.find(p => p.id === req.params.pid)
    try {     
        if(!productoCarrito){
            console.log("se agrego el producto a la lista")
            carrito.push(products)
        } else {
            productos.quantity++;
            console.log("se sumo a la lista")
        }
    }
    catch {
        console.log("no se puede sumar el producto")
    }

}) */

app.listen(8080, () => {
    console.log("servidor escuchando en el puerto 8080")
})

