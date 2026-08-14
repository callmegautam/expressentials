import type { Request, Response, NextFunction } from "express";
import { GatewayTimeout } from "../errors/http-error.js";

export interface TimeoutOptions {
  message?: string;
}

export function timeout(ms: number, options: TimeoutOptions = {}) {
  return (req: Request, res: Response, next: NextFunction): void => {
    const timer = setTimeout(() => {
      if (!res.headersSent) {
        next(new GatewayTimeout(options.message ?? "Request timed out"));
      }
    }, ms);

    const done = () => clearTimeout(timer);

    res.on("finish", done);
    res.on("close", done);

    next();
  };
}
