import { useEffect, useState } from "react";
import { socket } from "../socket/socket";
import { useAuthStore } from "../store/auth.store";

const useSocket = () => {
  const [onlineUsers, setOnlineUsers] = useState<string[]>([]);

  useEffect(() => {
    socket.connect();

    const user = useAuthStore.getState().user;

    if (user) {
      socket.emit("register-user", user.id);
    }

    socket.on("connect", () => {
      console.log("Socket connected:", socket.id);
    });

    socket.on(
      "online-users",
      (users: string[]) => {
        setOnlineUsers(users);
      }
    );

    return () => {
      socket.off("online-users");
      socket.disconnect();
    };
  }, []);

  return { onlineUsers };
};

export default useSocket;