import prisma from "../../config/prisma";

export const getDashboardStats = async (userId: string) => {
  const workspaces = await prisma.workspaceMember.count({
    where: {
      userId,
    },
  });

  const activeTasks = await prisma.task.count({
    where: {
      assigneeId: userId,
      status: {
        not: "DONE",
      },
    },
  });

  const completedTasks = await prisma.task.count({
    where: {
      assigneeId: userId,
      status: "DONE",
    },
  });

  const notifications = await prisma.notification.count({
    where: {
      userId,
      isRead: false,
    },
  });

  const recentActivities = await prisma.activity.findMany({
    where: {
      userId,
    },
    orderBy: {
      createdAt: "desc",
    },
    take: 5,
    include: {
      user: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  });

  const assignedTasks = await prisma.task.findMany({
    where: {
      assigneeId: userId,
      status: {
        not: "DONE",
      },
    },
    orderBy: {
      createdAt: "desc",
    },
    take: 5,
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

  return {
    workspaces,
    activeTasks,
    completedTasks,
    notifications,
    recentActivities,
    assignedTasks,
  };
};