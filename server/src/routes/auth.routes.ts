import { Router } from "express";
import { login, logout, me, refresh, register, updateMe, updatePassword } from "../controllers/auth.controller";
import { authenticate } from "../middleware/auth.middleware";

const router = Router();

router.post("/register", register);
router.post("/login", login);
router.get("/me", authenticate, me);
router.patch("/me", authenticate, updateMe);
router.patch("/me/password", authenticate, updatePassword);
router.post("/refresh", refresh);
router.post("/logout", logout);

export default router;
