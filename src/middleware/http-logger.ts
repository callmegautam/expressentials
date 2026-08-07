import type { Request, Response, NextFunction } from "express";
import { Logger } from "../logger/index.js";

export interface HttpLoggerOptions {
  skip?: (req: Request, res: Response) => boolean;
  logger?: Logger;
}

export function httpLogger(options: HttpLoggerOptions = {}) {
  const { skip, logger = new Logger() } = options;

  return (req: Request, res: Response, next: NextFunction): void => {
    if (skip?.(req, res)) {
      next();
      return;
    }

    const start = Date.now();

    res.on("finish", () => {
      const log = req.log ?? logger;

      log.info({
        method: req.method,
        path: req.originalUrl ?? req.url,
        status: res.statusCode,
        durationMs: Date.now() - start,
      });
    });

    next();
  };
}
