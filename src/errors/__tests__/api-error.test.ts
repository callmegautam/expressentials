import { describe, it, expect } from "vitest";
import { ApiError } from "../api-error";

describe("ApiError", () => {
  it("should set statusCode and message", () => {
    const err = new ApiError(404, "Not Found");
    expect(err.statusCode).toBe(404);
    expect(err.message).toBe("Not Found");
    expect(err.name).toBe("ApiError");
  });

  it("should default message based on status code", () => {
    const err = new ApiError(404);
    expect(err.message).toBe("Not Found");
  });

  it("should store optional details", () => {
    const err = new ApiError(400, "Invalid", { field: "email" });
    expect(err.details).toEqual({ field: "email" });
  });

  it("ApiError.notFound() should create 404 error", () => {
    const err = ApiError.notFound("User missing");
    expect(err).toBeInstanceOf(ApiError);
    expect(err.statusCode).toBe(404);
    expect(err.message).toBe("User missing");
  });

  it("ApiError.badRequest() should create 400 error", () => {
    const err = ApiError.badRequest();
    expect(err.statusCode).toBe(400);
  });

  it("ApiError.unauthorized() should create 401 error", () => {
    const err = ApiError.unauthorized();
    expect(err.statusCode).toBe(401);
  });

  it("ApiError.forbidden() should create 403 error", () => {
    const err = ApiError.forbidden();
    expect(err.statusCode).toBe(403);
  });

  it("ApiError.conflict() should create 409 error", () => {
    const err = ApiError.conflict();
    expect(err.statusCode).toBe(409);
  });

  it("ApiError.internalServerError() should create 500 error", () => {
    const err = ApiError.internalServerError();
    expect(err.statusCode).toBe(500);
  });

  it("ApiError.serviceUnavailable() should create 503 error", () => {
    const err = ApiError.serviceUnavailable();
    expect(err.statusCode).toBe(503);
  });

  it("ApiError.tooManyRequests() should create 429 error", () => {
    const err = ApiError.tooManyRequests();
    expect(err.statusCode).toBe(429);
  });
});
