import { Request, Response } from "express";

import { asyncHandler } from "../../utils/asyncHandler";

import {
  getUserNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
} from "./notification.service";

export const getNotificationsController = asyncHandler(
  async (req: Request, res: Response) => {
    const notifications = await getUserNotifications(req.user!.id);

    res.json({
      success: true,

      data: notifications,
    });
  },
);

export const markNotificationReadController = asyncHandler(
  async (req: Request, res: Response) => {
    const notification = await markNotificationAsRead(req.params.id as string);

    res.json({
      success: true,

      data: notification,
    });
  },
);

export const markAllNotificationsReadController = asyncHandler(
  async (req: Request, res: Response) => {
    await markAllNotificationsAsRead(req.user!.id);

    res.json({
      success: true,
      message: "All notifications marked as read",
    });
  },
);
