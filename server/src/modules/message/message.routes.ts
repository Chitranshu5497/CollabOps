import { Router } from "express";

import { authenticate } from "../../middleware/auth.middleware";

import {
  getWorkspaceMessagesController,
  searchMessagesController,
} from "./message.controller";

const router = Router();
router.get(
  "/search",
  authenticate,
  searchMessagesController
);
router.get(
  "/:workspaceId",
  authenticate,
  getWorkspaceMessagesController
);


export default router;