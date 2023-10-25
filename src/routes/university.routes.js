import { Router } from "express";
import { list , create , update, remove } from "../controllers/university.controller.js";
import multer from "multer";

// Configuración de subida
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./uploads/universities/");
  },
  filename: (req, file, cb) => {
    cb(null, "university-" + Date.now() + "-" + file.originalname);
  },
});

const uploads = multer({ storage });




const router = Router();

router.get("/universities", list);
router.post("/create", create);
router.put("/:id", update);
router.delete("/:id", remove);


router.post("/upload-photo/:id", [auth, uploads.single("file0")], uploadPhoto);
router.get("/photo/:file", auth, showPhoto);

export default router;