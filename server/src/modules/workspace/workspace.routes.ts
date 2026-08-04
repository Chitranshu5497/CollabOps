import { Router } from "express";

import { authenticate } from "../../middleware/auth.middleware";
import {
  createWorkspaceController,
  getMyWorkspacesController,
  getWorkspaceMembersController,
  updateWorkspaceController,
  removeMemberController,
  updateMemberRoleController, // <-- new
} from "./workspace.controller";

const router = Router();

router.post("/", authenticate, createWorkspaceController);

router.get("/", authenticate, getMyWorkspacesController);

router.get("/:workspaceId/members", authenticate, getWorkspaceMembersController);

router.delete("/:workspaceId/members/:memberId", authenticate, removeMemberController);

// This was missing — it's why the PATCH from the frontend 404'd.
router.patch(
  "/:workspaceId/members/:memberId/role",
  authenticate,
  updateMemberRoleController
);

router.patch("/:id", authenticate, updateWorkspaceController);

export default router;