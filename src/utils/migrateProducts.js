import mongoose from "mongoose";
import ProductModel from "../model/Product.model.js";

const MONGO_URL =
  "mongodb+srv://coderuser:franco123@codercluster.oikhjpm.mongodb.net/coderEco?retryWrites=true&w=majority";


const migrate = async () => {
  try {
    await mongoose.connect(MONGO_URL);
    console.log("Conectado a MongoDB");

    await ProductModel.insertMany(productos);

    console.log("✅ Productos cargados correctamente en MongoDB");
    process.exit();

  } catch (error) {
    console.log("❌ Error:", error.message);
  }
};

migrate();