import passport from "passport";
import { Strategy as JwtStrategy, ExtractJwt } from "passport-jwt";
import UserDBManager from "../DAO/userDBManager.js";

const userDAO = new UserDBManager()
const KEY = process.env.PRIVATE_KEY 

export const initializePassport = () => {
    passport.use(
        "jwt",          //aca estamos definiendo la estrategia de passport, recuperamos el token y lo comparamos con la palabra clave
        new JwtStrategy(            //en caso de que el token coincida, le decimos que hacer despues de eso
            {
                jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
                secretOrKey: KEY
            },
            async (jwt_payload, done) => {
                try {                               //en el jwt_payload vamos a tener los datos que pasamos del usuario, entre ellos el id
                    const user = await userDAO.findByID(jwt_payload.id);          //buscamos el id para ver si existe, y en caso de que si
                    if (!user) return done(null, false);                            //simplemente dejamos pasar el request.
                    return done(null, user)
                } catch (error) {
                    return done(error)
                }
            }
        )
    )
}
