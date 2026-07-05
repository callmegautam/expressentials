import { describe, it, expect, vi } from "vitest";
import type { Request, Response } from "express";
import { requestContext } from "../request-context";
import { Logger } from "../../logger";
import { getLogger, getRequestId } from "../../context";

function mockReq(requestId = "test-id") {
  return { requestId } as Request;
}

function mockRes() {
  return {} as Response;
}

describe("requestContext", () => {
  it("should attach log to req", () => {
    const handler = requestContext();
    const req = mockReq();
    const res = mockRes();
    const next = vi.fn();

    handler(req, res, next);

    expect(req.log).toBeDefined();
    expect(typeof req.log.info).toBe("function");
    expect(next).toHaveBeenCalledOnce();
  });

  it("should bind requestId to the scoped logger", () => {
    const dest = vi.fn();
    const log = new Logger({ destination: dest });
    const handler = requestContext({ logger: log });
    const req = mockReq("abc-123");
    const res = mockRes();
    const next = vi.fn();

    handler(req, res, next);
    req.log.info("test");

    expect(dest).toHaveBeenCalledWith(
      expect.objectContaining({ requestId: "abc-123", message: "test" }),
    );
  });

  it("should set up AsyncLocalStorage context", () => {
    const handler = requestContext();
    const req = mockReq("ctx-id");
    const res = mockRes();
    const next = vi.fn();

    handler(req, res, () => {
      expect(getLogger()).toBe(req.log);
      expect(getRequestId()).toBe("ctx-id");
      next();
    });
  });
});
