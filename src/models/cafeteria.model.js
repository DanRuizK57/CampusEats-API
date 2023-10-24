import mongoose from "mongoose";

const CafeteriaSchema = new mongoose.Schema({
  university: {
    type: Schema.ObjectId,
    ref: "University",
  },
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    default: "default.png",
  },
});

const CafeteriaModel = mongoose.model(
  "Cafeteria",
  CafeteriaSchema,
  "cafeterias"
);

export default CafeteriaModel;
