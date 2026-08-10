import { Server } from "socket.io";

let io: Server;

export const initializeNotificationSocket = (
  socketIO: Server
) => {
  io = socketIO;
};

export const emitNotification = (
  userId: string,
  notification: unknown
) => {
  if (!io) {
    console.log("Socket.IO not initialized");
    return;
  }

  io.to(`user:${userId}`).emit(
    "new-notification",
    notification
  );
};