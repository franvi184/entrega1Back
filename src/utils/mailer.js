import nodemailer from 'nodemailer'

const SMTP_HOST = process.env.SMTP_HOST
const SMTP_PORT = process.env.SMTP_PORT
const SMTP_USER = process.env.SMTP_USER
const SMTP_PASS = process.env.SMTP_PASS

let transporter
if (SMTP_HOST && SMTP_PORT && SMTP_USER && SMTP_PASS) {
    transporter = nodemailer.createTransport({
        host: SMTP_HOST,
        port: Number(SMTP_PORT),
        secure: Number(SMTP_PORT) === 465,
        auth: {
            user: SMTP_USER,
            pass: SMTP_PASS
        }
    })
} else {
    transporter = null
}

export const sendResetEmail = async (to, subject, html) => {
    if (!transporter) {
        const error = new Error('SMTP no configurado')
        error.status = 500
        throw error
    }

    const info = await transporter.sendMail({
        from: SMTP_USER,
        to,
        subject,
        html
    })

    return info
}

export default transporter
