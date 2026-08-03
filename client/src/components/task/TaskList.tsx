import { useEffect, useState } from "react";
import { ClipboardList } from "lucide-react";
import { socket } from "../../socket/socket";
import {
  getWorkspaceTasks,
  updateTaskStatus,
  assignTask,
  getWorkspaceMembers,
} from "../../services/workspace.service";

import type { Task } from "../../types/task";
import AddTaskForm from "./AddTaskForm";

interface Member {
  user: {
    id: string;
    name: string;
    email: string;
  };
}

interface Props {
  workspaceId: string;
}

const STATUS_STYLES: Record<string, string> = {
  TODO: "bg-gray-100 text-gray-600",
  IN_PROGRESS: "bg-amber-50 text-amber-600",
  DONE: "bg-emerald-50 text-emerald-600",
};

const PRIORITY_DOT: Record<string, string> = {
  LOW: "bg-emerald-400",
  MEDIUM: "bg-amber-400",
  HIGH: "bg-rose-500",
};

const TaskList = ({ workspaceId }: Props) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [members, setMembers] = useState<Member[]>([]);

  const loadTasks = async () => {
    const data = await getWorkspaceTasks(workspaceId);
    setTasks(data);
  };

  const loadMembers = async () => {
    const data = await getWorkspaceMembers(workspaceId);
    setMembers(data);
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadTasks();
    loadMembers();

    socket.on("task-status-updated", () => {
      loadTasks();
    });

    socket.on("task-assigned", () => {
      loadTasks();
    });

    return () => {
      socket.off("task-status-updated");
      socket.off("task-assigned");
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [workspaceId]);

  const handleStatusChange = async (taskId: string, status: string) => {
    const updatedTask = await updateTaskStatus(taskId, status);
    socket.emit("task-status-updated", { workspaceId, task: updatedTask });
    loadTasks();
  };

  const handleAssign = async (taskId: string, assigneeId: string) => {
    const updatedTask = await assignTask(taskId, assigneeId);
    socket.emit("task-assigned", { workspaceId, task: updatedTask });
    loadTasks();
  };

  return (
    <div className="flex flex-col h-130 rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
      <h2 className="text-sm font-semibold tracking-tight text-gray-900">Tasks</h2>

      <div className="mt-3">
        <AddTaskForm workspaceId={workspaceId} onTaskCreated={loadTasks} />
      </div>

      {tasks.length === 0 && (
        <div className="mt-4 flex flex-col items-center gap-2 rounded-xl border border-dashed border-gray-200 py-8 text-center">
          <ClipboardList size={20} className="text-gray-300" />
          <p className="text-xs text-gray-400">No tasks yet.</p>
        </div>
      )}

      <div className="mt-2 styled-scrollbar overflow-y-auto flex flex-col gap-3">
        {tasks.map((task) => (
          <div
            key={task.id}
            className="group rounded-xl bg-blue-50 border border-gray-100 p-3.5 transition-all duration-200 hover:-translate-y-0.5 hover:border-indigo-100 hover:shadow-md"
          >
            <div className="flex items-start gap-2">
              <span
                className={`mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full ${
                  PRIORITY_DOT[task.priority] ?? "bg-gray-300"
                }`}
              />
              <div className="min-w-0">
                <h3 className="truncate text-sm font-semibold text-gray-800">{task.title}</h3>
                {task.description && (
                  <p className="mt-0.5 line-clamp-2 text-xs text-gray-500">{task.description}</p>
                )}
              </div>
            </div>

            <div className="mt-3 flex flex-wrap items-center gap-2">
              <select
                value={task.status}
                onChange={(e) => handleStatusChange(task.id, e.target.value)}
                className={`rounded-lg border-0 px-2 py-1 text-[11px] font-semibold outline-none ${
                  STATUS_STYLES[task.status] ?? "bg-gray-100 text-gray-600"
                }`}
              >
                <option value="TODO">TODO</option>
                <option value="IN_PROGRESS">IN PROGRESS</option>
                <option value="DONE">DONE</option>
              </select>

              <select
                value={task.assignee?.id ?? ""}
                onChange={(e) => handleAssign(task.id, e.target.value)}
                className="rounded-lg border border-gray-200 px-2 py-1 text-[11px] font-medium text-gray-600 outline-none focus:border-indigo-300"
              >
                <option value="">Unassigned</option>
                {members.map((member) => (
                  <option key={member.user.id} value={member.user.id}>
                    {member.user.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TaskList;