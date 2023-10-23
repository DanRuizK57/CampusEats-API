import ProductModel from "../models/product.model";

async function register(req, res) {
  try {
    let params = req.body;

    // Validación de parámetros requeridos.
    if (!params.name || !params.description || !params.quantity) {
      return res.status(400).send({ error: "Faltan datos por enviar" });
    }

    // Obtención de usuarios existentes
    let existingProducts = await ProductModel.find({
      $or: [{ name: params.name }],
    });

    // Validación de usuario ya registrado
    if (existingProducts && existingProducts.length >= 1) {
      return res.status(400).send({
        status: "error",
        message: "¡El producto ya existe!",
      });
    } else {
      // Crear un nuevo objeto producto con sus parámetros
      let newProduct = new ProductModel(params);

      // Guardar usuario en la base de datos
      await newProduct.save();

      return res.status(200).send({
        status: "success",
        message: "¡El producto se ha registrado correctamente!",
      });
    }
  } catch (error) {
    return res
      .status(500)
      .send({ error: "Ha ocurrido un error en la base de datos" });
  }
}

export { register };