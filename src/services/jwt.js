import jwt from "jwt-simple";
import moment from "moment";
import envs from "../configs/environments.js"

export function createToken(user) {

    const payload = {
        id: user._id,
        name: user.name,
        surname: user.surname,
        email: user.email,
        role: user.role,
        image: user.image,
        iat: moment().unix(), // Fecha de creación del payload
        exp: moment().add(30, "days").unix()
    };

    // Devolver JWT token codificado
    return jwt.encode(payload, envs.SECRET_KEY);

}