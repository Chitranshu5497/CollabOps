import { useEffect, useRef, useState } from "react";
import { Bell, Search, ChevronDown, Menu, LogOut, Settings } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../../store/auth.store";
import { useNotificationStore } from "../../store/notification.store";
import { globalSearch } from "../../services/search.service";
import { logout } from "../../services/auth.service";

interface Props {
  onMenuClick: () => void;
}

const Navbar = ({ onMenuClick }: Props) => {
  const user = useAuthStore((state) => state.user);
  const logoutStore = useAuthStore((state) => state.logout);
  const navigate = useNavigate();

  const { notifications, unreadCount, fetchNotifications, markAsRead } =
    useNotificationStore();

  const [focused, setFocused] = useState(false);
  const [search, setSearch] = useState("");
  const [results, setResults] = useState<{
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    workspaces: any[];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    tasks: any[];
  }>({ workspaces: [], tasks: [] });
  const [showResults, setShowResults] = useState(false);

  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);

  const notifRef = useRef<HTMLDivElement | null>(null);
  const profileRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  // close dropdowns on outside click
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setShowNotifications(false);
      }
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setShowProfile(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  useEffect(() => {
    if (!search.trim()) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setResults({ workspaces: [], tasks: [] });
      setShowResults(false);
      return;
    }

    const timer = setTimeout(async () => {
      try {
        const data = await globalSearch(search);
        setResults(data);
        setShowResults(true);
      } catch (err) {
        console.log(err);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [search]);

  const handleLogout = async () => {
    try {
      await logout();
    } catch (err) {
      console.error(err);
    }
    logoutStore();
    navigate("/login", { replace: true });
  };

  return (
    <header className="flex h-16 items-center justify-between gap-4 border-b border-gray-100 bg-white px-4 sm:px-8">
      <button
        onClick={onMenuClick}
        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-gray-200 bg-white shadow-sm lg:hidden"
      >
        <Menu size={18} className="text-gray-600" />
      </button>

      <div
        className={`relative flex h-10 min-w-0 flex-1 items-center gap-2 rounded-xl border bg-white px-3 transition-all duration-200 sm:max-w-96 ${
          focused ? "border-indigo-300 shadow-md shadow-indigo-100" : "border-gray-200 shadow-sm"
        }`}
      >
        <Search size={16} className="shrink-0 text-gray-400" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search workspaces or tasks..."
          onFocus={() => setFocused(true)}
          onBlur={() =>
            setTimeout(() => {
              setFocused(false);
              setShowResults(false);
            }, 200)
          }
          className="h-full w-full min-w-0 text-sm text-gray-700 outline-none placeholder:text-gray-400"
        />
        <kbd className="hidden shrink-0 rounded-md border border-gray-200 bg-gray-50 px-1.5 py-0.5 font-mono text-[10px] text-gray-400 sm:block">
          ⌘K
        </kbd>

        {showResults && (
          <div className="absolute left-0 right-0 top-12 z-50 max-h-80 overflow-y-auto rounded-xl border border-gray-200 bg-white shadow-xl">
            {results.workspaces.length > 0 && (
              <>
                <div className="border-b bg-gray-50 px-4 py-2 text-xs font-semibold text-gray-500">
                  Workspaces
                </div>
                {results.workspaces.map((workspace) => (
                  <button
                    key={workspace.id}
                    type="button"
                    onMouseDown={(e) => {
                      e.preventDefault();
                      navigate(`/workspace/${workspace.id}`);
                      setSearch("");
                      setShowResults(false);
                    }}
                    className="block w-full px-4 py-3 text-left text-sm transition hover:bg-indigo-50"
                  >
                    📁 {workspace.name}
                  </button>
                ))}
              </>
            )}

            {results.tasks.length > 0 && (
              <>
                <div className="border-y bg-gray-50 px-4 py-2 text-xs font-semibold text-gray-500">
                  Tasks
                </div>
                {results.tasks.map((task) => (
                  <button
                    key={task.id}
                    type="button"
                    onMouseDown={(e) => {
                      e.preventDefault();
                      navigate(`/workspace/${task.workspaceId}`);
                      setSearch("");
                      setShowResults(false);
                    }}
                    className="block w-full px-4 py-3 text-left text-sm transition hover:bg-indigo-50"
                  >
                    ✅ {task.title}
                  </button>
                ))}
              </>
            )}

            {results.workspaces.length === 0 && results.tasks.length === 0 && (
              <div className="px-4 py-4 text-sm text-gray-400">No results found</div>
            )}
          </div>
        )}
      </div>

      <div className="flex shrink-0 items-center gap-3 sm:gap-4">
        {/* Notification bell + dropdown */}
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => setShowNotifications((v) => !v)}
            className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-gray-200 bg-white shadow-sm transition-transform duration-200 hover:-translate-y-0.5 hover:shadow-md"
          >
            <Bell size={18} className="text-gray-500" />
            {unreadCount > 0 && (
              <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full border-2 border-white bg-linear-to-br from-rose-500 to-orange-400 text-[10px] font-bold text-white">
                {unreadCount}
              </span>
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 top-12 z-50 w-80 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-xl">
              <div className="border-b border-gray-100 px-4 py-3">
                <h3 className="text-sm font-semibold text-gray-900">Notifications</h3>
              </div>

              <div className="max-h-80 overflow-y-auto">
                {notifications.length === 0 ? (
                  <p className="px-4 py-6 text-center text-sm text-gray-400">
                    You're all caught up.
                  </p>
                ) : (
                  notifications.map((n) => (
                    <button
                      key={n.id}
                      onClick={() => markAsRead(n.id)}
                      className={`flex w-full items-start gap-2 border-b border-gray-50 px-4 py-3 text-left transition hover:bg-indigo-50 ${
                        !n.isRead ? "bg-indigo-50/40" : ""
                      }`}
                    >
                      <span
                        className={`mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full ${
                          n.isRead ? "bg-gray-300" : "bg-indigo-500"
                        }`}
                      />
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium text-gray-800">{n.title}</p>
                        {n.message && (
                          <p className="truncate text-xs text-gray-500">{n.message}</p>
                        )}
                        <p className="mt-0.5 font-mono text-[10px] text-gray-400">
                          {new Date(n.createdAt).toLocaleString()}
                        </p>
                      </div>
                    </button>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* Profile chip + dropdown */}
        <div className="relative" ref={profileRef}>
          <button
            onClick={() => setShowProfile((v) => !v)}
            className="flex items-center gap-2.5 rounded-xl border border-gray-200 bg-white py-1.5 pl-1.5 pr-3 shadow-sm transition-transform duration-200 hover:-translate-y-0.5 hover:shadow-md"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-linear-to-br from-indigo-500 to-cyan-400 text-xs font-bold text-white">
              {user?.name?.charAt(0).toUpperCase() ?? "U"}
            </div>
            <div className="hidden text-left leading-tight sm:block">
              <p className="text-xs font-semibold text-gray-800">{user?.name ?? "User"}</p>
              <p className="text-[10px] uppercase tracking-wide text-gray-400">User</p>
            </div>
            <ChevronDown size={14} className="hidden text-gray-400 sm:block" />
          </button>

          {showProfile && (
            <div className="absolute right-0 top-12 z-50 w-48 overflow-hidden rounded-xl border border-gray-200 bg-white py-1.5 shadow-xl">
              <div className="border-b border-gray-100 px-4 py-2.5">
                <p className="text-sm font-semibold text-gray-800">{user?.name ?? "User"}</p>
                <p className="text-xs text-gray-400">{user?.email}</p>
              </div>

              <button
                onClick={() => {
                  setShowProfile(false);
                  navigate("/settings");
                }}
                className="flex w-full items-center gap-2.5 px-4 py-2.5 text-left text-sm text-gray-600 transition hover:bg-gray-50"
              >
                <Settings size={15} />
                Settings
              </button>

              <button
                onClick={handleLogout}
                className="flex w-full items-center gap-2.5 px-4 py-2.5 text-left text-sm text-red-500 transition hover:bg-red-50"
              >
                <LogOut size={15} />
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;