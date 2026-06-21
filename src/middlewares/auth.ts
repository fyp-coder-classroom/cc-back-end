import { env } from "@/config/env";
import type { Role } from "@/config/roles";
import User from "@/models/user.model";
import { ApiError } from "@/utils/api-error";
import type { NextFunction, Request, Response, RequestHandler } from "express";
import httpStatus from "http-status";
import jwt from "jsonwebtoken";

const auth =
  (requiredRoles: Role[] = []): RequestHandler =>
  async (req, _res, next) => {
    try {
      const authHeader = req.headers.authorization;

      if (!authHeader || !authHeader.startsWith("Bearer ")) {
        throw new ApiError(httpStatus.UNAUTHORIZED, "Missing or invalid token");
      }

      const token = authHeader.substring(7);

      const decoded = jwt.verify(token, env.jwt.secret) as {
        sub: string;
      };

      console.log(decoded);
      const user = await User.findById(decoded.sub);

      if (!user) {
        throw new ApiError(httpStatus.UNAUTHORIZED, "User not found");
      }

      (req as any).user = user;

      if (requiredRoles.length > 0 && !requiredRoles.includes(user.role)) {
        throw new ApiError(
          httpStatus.FORBIDDEN,
          "You are not authorized to access this resource",
        );
      }

      next();
    } catch (error) {
      next(
        error instanceof ApiError
          ? error
          : new ApiError(httpStatus.UNAUTHORIZED, "Invalid or expired token"),
      );
    }
  };

export default auth;
