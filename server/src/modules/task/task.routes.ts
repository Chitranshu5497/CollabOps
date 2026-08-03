import { Router } from "express";

import { authenticate }
from "../../middleware/auth.middleware";

import {
  createTaskController,
  getWorkspaceTasksController,
  updateTaskStatusController,
 assignTaskController,
 getMyTasksController,
} from "./task.controller";

const router = Router();

router.post(
  "/",
  authenticate,
  createTaskController
);

router.get(
  "/",
  authenticate,
  getMyTasksController
);

router.get(
  "/:workspaceId",
  authenticate,
  getWorkspaceTasksController
);

router.patch(
  "/:taskId/status",
  authenticate,
  updateTaskStatusController
);
router.patch(
  "/:taskId/assign",
  authenticate,
  assignTaskController
);
export default router;