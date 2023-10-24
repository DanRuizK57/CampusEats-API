import CafeteriaModel from "../models/cafeteria.model.js";
import fs from "fs";
import path from "path";

async function add(req, res) {
  try {
    // Obtener datos de la petición
    let params = req.body;

    // Crear obj cafeteria
    let cafeteria = new CafeteriaModel(params);

    // Guardar en la BBDD
    await cafeteria.save();

    return res.status(200).send({
      status: "success",
      cafeteria,
    });
  } catch (err) {
    return res
      .status(500)
      .send({ error: "Ha ocurrido un error en la base de datos" });
  }
}

async function list(req, res) {
  try {
    const cafeterias = await CafeteriaModel.find();
    return res.status(200).json({
      status: "success",
      cafeterias: cafeterias,
    });
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: "Ha ocurrido un error en la base de datos",
    });
  }
}

async function remove(req, res) {
  try {
    // Obtener el ID
    const cafeteriaId = req.params.cafeteriaId;

    // Buscar cafeteriao por ID
    const cafeteria = await CafeteriaModel.find({
      _id: cafeteriaId,
    });

    if (!cafeteria) {
      return res.status(400).send({
        status: "error",
        message: "No se ha eliminado el casino",
      });
    }

    await CafeteriaModel.findOneAndDelete(cafeteria);

    return res.status(200).send({
      status: "success",
      message: "¡El casino ha sido eliminado correctamente!",
      cafeteria: cafeteriaId,
    });
  } catch (err) {
    return res
      .status(500)
      .send({ error: "Ha ocurrido un error en la base de datos" });
  }
}

async function update(req, res) {
  try {
    const cafeteriaId = req.params.cafeteriaId;
    const cafeteriaToUpdate = req.body;

    // Buscar y actualizar
    let cafeteriaUpdated = await CafeteriaModel.findByIdAndUpdate(
      cafeteriaId,
      cafeteriaToUpdate,
      { new: true }
    );

    if (!cafeteriaUpdated) {
      return res
        .status(500)
        .send({ error: "Ha ocurrido un error al actualizar" });
    }

    return res.status(200).send({
      status: "success",
      message: "¡El cafeteriao se ha actualizado correctamente!",
      cafeteriaUpdated,
    });
  } catch (error) {
    return res
      .status(500)
      .send({ error: "Ha ocurrido un error en la base de datos" });
  }
}

async function uploadImage(req, res) {
  const cafeteriaId = req.params.cafeteriaId;

  // Recoger el fichero de imagen y comprobar que existe
  if (!req.file) {
    return res.status(404).send({
      status: "error",
      message: "¡La solicitud requiere una imagen!",
    });
  }

  // Conseguir en nombre del archivo
  let image = req.file.originalname;

  // Obtener la extensión del archivo
  const imageSplit = image.split(".");
  const extension = imageSplit[1];

  // Comprobar la extensión
  if (extension != "png" && extension != "jpg" && extension != "jpeg") {
    const filePath = req.file.path;
    // Borrar archivo
    const fileDeleted = fs.unlinkSync(filePath);

    return res.status(400).send({
      status: "error",
      message: "¡Extensión del fichero inválida!",
    });
  }

  // Si es correcta, guardar en la BBDD
  const cafeteriaUpdated = await CafeteriaModel.findByIdAndUpdate(
    cafeteriaId,
    { image: req.file.filename },
    { new: true }
  );

  if (!cafeteriaUpdated) {
    return res.status(500).send({
      status: "error",
      message: "Ha ocurrido un error en la base de datos",
    });
  }

  return res.status(200).send({
    status: "success",
    message: "Imagen subida correctamente!",
    cafeteriaUpdated,
  });
}

function showImage(req, res) {
  const file = req.params.file;

  const filePath = "./uploads/cafeterias/" + file;

  // Comprobar que existe
  fs.stat(filePath, (error, exists) => {
    if (!exists) {
      return res.status(404).send({
        status: "error",
        message: "¡No existe la imagen!",
      });
    }

    // Devolver imagen
    return res.sendFile(path.resolve(filePath));
  });
}

export { add, list, remove, update, uploadImage, showImage };