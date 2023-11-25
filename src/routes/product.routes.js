import { Router } from "express";
import {
  add,
  detail,
  remove,
  update,
  uploadPhoto,
  showPhoto,
  list,
  favourites,
} from "../controllers/product.controller.js";
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

router.post("/add", add);
router.get("/detail/:productId", detail);
router.delete("/remove/:productId", remove);
router.put("/update/:productId", update);
router.post("/upload-photo/:productId", uploads.single("file0"), uploadPhoto);
router.get("/photo/:file", showPhoto);
router.get("/list", list);
router.get("/favourites", favourites);

export default router;
