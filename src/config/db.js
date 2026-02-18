import mongoose from "mongoose"
import dotenv from "dotenv"

dotenv.config()

export const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI)
        console.log('conectado correctamente a la base de datos')
    } catch (error) {
        console.log('error al conectar a la base', error)
        process.exit(1)
    }
}