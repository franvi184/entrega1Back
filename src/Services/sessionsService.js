import { generarToken } from "../utils/jwt.js";
import { createHash, isValidPassword } from "../utils/bcrypt.js";
import UserDBManager from "../DAO/userDBManager.js";
import { sendResetEmail } from "../utils/mailer.js";
import jwt from 'jsonwebtoken'

const userDAO = new UserDBManager()

class UserService {
    async register(data) {
        const { first_name, last_name, email, age, password } = data

        if (!first_name || !last_name || !email || !password) {
            const error = new Error("Campos incompletos")
            error.status = 400
            throw error
        }

        try {
            const exist = await userDAO.findByEmail(email)
            if (exist) {
                const error = new Error("Usuario ya registrado")
                error.status = 400
                throw error
            }

            const user = await userDAO.create({
                first_name,
                last_name,
                email,
                age,
                password: createHash(password)
            })

            return { user }
        } catch (err) {
            throw err
        }
    }

    async login(data) {
        const { email, password } = data

        if (!email || !password) {
            const error = new Error("Credenciales incompletas")
            error.status = 400
            throw error
        }

        try {
            const user = await userDAO.findByEmail(email)
            if (!user) {
                const error = new Error("Usuario no existente")
                error.status = 400
                throw error
            }

            if (!isValidPassword(user, password)) {
                const error = new Error("Credenciales incorrectas")
                error.status = 401
                throw error
            }

            const token = generarToken(user)
            return { token }
        } catch (err) {
            throw err
        }
    }

    async forgotPassword(email) {
        if (!email) {
            const error = new Error('Email requerido')
            error.status = 400
            throw error
        }

        const user = await userDAO.findByEmail(email)
        if (!user) {
            const error = new Error('Usuario no existente')
            error.status = 400
            throw error
        }

        const KEY = process.env.PRIVATE_KEY
        const token = jwt.sign({ id: user._id, action: 'reset' }, KEY, { expiresIn: '1h' })
        const resetLink = `${process.env.FRONT_URL || 'http://localhost:8080'}/reset-password?token=${token}`

        const html = `<p>Hola ${user.first_name},</p>
            <p>Haz click en el siguiente enlace para restablecer tu contraseña (expira en 1 hora):</p>
            <a href="${resetLink}">Restablecer contraseña</a>`

        await sendResetEmail(user.email, 'Restablecer contraseña', html)
        return { message: 'Email de restablecimiento enviado' }
    }

    async resetPassword(token, newPassword) {
        if (!token || !newPassword) {
            const error = new Error('Token y nueva contraseña requeridos')
            error.status = 400
            throw error
        }

        const KEY = process.env.PRIVATE_KEY
        let payload
        try {
            payload = jwt.verify(token, KEY)
        } catch (err) {
            const error = new Error('Token inválido o expirado')
            error.status = 400
            throw error
        }

        if (payload.action !== 'reset') {
            const error = new Error('Token inválido')
            error.status = 400
            throw error
        }

        const user = await userDAO.findByID(payload.id)
        if (!user) {
            const error = new Error('Usuario no encontrado')
            error.status = 404
            throw error
        }

        // evitar reutilizar la misma contraseña
        if (isValidPassword(user, newPassword)) {
            const error = new Error('La nueva contraseña no puede ser igual a la anterior')
            error.status = 400
            throw error
        }

        const hashed = createHash(newPassword)
        const updated = await userDAO.updateUser(user._id, { password: hashed })
        return { message: 'Contraseña actualizada', user: updated }
    }
}

export default UserService