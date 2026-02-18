import { Router } from "express";
import productServices from "../Services/productService.js"
import passport from "passport"
import authorization from "../middleware/authorization.js";

const app = Router()
const productService = productServices


//creamos el get que trae todos los productos

app.get("/", async (req, res) => { 
    try {
        const result = await productService.getAllProducts(req.query)
        res.send({
            status: 'success',
            payload: result
        })
    } catch (error) {
        res.status(500).send({
            error: "error interno",
            message: error
        })
        console.log(error)
    }
})

 //get que trae producto por id
app.get('/:pid', async (req, res) => {  
    try {
        const result = await productService.getProductsById(req.params.pid)
        res.send({
            status: 'success',
            payload: result
        })
    } catch (error) {
        res.status(error.status || 500).send({
            status: 'error',
            payload: error.message
        })
    }    
})

//metodo post para crear nuevo producto

app.post('/create',
    passport.authenticate("jwt", { session: false }),
    authorization(["admin"]),
    async (req, res) => {
    try {
        const result = await productService.createProduct(req.body)
        res.send({
            status: 'success',
            payload: result
        })
    } catch (error) {
        res.status(error.status || 500 ).send({
            status: 'error',
            payload: error.message
        })
    }
})

//metodo put que permita modificar el producto sin tocar su id

app.put('/update/:pid',
    passport.authenticate("jwt", { session: false }),
    authorization(["admin"]),
    async(req, res) => {
    try {
        const result = await productService.updateProduct(req.params.pid, req.body)
        res.status(200).send({
            status: 'success',
            payload: result
        })
    } catch (error) {
        res.status(error.status || 500).send({
            status: 'error',
            payload: error.message
        })
    }
})

//metodo delete 

app.delete('/delete/:pid',
    passport.authenticate("jwt", { session: false }),
    authorization(["admin"]),
    async (req, res) => {
    try {
        const result = await productService.deleteProduct(req.params.pid)
        res.status(200).send({
            status: 'success',
            payload: result
        })
    } catch (error) {
        res.status(error.status || 500).send({
            status: 'error',
            payload: error.message
        })
    }
}) 

export default app;

