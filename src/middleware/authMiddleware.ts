import { Request, Response, NextFunction } from "express";
import * as jwt from "jsonwebtoken";

interface AuthRequest extends Request {
  userId?: string;
}

export const authMiddleware = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({
        message: "No token provided"
      });
    }

    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(token, "secretkey");

    req.userId = (decoded as any).userId;

    next();

  } catch (error) {
    return res.status(401).json({
      message: "Invalid token"
    });
  }
};