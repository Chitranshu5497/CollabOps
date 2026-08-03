import { Request, Response } from "express";

export const uploadFileController = (
  req: Request,
  res: Response
) => {

  if (!req.file) {

    return res.status(400).json({

      success: false,

      message: "No file uploaded",

    });

  }

  res.json({

    success: true,

    data: {

      filename: req.file.filename,

      url:
        "http://localhost:5000/uploads/" +
        req.file.filename,

      originalName:
        req.file.originalname,

      size: req.file.size,

    },

  });

};