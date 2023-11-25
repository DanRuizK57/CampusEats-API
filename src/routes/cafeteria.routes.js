import { Router } from "express";
import {
  add,
  list,
  remove,
  update,
  uploadImage,
  showImage
} from "../controllers/cafeteria.controller.js";
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

router.post("/add", add);
router.get("/list", list);
router.delete("/remove/:cafeteriaId", remove);
router.put("/update/:cafeteriaId", update);
router.post(
  "/upload-image/:cafeteriaId", uploads.single("file0"),
  uploadImage
);
router.get("/image/:file", showImage);

export default router;
