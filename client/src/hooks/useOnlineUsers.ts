import { useEffect, useState } from "react";
import { socket } from "../socket/socket";

const useOnlineUsers = () => {

  const [onlineUsers, setOnlineUsers] =
    useState<string[]>([]);

  useEffect(() => {

    socket.on(
      "online-users",
      (users: string[]) => {

        setOnlineUsers(users);

      }
    );

    return () => {

      socket.off("online-users");

    };

  }, []);

  return onlineUsers;
};

export default useOnlineUsers;