import { useEffect } from "react";
import { socket } from "../socket/socket";
import { useAuthStore } from "../store/auth.store";

const useWorkspaceSocket = (workspaceId: string) => {
  useEffect(() => {
    const user = useAuthStore.getState().user;
    if (!user) return;
    
    if (!socket.connected) {
      socket.connect();
    }

    socket.emit("join-workspace", {
      workspaceId,
      userId: user.id,
    });

    return () => {
      socket.emit("leave-workspace", workspaceId);
    };
  }, [workspaceId]);
};

export default useWorkspaceSocket;
