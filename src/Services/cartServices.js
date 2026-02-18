import cartDBManager from "../DAO/cartDBManager.js";
import productDBManager from "../DAO/productDBManager.js";
import CartDTO from "../DTO/cartDTO.js";
import TicketModel from "../model/Ticket.model.js";
import { v4 as uuidv4 } from 'uuid';

const cartDAO = new cartDBManager()
const productDAO = productDBManager

class cartServices {

    async createCart() {
        const cart = await cartDAO.createCart()
        return new CartDTO(cart)
    }

    async getProductsFromCartByID(cid) {
        const carrito = await cartDAO.getCartById(cid)
        if (!carrito) {
            const error = new Error("no existe el id")
            error.status = 404
            throw error
        }
        return new CartDTO(carrito)
    }

    async addProductByID(cid, pid) {
        const carrito = await cartDAO.getCartById(cid)
        const producto = await productDAO.getProductsById(pid)
        if (!carrito) {
            const error = new Error("no existe el carrito")
            error.status = 404
            throw error
        }
        if (!producto) {
            const error = new Error("no existe el producto")
            error.status = 404
            throw error
        }
        const productIndex = carrito.products.findIndex(
            p => p.product._id.toString() === pid
        )
        if (productIndex !== -1) {
            carrito.products[productIndex].quantity += 1
        } else {
            carrito.products.push({
                product: pid,
                quantity: 1
            })
        }
        const updateCart = await cartDAO.saveCart(carrito)

        return new CartDTO(updateCart)
    }

    async deleteProductByID(cid, pid) {
        const carrito = await cartDAO.getCartById(cid)
        if(!carrito){
            const error = new Error("no existe el carrito")
            error.status = 404
            throw error
        }
        const productIndex = carrito.products.findIndex(
            p => p.product._id.toString() === pid
        )
        if(productIndex === -1){
            const error = new Error("no existe el producto dentro del carrito")
            error.status = 404
            throw error
        }
        carrito.products.splice(productIndex, 1)
        const updateCart = await cartDAO.saveCart(carrito)

        return new CartDTO(updateCart)
    }

    async updateAllProducts (cid, products){
        for(let product of products){
            const exist = await productDAO.getProductsById(product.product)
            if(!exist){
                throw new Error(`el producto ${product.product} no existe`)
            }
        }
        const carrito = await cartDAO.updateCart(cid, products)

        return new CartDTO(carrito)
    }

    async updateProductQuantity(cid, pid, quantity){
        if(!quantity || isNaN(parseInt(quantity))){
            const error = new Error("la catnidad ingresada no es valida")
            error.status = 404
            throw error
        }
        const existProduct = await productDAO.getProductsById(pid)
        if(!existProduct){
            const error = new Error("el producto no existe")
            error.status = 404
            throw error
        }
        const carrito = await cartDAO.getCartById(cid)
        if(!carrito){
            const error = new Error("el carrito no existe")
            error.status = 404
            throw error
        }
        const productIndex = carrito.products.findIndex(
            p => p.product._id.toString() === pid
        )
        if(productIndex === -1){
            const error = new Error("el producto no existe en el carrito")
            error.status = 404
            throw error
        }
        carrito.products[productIndex].quantity = parseInt(quantity)
        const updatedCart = await cartDAO.updateCart(cid, carrito.products)

        return new CartDTO(updatedCart) 
    }

    async deleteAllProducts(cid){
        const carritoFormateado = await cartDAO.deleteAllProducts(cid)
        if(!carritoFormateado){
            const error = new Error("el carrito no existe")
            error.status = 404
            throw error
        }
        return new CartDTO(carritoFormateado)
    }

    async checkout(cid, userId){
        const carrito = await cartDAO.getCartById(cid)
        if(!carrito || carrito.products.length === 0){
            const error = new Error("el carrito está vacío")
            error.status = 400
            throw error
        }

        const productosComprados = []
        const productosNoComprados = []
        let totalAmount = 0

        for (let item of carrito.products){
            const productId = item.product._id ? item.product._id.toString() : item.product.toString()
            const producto = await productDAO.getProductsById(productId)
            if(!producto){
                productosNoComprados.push(productId)
                continue
            }

            const qty = item.quantity || 1
            if (producto.stock !== undefined && producto.stock >= qty){
                // descontar stock
                await productDAO.update(productId, { stock: producto.stock - qty })
                totalAmount += producto.price * qty
                productosComprados.push({ product: productId, quantity: qty, price: producto.price })
            } else {
                productosNoComprados.push(productId)
            }
        }

        let ticket = null
        if (productosComprados.length > 0){
            ticket = await TicketModel.create({
                code: uuidv4(),
                purchase_datetime: new Date(),
                amount: totalAmount,
                purchaser: userId,
                products: productosComprados
            })
        }

        // rebuild cart with productsNoComprados
        if (productosNoComprados.length > 0){
            const productosRestantes = carrito.products.filter(item => {
                const pid = item.product._id ? item.product._id.toString() : item.product.toString()
                return productosNoComprados.includes(pid)
            }).map(i => ({ product: i.product._id ? i.product._id : i.product, quantity: i.quantity }))

            await cartDAO.updateCart(cid, productosRestantes)
        } else {
            await cartDAO.deleteAllProducts(cid)
        }

        return {
            message: 'Compra procesada',
            ticket: ticket ? { id: ticket._id, code: ticket.code, amount: ticket.amount } : null,
            productosComprados: productosComprados.length,
            productosNoComprados: productosNoComprados.length,
            totalAmount
        }
    }

}


export default new cartServices