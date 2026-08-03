import { Request, Response } from "express";
import { asyncHandler } from "../../utils/asyncHandler";
import { getWorkspaceMessages, searchMessages } from "./message.service";

export const getWorkspaceMessagesController =
  asyncHandler(async (req: Request, res: Response) => {

    const workspaceId  = req.params.workspaceId as string;

    const messages =
      await getWorkspaceMessages(workspaceId);

    res.status(200).json({
      success: true,
      data: messages,
    });

  });

  export const searchMessagesController = asyncHandler(
  async (req, res) => {
    const workspaceId = req.query.workspaceId as string;
    const q = req.query.q as string;

    const messages = await searchMessages(
      workspaceId,
      q
    );

    res.json({
      success: true,
      data: messages,
    });
  }
);