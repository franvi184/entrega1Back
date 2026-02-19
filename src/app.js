import express from 'express';
import path from 'node:path'
import viewRoute from "./routes/view.route.js"
import Handlebars from "express-handlebars"
import { connectDB } from './config/db.js';
import ProductRouter from './routes/productRouter.js';
import CartRouter from './routes/cartRouter.js'
import SessionsRouter from './routes/sessionsRouter.js'
import passport from 'passport'
import { initializePassport } from './config/passport.js'
import { Server as SocketIOServer } from 'socket.io'
import { initSocket } from './websocket.js'


const app = express();
//con esta linea de abajo le decimos a express que pueda interpretar json
app.use(express.json());
app.use(express.urlencoded({ extended: true }))

// passport
initializePassport()
app.use(passport.initialize())

//conectamos a la base de datos
connectDB()

//configuracion de handlebars
app.engine("handlebars", Handlebars.engine())
app.set("view engine", "handlebars")
app.set("views", path.join(process.cwd(), "src", "views"))

app.use(express.static(path.join(process.cwd(), "src", "public")))
app.use('/', viewRoute)
app.use("/api/products", ProductRouter)
app.use("/api/carts", CartRouter)
app.use("/api/sessions", SessionsRouter)


const serverHttp = app.listen(8080, () => {
    console.log("servidor escuchando en el puerto 8080")
})

// configuracion de socket.io
const io = new SocketIOServer(serverHttp)
initSocket(io)





