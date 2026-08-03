import type { Task } from "../../types/task";

interface Props {
  task: Task;
}

const statusColors = {
  TODO: "bg-gray-100 text-gray-700",

  IN_PROGRESS:
    "bg-yellow-100 text-yellow-700",

  DONE:
    "bg-green-100 text-green-700",
};

const priorityColors = {
  LOW: "bg-sky-100 text-sky-700",

  MEDIUM:
    "bg-orange-100 text-orange-700",

  HIGH:
    "bg-red-100 text-red-700",
};

const TaskCard = ({ task }: Props) => {
  return (
    <div className="rounded-xl bg-white p-5 shadow-sm transition hover:shadow-lg">

      <div className="mb-3 flex items-center justify-between">

        <h3 className="font-semibold">
          {task.title}
        </h3>

        <span
          className={`rounded-full px-2 py-1 text-xs font-semibold ${
            statusColors[task.status]
          }`}
        >
          {task.status.replace("_", " ")}
        </span>

      </div>

      {task.description && (
        <p className="mb-4 text-sm text-gray-500">
          {task.description}
        </p>
      )}

      <div className="mb-4">
        <span
          className={`rounded-full px-2 py-1 text-xs font-semibold ${
            priorityColors[task.priority]
          }`}
        >
          {task.priority}
        </span>
      </div>

      <div className="flex items-center justify-between text-xs text-gray-500">

        <span>
          {task.workspace.name}
        </span>

        <span>
          {task.assignee?.name ?? "Unassigned"}
        </span>

      </div>

    </div>
  );
};

export default TaskCard;