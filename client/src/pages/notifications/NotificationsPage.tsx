import { useEffect, useState } from "react";
import { Bell } from "lucide-react";

import type { Notification } from "../../types/notification";

import {
  getNotifications,
  markNotificationRead,
  markAllNotificationsRead,
} from "../../services/notification.service";

const NotificationsPage = () => {
  const [notifications, setNotifications] = useState<
    Notification[]
  >([]);

  const loadNotifications = async () => {
    const data = await getNotifications();
    setNotifications(data);
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadNotifications();
  }, []);

  const handleRead = async (id: string) => {
    await markNotificationRead(id);
    loadNotifications();
  };

  const handleReadAll = async () => {
    await markAllNotificationsRead();
    loadNotifications();
  };

  return (
    <div className="min-h-screen bg-blue-50 px-6 py-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Notifications
          </h1>

          <p className="mt-1 text-gray-500">
            Stay updated with everything happening.
          </p>
        </div>

        <button
          onClick={handleReadAll}
          className="rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700"
        >
          Mark all as read
        </button>
      </div>

      <div className="space-y-4">
        {notifications.length === 0 && (
          <div className="rounded-xl bg-white py-12 text-center shadow-sm">
            <Bell
              size={28}
              className="mx-auto text-gray-300"
            />

            <p className="mt-3 text-gray-500">
              No notifications yet.
            </p>
          </div>
        )}

        {notifications.map((notification) => (
          <div
            key={notification.id}
            onClick={() =>
              !notification.isRead &&
              handleRead(notification.id)
            }
            className={`cursor-pointer rounded-xl border p-5 shadow-sm transition hover:shadow-md ${
              notification.isRead
                ? "border-gray-100 bg-white"
                : "border-indigo-200 bg-indigo-50"
            }`}
          >
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-semibold text-gray-900">
                  {notification.title}
                </h3>

                <p className="mt-1 text-sm text-gray-600">
                  {notification.message}
                </p>

                <p className="mt-3 text-xs text-gray-400">
                  {new Date(
                    notification.createdAt,
                  ).toLocaleString()}
                </p>
              </div>

              {!notification.isRead && (
                <div className="h-3 w-3 rounded-full bg-indigo-500" />
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NotificationsPage;