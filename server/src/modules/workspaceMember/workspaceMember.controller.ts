import { Request, Response } from "express";
import { asyncHandler } from "../../utils/asyncHandler";
import { addMember, inviteMember } from "./workspaceMember.service";
import { getWorkspaceMembers } 
from "./workspaceMember.service";

export const addMemberController =
asyncHandler(
async(req:Request,res:Response)=>{


const {
 workspaceId,
 userId
}=req.body;


const member =
await addMember(
 workspaceId,
 userId
);


res.status(201).json({

success:true,

data:member

});


});

export const getMembersController =
asyncHandler(
async(req,res)=>{


const { workspaceId } = req.params;


const members =
await getWorkspaceMembers(
  workspaceId as string
);


res.status(200).json({

success:true,

data:members

});


});

export const inviteMemberController =
asyncHandler(async (req, res) => {

  const {
    workspaceId,
    email,
  } = req.body;

  const member =
    await inviteMember(
      workspaceId,
      email
    );

  res.status(201).json({

    success: true,

    message: "Member invited successfully",

    data: member,

  });

});