import type { Request, Response, NextFunction } from "express";

export function asyncHandler(
  fn: (req: Request, res: Response, next: NextFunction) => Promise<void>,
) {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      Promise.resolve(fn(req, res, next)).catch(next);
    } catch (err) {
      next(err);
    }
  };
}
