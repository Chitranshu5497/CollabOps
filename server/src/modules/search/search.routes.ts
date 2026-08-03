import { Router } from "express";
import { authenticate } from "../../middleware/auth.middleware";
import { searchController } from "./search.controller";

const router = Router();

router.get("/", authenticate, searchController);

export default router;