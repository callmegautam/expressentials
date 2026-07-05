import { describe, it, expect, vi } from "vitest";
import type { Request, Response } from "express";
import { errorHandler } from "../error-handler";
import { ApiError } from "../../errors/api-error";

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
      error: { message: "Internal Server Error", statusCode: 500 },
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
