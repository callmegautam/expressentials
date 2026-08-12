import { describe, it, expect, vi } from "vitest";
import type { Request, Response } from "express";
import { errorHandler } from "../error-handler";
import { ApiError } from "../../errors/api-error";
import { message } from "../../message";

function mockRes() {
  const res: Partial<Response> = {};
  res.status = vi.fn().mockReturnValue(res);
  res.json = vi.fn().mockReturnValue(res);
  return res as Response;
}

describe("errorHandler", () => {
  it("should respond with ApiError status and message", () => {
    const handler = errorHandler({ log: false });
    const err = new ApiError(400, "Bad stuff");
    const req = {} as Request;
    const res = mockRes();
    const next = vi.fn();

    handler(err, req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      error: { message: "Bad stuff", statusCode: 400 },
    });
  });

  it("should include details when present", () => {
    const handler = errorHandler({ log: false });
    const err = new ApiError(422, "Invalid", { field: "email" });
    const req = {} as Request;
    const res = mockRes();
    const next = vi.fn();

    handler(err, req, res, next);

    expect(res.json).toHaveBeenCalledWith({
      error: { message: "Invalid", statusCode: 422, details: { field: "email" } },
    });
  });

  it("should return 500 for non-ApiError", () => {
    const handler = errorHandler({ log: false });
    const req = {} as Request;
    const res = mockRes();
    const next = vi.fn();

    handler(new Error("boom"), req, res, next);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      error: { message: message.internalServerError, statusCode: 500 },
    });
  });

  it("should log non-ApiError by default", () => {
    const spy = vi.spyOn(console, "error").mockImplementation(() => {});
    const handler = errorHandler();
    const req = {} as Request;
    const res = mockRes();
    const next = vi.fn();

    handler(new Error("boom"), req, res, next);

    expect(spy).toHaveBeenCalled();
    spy.mockRestore();
  });
});

  it("should delegate to Express when headers have already been sent", () => {
    const req = {} as Request;
    const next = vi.fn();
    const res = {
      headersSent: true,
      status: vi.fn(),
      json: vi.fn(),
    } as unknown as Response;

    const handler = errorHandler();
    const error = new Error("Something broke");

    handler(error, req, res, next);

    expect(next).toHaveBeenCalledWith(error);
    expect(res.status).not.toHaveBeenCalled();
    expect(res.json).not.toHaveBeenCalled();
  });
