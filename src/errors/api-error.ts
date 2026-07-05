import { status } from "../status/index.js";
import { message } from "../message/index.js";

export class ApiError extends Error {
  constructor(
    public readonly statusCode: number,
    message?: string,
    public readonly details?: unknown,
  ) {
    super((message ??= getDefaultMessage(statusCode)));
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
  const entry = Object.entries(status).find(([, v]) => v === code);
  if (!entry) return "Error";
  return message[entry[0] as keyof typeof message];
}
