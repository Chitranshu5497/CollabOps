import { Request, Response } from "express";
import { loginSchema, registerSchema } from "../validators/auth.validator";
import { loginUser, logoutUser, refreshUserToken, registerUser } from "../services/auth.service";
import { asyncHandler } from "../utils/asyncHandler";
import prisma from "../config/prisma";
import { AppError } from "../utils/AppError";
import { verifyRefreshToken } from "../utils/jwt";

export const register = asyncHandler(async (req: Request, res: Response) => {
  const data = registerSchema.parse(req.body);

  const result = await registerUser(
    data.name,
    data.email,
    data.password
  );

  res.cookie("refreshToken", result.refreshToken, {
    httpOnly: true,
    secure: false, // true in production
    sameSite: "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  res.status(201).json({
    success: true,
    message: "User registered successfully",
    data: {
      accessToken: result.accessToken,
      user: {
        id: result.user.id,
        name: result.user.name,
        email: result.user.email,
        role: result.user.role,
      },
    },
  });
});

export const login = asyncHandler(async (req: Request, res: Response) => {
  const data = loginSchema.parse(req.body);

  const result = await loginUser(data.email, data.password);

  res.cookie("refreshToken", result.refreshToken, {
    httpOnly: true,
    secure: false, // true in production with HTTPS
    sameSite: "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  res.status(200).json({
    success: true,
    message: "Login successful",
    data: {
      accessToken: result.accessToken,
      user: {
        id: result.user.id,
        name: result.user.name,
        email: result.user.email,
        role: result.user.role,
      },
    },
  });
});

export const me = asyncHandler(async (req: Request, res: Response) => {
  const user = await prisma.user.findUnique({
    where: {
      id: req.user!.id,
    },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      createdAt: true,
    },
  });

  res.status(200).json({
    success: true,
    data: user,
  });
});

export const refresh = asyncHandler(async (req, res) => {
  const refreshToken = req.cookies.refreshToken;

  if (!refreshToken) {
    throw new AppError("Unauthorized", 401);
  }

  const accessToken = await refreshUserToken(
    refreshToken
  );

  res.status(200).json({
    success: true,
    data: {
      accessToken,
    },
  });
});

export const logout = asyncHandler(async (req, res) => {
  const refreshToken = req.cookies.refreshToken;

  if (!refreshToken) {
    return res.status(200).json({
      success: true,
      message: "Logged out",
    });
  }

  const decoded = verifyRefreshToken(refreshToken);

  await logoutUser(decoded.id);

  res.clearCookie("refreshToken");

  res.status(200).json({
    success: true,
    message: "Logged out successfully",
  });
});