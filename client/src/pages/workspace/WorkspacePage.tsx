import { useParams } from "react-router-dom";
import { Users } from "lucide-react";
import ChatBox from "../../components/chat/ChatBox";
import { useAuthStore } from "../../store/auth.store";
import useWorkspaceSocket from "../../hooks/useWorkspaceSocket";
import useOnlineUsers from "../../hooks/useOnlineUsers";
import MemberList from "../../components/workspace/MemberList";
import TaskList from "../../components/task/TaskList";
import ActivityFeed from "../../components/activity/ActivityFeed";

const WorkspacePage = () => {
  const onlineUsers = useOnlineUsers();
  const { id } = useParams();

  const user = useAuthStore((state) => state.user);
  useWorkspaceSocket(id!);

  if (!id || !user) {
    return null;
  }

  return (
    <div className="relative max-h-130 flex flex-col gap-5">
      <div className="pointer-events-none fixed inset-0 -z-10 bg-[radial-gradient(1100px_500px_at_90%_-10%,rgba(124,92,252,0.08),transparent_60%),radial-gradient(900px_500px_at_-10%_10%,rgba(34,211,238,0.06),transparent_55%)]" />

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
            Workspace
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Chat, tasks, and activity — all in one place.
          </p>
        </div>

        <div className="flex items-center gap-2 rounded-full border border-gray-100 bg-white px-3.5 py-2 shadow-sm">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
          </span>
          <Users size={14} className="text-gray-400" />
          <span className="text-xs font-semibold text-gray-600">
            {onlineUsers.length} online
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-12">
        {/* Left: Members + Activity */}
        <div className="flex flex-col gap-5 lg:col-span-3">
          <MemberList workspaceId={id} onlineUsers={onlineUsers} />
          <ActivityFeed workspaceId={id} />
        </div>

        {/* Center: Chat */}
        <div className="lg:col-span-6">
          <ChatBox workspaceId={id} userId={user.id} />
        </div>

        {/* Right: Tasks */}
        <div className="lg:col-span-3">
          <TaskList workspaceId={id} />
        </div>
      </div>
    </div>
  );
};

export default WorkspacePage;