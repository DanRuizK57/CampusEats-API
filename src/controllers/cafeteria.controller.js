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

export { add };