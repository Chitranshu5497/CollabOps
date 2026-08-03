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
  const members =
    await prisma.workspaceMember.findMany({
      where: {
        workspaceId,
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

      orderBy: {
        joinedAt: "asc",
      },
    });

  return members.map((member) => member.user);
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