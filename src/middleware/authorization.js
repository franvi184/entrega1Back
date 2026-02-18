const authorization = (roles = []) => {

    return (req, res, next) => {

        if (!req.user) {
            return res.status(401).send({ error: "no autorizado" })
        }

        if (!roles.includes(req.user.role)) {
            return res.status(403).send({ error: "no tenes permiso para esto" })
        }

        next()
    }
}

export default authorization
