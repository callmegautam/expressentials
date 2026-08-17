import { ApiError } from "./api-error.js";
import { status } from "../status/index.js";

export class NotFound extends ApiError {
  constructor(message?: string) {
    super(status.notFound, message);
  }
}

export class BadRequest extends ApiError {
  constructor(message?: string) {
    super(status.badRequest, message);
  }
}

export class Unauthorized extends ApiError {
  constructor(message?: string) {
    super(status.unauthorized, message);
  }
}

export class Forbidden extends ApiError {
  constructor(message?: string) {
    super(status.forbidden, message);
  }
}

export class Conflict extends ApiError {
  constructor(message?: string) {
    super(status.conflict, message);
  }
}

export class InternalServerError extends ApiError {
  constructor(message?: string) {
    super(status.internalServerError, message);
  }
}

export class ServiceUnavailable extends ApiError {
  constructor(message?: string) {
    super(status.serviceUnavailable, message);
  }
}

export class TooManyRequests extends ApiError {
  constructor(message?: string) {
    super(status.tooManyRequests, message);
  }
}

export class ValidationError extends ApiError {
  constructor(message?: string, details?: unknown) {
    super(status.unprocessableEntity, message ?? "Validation failed", details);
  }
}

export class GatewayTimeout extends ApiError {
  constructor(message?: string) {
    super(status.gatewayTimeout, message);
  }
}
