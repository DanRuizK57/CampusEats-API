import { Router } from "express";
import { add } from "../controllers/cafeteria.controller.js";
import { auth } from "../middlewares/auth.js";

const router = Router();

router.post("/add", auth, add);

export default router;
