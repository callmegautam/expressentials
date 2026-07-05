import { status } from "../status/index.js";

export class ApiError extends Error {
  constructor(
    public readonly statusCode: number,
    message?: string,
    public readonly details?: unknown,
  ) {
    super(message ??= getDefaultMessage(statusCode));
    this.name = "ApiError";
  }

  static notFound(message?: string) {
    return new ApiError(status.notFound, message);
  }

  static badRequest(message?: string) {
    return new ApiError(status.badRequest, message);
  }

  static unauthorized(message?: string) {
    return new ApiError(status.unauthorized, message);
  }

  static forbidden(message?: string) {
    return new ApiError(status.forbidden, message);
  }

  static conflict(message?: string) {
    return new ApiError(status.conflict, message);
  }

  static internalServerError(message?: string) {
    return new ApiError(status.internalServerError, message);
  }

  static serviceUnavailable(message?: string) {
    return new ApiError(status.serviceUnavailable, message);
  }

  static tooManyRequests(message?: string) {
    return new ApiError(status.tooManyRequests, message);
  }
}

function getDefaultMessage(code: number): string {
  const map: Record<number, string> = {
    [status.badRequest]: "Bad Request",
    [status.unauthorized]: "Unauthorized",
    [status.forbidden]: "Forbidden",
    [status.notFound]: "Not Found",
    [status.conflict]: "Conflict",
    [status.tooManyRequests]: "Too Many Requests",
    [status.internalServerError]: "Internal Server Error",
    [status.serviceUnavailable]: "Service Unavailable",
  };
  return map[code] ?? "Error";
}
