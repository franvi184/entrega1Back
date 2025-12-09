import { Router } from "express";
import productModel from "../model/Product.model.js";

const route = Router()

route.get('/', async (req, res) => {
    //aca solo definimos los productos para poder llamarlos en el home
    const products = await productModel.find()
    res.render("home", { products })
})

route.get('/realtimeproducts', async (req, res) => {
    const products = await productModel.find()
    res.render("realTimeProducts", { products })
})

export default route;