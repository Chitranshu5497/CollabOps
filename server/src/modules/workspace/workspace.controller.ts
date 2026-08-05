import type { Request, Response } from "express";

import {
  createWorkspaceSchema,
  updateMemberRoleSchema,
} from "./workspace.validation";
import * as workspaceService from "./workspace.service";
import { updateWorkspaceSchema } from "./workspace.validation";
export const createWorkspaceController = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const data = createWorkspaceSchema.parse(req.body);

  const workspace = await workspaceService.createWorkspace(req.user.id, data);

  res.status(201).json({
    success: true,
    message: "Workspace created successfully",
    data: workspace,
  });
};

export const getMyWorkspacesController = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const workspaces = await workspaceService.getUserWorkspaces(req.user.id);

  res.status(200).json({
    success: true,
    data: workspaces,
  });
};

export const getWorkspaceMembersController = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const { workspaceId } = req.params;

  const members = await workspaceService.getWorkspaceMembers(
    workspaceId as string,
  );

  res.status(200).json({
    success: true,
    data: members,
  });
};

export const updateWorkspaceController = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const data = updateWorkspaceSchema.parse(req.body);

  const workspace = await workspaceService.updateWorkspace(
    req.params.id as string,
    req.user.id,
    data,
  );

  res.status(200).json({
    success: true,
    message: "Workspace updated successfully",
    data: workspace,
  });
};

export const removeMemberController = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const workspaceId = req.params.workspaceId as string;
  const memberId = req.params.memberId as string;

  await workspaceService.removeMember(workspaceId, memberId, req.user.id);

  res.status(200).json({
    success: true,
    message: "Member removed successfully",
  });
};

export const updateMemberRoleController = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const { role } = updateMemberRoleSchema.parse(req.body);
  const workspaceId = req.params.workspaceId as string;
  const memberId = req.params.memberId as string;

  const member = await workspaceService.updateMemberRole(
    workspaceId,
    memberId,
    req.user.id,
    role,
  );

  res.status(200).json({
    success: true,
    message: "Member role updated successfully",
    data: member,
  });
};

export const leaveWorkspaceController = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const workspaceId = req.params.workspaceId as string;

  await workspaceService.leaveWorkspace(workspaceId, req.user.id);

  res.status(200).json({
    success: true,
    message: "Left workspace successfully",
  });
};

export const deleteWorkspaceController = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const workspaceId = req.params.workspaceId as string;

  await workspaceService.deleteWorkspace(workspaceId, req.user.id);

  res.status(200).json({
    success: true,
    message: "Workspace deleted successfully",
  });
};

export const searchWorkspaceController = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const query = (req.query.q as string) || "";

  const workspaces = await workspaceService.searchWorkspaces(
    req.user.id,
    query,
  );

  res.status(200).json({
    success: true,
    data: workspaces,
  });
};
