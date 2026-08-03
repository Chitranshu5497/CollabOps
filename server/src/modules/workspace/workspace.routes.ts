import { Router } from "express";

import { authenticate } from "../../middleware/auth.middleware";
import { getWorkspaceMembersController, updateWorkspaceController } from "./workspace.controller";
import {
  createWorkspaceController,
  getMyWorkspacesController,
} from "./workspace.controller";

const router = Router();

router.post(
  "/",
  authenticate,
  createWorkspaceController
);

router.get(
  "/",
  authenticate,
  getMyWorkspacesController
);

router.get(
  "/:workspaceId/members",
  authenticate,
  getWorkspaceMembersController
);

router.patch(
  "/:id",
  authenticate,
  updateWorkspaceController
);

export default router;