export interface Assignee {
  id: string;
  name: string;
  email: string;
}

export interface Workspace {
  id: string;
  name: string;
}

export interface Task {
  id: string;
  title: string;
  description?: string;

  status: "TODO" | "IN_PROGRESS" | "DONE";

  priority: "LOW" | "MEDIUM" | "HIGH";

  workspaceId: string;

  workspace: Workspace;

  assignee?: Assignee | null;

  createdAt: string;
  updatedAt: string;
}