import cartServices from "../Services/cartServices.js";
import { Router } from "express";
import passport from "passport"
import authorization from "../middleware/authorization.js";


const app = Router()
const cartService = cartServices
//metodo para poder crear un carrito nuevo

app.post('/', async (req, res) => {
    try {
        const result = await cartService.createCart()
        res.status(201).json({
            status: "success",
            payload: result
        });
    } catch (error) {
        res.status(500).json({ message: 'Error al crear carrito' });
        console.log(error)
    }
});

//metodo get para traer los productos de un carrito

app.get('/:cid', async (req, res) => {
    try {
        const result = await cartService.getProductsFromCartByID(req.params.cid)
        res.status(201).json({
            status: "success",
            payload: result
        })
    } catch (error) {
        res.status(500).json({
            message: "error al encontrar carrito"
        })
    }
})

//metodo para agregar un producto al carrito

app.post('/:cid/products/:pid',
    passport.authenticate("jwt", { session: false }),
    authorization(["user"]),
    async (req, res) => {
        try {
            const result = await cartService.addProductByID(req.params.cid, req.params.pid)
            res.status(201).json({
                status: "success",
                payload: result
            })
        } catch (error) {
            res.status(500).json({
                message: "error al encontrar carrito"
            })
        }
    })

//metodo delete para eliminar producto del carrito
app.delete('/:cid/products/:pid',
    passport.authenticate("jwt", { session: false }),
    async (req, res) => {
    try {
        const result = await cartService.deleteProductByID(req.params.cid, req.params.pid)
        res.status(201).json({
            status: "success",
            payload: result
        })
    } catch (error) {
        res.status(500).json({
            message: "error al eliminar el producto"
        })
        console.log(error)
    }
})

//metodo para editar todos los productos
app.put('/:cid',
    passport.authenticate("jwt", { session: false }),
    authorization(["user"]),
    async (req, res) => {
        try {
            const result = await cartService.updateAllProducts(req.params.cid, req.body.products)
            res.send({
                status: 'success',
                payload: result
            });
        } catch (error) {
            res.status(400).send({
                status: 'error',
                message: error.message
            });
        }
    });

//actualizamos la catnidad
app.put('/:cid/products/:pid',
    passport.authenticate("jwt", { session: false }),
    authorization(["user"]),
    async (req, res) => {
    try {
        const result = await cartService.updateProductQuantity(req.params.cid, req.params.pid, req.body.quantity)
        res.send({
            status: 'success',
            payload: result
        });
    } catch (error) {
        res.status(400).send({
            status: 'error',
            message: error.message
        });
    }
});

//elimiamos todo el carrito
app.delete('/:cid',
    passport.authenticate("jwt", { session: false }),
    authorization(["user"]),
    async (req, res) => {
    try {
        const result = await cartService.deleteAllProducts(req.params.cid)
        res.send({
            status: 'success',
            payload: result
        });
    } catch (error) {
        res.status(400).send({
            status: 'error',
            message: error.message
        });
    }
})

// endpoint checkout - solo usuarios
app.post('/:cid/checkout',
    passport.authenticate("jwt", { session: false }),
    authorization(["user"]),
    async (req, res) => {
        try {
            const result = await cartService.checkout(req.params.cid, req.user._id)
            res.status(200).json({ status: 'success', payload: result })
        } catch (error) {
            res.status(error.status || 500).json({ status: 'error', message: error.message })
        }
    }
)

export default app