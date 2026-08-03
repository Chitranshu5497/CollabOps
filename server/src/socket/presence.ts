const onlineUsers = new Map<string, Set<string>>();
// workspaceId -> Set<userId>

export const joinWorkspace = (
  workspaceId: string,
  userId: string
) => {
  if (!onlineUsers.has(workspaceId)) {
    onlineUsers.set(workspaceId, new Set());
  }

  onlineUsers.get(workspaceId)!.add(userId);
};

export const leaveWorkspace = (
  workspaceId: string,
  userId: string
) => {
  const users = onlineUsers.get(workspaceId);

  if (!users) return;

  users.delete(userId);

  if (users.size === 0) {
    onlineUsers.delete(workspaceId);
  }
};

export const getOnlineUsers = (
  workspaceId: string
) => {
  return Array.from(
    onlineUsers.get(workspaceId) ?? []
  );
};