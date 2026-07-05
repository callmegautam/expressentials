import { describe, it, expect, vi } from "vitest";
import type { Request, Response } from "express";
import { requestId } from "../request-id";

function mockReq(headers: Record<string, string> = {}) {
  return {
    get: vi.fn((name: string) => headers[name.toLowerCase()] ?? null),
  } as unknown as Request;
}

function mockRes() {
  const res: Partial<Response> = {};
  res.setHeader = vi.fn();
  return res as Response;
}

describe("requestId", () => {
  it("should generate a UUID and set header and req.requestId", () => {
    const handler = requestId();
    const req = mockReq();
    const res = mockRes();
    const next = vi.fn();

    handler(req, res, next);

    expect(req.requestId).toBeDefined();
    expect(req.requestId).toMatch(
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/,
    );
    expect(res.setHeader).toHaveBeenCalledWith("x-request-id", req.requestId);
    expect(next).toHaveBeenCalledOnce();
  });

  it("should respect existing x-request-id header by default", () => {
    const handler = requestId();
    const req = mockReq({ "x-request-id": "incoming-id" });
    const res = mockRes();
    const next = vi.fn();

    handler(req, res, next);

    expect(req.requestId).toBe("incoming-id");
    expect(res.setHeader).toHaveBeenCalledWith("x-request-id", "incoming-id");
  });

  it("should override existing header when respectExisting is false", () => {
    const handler = requestId({ respectExisting: false });
    const req = mockReq({ "x-request-id": "incoming-id" });
    const res = mockRes();
    const next = vi.fn();

    handler(req, res, next);

    expect(req.requestId).not.toBe("incoming-id");
  });

  it("should use custom header name", () => {
    const handler = requestId({ header: "x-trace-id" });
    const req = mockReq();
    const res = mockRes();
    const next = vi.fn();

    handler(req, res, next);

    expect(res.setHeader).toHaveBeenCalledWith("x-trace-id", req.requestId);
  });

  it("should use custom generator", () => {
    const handler = requestId({ generator: () => "custom-id" });
    const req = mockReq();
    const res = mockRes();
    const next = vi.fn();

    handler(req, res, next);

    expect(req.requestId).toBe("custom-id");
    expect(res.setHeader).toHaveBeenCalledWith("x-request-id", "custom-id");
  });
});
