import { Router } from "express";
import { authenticate } from "../../middleware/auth.middleware";
import { searchController } from "./search.controller";
import { searchRateLimiter } from "../../middleware/rateLimit.middleware";

const router = Router();

router.get("/", authenticate, searchRateLimiter, searchController);

export default router;
