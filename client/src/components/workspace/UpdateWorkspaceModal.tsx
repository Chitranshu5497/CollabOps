import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";

import { updateWorkspace } from "../../services/workspace.service";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  workspaceId: string;
  initialName: string;
  initialDescription?: string;
  onUpdated: () => void;
}

const UpdateWorkspaceModal = ({
  open,
  onOpenChange,
  workspaceId,
  initialName,
  initialDescription,
  onUpdated,
}: Props) => {
  const [name, setName] = useState(initialName);
  const [description, setDescription] = useState(initialDescription || "");

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setName(initialName);
    setDescription(initialDescription || "");
  }, [initialName, initialDescription]);

  useEffect(() => {
    if (!open) return;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onOpenChange(false);
    };
    document.addEventListener("keydown", handleKey);

    return () => {
      document.body.style.overflow = originalOverflow;
      document.removeEventListener("keydown", handleKey);
    };
  }, [open, onOpenChange]);

  if (!open) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await updateWorkspace(workspaceId, { name, description });
      onUpdated();
      onOpenChange(false);
    } catch (err) {
      console.log(err);
    }
  };

  const modal = (
    <div
      className="fixed inset-0 z-9999 flex items-center justify-center bg-black/40 p-4 animate-[fadeIn_0.15s_ease-out]"
      onClick={(e) => {
        if (e.target === e.currentTarget) onOpenChange(false);
      }}
    >
      <form
        onSubmit={handleSubmit}
        onClick={(e) => e.stopPropagation()}
        className="relative z-10 w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl"
      >
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-lg font-semibold">Edit Workspace</h2>
          <button
            type="button"
            onClick={() => onOpenChange(false)}
            aria-label="Close"
          >
            <X size={18} />
          </button>
        </div>

        <div className="space-y-4">
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Workspace Name"
            className="w-full rounded-lg border p-3 outline-none transition focus:border-indigo-400 focus:ring-4 focus:ring-indigo-50"
          />

          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Description"
            rows={4}
            className="w-full rounded-lg border p-3 outline-none transition focus:border-indigo-400 focus:ring-4 focus:ring-indigo-50"
          />
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            onClick={() => onOpenChange(false)}
            className="rounded-lg border px-4 py-2 transition hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="rounded-lg bg-indigo-600 px-4 py-2 text-white transition hover:bg-indigo-700"
          >
            Save
          </button>
        </div>
      </form>
    </div>
  );

  return createPortal(modal, document.body);
};

export default UpdateWorkspaceModal;
