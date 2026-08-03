import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import { getMyWorkspaces } from "../../services/workspace.service";

import type { Workspace } from "../../types/workspace";
import type { Task } from "../../types/task";
import TaskCard from "../../components/task/TaskCard";
import { getMyTasks } from "../../services/task.service";
import AddTaskModal from "../../components/task/AddTaskModal";

const TasksPage = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);

  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const fetchTasks = async () => {
    try {
      const [taskData, workspaceData] = await Promise.all([
        getMyTasks(),
        getMyWorkspaces(),
      ]);

      setTasks(taskData);
      setWorkspaces(workspaceData);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchTasks();
  }, []);

  const todo = tasks.filter((task) => task.status === "TODO");

  const inProgress = tasks.filter((task) => task.status === "IN_PROGRESS");

  const done = tasks.filter((task) => task.status === "DONE");

  return (
    <div className="min-h-screen bg-blue-50 px-6 py-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Tasks</h1>

          <p className="mt-1 text-gray-500">Manage all your tasks.</p>
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 font-semibold text-white hover:bg-indigo-700"
        >
          <Plus size={18} />
          New Task
        </button>
      </div>

      {loading ? (
        <div>Loading...</div>
      ) : (
        <div className="grid gap-6 lg:grid-cols-3">
          <div>
            <h2 className="mb-4 font-semibold text-gray-700">
              Todo ({todo.length})
            </h2>

            <div className="space-y-4">
              {todo.map((task) => (
                <TaskCard key={task.id} task={task} />
              ))}
            </div>
          </div>

          <div>
            <h2 className="mb-4 font-semibold text-amber-700">
              In Progress ({inProgress.length})
            </h2>

            <div className="space-y-4">
              {inProgress.map((task) => (
                <TaskCard key={task.id} task={task} />
              ))}
            </div>
          </div>

          <div>
            <h2 className="mb-4 font-semibold text-emerald-700">
              Done ({done.length})
            </h2>

            <div className="space-y-4">
              {done.map((task) => (
                <TaskCard key={task.id} task={task} />
              ))}
            </div>
          </div>
        </div>
      )}
      <AddTaskModal
        open={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        workspaces={workspaces}
        onTaskCreated={fetchTasks}
      />
    </div>
  );
};

export default TasksPage;
