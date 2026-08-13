import { Request, Response } from "express";

export const uploadFileController = (req: Request, res: Response) => {
  if (!req.file) {
    return res.status(400).json({
      success: false,
      message: "No file uploaded",
    });
  }

  const serverUrl =
    process.env.SERVER_URL || `http://localhost:${process.env.PORT || 5000}`;

  res.json({
    success: true,
    data: {
      filename: req.file.filename,

      url: `${serverUrl}/uploads/${req.file.filename}`,

      originalName: req.file.originalname,

      size: req.file.size,
    },
  });
};