import { useEffect, useState } from "react";
import {
  FolderKanban,
  Users,
  CheckSquare,
  Bell,
  Clock,
  Plus,
} from "lucide-react";

import WorkspaceCard from "../../components/workspace/WorkspaceCard";
import { getMyWorkspaces } from "../../services/workspace.service";
import type { Workspace } from "../../types/workspace";
import CreateWorkspaceModal from "../../components/workspace/CreateWorkspaceModal";
import useSocket from "../../hooks/useSocket";
import { useAuthStore } from "../../store/auth.store";
import {
  getDashboardStats,
  type DashboardStats,
} from "../../services/dashboard.service";
import { getQueueStats, type QueueStats } from "../../services/jobs.service";

const SkeletonCard = () => (
  <div className="animate-pulse rounded-xl border border-gray-100 bg-white p-5">
    <div className="h-4 w-2/3 rounded bg-gray-200" />
    <div className="mt-3 h-3 w-1/2 rounded bg-gray-100" />
    <div className="mt-6 h-3 w-full rounded bg-gray-100" />
  </div>
);

const StatCard = ({
  icon: Icon,
  gradient,
  value,
  label,
  delay,
}: {
  icon: typeof Users;
  gradient: string;
  value: number;
  label: string;
  delay: number;
}) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const duration = 700;
    const start = performance.now();
    let frame: number;
    const tick = (now: number) => {
      const progress = Math.min((now - start) / duration, 1);
      setCount(Math.round((1 - Math.pow(1 - progress, 3)) * value));
      if (progress < 1) frame = requestAnimationFrame(tick);
    };
    const timeout = setTimeout(
      () => (frame = requestAnimationFrame(tick)),
      delay,
    );
    return () => {
      clearTimeout(timeout);
      cancelAnimationFrame(frame);
    };
  }, [value, delay]);

  return (
    <div
      className="animate-[rise_0.5s_ease-out_forwards] rounded-2xl border border-gray-100 bg-white p-5 opacity-0 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-lg"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div
        className={`mb-3 flex h-9 w-9 items-center justify-center rounded-[10px] ${gradient}`}
      >
        <Icon size={18} className="text-white" />
      </div>
      <p className="font-mono text-2xl font-bold text-gray-900">{count}</p>
      <p className="mt-0.5 text-xs text-gray-500">{label}</p>
    </div>
  );
};

const getGreeting = () => {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
};

const DashboardPage = () => {
  useSocket();
  const user = useAuthStore((state) => state.user);
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<"grid" | "list">("grid");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [queueStats, setQueueStats] = useState<QueueStats | null>(null);
  const fetchDashboard = async () => {
    try {
      const [workspaceData, dashboardData, queueData] = await Promise.all([
        getMyWorkspaces(),
        getDashboardStats(),
        getQueueStats(),
      ]);
      setWorkspaces(workspaceData);
      setStats(dashboardData);
      setQueueStats(queueData);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchDashboard();
  }, []);

  return (
    <div className="min-h-screen bg-blue-50 px-4 py-6 pb-20 sm:px-6 sm:py-8 lg:px-10 lg:pb-8">
      <style>{`
        @keyframes rise { from { opacity: 0; transform: translateY(14px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes wave { 0%,100% { transform: rotate(0deg); } 15% { transform: rotate(16deg); } 30% { transform: rotate(-8deg); } 45% { transform: rotate(16deg); } 60% { transform: rotate(0deg); } }
        .wave { display: inline-block; transform-origin: 70% 70%; animation: wave 2.2s ease-in-out infinite; }
      `}</style>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
            {getGreeting()}, {user?.name ?? "there"}{" "}
            <span className="wave">👋</span>
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Here's what's happening across your workspaces today.
          </p>
        </div>

        <div className="shrink-0">
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-2 rounded-xl bg-linear-to-r from-indigo-500 via-violet-500 to-cyan-400 bg-size-[160%_160%] px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-500/30 transition-all duration-200 hover:-translate-y-0.5 hover:bg-position-[100%_40%] hover:shadow-xl hover:shadow-indigo-500/40"
          >
            <Plus size={16} />
            Create Workspace
          </button>
        </div>
      </div>

      {!loading && (
        <div className="mt-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
          <StatCard
            icon={Users}
            gradient="bg-linear-to-br from-indigo-500 to-violet-400"
            value={stats?.workspaces ?? 0}
            label="Workspaces"
            delay={0}
          />
          <StatCard
            icon={CheckSquare}
            gradient="bg-linear-to-br from-cyan-500 to-sky-500"
            value={stats?.activeTasks ?? 0}
            label="Active tasks"
            delay={60}
          />
          <StatCard
            icon={Bell}
            gradient="bg-linear-to-br from-rose-500 to-orange-400"
            value={stats?.notifications ?? 0}
            label="Notifications"
            delay={120}
          />
          <StatCard
            icon={Clock}
            gradient="bg-linear-to-br from-emerald-500 to-teal-500"
            value={stats?.completedTasks ?? 0}
            label="Completed Tasks"
            delay={180}
          />
        </div>
      )}
      {!loading && queueStats && (
        <div className="mt-5 rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-semibold text-gray-900">
                Background Jobs
              </h2>

              <p className="mt-1 text-xs text-gray-500">
                BullMQ invite email processing
              </p>
            </div>

            <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-[10px] font-semibold text-emerald-600">
              Redis + BullMQ
            </span>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
            <div className="rounded-xl bg-gray-50 p-3">
              <p className="text-lg font-bold text-gray-900">
                {queueStats.waiting}
              </p>
              <p className="text-xs text-gray-500">Waiting</p>
            </div>

            <div className="rounded-xl bg-gray-50 p-3">
              <p className="text-lg font-bold text-gray-900">
                {queueStats.active}
              </p>
              <p className="text-xs text-gray-500">Active</p>
            </div>

            <div className="rounded-xl bg-gray-50 p-3">
              <p className="text-lg font-bold text-gray-900">
                {queueStats.completed}
              </p>
              <p className="text-xs text-gray-500">Completed</p>
            </div>

            <div className="rounded-xl bg-gray-50 p-3">
              <p className="text-lg font-bold text-gray-900">
                {queueStats.failed}
              </p>
              <p className="text-xs text-gray-500">Failed</p>
            </div>
          </div>
        </div>
      )}
      <div className="mt-8 flex items-center justify-between">
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
        onCreated={fetchDashboard}
      />
    </div>
  );
};

export default DashboardPage;
