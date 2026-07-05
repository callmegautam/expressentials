import { describe, it, expect } from "vitest";
import {
  NotFound,
  BadRequest,
  Unauthorized,
  Forbidden,
  Conflict,
  InternalServerError,
  ServiceUnavailable,
  TooManyRequests,
} from "../http-error";
import { ApiError } from "../api-error";

describe("predefined error classes", () => {
  it("NotFound extends ApiError with 404", () => {
    const err = new NotFound("User not found");
    expect(err).toBeInstanceOf(ApiError);
    expect(err).toBeInstanceOf(NotFound);
    expect(err.statusCode).toBe(404);
    expect(err.message).toBe("User not found");
    expect(err.name).toBe("ApiError");
  });

  it("BadRequest extends ApiError with 400", () => {
    const err = new BadRequest();
    expect(err.statusCode).toBe(400);
  });

  it("Unauthorized extends ApiError with 401", () => {
    const err = new Unauthorized();
    expect(err.statusCode).toBe(401);
  });

  it("Forbidden extends ApiError with 403", () => {
    const err = new Forbidden();
    expect(err.statusCode).toBe(403);
  });

  it("Conflict extends ApiError with 409", () => {
    const err = new Conflict();
    expect(err.statusCode).toBe(409);
  });

  it("InternalServerError extends ApiError with 500", () => {
    const err = new InternalServerError();
    expect(err.statusCode).toBe(500);
  });

  it("ServiceUnavailable extends ApiError with 503", () => {
    const err = new ServiceUnavailable();
    expect(err.statusCode).toBe(503);
  });

  it("TooManyRequests extends ApiError with 429", () => {
    const err = new TooManyRequests();
    expect(err.statusCode).toBe(429);
  });
});
