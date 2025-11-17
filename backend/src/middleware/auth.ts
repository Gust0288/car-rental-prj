import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { userPool } from "../config/database.js";

interface AuthenticatedRequest extends Request {
  userId?: number;
  userEmail?: string;
}

export const authenticateToken = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(" ")[1]; // Bearer TOKEN

  if (!token) {
    return res.status(401).json({
      error: "Access token required",
      message: "No authentication token provided",
    });
  }

  jwt.verify(
    token,
    process.env.JWT_SECRET || "fallback_secret",
    (err, decoded) => {
      if (err) {
        return res.status(403).json({
          error: "Invalid token",
          message: "Token is invalid or expired",
        });
      }

      const payload = decoded as { userId: number; email: string };
      req.userId = payload.userId;
      req.userEmail = payload.email;

      next();
    }
  );
};

// Middleware to require admin users. Assumes `admin` column exists on users (0 or 1).
export const requireAdmin = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.userId) {
      return res
        .status(401)
        .json({ error: "Unauthorized", message: "No authenticated user" });
    }

    const { rows } = await userPool.query(
      `SELECT admin, user_deleted_at FROM public.users WHERE id = $1`,
      [req.userId]
    );

    if (rows.length === 0) {
      return res
        .status(401)
        .json({ error: "Unauthorized", message: "User not found" });
    }

    const user = rows[0];
    if (user.user_deleted_at) {
      return res.status(403).json({
        error: "Forbidden",
        message: "Deleted users cannot perform this action",
      });
    }

    if (parseInt(user.admin, 10) !== 1 && user.admin !== 1) {
      return res
        .status(403)
        .json({ error: "Forbidden", message: "Admin privileges required" });
    }

    next();
  } catch (error) {
    return res.status(500).json({ error: "Internal server error" });
  }
};

export type { AuthenticatedRequest };
