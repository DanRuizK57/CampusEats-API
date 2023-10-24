import UniversityModel from "../models/university.model.js";


// obtener la lista de universidades
async function list(req, res) {
  try {
    const universities = await UniversityModel.find();
    return res.status(200).json({
      status: "success",
      universities: universities,
    });
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: "Ha ocurrido un error en la base de datos",
    });
  }
}

// crear universidad y guardarla en la base de datos
async function create(req, res) {
  try {
    const universityData = req.body;
    const newUniversity = new UniversityModel(universityData);
    await newUniversity.save();
    return res.status(201).json({
      status: "success",
      university: newUniversity,
    });
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: "Error al crear la universidad",
    });
  }
}


// actualizar los datos de la universidad
async function update(req, res) {
  try {
    const universityId = req.params.id;
    const updatedUniversityData = req.body;
    const updatedUniversity = await UniversityModel.findByIdAndUpdate(
      universityId,
      updatedUniversityData,
      { new: true }
    );
    if (!updatedUniversity) {
      return res.status(404).json({
        status: "error",
        message: "Universidad no encontrada",
      });
    }
    return res.status(200).json({
      status: "success",
      university: updatedUniversity,
    });
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: "Error al actualizar la universidad",
    });
  }
}

//eliminar una universidad 
async function remove(req, res) {
  try {
    const universityId = req.params.id;
    const deletedUniversity = await UniversityModel.findByIdAndRemove(universityId);
    if (!deletedUniversity) {
      return res.status(404).json({
        status: "error",
        message: "Universidad no encontrada",
      });
    }
    return res.status(200).json({
      status: "success",
      message: "Universidad eliminada correctamente",
    });
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: "Error al eliminar la universidad",
    });
  }
}

export { list , create , update, remove};
