import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { AppError } from "../utils/AppError";

const ACCESS_SECRET = process.env.JWT_ACCESS_SECRET!;

export const authenticate = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith("Bearer ")) {
    throw new AppError("Unauthorized", 401);
  }

  const token = authHeader.split(" ")[1];

  const decoded = jwt.verify(token, ACCESS_SECRET) as {
    id: string;
    role: string;
  };

  req.user = decoded;

  next();
};