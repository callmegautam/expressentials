import type { Request, Response, NextFunction } from "express";
import { ApiError } from "../errors/api-error.js";
import { message } from "../message/index.js";

export interface ErrorHandlerOptions {
  log?: boolean;
}

export function errorHandler(options: ErrorHandlerOptions = {}) {
  const log = options.log ?? true;

  return (err: unknown, _req: Request, res: Response, next: NextFunction): void => {
    if (res.headersSent) {
      next(err);
      return;
    }

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
        message: message.internalServerError,
        statusCode: 500,
      },
    });
  };
}
