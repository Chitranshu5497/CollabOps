import  prisma  from "../../config/prisma";
import  {AppError}  from "../../utils/AppError";


export const addMember = async (
  workspaceId: string,
  userId: string
) => {


  const existing =
    await prisma.workspaceMember.findUnique({
      where:{
        userId_workspaceId:{
          userId,
          workspaceId
        }
      }
    });


  if(existing){
    throw new AppError(
      "User already member",
      400
    );
  }


  return prisma.workspaceMember.create({

    data:{
      userId,
      workspaceId,
      role:"MEMBER"
    },

    include:{
      user:{
        select:{
          id:true,
          name:true,
          email:true
        }
      }
    }

  });

};

export const getWorkspaceMembers = async (
  workspaceId: string
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


export const inviteMember = async (
  workspaceId: string,
  email: string
) => {

  const user = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  if (!user) {
    throw new AppError("User not found", 404);
  }

  const existing =
    await prisma.workspaceMember.findUnique({
      where: {
        userId_workspaceId: {
          userId: user.id,
          workspaceId,
        },
      },
    });

  if (existing) {
    throw new AppError(
      "User already a member",
      400
    );
  }

  return prisma.workspaceMember.create({

    data: {
      workspaceId,
      userId: user.id,
      role: "MEMBER",
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

  });

};