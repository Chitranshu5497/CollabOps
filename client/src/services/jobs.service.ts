import api from "../api/axios";

export interface QueueStats {
  active: number;
  completed: number;
  delayed: number;
  failed: number;
  paused: number;
  prioritized: number;
  waiting: number;
  "waiting-children": number;
}

export const getQueueStats = async (): Promise<QueueStats> => {
  const response = await api.get("/jobs");

  return response.data.data;
};