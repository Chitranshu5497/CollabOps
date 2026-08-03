import api from "../api/axios";
import type { Workspace } from "../types/workspace";
import type { Task } from "../types/task";

export const getMyWorkspaces = async (): Promise<Workspace[]> => {
  const response = await api.get("/workspaces");

  return response.data.data;
};


export const createWorkspace = async (
  data: {
    name: string;
    description?: string;
  }
) => {
  const response = await api.post(
    "/workspaces",
    data
  );

  return response.data.data;
};

export const getWorkspaceMessages = async (
  workspaceId: string
) => {
  const response = await api.get(
    `/messages/${workspaceId}`
  );

  return response.data.data;
};

export const getWorkspaceMembers = async (
  workspaceId:string
) => {

  const response = await api.get(
    `/workspace-members/${workspaceId}`
  );

  return response.data.data;

};

export const inviteMember = async (
  workspaceId: string,
  email: string
) => {

  const response = await api.post(
    "/workspace-members/invite",
    {
      workspaceId,
      email,
    }
  );

  return response.data;

};

export const createTask = async (
  data: {
    title: string;
    description?: string;
    workspaceId: string;
    assigneeId?: string;
  }
) => {

  const response = await api.post(
    "/tasks",
    data
  );

  return response.data.data;

};

export const getWorkspaceTasks = async (
  workspaceId: string
): Promise<Task[]> => {

  const response =
    await api.get(
      `/tasks/${workspaceId}`
    );

  return response.data.data;

};

export const updateTaskStatus = async (
  taskId: string,
  status: string
) => {

  const response =
    await api.patch(

      `/tasks/${taskId}/status`,

      {
        status,
      }

    );

  return response.data.data;

};

export const assignTask = async (
  taskId: string,
  assigneeId: string
) => {

  const response =
    await api.patch(

      `/tasks/${taskId}/assign`,

      {
        assigneeId,
      }

    );

  return response.data.data;

};

export const searchMessages = async (
  workspaceId: string,
  q: string
) => {
  const response = await api.get(
    `/messages/search`,
    {
      params: {
        workspaceId,
        q,
      },
    }
  );

  return response.data.data;
};

export const updateWorkspace = async (
  workspaceId: string,
  data: {
    name: string;
    description?: string;
  }
) => {
  const response = await api.patch(
    `/workspaces/${workspaceId}`,
    data
  );

  return response.data.data;
};