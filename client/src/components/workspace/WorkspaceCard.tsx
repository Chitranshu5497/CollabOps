import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { MoreVertical } from "lucide-react";

import type { Workspace } from "../../types/workspace";
import UpdateWorkspaceModal from "./UpdateWorkspaceModal";
import { leaveWorkspace, deleteWorkspace } from "../../services/workspace.service";
import ConfirmDialog from "./ConfirmDialog";

interface Props {
  workspace: Workspace;
}

// Deterministic gradient pair per workspace, based on its name.
const GRADIENTS: [string, string][] = [
  ["#7C5CFC", "#22D3EE"],
  ["#FB923C", "#F43F5E"],
  ["#34D399", "#0EA5E9"],
  ["#C084FC", "#F472B6"],
  ["#22D3EE", "#3B82F6"],
  ["#F59E0B", "#EF4444"],
];

const gradientFor = (name: string) => {
  const sum = name.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return GRADIENTS[sum % GRADIENTS.length];
};

const ROLE_STYLES: Record<Workspace["role"], string> = {
  OWNER: "bg-indigo-50 text-indigo-600",
  ADMIN: "bg-cyan-50 text-cyan-600",
  MEMBER: "bg-gray-100 text-gray-500",
};

const timeAgo = (iso: string) => {
  const diffMs = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diffMs / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days < 30) return `${days}d ago`;
  return new Date(iso).toLocaleDateString();
};

type ConfirmKind = "leave" | "delete" | null;

