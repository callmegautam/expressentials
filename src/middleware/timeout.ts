import type { Request, Response, NextFunction } from "express";
import { GatewayTimeout } from "../errors/http-error.js";

export interface TimeoutOptions {
  message?: string;
}

export function timeout(ms: number, options: TimeoutOptions = {}) {
  return (req: Request, _res: Response, next: NextFunction): void => {
    let completed = false;

    const done = () => {
      completed = true;
      clearTimeout(timer);
    };

    const timer = setTimeout(() => {
      if (completed || _res.headersSent) return;
      next(new GatewayTimeout(options.message ?? "Request timed out"));
    }, ms);

    _res.once("finish", done);
    _res.once("close", done);

    next();
  };
}
