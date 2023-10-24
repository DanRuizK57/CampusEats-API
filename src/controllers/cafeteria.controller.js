import CafeteriaModel from "../models/cafeteria.model.js";

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

export { add, list, remove, update };