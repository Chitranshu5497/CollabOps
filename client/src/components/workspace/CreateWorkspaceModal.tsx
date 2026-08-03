import { useState } from "react";
import { X, Loader2 } from "lucide-react";

import { createWorkspace } from "../../services/workspace.service";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreated: () => void;
}

const CreateWorkspaceModal = ({ open, onOpenChange, onCreated }: Props) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const close = () => {
    if (submitting) return;
    onOpenChange(false);
    setName("");
    setDescription("");
  };

  const handleSubmit = async () => {
    if (!name.trim() || submitting) return;
    setSubmitting(true);
    try {
      await createWorkspace({ name, description });
      setName("");
      setDescription("");
      onOpenChange(false);
      onCreated();
    } finally {
      setSubmitting(false);
    }
  };

  if (!open) return null;

  return (
    <>
      <style>{`
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes scaleIn { from { opacity: 0; transform: translateY(10px) scale(0.97); } to { opacity: 1; transform: translateY(0) scale(1); } }
      `}</style>

      <div
        onClick={close}
        style={{ animation: "fadeIn 0.2s ease-out forwards" }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
      >
        <div
          onClick={(e) => e.stopPropagation()}
          style={{ animation: "scaleIn 0.25s cubic-bezier(.2,.7,.3,1) forwards" }}
          className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl"
        >
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-lg font-bold text-gray-900">Create workspace</h2>
              <p className="mt-0.5 text-sm text-gray-500">
                Give your team a home for tasks and conversations.
              </p>
            </div>
            <button
              onClick={close}
              className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
            >
              <X size={18} />
            </button>
          </div>

          <div className="mt-5">
            <label className="text-xs font-semibold uppercase tracking-wide text-gray-500">
              Name
            </label>
            <input
              autoFocus
              className="mt-1.5 w-full rounded-xl border border-gray-200 px-3.5 py-2.5 text-sm text-gray-800 outline-none transition-all duration-200 placeholder:text-gray-400 focus:border-indigo-300 focus:ring-4 focus:ring-indigo-100"
              placeholder="e.g. Product Team"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className="mt-4">
            <label className="text-xs font-semibold uppercase tracking-wide text-gray-500">
              Description
            </label>
            <textarea
              className="mt-1.5 w-full resize-none rounded-xl border border-gray-200 px-3.5 py-2.5 text-sm text-gray-800 outline-none transition-all duration-200 placeholder:text-gray-400 focus:border-indigo-300 focus:ring-4 focus:ring-indigo-100"
              placeholder="What's this workspace for?"
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div className="mt-6 flex justify-end gap-3">
            <button
              onClick={close}
              disabled={submitting}
              className="rounded-xl px-4 py-2.5 text-sm font-semibold text-gray-500 transition-colors hover:bg-gray-100 disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={!name.trim() || submitting}
              className="flex items-center gap-2 rounded-xl bg-linear-to-r from-indigo-500 to-violet-500 px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-indigo-500/25 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0"
            >
              {submitting && <Loader2 size={15} className="animate-spin" />}
              {submitting ? "Creating…" : "Create"}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default CreateWorkspaceModal;