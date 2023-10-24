import mongoose from "mongoose";

const UniversitySchema = new mongoose.Schema({

    name: {
        type: String,
        required: true,
      },
      city: {
        type: String,
        required: true,
      },
      image: {
        type: String,
        default: "default_university.png",
      }


});

const UniversityModel = mongoose.model("University", UniversitySchema, "universities");

export default UniversityModel;