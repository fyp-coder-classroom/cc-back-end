import { ApiError } from "@/utils/api-error";
import type { NextFunction, Request, Response } from "express";
import { RequestHandler } from "express";
import httpStatus from "http-status";
import jwt from "jsonwebtoken";
import { env } from "@/config/env";

const auth: RequestHandler = (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      throw new ApiError(httpStatus.UNAUTHORIZED, "Missing or invalid token");
    }

    const token = authHeader.substring(7);

    const decoded = jwt.verify(token, env.jwt.secret) as any;

    (req as any).user = {
      id: decoded.sub,
      email: decoded.email,
      role: decoded.role,
    };

    next();
  } catch (error) {
    if (error instanceof ApiError) {
      next(error);
    } else {
      next(
        new ApiError(httpStatus.UNAUTHORIZED, "Invalid or expired token"),
      );
    }
  }
};

export default auth;