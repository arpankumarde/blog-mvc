import { Router } from "express";
import { register, login, getProfile } from "@/controllers/user.controller";

const router = Router();

router.post("/register", register);
router.post("/login", login);
router.get("/:id", getProfile);

export default router;
