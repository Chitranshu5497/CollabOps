import { useEffect, useState } from "react";
import { socket } from "../socket/socket";
import { useAuthStore } from "../store/auth.store";
import { useNotificationStore } from "../store/notification.store";
import type { Notification } from "../store/notification.store";

const useSocket = () => {
  const [onlineUsers, setOnlineUsers] = useState<string[]>([]);

  useEffect(() => {
    const user = useAuthStore.getState().user;

    socket.connect();

    const handleConnect = () => {
      console.log("Socket connected:", socket.id);

      if (user) {
        socket.emit("register-user", user.id);
      }
    };

    const handleOnlineUsers = (users: string[]) => {
      setOnlineUsers(users);
    };

    const addNotification = useNotificationStore.getState().addNotification;

    const handleNewNotification = (notification: Notification) => {
      console.log("🔔 New notification:", notification);

      addNotification(notification);
    };

    socket.on("connect", handleConnect);
    socket.on("online-users", handleOnlineUsers);
    socket.on("new-notification", handleNewNotification);

    return () => {
      socket.off("connect", handleConnect);
      socket.off("online-users", handleOnlineUsers);
      socket.off("new-notification", handleNewNotification);
      socket.disconnect();
    };
  }, []);

  return { onlineUsers };
};

export default useSocket;
