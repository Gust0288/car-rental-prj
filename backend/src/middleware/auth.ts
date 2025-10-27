import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

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
      message: "No authentication token provided" 
    });
  }

  jwt.verify(token, process.env.JWT_SECRET || "fallback_secret", (err, decoded) => {
    if (err) {
      return res.status(403).json({ 
        error: "Invalid token",
        message: "Token is invalid or expired" 
      });
    }

    const payload = decoded as { userId: number; email: string };
    req.userId = payload.userId;
    req.userEmail = payload.email;
    
    next();
  });
};

export type { AuthenticatedRequest };