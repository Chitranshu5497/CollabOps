import prisma from "../../config/prisma";

export const globalSearch = async (query: string) => {
  const [workspaces, tasks] = await Promise.all([
    prisma.workspace.findMany({
      where: {
        name: {
          contains: query,
          mode: "insensitive",
        },
      },
      take: 5,
    }),

    prisma.task.findMany({
      where: {
        title: {
          contains: query,
          mode: "insensitive",
        },
      },
      include: {
        workspace: true,
      },
      take: 5,
    }),
  ]);

  return {
    workspaces,
    tasks,
  };
};