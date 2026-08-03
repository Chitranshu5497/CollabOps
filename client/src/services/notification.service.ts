import api from "../api/axios";
import type { Notification } from "../store/notification.store";

export const getNotifications = async (): Promise<Notification[]> => {
  const response = await api.get("/notifications");
  return response.data.data;
};

export const markNotificationRead = async (id: string): Promise<Notification> => {
  const response = await api.patch(`/notifications/${id}/read`);
  return response.data.data;
};

export const markAllNotificationsRead = async (): Promise<void> => {
  await api.patch("/notifications/read-all");
};