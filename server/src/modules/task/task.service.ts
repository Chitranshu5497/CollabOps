import prisma from "../../config/prisma";
import { NotificationType } from "@prisma/client";

import { createActivity } from "../activity/activity.service";
import { createNotification } from "../notification/notification.service";

interface CreateTaskInput {
  title: string;
  description?: string;
  workspaceId: string;
  assigneeId?: string;
}

export const createTask = async (
  data: CreateTaskInput,
  performedBy: string,
) => {
  const task = await prisma.task.create({
    data: {
      title: data.title,
      description: data.description,
      workspaceId: data.workspaceId,
      assigneeId: data.assigneeId,
    },

    include: {
      assignee: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
  });

  await createActivity({
    workspaceId: data.workspaceId,
    userId: performedBy,
    action: "TASK_CREATED",
    entityType: "TASK",
    entityId: task.id,
    metadata: {
      title: task.title,
    },
  });

  return task;
};

export const getWorkspaceTasks = async (
  workspaceId: string
) => {
  return prisma.task.findMany({
    where: {
      workspaceId,
    },

    include: {
      assignee: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },

    orderBy: {
      createdAt: "desc",
    },
  });
};

export const updateTaskStatus = async (
  taskId: string,
  status: "TODO" | "IN_PROGRESS" | "DONE",
  performedBy: string,
) => {
  const task = await prisma.task.update({
    where: {
      id: taskId,
    },

    data: {
      status,
    },

    include: {
      assignee: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
  });

  await createActivity({
    workspaceId: task.workspaceId,
    userId: performedBy,
    action: "TASK_STATUS_UPDATED",
    entityType: "TASK",
    entityId: task.id,
    metadata: {
      title: task.title,
      status: task.status,
    },
  });

  return task;
};

export const assignTask = async (
  taskId: string,
  assigneeId: string | null,
  performedBy: string,
) => {
  const task = await prisma.task.update({
    where: {
      id: taskId,
    },

    data: {
      assigneeId,
    },

    include: {
      assignee: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
  });

  if (assigneeId) {
    await createNotification({
      title: "New Task Assigned",
      message: `You were assigned task "${task.title}"`,
      type: NotificationType.TASK_ASSIGNED,
      userId: assigneeId,
    });
  }

  await createActivity({
    workspaceId: task.workspaceId,
    userId: performedBy,
    action: "TASK_ASSIGNED",
    entityType: "TASK",
    entityId: task.id,
    metadata: {
      title: task.title,
      assigneeId,
    },
  });

  return task;
};

export const getMyTasks = async (userId: string) => {
  return prisma.task.findMany({
    where: {
      workspace: {
        members: {
          some: {
            userId,
          },
        },
      },
    },

    include: {
      workspace: {
        select: {
          id: true,
          name: true,
        },
      },

      assignee: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },

    orderBy: {
      createdAt: "desc",
    },
  });
};