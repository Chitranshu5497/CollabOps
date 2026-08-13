import { Request, Response } from "express";
import { loginSchema, registerSchema } from "../validators/auth.validator";
import {
  loginUser,
  logoutUser,
  refreshUserToken,
  registerUser,
  updateUserPassword,
  createPasswordResetToken,
  resetUserPassword,
} from "../services/auth.service";
import { asyncHandler } from "../utils/asyncHandler";
import prisma from "../config/prisma";
import { AppError } from "../utils/AppError";
import { verifyRefreshToken } from "../utils/jwt";
import {
  updateMeSchema,
  updatePasswordSchema,
} from "../validators/auth.validator"; // add to existing import line

export const register = asyncHandler(async (req: Request, res: Response) => {
  const data = registerSchema.parse(req.body);

  const result = await registerUser(data.name, data.email, data.password);

  res.cookie("refreshToken", result.refreshToken, {
    httpOnly: true,
    secure: true,
    sameSite: "none",
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
    secure: true,
    sameSite: "none",
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

  const accessToken = await refreshUserToken(refreshToken);

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

  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: true,
    sameSite: "none",
  });
  res.status(200).json({
    success: true,
    message: "Logged out successfully",
  });
});

export const updateMe = asyncHandler(async (req: Request, res: Response) => {
  const data = updateMeSchema.parse(req.body);

  const user = await prisma.user.update({
    where: { id: req.user!.id },
    data: { name: data.name },
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
    message: "Profile updated successfully",
    data: user,
  });
});

export const updatePassword = asyncHandler(
  async (req: Request, res: Response) => {
    const data = updatePasswordSchema.parse(req.body);

    await updateUserPassword(
      req.user!.id,
      data.currentPassword,
      data.newPassword,
    );

    res.status(200).json({
      success: true,
      message: "Password updated successfully",
    });
  },
);

export const forgotPassword = asyncHandler(
  async (req: Request, res: Response) => {
    const { email } = req.body;

    if (!email) {
      throw new AppError("Email is required", 400);
    }

    await createPasswordResetToken(email);

    res.status(200).json({
      success: true,
      message:
        "If an account exists with this email, a password reset link has been sent.",
    });
  },
);

export const resetPassword = asyncHandler(
  async (req: Request, res: Response) => {
    const { token, newPassword } = req.body;

    if (!token || !newPassword) {
      throw new AppError("Token and new password are required", 400);
    }

    if (newPassword.length < 6) {
      throw new AppError("Password must be at least 6 characters", 400);
    }

    await resetUserPassword(token, newPassword);

    res.status(200).json({
      success: true,
      message: "Password reset successfully",
    });
  },
);
