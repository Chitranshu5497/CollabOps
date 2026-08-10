import type { Request, Response } from "express";
import { inviteQueue } from "../../jobs/queues/invite.queue";

export const getQueueStatsController = async (
  req: Request,
  res: Response
): Promise<void> => {

  const stats = await inviteQueue.getJobCounts();

  res.status(200).json({
    success: true,
    data: stats,
  });

};