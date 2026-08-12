export interface Notification {
  id: string;
  title: string;
  message: string;

  type:
    | "MESSAGE"
    | "TASK_ASSIGNED"
    | "WORKSPACE_INVITE";

  isRead: boolean;
  createdAt: string;
}