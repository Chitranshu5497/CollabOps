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


export const leaveWorkspace = async (
  workspaceId: string,
  userId: string
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
      "The owner cannot leave the workspace. Delete it or transfer ownership instead."
    );
  }
 
  await prisma.workspaceMember.delete({
    where: { id: membership.id },
  });
};
 
export const deleteWorkspace = async (
  workspaceId: string,
  userId: string
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
 
  // Explicit member cleanup inside a transaction, rather than relying on
  // `onDelete: Cascade` in your Prisma schema — safer if that cascade
  // isn't actually set up on the WorkspaceMember relation. If it IS set
  // up, this is harmless (just redundant); if it isn't, this is what
  // prevents an orphaned-membership-row error on delete.
  await prisma.$transaction([
    prisma.workspaceMember.deleteMany({ where: { workspaceId } }),
    prisma.workspace.delete({ where: { id: workspaceId } }),
  ]);
};