import prisma from "../../config/prisma";
import { createActivity } from "../activity/activity.service";

interface CreateMessageInput {
  senderId: string;
  workspaceId: string;

  content?: string;

  fileUrl?: string;
  fileName?: string;
  fileType?: string;
}

export const createMessage = async (
  data: CreateMessageInput
) => {
  const message = await prisma.message.create({
    data: {
      senderId: data.senderId,

      workspaceId: data.workspaceId,

      content: data.content,

      fileUrl: data.fileUrl,

      fileName: data.fileName,

      fileType: data.fileType,
    },

    include: {
      sender: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  });

  await createActivity({
    workspaceId: data.workspaceId,
    userId: data.senderId,
    action: "MESSAGE_SENT",
    entityType: "MESSAGE",
    entityId: message.id,
    metadata: {
      hasFile: !!data.fileUrl,
    },
  });

  return message;
};

export const getWorkspaceMessages = async (
  workspaceId: string
) => {
  return prisma.message.findMany({
    where: {
      workspaceId,
    },

    include: {
      sender: {
        select: {
          id: true,
          name: true,
        },
      },
    },

    orderBy: {
      createdAt: "asc",
    },
  });
};

export const searchMessages = async (
  workspaceId: string,
  q: string
) => {
  return prisma.message.findMany({
    where: {
      workspaceId,

      content: {
        contains: q,
        mode: "insensitive",
      },
    },

    include: {
      sender: {
        select: {
          id: true,
          name: true,
        },
      },
    },

    orderBy: {
      createdAt: "desc",
    },
  });
};