import { Router } from "express";
import passport from "passport"
import UserService from "../Services/sessionsService.js";
import UserDTO from "../DTO/userDTO.js";

const app = Router();
const userService = new UserService()

app.post("/register", async (req, res) => {
    try {
        const result = await userService.register(req.body)
        res.status(201).json({
            status: "success",
            payload: result
        })
    } catch (error) {
        res.status(error.status || 500).send({
            status: 'error',
            payload: error.message
        })
        console.log(error)
    }
});




app.post("/login", async (req, res) => {
    try {
        const result = await userService.login(req.body)
        res.status(200).json({
            payload: result
        })
    } catch (error) {
        res.status(error.status || 500).send({
            status: 'error',
            payload: error.message
        })
    }
});

// forgot password
app.post('/forgot-password', async (req, res) => {
    try {
        const { email } = req.body
        const result = await userService.forgotPassword(email)
        res.status(200).json({ status: 'success', payload: result })
    } catch (error) {
        res.status(error.status || 500).json({ status: 'error', message: error.message })
    }
})

// reset password
app.put('/reset-password/:token', async (req, res) => {
    try {
        const { token } = req.params
        const { password } = req.body
        const result = await userService.resetPassword(token, password)
        res.status(200).json({ status: 'success', payload: result })
    } catch (error) {
        res.status(error.status || 500).json({ status: 'error', message: error.message })
    }
})

app.get(
    "/current",
    passport.authenticate("jwt", { session: false }),
    (req, res) => {
        const user = new UserDTO(req.user)
        res.send({
            status: "success",
            user
        })
    }
)

export default app;