import api from "../api/axios";
import type { Task } from "../types/task";

export const getMyTasks = async (): Promise<Task[]> => {
  const response = await api.get("/tasks");
  return response.data.data;
};

export const getWorkspaceTasks = async (workspaceId: string): Promise<Task[]> => {
  const response = await api.get(`/tasks/${workspaceId}`);
  return response.data.data;
};

export const updateTaskStatus = async (taskId: string, status: string): Promise<Task> => {
  const response = await api.patch(`/tasks/${taskId}/status`, { status });
  return response.data.data;
};

export const assignTask = async (taskId: string, assigneeId: string): Promise<Task> => {
  const response = await api.patch(`/tasks/${taskId}/assign`, {
    assigneeId: assigneeId || null,
  });
  return response.data.data;
};

export const createTask = async (data: {
  title: string;
  description?: string;
  workspaceId: string;
  assigneeId?: string;
}): Promise<Task> => {
  const response = await api.post("/tasks", data);
  return response.data.data;
};