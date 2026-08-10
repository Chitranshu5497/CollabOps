import { Router } from "express";
import { authenticate } from "../../middleware/auth.middleware";
import { getQueueStatsController } from "./jobs.controller";

const router = Router();

router.get(
  "/",
  authenticate,
  getQueueStatsController
);

export default router;