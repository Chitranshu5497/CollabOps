import prisma from "../../config/prisma";
import type { CreateWorkspaceInput } from "./workspace.validation";

export const createWorkspace = async (
  userId: string,
  data: CreateWorkspaceInput,
) => {
  return prisma.workspace.create({
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

export const getWorkspaceMembers = async (
  workspaceId: string,
) => {
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
  }
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

  return prisma.workspace.update({
    where: {
      id: workspaceId,
    },

    data: {
      name: data.name,
      description: data.description,
    },
  });
};

export const removeMember = async (
  workspaceId: string,
  memberId: string,
  currentUserId: string
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

  const member =
    await prisma.workspaceMember.findUnique({
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
};

export const updateMemberRole = async (
  workspaceId: string,
  memberId: string,
  currentUserId: string,
  role: "ADMIN" | "MEMBER"
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

  if (!member) {
    throw new Error("Member not found");
  }

  if (member.role === "OWNER") {
    throw new Error("Owner role cannot be changed");
  }

  return prisma.workspaceMember.update({
    where: {
      id: memberId,
    },
    data: {
      role,
    },
  });
};