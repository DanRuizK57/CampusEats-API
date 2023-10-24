import ProductModel from "../models/product.model.js";
import fs from "fs";
import path from "path";

async function add(req, res) {
  try {
    let params = req.body;

    // Validación de parámetros requeridos.
    if (!params.name || !params.description || !params.quantity) {
      return res.status(400).send({ error: "Faltan datos por enviar" });
    }

    // Obtención de productos existentes
    let existingProducts = await ProductModel.find({
      $or: [{ name: params.name }],
    });

    // Validación de producto ya registrado
    if (existingProducts && existingProducts.length >= 1) {
      return res.status(400).send({
        status: "error",
        message: "¡El producto ya existe!",
      });
    } else {
      // Crear un nuevo objeto producto con sus parámetros
      let newProduct = new ProductModel(params);

      // Guardar producto en la base de datos
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

async function uploadPhoto(req, res) {

  const productId = req.params.productId;
  console.log(req.file);
  // Recoger el fichero de imagen y comprobar que existe
  if (!req.file) {
    return res.status(404).send({
      status: "error",
      message: "¡La solicitud requiere una imagen!",
    });
  }

  // Conseguir en nombre del archivo
  let photo = req.file.originalname;

  // Obtener la extensión del archivo
  const photoSplit = photo.split(".");
  const extension = photoSplit[1];

  // Comprobar la extensión
  if (
    extension != "png" &&
    extension != "jpg" &&
    extension != "jpeg"
  ) {
    const filePath = req.file.path;
    // Borrar archivo
    const fileDeleted = fs.unlinkSync(filePath);

    return res.status(400).send({
      status: "error",
      message: "¡Extensión del fichero inválida!",
    });
  }

  // Si es correcta, guardar en la BBDD
  const productUpdated = await ProductModel.findByIdAndUpdate(
    productId,
    { photo: req.file.filename },
    { new: true }
  );

  if (!productUpdated) {
    return res.status(500).send({
      status: "error",
      message: "Ha ocurrido un error en la base de datos",
    });
  }

  return res.status(200).send({
    status: "success",
    message: "¡Foto subida correctamente!",
    productUpdated,
  });
}

function showPhoto(req, res) {
  const file = req.params.file;

  const filePath = "./uploads/products/" + file;

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

async function list(req, res) {
  try {
    const products = await ProductModel.find();
    return res.status(200).json({
      status: "success",
      products: products,
    });
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: "Ha ocurrido un error en la base de datos",
    });
  }
}

export { add, detail, remove, update, uploadPhoto, showPhoto, list };