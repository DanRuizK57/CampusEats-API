import { Router } from "express";
import {register, login, update} from "../controllers/user.controller.js";
import { auth } from "../middlewares/auth.js";

const router = Router();

router.post("/register", register);
router.post("/login", login);
router.put("/update", auth, update);

export default router;