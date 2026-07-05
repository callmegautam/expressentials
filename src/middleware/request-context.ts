import type { Request, Response, NextFunction } from "express";
import { Logger } from "../logger/index.js";
import { runWithContext } from "../context/index.js";

declare global {
  namespace Express {
    interface Request {
      log: Logger;
    }
  }
}

export interface RequestContextOptions {
  logger?: Logger;
}

export function requestContext(options: RequestContextOptions = {}) {
  const logger = options.logger ?? new Logger();

  return (req: Request, _res: Response, next: NextFunction): void => {
    const scoped = logger.child({ requestId: req.requestId });
    req.log = scoped;

    runWithContext({ requestId: req.requestId, log: scoped }, () => {
      next();
    });
  };
}
