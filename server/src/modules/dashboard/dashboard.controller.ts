import { Request, Response } from "express";
import { getDashboardStats } from "./dashboard.service";

export const getDashboardController = async (
  req: Request,
  res: Response
) => {
  const userId = req.user!.id;

  const stats = await getDashboardStats(userId);

  res.json({
    success: true,
    data: stats,
  });
};