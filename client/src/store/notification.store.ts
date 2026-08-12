import { create } from "zustand";
import {
  getNotifications,
  markNotificationRead,
} from "../services/notification.service";
import type { Notification } from "../types/notification";

interface NotificationState {
  notifications: Notification[];
  unreadCount: number;
  fetchNotifications: () => Promise<void>;
  markAsRead: (id: string) => Promise<void>;
  addNotification: (notification: Notification) => void;
}

export const useNotificationStore = create<NotificationState>((set, get) => ({
  notifications: [],
  unreadCount: 0,

  fetchNotifications: async () => {
    const data = await getNotifications();
    set({
      notifications: data,
      unreadCount: data.filter((n) => !n.isRead).length,
    });
  },

  markAsRead: async (id: string) => {
    await markNotificationRead(id);
    set({
      notifications: get().notifications.map((n) =>
        n.id === id ? { ...n, isRead: true } : n,
      ),
      unreadCount: get().notifications.filter((n) => n.id !== id && !n.isRead)
        .length,
    });
  },
  addNotification: (notification: Notification) => {
    set((state) => ({
      notifications: [notification, ...state.notifications],
      unreadCount: state.unreadCount + 1,
    }));
  },
}));
