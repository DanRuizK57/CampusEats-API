import { Router } from "express";
import {
  add,
  detail,
  remove,
  update,
  uploadPhoto,
  showPhoto,
  list,
} from "../controllers/product.controller.js";
import { auth } from "../middlewares/auth.js";
import multer from "multer";

// Configuración de subida
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./uploads/products/");
  },
  filename: (req, file, cb) => {
    cb(null, "product-" + Date.now() + "-" + file.originalname);
  },
});

const uploads = multer({ storage });

const router = Router();

router.post("/add", auth, add);
router.get("/detail/:productId", auth, detail);
router.delete("/remove/:productId", auth, remove);
router.put("/update/:productId", auth, update);
router.post("/upload-photo/:productId", [auth, uploads.single("file0")], uploadPhoto);
router.get("/photo/:file", auth, showPhoto);
router.get("/list", auth, list);

export default router;
