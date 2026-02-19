import { Router } from "express";
import productModel from "../model/Product.model.js";
import productDBManager from "../DAO/productDBManager.js";

const productServices = productDBManager

const route = Router()

route.get('/products', async (req, res) => {
    //aca solo definimos los productos para poder llamarlos en el home
    const products = await productServices.getAllProducts(req.query)
    res.render("home", { products })
})

route.get('/realtimeproducts', async (req, res) => {
    const products = await productModel.find().lean()
    res.render("realTimeProducts", { products })
})

route.get('/register', (req, res) => {
    res.render("register")
})

route.get('/login', (req, res) => {
    res.render("login")
})

export default route;