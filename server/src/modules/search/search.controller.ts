import { Request, Response } from "express";
import { asyncHandler } from "../../utils/asyncHandler";
import { globalSearch } from "./search.service";

export const searchController = asyncHandler(
  async (req: Request, res: Response) => {
    const q = req.query.q as string;

    if (!q) {
      return res.json({
        success: true,
        data: {
          workspaces: [],
          tasks: [],
        },
      });
    }

    const result = await globalSearch(q, req.user!.id);

    res.json({
      success: true,
      data: result,
    });
  },
);
