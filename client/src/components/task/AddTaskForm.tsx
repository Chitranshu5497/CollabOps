import { useEffect, useState } from "react";
import { Loader2, Plus } from "lucide-react";

import { createTask } from "../../services/task.service";
import { getWorkspaceMembers } from "../../services/workspace.service";
interface Props {
  workspaceId: string;
  onTaskCreated: () => void;
}

const AddTaskForm = ({ workspaceId, onTaskCreated }: Props) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [assigneeId, setAssigneeId] = useState("");
  interface Member {
    id: string;
    role: string;

    user: {
      id: string;
      name: string;
      email: string;
    };
  }

  const [members, setMembers] = useState<Member[]>([]);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim() || submitting) return;

    setSubmitting(true);
    try {
      await createTask({
        title,
        description,
        workspaceId,
        assigneeId: assigneeId || undefined,
      });

      setTitle("");
      setDescription("");
      setAssigneeId("");
      onTaskCreated();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      alert(err.response?.data?.message || "Failed to create task");
    } finally {
      setSubmitting(false);
    }
  };
  useEffect(() => {
    const loadMembers = async () => {
      try {
        const data = await getWorkspaceMembers(workspaceId);
        setMembers(data);
      } catch (err) {
        console.log(err);
      }
    };

    loadMembers();
  }, [workspaceId]);

  return (
    <form onSubmit={handleSubmit} className="mb-2 flex flex-col gap-2">
      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Task title"
        className="w-full rounded-xl border border-gray-200 px-3.5 py-2.5 text-sm text-gray-800 outline-none transition-all duration-200 placeholder:text-gray-400 focus:border-indigo-300 focus:ring-4 focus:ring-indigo-100"
      />

      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Description"
        rows={2}
        className="w-full resize-none rounded-xl border border-gray-200 px-3.5 py-2.5 text-sm text-gray-800 outline-none transition-all duration-200 placeholder:text-gray-400 focus:border-indigo-300 focus:ring-4 focus:ring-indigo-100"
      />
      <select
        value={assigneeId}
        onChange={(e) => setAssigneeId(e.target.value)}
      >
        <option value="">Unassigned</option>

        {members.map((member) => (
          <option key={member.user.id} value={member.user.id}>
            {member.user.name}
          </option>
        ))}
      </select>
      <button
        type="submit"
        disabled={!title.trim() || submitting}
        className="flex items-center justify-center gap-2 self-start rounded-xl bg-linear-to-r from-indigo-500 to-violet-500 px-4 py-2 text-sm font-semibold text-white shadow-md shadow-indigo-500/20 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0"
      >
        {submitting ? (
          <Loader2 size={14} className="animate-spin" />
        ) : (
          <Plus size={14} />
        )}
        {submitting ? "Creating…" : "Create task"}
      </button>
    </form>
  );
};

export default AddTaskForm;
