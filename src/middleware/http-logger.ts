import type { Request, Response, NextFunction } from "express";

export interface HttpLoggerOptions {
  skip?: (req: Request, res: Response) => boolean;
}

export function httpLogger(options: HttpLoggerOptions = {}) {
  const { skip } = options;

  return (req: Request, res: Response, next: NextFunction): void => {
    if (skip?.(req, res)) {
      next();
      return;
    }

    const start = Date.now();

    res.on("finish", () => {
      req.log.info({
        method: req.method,
        path: req.originalUrl ?? req.url,
        status: res.statusCode,
        durationMs: Date.now() - start,
      });
    });

    next();
  };
}
