import { useEffect, useState } from "react";
import { FolderKanban, Plus } from "lucide-react";

import WorkspaceCard from "../../components/workspace/WorkspaceCard";
import { getMyWorkspaces } from "../../services/workspace.service";
import type { Workspace } from "../../types/workspace";
import CreateWorkspaceModal from "../../components/workspace/CreateWorkspaceModal";
import useSocket from "../../hooks/useSocket";

const SkeletonCard = () => (
  <div className="animate-pulse rounded-xl border border-gray-100 bg-white p-5">
    <div className="h-4 w-2/3 rounded bg-gray-200" />
    <div className="mt-3 h-3 w-1/2 rounded bg-gray-100" />
    <div className="mt-6 h-3 w-full rounded bg-gray-100" />
  </div>
);

const DashboardPage = () => {
  useSocket();
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<"grid" | "list">("grid");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const fetchWorkspaces = async () => {
    try {
      const data = await getMyWorkspaces();
      setWorkspaces(data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchWorkspaces();
  }, []);

  return (
    <div className="min-h-screen bg-blue-50 px-4 py-6 pb-20 sm:px-6 sm:py-8 lg:px-10 lg:pb-8">
      <div className="mt-2 flex items-center justify-between">
        <h2
          id="workspaces"
          className="scroll-mt-24 text-lg font-semibold tracking-tight text-gray-900"
        >
          My Workspaces{" "}
          <span className="ml-1 text-sm font-medium text-gray-400">
            {loading
              ? ""
              : `${workspaces.length} workspace${workspaces.length === 1 ? "" : "s"}`}
          </span>
        </h2>

        <div className="flex gap-1 rounded-lg bg-gray-100 p-1">
          <button
            onClick={() => setView("grid")}
            className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors duration-200 ${
              view === "grid"
                ? "bg-white text-gray-900 shadow-sm"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Grid
          </button>
          <button
            onClick={() => setView("list")}
            className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors duration-200 ${
              view === "list"
                ? "bg-white text-gray-900 shadow-sm"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            List
          </button>
        </div>
      </div>

      <div className="mt-4">
        {loading ? (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        ) : workspaces.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-gray-200 bg-white px-6 py-16 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-indigo-50">
              <FolderKanban size={24} className="text-indigo-500" />
            </div>
            <h2 className="mt-4 text-base font-semibold text-gray-800">
              No workspaces yet
            </h2>
            <p className="mt-1 max-w-sm text-sm text-gray-500">
              Create your first workspace to start organizing tasks and
              collaborating with your team.
            </p>
          </div>
        ) : (
          <div
            className={
              view === "grid"
                ? "grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
                : "flex flex-col gap-3"
            }
          >
            {workspaces.map((workspace) => (
              <WorkspaceCard key={workspace.id} workspace={workspace} />
            ))}

            <button
              onClick={() => setShowCreateModal(true)}
              className="group flex min-h-53 flex-col items-center justify-center gap-2.5 rounded-2xl border-2 border-dashed border-gray-200 bg-transparent transition-all duration-200 hover:-translate-y-1 hover:border-indigo-300 hover:bg-indigo-50/40"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-gray-100 text-indigo-500 transition-all duration-300 ease-[cubic-bezier(.2,.7,.3,1)] group-hover:rotate-90 group-hover:scale-110 group-hover:bg-indigo-100">
                <Plus size={20} />
              </div>
              <span className="text-sm font-semibold text-gray-500">
                Create Workspace
              </span>
            </button>
          </div>
        )}
      </div>
      <CreateWorkspaceModal
        open={showCreateModal}
        onOpenChange={setShowCreateModal}
        onCreated={fetchWorkspaces}
      />
    </div>
  );
};

export default DashboardPage;
