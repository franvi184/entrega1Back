import mongoose, { Schema } from "mongoose";

/* con este const captamos la db */
const productsColecction = 'products'

/* aca definimos el schema que queremos que tengan nuestros productos */
const productSchema = new Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  code: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  category: {
    type: String,
    required: true,
    trim: true
  }
  ,
  stock: {
    type: Number,
    default: 0,
    min: 0
  }
})

/* primero pasame la collecion y despues el esquema que queremos que tenga */
const productModel = mongoose.model(productsColecction, productSchema)

export default productModel