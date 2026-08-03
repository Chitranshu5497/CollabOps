import prisma from "../../config/prisma";
import { Prisma } from "@prisma/client";
interface ActivityInput {
  workspaceId: string;

  userId: string;

  action: string;

  entityType?: string;

  entityId?: string;

  metadata?: Prisma.InputJsonValue;
}

export const createActivity = async (data: ActivityInput) => {
  return prisma.activity.create({
    data: {
      workspaceId: data.workspaceId,

      userId: data.userId,

      action: data.action,

      entityType: data.entityType,

      entityId: data.entityId,

      metadata: data.metadata,
    },
  });
};

export const getWorkspaceActivities = async (workspaceId: string) => {
  return prisma.activity.findMany({
    where: {
      workspaceId,
    },

    include: {
      user: {
        select: {
          id: true,

          name: true,
        },
      },
    },

    orderBy: {
      createdAt: "desc",
    },

    take: 100,
  });
};
