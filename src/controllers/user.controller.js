import UserModel from "../models/user.model.js";
import bcrypt from "bcrypt";
import { createToken } from "../services/jwt.js";

async function register(req, res) {
  
    try {
        // Obteneción de lso datos del usuario.
        let params = req.body;

        // Validación de parámetros requeridos.
        if (!params.name || !params.surname || !params.email || !params.password) {
            return res.status(400).send({ error: "Faltan datos por enviar" });
        }

        // Obtención de usuarios existentes
        let existingUsers = await UserModel.find({
            $or: [
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

async function login(req, res) {

    try {
      // Obtener parámetros del body
      let params = req.body;

      // Validación de parámetros requeridos.
      if (!params.email || !params.password) {
          return res.status(400).send({
            status: "error",
            message: "Faltan datos por enviar",
          });
        }
        
        // Buscar usuario en la BBDD
      const user = await UserModel.findOne({ email: params.email })
                          .select("+password +role");

        // Validar si el usuario existe
        if (!user) {
            return res.status(400).send({
              status: "error",
              message: "El usuario no está registrado",
            });
        }

        // Comprobar contraseña
        let isSamePassword = bcrypt.compareSync(params.password, user.password);

        // Validación de contraseña
        if (!isSamePassword) {
            return res.status(400).send({
              status: "error",
              message: "¡Contraseña incorrecta!",
            });
        }

        // Creación del token
        const token = createToken(user)

        return res.status(200).send({
            status: "success",
            message: "¡Inicio de sesión exitoso!",
            token: token
        })
        
    } catch (error) {
        return res
          .status(500)
          .send({ error: "Ha ocurrido un error en la base de datos" });
    }

}

async function update(req, res) {

  try {
    const userIdentified = req.user;
    const userToUpdate = req.body;

    // Eliminar datos que no se requieren
    delete userToUpdate.iat;
    delete userToUpdate.exp;
    delete userToUpdate.role;
    delete userToUpdate.image;

    let existingUsers = await UserModel.find({ email: userToUpdate.email });

    let userIsSet = false;

    existingUsers.forEach((user) => {
      if (user && user._id != userIdentified.id) {
        userIsSet = true;
      }
    });

    if (userIsSet) {
      return res.status(404).send({
        status: "error",
        message: "Sólo puedes editar tu propio perfil!",
      });
    }

    if (userToUpdate.password) {
      // Cifrar contraseña
      userToUpdate.password = await bcrypt.hashSync(userToUpdate.password, 10);
    } else {
      delete userToUpdate.password; // Para q no sobre-escriba en la BBDD
    }

    // Buscar y actualizar
    let userUpdated = await UserModel.findByIdAndUpdate(
      userIdentified.id,
      userToUpdate,
      { new: true }
    );

    if (!userUpdated) {
      return res
        .status(500)
        .send({ error: "Ha ocurrido un error al actualizar" });
    }

    return res.status(200).send({
      status: "success",
      message: "El usuario se ha actualizado correctamente!",
      userUpdated,
    });
  } catch (error) {
    return res
      .status(500)
      .send({ error: "Ha ocurrido un error en la base de datos" });
  }

}

export { register, login, update };