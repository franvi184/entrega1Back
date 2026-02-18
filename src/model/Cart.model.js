import mongoose, { mongo, Schema } from "mongoose";

const cartsColecction = 'carts'

const cartSchema = new Schema({
    products: [{
        product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "products"
        },
        quantity: {
            type: Number,
            default: 1
        }        
    }]
})

const CartModel = mongoose.model(cartsColecction, cartSchema)

export default CartModel