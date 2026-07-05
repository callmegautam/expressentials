import { describe, it, expect, vi } from "vitest";
import type { Request, Response } from "express";
import { healthCheck } from "../health-check";

describe("healthCheck", () => {
  it("should return status ok, uptime, and timestamp", () => {
    const handler = healthCheck();
    const req = {} as Request;
    const res = {
      json: vi.fn(),
    } as unknown as Response;
    const next = vi.fn();

    handler(req, res, next);

    expect(res.json).toHaveBeenCalledWith({
      status: "ok",
      uptime: expect.any(Number),
      timestamp: expect.any(String),
    });
  });

  it("should include custom checks", () => {
    const handler = healthCheck({
      checks: () => ({ db: "connected", cache: "healthy" }),
    });
    const req = {} as Request;
    const res = { json: vi.fn() } as unknown as Response;
    const next = vi.fn();

    handler(req, res, next);

    expect(res.json).toHaveBeenCalledWith({
      status: "ok",
      uptime: expect.any(Number),
      timestamp: expect.any(String),
      db: "connected",
      cache: "healthy",
    });
  });

  it("should use custom uptime and timestamp functions", () => {
    const handler = healthCheck({
      uptime: () => 42,
      timestamp: () => "2026-01-01T00:00:00.000Z",
    });
    const req = {} as Request;
    const res = { json: vi.fn() } as unknown as Response;
    const next = vi.fn();

    handler(req, res, next);

    expect(res.json).toHaveBeenCalledWith({
      status: "ok",
      uptime: 42,
      timestamp: "2026-01-01T00:00:00.000Z",
    });
  });
});
