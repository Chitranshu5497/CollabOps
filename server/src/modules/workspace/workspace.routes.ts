import { Router } from "express";

import { authenticate } from "../../middleware/auth.middleware";
import {
  createWorkspaceController,
  getMyWorkspacesController,
  getWorkspaceMembersController,
  updateWorkspaceController,
  removeMemberController,
  updateMemberRoleController,
  leaveWorkspaceController,
  deleteWorkspaceController,
  searchWorkspaceController,
} from "./workspace.controller";

const router = Router();

router.post("/", authenticate, createWorkspaceController);

router.get("/", authenticate, getMyWorkspacesController);
router.get("/search", authenticate, searchWorkspaceController);

router.get(
  "/:workspaceId/members",
  authenticate,
  getWorkspaceMembersController,
);

router.delete(
  "/:workspaceId/members/:memberId",
  authenticate,
  removeMemberController,
);

router.patch(
  "/:workspaceId/members/:memberId/role",
  authenticate,
  updateMemberRoleController,
);

router.post("/:workspaceId/leave", authenticate, leaveWorkspaceController);

router.delete("/:workspaceId", authenticate, deleteWorkspaceController);

router.patch("/:id", authenticate, updateWorkspaceController);

export default router;
