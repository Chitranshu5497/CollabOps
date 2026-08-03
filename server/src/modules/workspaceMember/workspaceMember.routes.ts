import { Router } from "express";

import { addMemberController } from "./workspaceMember.controller";

import { authenticate } from "../../middleware/auth.middleware";

import { getMembersController } from "./workspaceMember.controller";
import { inviteMemberController } from "./workspaceMember.controller";
const router = Router();

router.post("/", authenticate, addMemberController);
router.post("/invite", authenticate, inviteMemberController);
router.get("/:workspaceId", authenticate, getMembersController);

export default router;
