import type { Request, Response, NextFunction } from "express";
import { GatewayTimeout } from "../errors/http-error.js";

export interface TimeoutOptions {
  message?: string;
}

export function timeout(ms: number, options: TimeoutOptions = {}) {
  return (req: Request, _res: Response, next: NextFunction): void => {
    const timer = setTimeout(() => {
      next(new GatewayTimeout(options.message ?? "Request timed out"));
    }, ms);

    const done = () => clearTimeout(timer);

    _res.on("finish", done);
    _res.on("close", done);

    next();
  };
}
