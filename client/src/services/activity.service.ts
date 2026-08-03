import api from "../api/axios";
import type { Activity } from "../types/activity";

export const getWorkspaceActivities = async (
  workspaceId: string
): Promise<Activity[]> => {
  const response = await api.get(
    `/activity/${workspaceId}`
  );

  return response.data.data;
};