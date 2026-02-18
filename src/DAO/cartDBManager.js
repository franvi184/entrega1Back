import CartModel from "../model/Cart.model.js";

class cartDBManager {

    async createCart() {
        return await CartModel.create({})
    }

    async getCartById(cid) {
        return await CartModel.findById(cid).populate('products.product', 'title price')
    }

    async saveCart(cart) {
        return await cart.save()
    }

    async updateCart(cid, products) {
        return await CartModel.findByIdAndUpdate(
            cid,
            { products },
            { new: true }
        )
    }

    async deleteAllProducts(cid) {
        return await CartModel.findByIdAndUpdate(
            cid,
            { products: [] },
            { new: true }
        )
    }
}

export default cartDBManager