import { describe, it, expect, vi, afterEach } from "vitest";
import type { Request, Response } from "express";
import { EventEmitter } from "node:events";
import { timeout } from "../timeout";
import { GatewayTimeout } from "../../errors/http-error";

function mockReq() {
  return {} as Request;
}

function mockRes(headersSent = false) {
  const res = new EventEmitter() as unknown as Response;
  res.headersSent = headersSent;
  (res as any).setHeader = vi.fn();
  return res;
}

describe("timeout", () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it("should call next with GatewayTimeout after specified ms", async () => {
    vi.useFakeTimers();
    const handler = timeout(100);
    const req = mockReq();
    const res = mockRes();
    const next = vi.fn();

    handler(req, res, next);
    expect(next).toHaveBeenCalledOnce(); // initial call to pass through

    vi.advanceTimersByTime(100);

    expect(next).toHaveBeenCalledTimes(2);
    expect(next).toHaveBeenLastCalledWith(new GatewayTimeout("Request timed out"));
  });

  it("should clear timeout on response finish", async () => {
    vi.useFakeTimers();
    const handler = timeout(100);
    const req = mockReq();
    const res = mockRes();
    const next = vi.fn();

    handler(req, res, next);
    expect(next).toHaveBeenCalledOnce();

    res.emit("finish");
    vi.advanceTimersByTime(100);

    expect(next).toHaveBeenCalledTimes(1); // no additional call
  });

  it("should clear timeout on response close", async () => {
    vi.useFakeTimers();
    const handler = timeout(100);
    const req = mockReq();
    const res = mockRes();
    const next = vi.fn();

    handler(req, res, next);
    expect(next).toHaveBeenCalledOnce();

    res.emit("close");
    vi.advanceTimersByTime(100);

    expect(next).toHaveBeenCalledTimes(1);
  });

  it("should not call next with GatewayTimeout after headers are sent", async () => {
    vi.useFakeTimers();
    const handler = timeout(100);
    const req = mockReq();
    const res = mockRes(true);
    const next = vi.fn();

    handler(req, res, next);
    vi.advanceTimersByTime(100);

    expect(next).toHaveBeenCalledTimes(1);
  });

  it("should use custom message", async () => {
    vi.useFakeTimers();
    const handler = timeout(100, { message: "Custom timeout" });
    const req = mockReq();
    const res = mockRes();
    const next = vi.fn();

    handler(req, res, next);
    vi.advanceTimersByTime(100);

    expect(next).toHaveBeenLastCalledWith(new GatewayTimeout("Custom timeout"));
  });
});
