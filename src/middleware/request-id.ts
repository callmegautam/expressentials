import type { Request, Response, NextFunction } from "express";
import crypto from "node:crypto";

declare global {
  namespace Express {
    interface Request {
      requestId: string;
    }
  }
}

export interface RequestIdOptions {
  header?: string;
  generator?: () => string;
  respectExisting?: boolean;
}

export function requestId(options: RequestIdOptions = {}) {
  const {
    header = "x-request-id",
    generator = crypto.randomUUID,
    respectExisting = true,
  } = options;

  return (req: Request, res: Response, next: NextFunction): void => {
    const existing = req.get(header);
    const id = existing && respectExisting ? existing : generator();

    req.requestId = id;
    res.setHeader(header, id);
    next();
  };
}
