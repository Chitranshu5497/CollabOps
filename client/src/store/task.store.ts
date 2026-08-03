import { create } from "zustand";
import { getMyTasks } from "../services/task.service";
import type { Task } from "../types/task";

interface TaskState {
  tasks: Task[];
  taskCount: number;
  fetchTasks: () => Promise<void>;
}

export const useTaskStore = create<TaskState>((set) => ({
  tasks: [],
  taskCount: 0,

  fetchTasks: async () => {
    const data = await getMyTasks();
    set({
      tasks: data,
      taskCount: data.filter((t) => t.status !== "DONE").length,
    });
  },
}));