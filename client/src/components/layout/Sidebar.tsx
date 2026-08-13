import {
  LayoutDashboard,
  Users,
  CheckSquare,
  Bell,
  Settings,
  LogOut,
  Boxes,
} from "lucide-react";
import { useAuthStore } from "../../store/auth.store";
import { NavLink, useNavigate } from "react-router-dom";
import { logout } from "../../services/auth.service";
import { useEffect } from "react";
import { useNotificationStore } from "../../store/notification.store";
import { useTaskStore } from "../../store/task.store";
interface Props {
  open: boolean;
  onClose: () => void;
}

const Sidebar = ({ open, onClose }: Props) => {
  const user = useAuthStore((state) => state.user);
  const logoutStore = useAuthStore((state) => state.logout);
  const navigate = useNavigate();

  const unreadCount = useNotificationStore((state) => state.unreadCount);
  const fetchNotifications = useNotificationStore(
    (state) => state.fetchNotifications,
  );

  const taskCount = useTaskStore((state) => state.taskCount);
  const fetchTasks = useTaskStore((state) => state.fetchTasks);

  useEffect(() => {
    fetchNotifications();
    fetchTasks();
  }, [fetchNotifications, fetchTasks]);

  const items = [
    { icon: LayoutDashboard, label: "Dashboard", path: "/" },
    { icon: Users, label: "Workspaces", path: "/workspaces" },
    {
      icon: CheckSquare,
      label: "Tasks",
      path: "/tasks",
      badge: taskCount || undefined,
    },
    {
      icon: Bell,
      label: "Notifications",
      path: "/notifications",
      badge: unreadCount || undefined,
    },
    { icon: Settings, label: "Settings", path: "/settings" },
  ];

  const handleLogout = async () => {
    try {
      await logout();
    } catch (err) {
      console.error(err);
    }
    logoutStore();
    navigate("/login", {
      replace: true,
    });
  };

  return (
    <aside
      className={`fixed inset-y-0 left-0 z-40 flex h-screen w-64 shrink-0 flex-col bg-linear-to-b from-slate-950 to-slate-900 text-white transition-transform duration-300 ease-in-out lg:static lg:translate-x-0 ${
        open ? "translate-x-0 shadow-2xl" : "-translate-x-full"
      }`}
    >
      <div className="flex items-center gap-2.5 px-6 py-7">
        <div className="flex h-9 w-9 items-center justify-center rounded-[10px] bg-linear-to-br from-indigo-500 to-cyan-400 shadow-lg shadow-indigo-500/30">
          <Boxes size={18} />
        </div>

        <h1 className="text-xl font-bold tracking-tight">
          Collab
          <span className="bg-linear-to-r from-indigo-300 to-cyan-300 bg-clip-text text-transparent">
            Ops
          </span>
        </h1>
      </div>

      <nav className="flex flex-1 flex-col gap-1 px-3">
        {items.map((item) => {
          const Icon = item.icon;

          return (
            <NavLink
              key={item.label}
              to={item.path}
              onClick={onClose}
              className={({ isActive }) =>
                `group relative flex w-full items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-medium transition-colors duration-200 ${
                  isActive
                    ? "bg-indigo-500/15 text-white"
                    : "text-slate-400 hover:bg-white/5 hover:text-white"
                }`
              }
            >
              {({ isActive }) => (
                <>
                  {isActive && (
                    <span className="absolute left-0 top-1/2 h-5 w-1 -translate-y-1/2 rounded-full bg-linear-to-b from-indigo-400 to-cyan-400" />
                  )}
                  <Icon size={18} />
                  <span>{item.label}</span>
                  {item.badge && (
                    <span
                      className={`ml-auto rounded-full px-2 py-0.5 text-[11px] font-semibold ${
                        isActive
                          ? "bg-linear-to-r from-indigo-400 to-cyan-400 text-slate-900"
                          : "bg-white/10 text-slate-300"
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </>
              )}
            </NavLink>
          );
        })}
      </nav>

      <div className="border-t border-white/10 p-3">
        <div className="flex items-center gap-3 rounded-xl px-3 py-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-linear-to-br from-indigo-500 to-violet-500 text-sm font-bold">
            {user?.name?.charAt(0).toUpperCase() ?? "U"}
          </div>

          <div className="leading-tight">
            <p className="text-sm font-semibold text-white">
              {user?.name ?? "User"}
            </p>

            <p className="text-[11px] text-slate-400">User</p>
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="mt-1 flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-400 transition-colors duration-200 hover:bg-red-500/10 hover:text-red-400"
        >
          <LogOut size={18} />
          Logout
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
