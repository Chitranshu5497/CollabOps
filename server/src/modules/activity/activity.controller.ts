import { Request, Response } from "express";
import { getWorkspaceActivities } from "./activity.service";

export const getActivities = async (
  req: Request<{ workspaceId: string }>,
  res: Response
) => {
  const { workspaceId } = req.params;

  const activities = await getWorkspaceActivities(workspaceId);

  res.json({
    success: true,
    data: activities,
  });
};