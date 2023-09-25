import UserModel from "../models/user.model.js";
import bcrypt from "bcrypt";

async function register(req, res) {
  
    try {
        // Obteneción de lso datos del usuario.
        let params = req.body;

        // Validación de parámetros requeridos.
        if (!params.tuitionNumber || !params.name || !params.surname || !params.email || !params.password) {
            return res.status(400).send({ error: "Faltan datos por enviar" });
        }

        // Obtención de usuarios existentes
        let existingUsers = await UserModel.find({
            $or: [
                { tuitionNumber: params.tuitionNumber },
                { email: params.email }
            ]
        });

        // Validación de usuario ya registrado
        if (existingUsers && existingUsers.length >= 1) {
            return res.status(400).send({
              status: "error",
              message: "El usuario ya existe!",
            });
        } else {
            // Cifrar contarseña
            params.password = await bcrypt.hashSync(params.password, 10);

            // Crear un nuevo objeto usuario con sus parámetros
            let newUser = new UserModel(params);

            // Guardar usuario en la base de datos
            await newUser.save();

            return res.status(200).send({
              status: "success",
              message: "¡El usuario se ha registrado correctamente!"
            });
        }

    } catch (error) {
        return res
          .status(500)
          .send({ error: "Ha ocurrido un error en la base de datos" });
    }
}

export { register};