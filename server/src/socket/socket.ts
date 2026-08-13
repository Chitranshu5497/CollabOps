import { Server, Socket } from "socket.io";
import { createMessage } from "../modules/message/message.service";
import { joinWorkspace, leaveWorkspace, getOnlineUsers } from "./presence";
import { initializeNotificationSocket } from "./notification";
const connectedUsers = new Map<string, string>();
// userId -> socketId
export const initializeSocket = (io: Server) => {
  initializeNotificationSocket(io);
  io.on("connection", (socket: Socket) => {
    console.log("User connected:", socket.id);
    socket.on("register-user", (userId: string) => {
      socket.data.userId = userId;

      connectedUsers.set(userId, socket.id);

      socket.join(`user:${userId}`);
    });

    socket.on("join-workspace", ({ workspaceId, userId }) => {
      socket.join(workspaceId);

      socket.data.workspaceId = workspaceId;
      socket.data.userId = userId;

      joinWorkspace(workspaceId, userId, socket.id);

      io.to(workspaceId).emit("online-users", getOnlineUsers(workspaceId));

      console.log(`${userId} joined ${workspaceId}`);
    });

    socket.on("send-message", async (data) => {
      try {
        const message = await createMessage({
          workspaceId: data.workspaceId,
          senderId: data.userId,
          content: data.content,
          fileUrl: data.fileUrl,
          fileName: data.fileName,
          fileType: data.fileType,
        });

        io.to(data.workspaceId).emit("receive-message", message);
      } catch (err) {
        console.error(err);

        socket.emit("message-error", "Failed to send message.");
      }
    });
    socket.on("task-status-updated", ({ workspaceId, task }) => {
      io.to(workspaceId).emit("task-status-updated", task);
    });
    socket.on("task-assigned", ({ workspaceId, task }) => {
      io.to(workspaceId).emit("task-assigned", task);
    });
    socket.on("typing", ({ workspaceId, userName }) => {
      socket.to(workspaceId).emit("user-typing", userName);
    });

    socket.on("stop-typing", ({ workspaceId }) => {
      socket.to(workspaceId).emit("user-stop-typing");
    });

    socket.on("disconnect", () => {
      const workspaceId = socket.data.workspaceId;

      const userId = socket.data.userId;
      if (socket.data.userId) {
        const currentSocketId = connectedUsers.get(socket.data.userId);

        if (currentSocketId === socket.id) {
          connectedUsers.delete(socket.data.userId);
        }
      }

      if (workspaceId && userId) {
        leaveWorkspace(workspaceId, userId, socket.id);

        io.to(workspaceId).emit("online-users", getOnlineUsers(workspaceId));
      }

      console.log("Disconnected:", socket.id);
    });
  });
};
