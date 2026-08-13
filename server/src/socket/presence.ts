const onlineUsers = new Map<string, Map<string, Set<string>>>();
// workspaceId -> userId -> socketIds

export const joinWorkspace = (
  workspaceId: string,
  userId: string,
  socketId: string,
) => {
  if (!onlineUsers.has(workspaceId)) {
    onlineUsers.set(workspaceId, new Map());
  }

  const workspaceUsers = onlineUsers.get(workspaceId)!;

  if (!workspaceUsers.has(userId)) {
    workspaceUsers.set(userId, new Set());
  }

  workspaceUsers.get(userId)!.add(socketId);
};

export const leaveWorkspace = (
  workspaceId: string,
  userId: string,
  socketId: string,
) => {
  const workspaceUsers = onlineUsers.get(workspaceId);

  if (!workspaceUsers) return;

  const userSockets = workspaceUsers.get(userId);

  if (!userSockets) return;

  userSockets.delete(socketId);

  // User is only offline when ALL their sockets are gone
  if (userSockets.size === 0) {
    workspaceUsers.delete(userId);
  }

  if (workspaceUsers.size === 0) {
    onlineUsers.delete(workspaceId);
  }
};

export const getOnlineUsers = (workspaceId: string) => {
  return Array.from(
    onlineUsers.get(workspaceId)?.keys() ?? [],
  );
};