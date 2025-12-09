import mongoose, { Schema } from "mongoose";

/* con este const captamos la db */
const productsColecction = 'products'

/* aca definimos el schema que queremos que tengan nuestros productos */
const productSchema = new Schema({
  title: String,
  price: Number,
  code: String,
  description: String,
  category: String,
})

/* primero pasame la collecion y despues el esquema que queremos que tenga */
const productModel = mongoose.model(productsColecction, productSchema)

export default productModel