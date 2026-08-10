import prisma from "../../config/prisma";
import { NotificationType } from "@prisma/client";
import { emitNotification } from "../../socket/notification";

interface CreateNotificationInput {
  title: string;
  message: string;
  type: NotificationType;
  userId: string;
}

export const createNotification = async (data: CreateNotificationInput) => {
  const notification = await prisma.notification.create({
    data,
  });

  emitNotification(data.userId, notification);

  return notification;
};

export const getUserNotifications = async (userId: string) => {
  return prisma.notification.findMany({
    where: {
      userId,
    },

    orderBy: {
      createdAt: "desc",
    },
  });
};

export const markNotificationAsRead = async (id: string) => {
  return prisma.notification.update({
    where: {
      id,
    },

    data: {
      isRead: true,
    },
  });
};

export const getMyNotifications = async (userId: string) => {
  return prisma.notification.findMany({
    where: {
      userId,
    },

    orderBy: {
      createdAt: "desc",
    },

    take: 20,
  });
};

export const markAllNotificationsAsRead = async (userId: string) => {
  return prisma.notification.updateMany({
    where: {
      userId,
      isRead: false,
    },
    data: {
      isRead: true,
    },
  });
};
