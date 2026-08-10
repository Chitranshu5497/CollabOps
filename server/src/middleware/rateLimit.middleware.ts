import type { Request, Response, NextFunction } from "express";
import redis from "../config/redis";

const WINDOW_SECONDS = 60;
const MAX_REQUESTS = 5;
const SEARCH_WINDOW_SECONDS = 60;
const MAX_SEARCH_REQUESTS = 30;

export const loginRateLimiter = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const ip = req.ip || req.socket.remoteAddress || "unknown";

    const key = `rate-limit:login:${ip}`;

    const current = await redis.incr(key);

    if (current === 1) {
      await redis.expire(key, WINDOW_SECONDS);
    }

    if (current > MAX_REQUESTS) {
      return res.status(429).json({
        success: false,
        message:
          "Too many login attempts. Please try again after 1 minute.",
      });
    }

    next();
  } catch (error) {
    console.error("Rate limiter error:", error);

    // If Redis has a problem, don't block authentication.
    next();
  }
};

export const searchRateLimiter = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user?.id || req.ip || "unknown";

    const key = `rate-limit:search:${userId}`;

    const current = await redis.incr(key);

    if (current === 1) {
      await redis.expire(
        key,
        SEARCH_WINDOW_SECONDS
      );
    }

    if (current > MAX_SEARCH_REQUESTS) {
      return res.status(429).json({
        success: false,
        message:
          "Too many search requests. Please try again later.",
      });
    }

    next();
  } catch (error) {
    console.error("Search rate limiter error:", error);

    next();
  }
};