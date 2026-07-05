import { ApiError } from "./api-error.js";

export class NotFound extends ApiError {
  constructor(message?: string) {
    super(404, message);
  }
}

export class BadRequest extends ApiError {
  constructor(message?: string) {
    super(400, message);
  }
}

export class Unauthorized extends ApiError {
  constructor(message?: string) {
    super(401, message);
  }
}

export class Forbidden extends ApiError {
  constructor(message?: string) {
    super(403, message);
  }
}

export class Conflict extends ApiError {
  constructor(message?: string) {
    super(409, message);
  }
}

export class InternalServerError extends ApiError {
  constructor(message?: string) {
    super(500, message);
  }
}

export class ServiceUnavailable extends ApiError {
  constructor(message?: string) {
    super(503, message);
  }
}

export class TooManyRequests extends ApiError {
  constructor(message?: string) {
    super(429, message);
  }
}

export class ValidationError extends ApiError {
  constructor(message?: string, details?: unknown) {
    super(422, message ?? "Validation failed", details);
  }
}

export class GatewayTimeout extends ApiError {
  constructor(message?: string) {
    super(504, message);
  }
}
