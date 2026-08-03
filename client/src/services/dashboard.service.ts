import api from "../api/axios";
import type { Task } from "../types/task";
export interface Activity {
  id: string;
  action: string;
  entityType: string;
  createdAt: string;

  user: {
    id: string;
    name: string;
  };
}

export interface DashboardStats {
  workspaces: number;
  activeTasks: number;
  completedTasks: number;
  notifications: number;

  recentActivities: Activity[];

  assignedTasks: Task[];
}
export const getDashboardStats = async (): Promise<DashboardStats> => {
  const res = await api.get("/dashboard");

  return res.data.data;
};