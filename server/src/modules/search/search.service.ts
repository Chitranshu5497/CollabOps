import prisma from "../../config/prisma";
import redis from "../../config/redis";

export const globalSearch = async (query: string, userId: string) => {
  const normalizedQuery = query.trim().toLowerCase();

  // IMPORTANT:
  // Cache must be user-specific because search results
  // depend on the user's workspace memberships.
  const cacheKey = `search:${userId}:${normalizedQuery}`;

  const cached = await redis.get(cacheKey);

  if (cached) {
    console.log("✅ Search served from Redis");
    return JSON.parse(cached);
  }

  console.log("❌ Search served from Database");

  const [workspaces, tasks] = await Promise.all([
    // Only workspaces where the user is a member
    prisma.workspace.findMany({
      where: {
        AND: [
          {
            name: {
              contains: query,
              mode: "insensitive",
            },
          },
          {
            members: {
              some: {
                userId,
              },
            },
          },
        ],
      },
      take: 5,
    }),

    // Only tasks belonging to workspaces
    // where the user is a member
    prisma.task.findMany({
      where: {
        AND: [
          {
            title: {
              contains: query,
              mode: "insensitive",
            },
          },
          {
            workspace: {
              members: {
                some: {
                  userId,
                },
              },
            },
          },
        ],
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
