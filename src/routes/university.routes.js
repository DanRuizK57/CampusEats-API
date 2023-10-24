import { Router } from "express";
import { list , create , update, remove } from "../controllers/university.controller.js";

const router = Router();

router.get("/universities", list);
router.post("/crearUniversity", create);
router.put("/:id", update);
router.delete("/:id", remove);


export default router;