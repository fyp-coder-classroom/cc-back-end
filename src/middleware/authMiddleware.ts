import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

// This extends Express Request to include user info
declare global {
  namespace Express {
    interface Request {
      userId?: string;
      userRole?: string;
    }
  }
}

// This middleware checks if JWT token is valid
export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  try {
    // Get token from Authorization header
    // Header looks like: "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      res.status(401).json({ message: "No token provided" });
      return;
    }

    // Verify token
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET as string
    ) as {
      userId: string;
      userRole: string;
    };

    // Attach user info to request
    req.userId = decoded.userId;
    req.userRole = decoded.userRole;

    // Move to next middleware/route
    next();
  } catch (error) {
    res.status(401).json({ message: "Invalid token" });
  }
};

// This middleware checks if user is a teacher
export const teacherMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  if (req.userRole !== "teacher") {
    res.status(403).json({ message: "Only teachers can perform this action" });
    return;
  }
  next();
};

// This middleware checks if user is a student
export const studentMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  if (req.userRole !== "student") {
    res.status(403).json({ message: "Only students can perform this action" });
    return;
  }
  next();
};