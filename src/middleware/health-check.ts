import type { Request, Response, NextFunction } from "express";

export interface HealthCheckOptions {
  uptime?: () => number;
  timestamp?: () => string;
  checks?: () => Record<string, unknown>;
}

export function healthCheck(options: HealthCheckOptions = {}) {
  const getUptime = options.uptime ?? (() => process.uptime());
  const getTimestamp = options.timestamp ?? (() => new Date().toISOString());

  return (_req: Request, res: Response, _next: NextFunction): void => {
    res.json({
      ...(options.checks?.() ?? {}),
      status: "ok",
      uptime: getUptime(),
      timestamp: getTimestamp(),
    });
  };
}
