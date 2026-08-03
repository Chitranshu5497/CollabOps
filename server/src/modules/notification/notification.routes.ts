import { Router } from "express";

import { authenticate } from "../../middleware/auth.middleware";

import {
  getNotificationsController,
  markNotificationReadController,
  markAllNotificationsReadController,
} from "./notification.controller";
const router = Router();

router.get(

  "/",

  authenticate,

  getNotificationsController

);
router.patch(
  "/read-all",
  authenticate,
  markAllNotificationsReadController
);
router.patch(

  "/:id/read",

  authenticate,

  markNotificationReadController

);

export default router;