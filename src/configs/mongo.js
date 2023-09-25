import mongoose from "mongoose";
import envs from "./environments.js";

function connect() {
  return mongoose.connect(envs.MONGO_URI);
}

export default connect;
