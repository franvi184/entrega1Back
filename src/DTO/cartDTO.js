class CartDTO {
    constructor(cart){
        this.id = cart._id
        this.products = cart.products.map(p => ({
            productID: p.product._id,
            title: p.product.title,
            price: p.product.price,
            quantity: p.quantity
        }))
    }
}

export default CartDTO