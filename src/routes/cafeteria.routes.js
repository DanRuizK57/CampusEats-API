import { Router } from "express";
import { add, list, remove, update } from "../controllers/cafeteria.controller.js";
import { auth } from "../middlewares/auth.js";

const router = Router();

router.post("/add", auth, add);
router.get("/list", auth, list);
router.delete("/remove/:cafeteriaId", auth, remove);
router.put("/update/:cafeteriaId", auth, update);

export default router;
