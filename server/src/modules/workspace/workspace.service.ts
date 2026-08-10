import prisma from "../../config/prisma";
import type { CreateWorkspaceInput } from "./workspace.validation";
import redis from "../../config/redis";

export const createWorkspace = async (
  userId: string,
  data: CreateWorkspaceInput,
) => {
  const workspace = await prisma.workspace.create({
    data: {
      name: data.name,
      description: data.description,
      ownerId: userId,

      members: {
        create: {
          userId,
          role: "OWNER",
        },
      },
    },

    include: {
      owner: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },

      members: {
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      },
    },
  });
  await redis.del(`workspace-search:${userId}:`);
  await clearWorkspaceSearchCache(userId);
  await redis.flushAll();
  return workspace;
};

export const getUserWorkspaces = async (userId: string) => {
  const memberships = await prisma.workspaceMember.findMany({
    where: {
      userId,
    },

    include: {
      workspace: true,
    },

    orderBy: {
      joinedAt: "desc",
    },
  });

  return memberships.map(
    (item: {
      workspace: { id: any; name: any; description: any; createdAt: any };
      role: any;
    }) => ({
      id: item.workspace.id,
      name: item.workspace.name,
      description: item.workspace.description,
      role: item.role,
      createdAt: item.workspace.createdAt,
    }),
  );
};

export const getWorkspaceMembers = async (workspaceId: string) => {
  return prisma.workspaceMember.findMany({
    where: {
      workspaceId,
    },

    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          avatar: true,
        },
      },
    },

    orderBy: {
      joinedAt: "asc",
    },
  });
};

export const updateWorkspace = async (
  workspaceId: string,
  userId: string,
  data: {
    name: string;
    description?: string;
  },
) => {
  // Check workspace exists
  const workspace = await prisma.workspace.findUnique({
    where: {
      id: workspaceId,
    },
  });

  if (!workspace) {
    throw new Error("Workspace not found");
  }

  // Only owner can update
  if (workspace.ownerId !== userId) {
    throw new Error("Not authorized");
  }

  const updatedWorkspace = await prisma.workspace.update({
    where: {
      id: workspaceId,
    },
    data: {
      name: data.name,
      description: data.description,
    },
  });

  await clearWorkspaceSearchCache(userId);

  return updatedWorkspace;
};

export const removeMember = async (
  workspaceId: string,
  memberId: string,
  currentUserId: string,
) => {
  const workspace = await prisma.workspace.findUnique({
    where: {
      id: workspaceId,
    },
  });

  if (!workspace) {
    throw new Error("Workspace not found");
  }

  if (workspace.ownerId !== currentUserId) {
    throw new Error("Only owner can remove members");
  }

  const member = await prisma.workspaceMember.findUnique({
    where: {
      id: memberId,
    },
  });

  if (!member) {
    throw new Error("Member not found");
  }

  if (member.role === "OWNER") {
    throw new Error("Owner cannot be removed");
  }

  await prisma.workspaceMember.delete({
    where: {
      id: memberId,
    },
  });
  await redis.flushAll();
};

export const updateMemberRole = async (
  workspaceId: string,
  memberId: string,
  currentUserId: string,
  role: "ADMIN" | "MEMBER",
) => {
  const workspace = await prisma.workspace.findUnique({
    where: {
      id: workspaceId,
    },
  });

  if (!workspace) {
    throw new Error("Workspace not found");
  }

  if (workspace.ownerId !== currentUserId) {
    throw new Error("Only owner can change member roles");
  }

  const member = await prisma.workspaceMember.findUnique({
    where: {
      id: memberId,
    },
  });
  await redis.flushAll();

  if (!member) {
    throw new Error("Member not found");
  }

  if (member.role === "OWNER") {
    throw new Error("Owner role cannot be changed");
  }

  const updatedMember = await prisma.workspaceMember.update({
  where: {
    id: memberId,
  },
  data: {
    role,
  },
  include: {
    user: {
      select: {
        id: true,
        name: true,
        email: true,
      },
    },
  },
});

return updatedMember;
};

export const leaveWorkspace = async (
  workspaceId: string,
  userId: string,
): Promise<void> => {
  const membership = await prisma.workspaceMember.findFirst({
    where: {
      workspaceId,
      userId,
    },
  });

  if (!membership) {
    throw new Error("You are not a member of this workspace");
  }

  if (membership.role === "OWNER") {
    throw new Error(
      "The owner cannot leave the workspace. Delete it or transfer ownership instead.",
    );
  }

  await prisma.workspaceMember.delete({
    where: { id: membership.id },
  });
  await redis.flushAll();
  await clearWorkspaceSearchCache(userId);
};

export const deleteWorkspace = async (
  workspaceId: string,
  userId: string,
): Promise<void> => {
  const workspace = await prisma.workspace.findUnique({
    where: { id: workspaceId },
  });

  if (!workspace) {
    throw new Error("Workspace not found");
  }

  if (workspace.ownerId !== userId) {
    throw new Error("Only the owner can delete this workspace");
  }

  await prisma.$transaction([
    prisma.workspaceMember.deleteMany({ where: { workspaceId } }),
    prisma.workspace.delete({ where: { id: workspaceId } }),
  ]);
  await redis.flushAll();
  await clearWorkspaceSearchCache(userId);
};

export const searchWorkspaces = async (userId: string, query: string) => {
  const cacheKey = `workspace-search:${userId}:${query.toLowerCase()}`;

  // Check cache
  const cached = await redis.get(cacheKey);

  if (cached) {
    console.log("✅ CACHE HIT:", cacheKey);
    return JSON.parse(cached);
  }

  console.log("❌ CACHE MISS:", cacheKey);

  const result = await prisma.workspaceMember.findMany({
    where: {
      userId,
      workspace: {
        name: {
          contains: query,
          mode: "insensitive",
        },
      },
    },

    include: {
      workspace: true,
    },

    take: 8,
  });

  // Cache for 60 seconds
  await redis.set(cacheKey, JSON.stringify(result), {
    EX: 60,
  });

  return result;
};

const clearWorkspaceSearchCache = async (userId: string) => {
  const keys = await redis.keys(`workspace-search:${userId}:*`);

  if (keys.length > 0) {
    await redis.del(keys);
  }
};
