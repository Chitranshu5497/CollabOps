import { useEffect, useState } from "react";
import { X, Loader2 } from "lucide-react";

import { createTask } from "../../services/task.service";
import { getWorkspaceMembers } from "../../services/workspace.service";

import type { Workspace } from "../../types/workspace";

interface Member {
  id: string;
  role: string;

  user: {
    id: string;
    name: string;
    email: string;
  };
}

interface Props {
  open: boolean;
  onClose: () => void;
  workspaces: Workspace[];
  onTaskCreated: () => void;
}

const AddTaskModal = ({ open, onClose, workspaces, onTaskCreated }: Props) => {
  const [workspaceId, setWorkspaceId] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [assigneeId, setAssigneeId] = useState("");

  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!workspaceId) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setMembers([]);
      setAssigneeId("");
      return;
    }

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!workspaceId || !title.trim()) return;

    setLoading(true);

    try {
      await createTask({
        title,
        description,
        workspaceId,
        assigneeId: assigneeId || undefined,
      });

      setWorkspaceId("");
      setTitle("");
      setDescription("");
      setAssigneeId("");

      onTaskCreated();
      onClose();
    } catch (err) {
      console.log(err);
      alert("Failed to create task");
    } finally {
      setLoading(false);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-xl font-semibold">Create Task</h2>

          <button onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <select
            value={workspaceId}
            onChange={(e) => setWorkspaceId(e.target.value)}
            className="w-full rounded-xl border border-gray-200 px-3 py-2"
          >
            <option value="">Select Workspace</option>

            {workspaces.map((workspace) => (
              <option key={workspace.id} value={workspace.id}>
                {workspace.name}
              </option>
            ))}
          </select>

          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Task title"
            className="w-full rounded-xl border border-gray-200 px-3 py-2"
          />

          <textarea
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Description"
            className="w-full rounded-xl border border-gray-200 px-3 py-2"
          />

          <select
            value={assigneeId}
            onChange={(e) => setAssigneeId(e.target.value)}
            className="w-full rounded-xl border border-gray-200 px-3 py-2"
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
            disabled={loading}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 py-3 font-semibold text-white hover:bg-indigo-700"
          >
            {loading && <Loader2 size={16} className="animate-spin" />}

            {loading ? "Creating..." : "Create Task"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddTaskModal;
