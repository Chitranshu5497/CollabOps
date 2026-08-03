import { useEffect, useState, type JSX } from "react";
import {
  CheckCircle2,
  ClipboardList,
  Upload,
  MessageSquare,
  UserPlus,
  FolderOpen,
} from "lucide-react";
import { getWorkspaceActivities } from "../../services/activity.service";
import type { Activity } from "../../types/activity";

interface Props {
  workspaceId: string;
}

const ICON_STYLES: Record<string, { icon: JSX.Element; bg: string }> = {
  TASK_CREATED: {
    icon: <ClipboardList size={14} />,
    bg: "bg-indigo-50 text-indigo-500",
  },
  TASK_STATUS_UPDATED: {
    icon: <CheckCircle2 size={14} />,
    bg: "bg-emerald-50 text-emerald-500",
  },
  FILE_UPLOADED: {
    icon: <Upload size={14} />,
    bg: "bg-violet-50 text-violet-500",
  },
  MESSAGE_SENT: {
    icon: <MessageSquare size={14} />,
    bg: "bg-orange-50 text-orange-500",
  },
  MEMBER_INVITED: {
    icon: <UserPlus size={14} />,
    bg: "bg-pink-50 text-pink-500",
  },
};

const getActivityStyle = (action: string) =>
  ICON_STYLES[action] ?? {
    icon: <FolderOpen size={14} />,
    bg: "bg-gray-100 text-gray-400",
  };

const formatActivity = (activity: Activity) => {
  switch (activity.action) {
    case "TASK_CREATED":
      return `created task "${(activity.metadata as { title?: string })?.title ?? ""}"`;
    case "TASK_STATUS_UPDATED":
      return `changed task status to ${(activity.metadata as { status?: string })?.status ?? ""}`;
    case "TASK_ASSIGNED":
      return "assigned a task";
    case "MESSAGE_SENT":
      return "sent a message";
    case "FILE_UPLOADED":
      return "uploaded a file";
    case "WORKSPACE_CREATED":
      return "created the workspace";
    case "MEMBER_INVITED":
      return "invited a member";
    default:
      return activity.action;
  }
};

const ActivityFeed = ({ workspaceId }: Props) => {
  const [activities, setActivities] = useState<Activity[]>([]);

  useEffect(() => {
    const load = async () => {
      const data = await getWorkspaceActivities(workspaceId);
      setActivities(data);
    };
    load();
  }, [workspaceId]);

  return (
    <div className="rounded-2xl border border-gray-100 bg-white shadow-sm">
      <h2 className="border-b border-gray-100 p-5 pb-4 text-sm font-semibold tracking-tight text-gray-900">
        Recent activity
      </h2>
      <div className="h-50 styled-scrollbar overflow-y-auto p-5 pt-4">
        <div className="flex flex-col gap-4">
          {activities.map((activity, i) => {
            const style = getActivityStyle(activity.action);
            const isLast = i === activities.length - 1;

            return (
              <div key={activity.id} className="relative flex gap-3">
                {!isLast && (
                  <span className="absolute left-3.25 top-7 h-full w-px bg-gray-100" />
                )}
                <div
                  className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full ${style.bg}`}
                >
                  {style.icon}
                </div>

                <div className="min-w-0 pb-1">
                  <p className="text-xs text-gray-600">
                    <span className="font-semibold text-gray-800">
                      {activity.user.name}
                    </span>{" "}
                    {formatActivity(activity)}
                  </p>
                  <p className="mt-0.5 font-mono text-[10.5px] text-gray-400">
                    {new Date(activity.createdAt).toLocaleString()}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ActivityFeed;
