import ProductModel from "../models/product.model";

async function add(req, res) {
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

async function detail(req, res) {
  try {
    // Obtener el ID
    const productId = req.params.productId;

    // Buscar producto por ID
    const product = await ProductModel.findById(productId);

    if (!product) {
      return res.status(400).send({
        status: "error",
        message: "El producto no existe",
      });
    }

    return res.status(200).send({
      status: "success",
      message: "¡El producto ha sido encontrado!",
      product: product,
    });
  } catch (err) {
    return res
      .status(500)
      .send({ error: "Ha ocurrido un error en la base de datos" });
  }
}

async function remove(req, res) {
  try {
    // Obtener el ID
    const productId = req.params.productId;

    // Buscar producto por ID
    const product = await ProductModel.find({
      _id: productId,
    });

    if (!product) {
      return res.status(400).send({
        status: "error",
        message: "No se ha eliminado el producto",
      });
    }

    await ProductModel.findOneAndDelete(product);

    return res.status(200).send({
      status: "success",
      message: "¡El producto ha sido eliminado correctamente!",
      product: productId,
    });
  } catch (err) {
    return res
      .status(500)
      .send({ error: "Ha ocurrido un error en la base de datos" });
  }
}

async function update(req, res) {
  try {
    const productId = req.params.productId;
    const productToUpdate = req.body;

    // Buscar y actualizar
    let productUpdated = await ProductModel.findByIdAndUpdate(
      productId,
      productToUpdate,
      { new: true }
    );

    if (!productUpdated) {
      return res
        .status(500)
        .send({ error: "Ha ocurrido un error al actualizar" });
    }

    return res.status(200).send({
      status: "success",
      message: "¡El producto se ha actualizado correctamente!",
      productUpdated,
    });
  } catch (error) {
    return res
      .status(500)
      .send({ error: "Ha ocurrido un error en la base de datos" });
  }
}

export { add, detail, remove, update };