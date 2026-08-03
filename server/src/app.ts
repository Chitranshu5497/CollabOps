import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

import authRoutes from "./routes/auth.routes";
import { errorHandler } from "./middleware/error.middleware";
import workspaceRoutes from "./modules/workspace/workspace.routes";
import messageRoutes from "./modules/message/message.routes";
import workspaceMemberRoutes from "./modules/workspaceMember/workspaceMember.routes";
import taskRoutes from "./modules/task/task.routes";
import path from "path";
import uploadRoutes from "./modules/upload/upload.routes";
import activityRoutes from "./modules/activity/activity.routes";
import searchRoutes from "./modules/search/search.routes";
import dashboardRoutes from "./modules/dashboard/dashboard.routes";
import notificationRoutes from "./modules/notification/notification.routes";
const app = express();

// CORS FIRST
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  }),
);
// Then parsers
app.use(express.json());
app.use(cookieParser());
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));
app.use("/api/upload", uploadRoutes);
// Health route
app.get("/api/health", (_, res) => {
  res.json({
    success: true,
    message: "Server Running",
  });
});
// Routes
app.use("/api/auth", authRoutes);
app.use("/api/workspaces", workspaceRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/workspace-members", workspaceMemberRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/activity", activityRoutes);
app.use("/api/search", searchRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/notifications", notificationRoutes);
// Error handler LAST
app.use(errorHandler);

export default app;
