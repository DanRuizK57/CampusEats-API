import { Router } from "express";
import {
  add,
  list,
  remove,
  update,
  uploadImage,
  showImage
} from "../controllers/cafeteria.controller.js";
import { auth } from "../middlewares/auth.js";
import multer from "multer";

// Configuración de subida
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./uploads/cafeterias/");
  },
  filename: (req, file, cb) => {
    cb(null, "cafeteria-" + Date.now() + "-" + file.originalname);
  },
});

const uploads = multer({ storage });

const router = Router();

router.post("/add", auth, add);
router.get("/list", auth, list);
router.delete("/remove/:cafeteriaId", auth, remove);
router.put("/update/:cafeteriaId", auth, update);
router.post(
  "/upload-image/:cafeteriaId",
  [auth, uploads.single("file0")],
  uploadImage
);
router.get("/image/:file", auth, showImage);

export default router;
