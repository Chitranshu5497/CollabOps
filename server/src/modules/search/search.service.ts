import prisma from "../../config/prisma";
import redis from "../../config/redis";
export const globalSearch = async (query: string) => {
  const cacheKey = `search:${query.toLowerCase()}`;

  const cached = await redis.get(cacheKey);

  if (cached) {
    console.log("✅ Search served from Redis");

    return JSON.parse(cached);
  }

  console.log("❌ Search served from Database");

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

  const result = {
    workspaces,
    tasks,
  };

  await redis.setEx(cacheKey, 300, JSON.stringify(result));

  return result;
};
