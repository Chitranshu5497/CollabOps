import { Router } from "express";

import { authenticate } from "../../middleware/auth.middleware";
import { getActivities } from "./activity.controller";

const router = Router();

router.get(
  "/:workspaceId",
  authenticate,
  getActivities
);

export default router;