import type { Request, Response, NextFunction } from "express";
import { ApiError } from "../errors/api-error.js";

export interface ErrorHandlerOptions {
  log?: boolean;
}

export function errorHandler(options: ErrorHandlerOptions = {}) {
  const log = options.log ?? true;

  return (err: unknown, _req: Request, res: Response, _next: NextFunction): void => {
    if (err instanceof ApiError) {
      res.status(err.statusCode).json({
        error: {
          message: err.message,
          statusCode: err.statusCode,
          ...(err.details !== undefined && { details: err.details }),
        },
      });
      return;
    }

    if (log) {
      console.error(err);
    }

    res.status(500).json({
      error: {
        message: "Internal Server Error",
        statusCode: 500,
      },
    });
  };
}
