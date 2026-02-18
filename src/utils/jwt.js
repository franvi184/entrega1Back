import jwt from 'jsonwebtoken' //primero importamos jwt

const KEY = process.env.PRIVATE_KEY //creamos la palabra clave para validar siempre si no se 
// cambia, y en caso de cambiar dejan de servir todos los tokens

export const generarToken = (user) => {    //aca estamos por crear el token que necesita el usuario para 
    return jwt.sign(                            //no tener que hacer login en cada request //con .sing "iniciamos" el jwt
        {
            id: user._id,
            email: user.email,
            role: user.role                 //estos son los datos no vulnerables que va tener el token
        },
        KEY,                        //esta es la palabra clave con la cual va a firmar el token ese "pase"
        { expiresIn: "1h"}
    )
} 

export const jwtVerify = (token) =>         //aca verifica si el token coincide con la palabra clave
    jwt.verify(token, KEY)