import mongoose from "mongoose";
import ProductModel from "../model/Product.model.js";
import { leerProductos } from "../filesProductos.js"; // tu archivo viejo

const MONGO_URL = "mongodb+srv://thefrancogamer72:AMFKHjTztarcnkc1@codercluster.oikhjpm.mongodb.net/coderEco";

const migrate = async () => {
  try {
    await mongoose.connect(MONGO_URL);
    console.log("Conectado a MongoDB");

    const productos = await leerProductos();

    await ProductModel.insertMany(productos);

    console.log("✅ Productos cargados correctamente en MongoDB");
    process.exit();

  } catch (error) {
    console.log("❌ Error:", error.message);
  }
};

migrate();