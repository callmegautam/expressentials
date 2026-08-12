import type { Request, Response, NextFunction } from "express";
import { ValidationError } from "../errors/http-error.js";

export interface Schema {
  parse: (data: unknown) => unknown;
}

export interface ValidationSchemas {
  body?: Schema;
  params?: Schema;
  query?: Schema;
}

export interface ValidationIssue {
  path: (string | number)[];
  message: string;
  code?: string;
}

export type IssueFormatter = (error: unknown) => ValidationIssue[];

function defaultFormatter(error: unknown): ValidationIssue[] {
  if (
    error &&
    typeof error === "object" &&
    "issues" in error &&
    Array.isArray((error as { issues: unknown }).issues)
  ) {
    return (error as { issues: ValidationIssue[] }).issues;
  }

  if (error instanceof Error) {
    return [{ path: [], message: error.message }];
  }

  return [{ path: [], message: String(error) }];
}

export interface ValidateOptions {
  formatError?: IssueFormatter;
}

export function validate(schemas: ValidationSchemas, options: ValidateOptions = {}) {
  const formatError = options.formatError ?? defaultFormatter;

  return (req: Request, _res: Response, next: NextFunction): void => {
    try {
      if (schemas.body) req.body = schemas.body.parse(req.body);
      if (schemas.params) req.params = schemas.params.parse(req.params) as typeof req.params;
      if (schemas.query) {
        const parsedQuery = schemas.query.parse(req.query) as typeof req.query;
        Object.defineProperty(req, "query", {
          value: parsedQuery,
          configurable: true,
          enumerable: true,
          writable: true,
        });
      }
      next();
    } catch (err) {
      next(new ValidationError("Validation failed", formatError(err)));
    }
  };
}
