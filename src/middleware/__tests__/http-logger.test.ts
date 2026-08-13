import { describe, it, expect, vi } from "vitest";
import type { Request, Response } from "express";
import { EventEmitter } from "node:events";
import { httpLogger } from "../http-logger";
import { Logger } from "../../logger";

function mockReq(url = "/api/users", withLogger = true) {
  const req = {
    method: "GET",
    originalUrl: url,
    url,
  } as unknown as Request;

  if (withLogger) {
    req.log = {
      info: vi.fn(),
      error: vi.fn(),
      warn: vi.fn(),
      debug: vi.fn(),
      child: vi.fn(),
    } as unknown as Logger;
  }

  return req;
}

function mockRes() {
  const res = new EventEmitter() as unknown as Response;
  res.statusCode = 200;
  (res as any).setHeader = vi.fn();
  return res as Response;
}

describe("httpLogger", () => {
  it("should log on response finish", () => {
    const handler = httpLogger();
    const req = mockReq();
    const res = mockRes();
    const next = vi.fn();

    handler(req, res, next);
    expect(next).toHaveBeenCalledOnce();

    res.emit("finish");

    expect(req.log.info).toHaveBeenCalledWith({
      method: "GET",
      path: "/api/users",
      status: 200,
      durationMs: expect.any(Number),
    });
  });

  it("should skip logging when skip function returns true", () => {
    const handler = httpLogger({ skip: () => true });
    const req = mockReq("/health");
    const res = mockRes();
    const next = vi.fn();

    handler(req, res, next);

    res.emit("finish");
    expect(req.log.info).not.toHaveBeenCalled();
  });

  it("should fall back to the configured logger when req.log is missing", () => {
    const destination = vi.fn();
    const logger = new Logger({ destination });
    const handler = httpLogger({ logger });
    const req = mockReq("/api/users", false);
    const res = mockRes();
    const next = vi.fn();

    handler(req, res, next);
    res.emit("finish");

    expect(destination).toHaveBeenCalledWith({
      level: "info",
      method: "GET",
      path: "/api/users",
      status: 200,
      durationMs: expect.any(Number),
    });
  });

  it("should log when response closes without finishing", () => {
    const handler = httpLogger();
    const req = mockReq();
    const res = mockRes();
    const next = vi.fn();

    handler(req, res, next);
    res.emit("close");

    expect(req.log.info).toHaveBeenCalledWith({
      method: "GET",
      path: "/api/users",
      status: 200,
      durationMs: expect.any(Number),
    });
  });
});
