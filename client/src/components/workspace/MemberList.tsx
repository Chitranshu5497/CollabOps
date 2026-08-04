import { useEffect, useState } from "react";
import { UserPlus, Loader2 } from "lucide-react";
import {
  getWorkspaceMembers,
  inviteMember,
  removeMember,
  updateMemberRole,
} from "../../services/workspace.service";
interface Props {
  workspaceId: string;
  onlineUsers: string[];
  role: "OWNER" | "ADMIN" | "MEMBER";
  mode?: "view" | "remove" | "role";
}

const AVATAR_COLORS = [
  "#7C5CFC",
  "#22D3EE",
  "#FB923C",
  "#34D399",
  "#F472B6",
  "#F43F5E",
];
const colorFor = (name: string) =>
  AVATAR_COLORS[name.charCodeAt(0) % AVATAR_COLORS.length];

const MemberList = ({
  workspaceId,
  onlineUsers,
  role,
  mode = "view",
}: Props) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [members, setMembers] = useState<any[]>([]);
  const [email, setEmail] = useState("");
  const [inviting, setInviting] = useState(false);

  const loadMembers = async () => {
    const data = await getWorkspaceMembers(workspaceId);
    setMembers(data);
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadMembers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [workspaceId]);

  const handleInvite = async () => {
    if (!email.trim() || inviting) return;
    setInviting(true);
    try {
      await inviteMember(workspaceId, email);
      setEmail("");
      await loadMembers();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      alert(err.response?.data?.message || "Invite failed");
    } finally {
      setInviting(false);
    }
  };

  const handleRemove = async (memberId: string) => {
    try {
      await removeMember(workspaceId, memberId);
      await loadMembers();
    } catch (err) {
      console.error(err);
      alert("You are not an Owner");
    }
  };
  const handleRoleChange = async (
    memberId: string,
    role: "ADMIN" | "MEMBER",
  ) => {
    try {
      await updateMemberRole(workspaceId, memberId, role);
      await loadMembers();
    } catch (err) {
      console.error(err);
      alert("Failed to update role");
    }
  };
  return (
    <div className=" rounded-2xl border border-gray-100 bg-white shadow-sm">
      <div className="border-b border-gray-100 p-5 pb-4">
        <h2 className="text-sm font-semibold tracking-tight text-gray-900">
          Members <span className="text-gray-400">({members.length})</span>
        </h2>

        {role !== "MEMBER" && (
          <div className="mt-3 flex gap-2">
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter email"
              onKeyDown={(e) => e.key === "Enter" && handleInvite()}
              className="min-w-0 flex-1 rounded-xl border border-gray-200 px-3 py-2 text-sm text-gray-800 outline-none transition-all duration-200 placeholder:text-gray-400 focus:border-indigo-300 focus:ring-4 focus:ring-indigo-100"
            />

            <button
              onClick={handleInvite}
              disabled={inviting}
              className="flex shrink-0 items-center gap-1.5 rounded-xl bg-linear-to-r from-indigo-500 to-violet-500 px-3.5 py-2 text-xs font-semibold text-white shadow-md shadow-indigo-500/20 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg disabled:opacity-50 disabled:hover:translate-y-0"
            >
              {inviting ? (
                <Loader2 size={14} className="animate-spin" />
              ) : (
                <UserPlus size={14} />
              )}
            </button>
          </div>
        )}
      </div>

      <div className="h-34 styled-scrollbar divide-y divide-gray-50 overflow-y-auto px-5">
        {members.map((member) => {
          const isOnline = onlineUsers.includes(member.user.id);

          return (
            <div
              key={member.id}
              className="flex items-center justify-between py-2.5"
            >
              <div className="flex items-center gap-2.5">
                <div className="relative">
                  <div
                    className="flex h-8 w-8 items-center justify-center rounded-full text-[11px] font-bold text-white"
                    style={{ background: colorFor(member.user.name) }}
                  >
                    {member.user.name.charAt(0).toUpperCase()}
                  </div>
                  <span
                    className={`absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border-2 border-white ${
                      isOnline ? "bg-emerald-500" : "bg-gray-300"
                    }`}
                  />
                </div>
                <span className="text-sm font-medium text-gray-700">
                  {member.user.name}
                </span>
              </div>

              <div className="flex items-center gap-2">
                {mode === "role" &&
                role === "OWNER" &&
                member.role !== "OWNER" ? (
                  <select
                    value={member.role}
                    onChange={(e) =>
                      handleRoleChange(
                        member.id,
                        e.target.value as "ADMIN" | "MEMBER",
                      )
                    }
                    className="rounded-md border border-gray-200 bg-white px-2 py-1 text-[11px] font-semibold"
                  >
                    <option value="MEMBER">MEMBER</option>
                    <option value="ADMIN">ADMIN</option>
                  </select>
                ) : (
                  <span className="rounded-full bg-gray-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-gray-500">
                    {member.role}
                  </span>
                )}

                {mode === "remove" &&
                  role === "OWNER" &&
                  member.role !== "OWNER" && (
                    <button
                      onClick={() => handleRemove(member.id)}
                      className="rounded-md bg-red-50 px-2 py-1 text-[10px] font-semibold text-red-600 hover:bg-red-100"
                    >
                      Remove
                    </button>
                  )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MemberList;
