export interface Notification {
  id: string;
  title: string;
  message: string;

  type:
    | "TASK_ASSIGNED"
    | "TASK_UPDATED"
    | "WORKSPACE_INVITE";

  isRead: boolean;

  createdAt: string;
}