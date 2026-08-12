import app from "./app";
import { createServer } from "http";
import { Server } from "socket.io";

import { initializeSocket } from "./socket/socket";

// BullMQ workers
import "./jobs/workers/invite.worker";
import "./jobs/workers/password-reset.worker";

const httpServer = createServer(app);

const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:5173",
    credentials: true,
  },
});

initializeSocket(io);

const PORT = Number(process.env.PORT) || 5000;

httpServer.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on ${PORT}`);
});