const WorkspaceCard = ({ workspace }: Props) => {
  const navigate = useNavigate();
  const [openMenu, setOpenMenu] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [confirmKind, setConfirmKind] = useState<ConfirmKind>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  const [g1, g2] = gradientFor(workspace.name);

  useEffect(() => {
    if (!openMenu) return;

    const handleClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpenMenu(false);
      }
    };
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpenMenu(false);
    };

    document.addEventListener("mousedown", handleClick);
    document.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("mousedown", handleClick);
      document.removeEventListener("keydown", handleKey);
    };
  }, [openMenu]);

  const handleAction = (action: string) => {
    setOpenMenu(false);

    switch (action) {
      case "rename":
        setShowUpdateModal(true);
        break;
      case "members":
        navigate(`/workspace/${workspace.id}/members`);
        break;
      case "role":
        navigate(`/workspace/${workspace.id}/change-role`);
        break;
      case "leave":
        setConfirmKind("leave");
        break;
      case "delete":
        setConfirmKind("delete");
        break;
    }
  };

  const handleLeave = async () => {
    try {
      await leaveWorkspace(workspace.id);
      setConfirmKind(null);
      window.location.reload();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async () => {
    try {
      await deleteWorkspace(workspace.id);
      setConfirmKind(null);
      window.location.reload();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div
      onClick={() => navigate(`/workspace/${workspace.id}`)}
      tabIndex={0}
      style={{ "--g1": g1, "--g2": g2 } as React.CSSProperties}
      className={`group relative cursor-pointer overflow-visible rounded-2xl border border-gray-100 bg-white p-5 shadow-sm transition-all duration-300 ease-[cubic-bezier(.2,.7,.3,1)] hover:-translate-y-1.5 hover:shadow-xl ${
        openMenu ? "z-20" : "z-0"
      }`}
    >
      {/* ambient glow */}
      <div
        className="pointer-events-none absolute -right-10 -top-14 h-40 w-40 rounded-full opacity-0 blur-3xl transition-opacity duration-300 group-hover:opacity-30"
        style={{ background: `linear-gradient(135deg, ${g1}, ${g2})` }}
      />
      {/* gradient ring on hover */}
      <div
        className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{
          padding: 1,
          background: `linear-gradient(135deg, ${g1}, ${g2})`,
          WebkitMask:
            "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
          WebkitMaskComposite: "xor",
          maskComposite: "exclude",
        }}
      />

      <div className="relative flex items-start justify-between">
        <div
          className="flex h-11 w-11 items-center justify-center rounded-[13px] text-lg font-bold text-white shadow-lg"
          style={{
            background: `linear-gradient(135deg, ${g1}, ${g2})`,
            boxShadow: `0 8px 18px -6px ${g1}66`,
          }}
        >
          {workspace.name.charAt(0).toUpperCase()}
        </div>

        <button
          onClick={(e) => {
            e.stopPropagation();
            setOpenMenu((prev) => !prev);
          }}
          className="flex h-7 w-7 items-center justify-center rounded-lg text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
        >
          <MoreVertical size={16} />
        </button>

        {openMenu && (
          <div
            ref={menuRef}
            onClick={(e) => e.stopPropagation()}
            role="menu"
            className="absolute right-0 top-10 z-50 flex max-h-[min(70vh,22rem)] w-56 max-w-[calc(100vw-2.5rem)] flex-col overflow-hidden rounded-xl border bg-white text-sm shadow-xl animate-[fadeIn_0.15s_ease-out] sm:w-60"
          >
            <div className="styled-scrollbar overflow-y-auto p-2">
              {(workspace.role === "OWNER" || workspace.role === "ADMIN") && (
                <>
                  <p className="px-3 py-2 text-xs font-semibold text-gray-400">
                    Workspace Information
                  </p>

                  <button onClick={() => handleAction("rename")} className="menu-item">
                    Edit workspace
                  </button>

                  <div className="my-2 border-t" />
                </>
              )}

              <p className="px-3 py-2 text-xs font-semibold text-gray-400">Members</p>

              <button onClick={() => handleAction("members")} className="menu-item">
                View all members
              </button>

              {(workspace.role === "OWNER" || workspace.role === "ADMIN") && (
                <button onClick={() => handleAction("role")} className="menu-item">
                  Change member role
                </button>
              )}

              <div className="my-2 border-t" />

              <p className="px-3 py-2 text-xs font-semibold text-gray-400">
                Workspace Actions
              </p>

              <button onClick={() => handleAction("leave")} className="menu-item">
                Leave workspace
              </button>

              {workspace.role === "OWNER" && (
                <button
                  onClick={() => handleAction("delete")}
                  className="menu-item text-red-600 hover:bg-red-50"
                >
                  Delete workspace
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      <h2 className="relative mt-4 text-lg font-semibold tracking-tight text-gray-900">
        {workspace.name}
      </h2>

      <p className="relative mt-1 min-h-4.5 text-sm text-gray-500">
        {workspace.description || "No description"}
      </p>

      <div className="relative mt-5 flex items-center justify-between">
        <span
          className={`rounded-full px-2.5 py-1 text-[11px] font-bold tracking-wide ${ROLE_STYLES[workspace.role]}`}
        >
          {workspace.role}
        </span>
        <span className="font-mono text-[11px] text-gray-400">
          {timeAgo(workspace.createdAt)}
        </span>
      </div>

      <UpdateWorkspaceModal
        open={showUpdateModal}
        onOpenChange={setShowUpdateModal}
        workspaceId={workspace.id}
        initialName={workspace.name}
        initialDescription={workspace.description ?? undefined}
        onUpdated={() => window.location.reload()}
      />

      <ConfirmDialog
        open={confirmKind === "leave"}
        title="Leave this workspace?"
        description="You'll lose access until someone invites you back."
        confirmLabel="Leave"
        onConfirm={handleLeave}
        onCancel={() => setConfirmKind(null)}
      />

      <ConfirmDialog
        open={confirmKind === "delete"}
        title="Delete this workspace?"
        description="This permanently deletes the workspace and everything in it. This can't be undone."
        confirmLabel="Delete"
        onConfirm={handleDelete}
        onCancel={() => setConfirmKind(null)}
      />
    </div>
  );
};

export default WorkspaceCard;