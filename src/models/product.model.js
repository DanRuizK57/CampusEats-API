import mongoose, { Schema } from "mongoose";

const ProductSchema = new mongoose.Schema({
  cafeteria: {
    type: Schema.ObjectId,
    ref: "Cafeteria",
  },
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  quantity: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  photo: {
    type: String,
    default: "default.png",
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
});

const ProductModel = mongoose.model("Product", ProductSchema, "products");

export default ProductModel;
