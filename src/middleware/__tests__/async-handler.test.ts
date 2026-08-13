import { describe, it, expect, vi } from "vitest";
import type { Request, Response } from "express";
import { asyncHandler } from "../async-handler";

describe("asyncHandler", () => {
  it("should call next with error when handler rejects", async () => {
    const error = new Error("async error");
    const handler = asyncHandler(async () => {
      throw error;
    });

    const req = {} as Request;
    const res = {} as Response;
    const next = vi.fn();

    handler(req, res, next);

    // Give the promise microtask a chance to settle
    await vi.waitFor(() => {
      expect(next).toHaveBeenCalledWith(error);
    });
  });

  it("should call next when handler throws synchronously", () => {
    const error = new Error("sync error");
    const handler = asyncHandler(() => {
      throw error;
    });

    const req = {} as Request;
    const res = {} as Response;
    const next = vi.fn();

    handler(req, res, next);

    expect(next).toHaveBeenCalledWith(error);
  });

  it("should call next without error on success", async () => {
    const handler = asyncHandler(async (_req, res) => {
      res.json({ ok: true });
    });

    const req = {} as Request;
    const res = { json: vi.fn() } as unknown as Response;
    const next = vi.fn();

    handler(req, res, next);

    await vi.waitFor(() => {
      expect(res.json).toHaveBeenCalledWith({ ok: true });
      expect(next).not.toHaveBeenCalled();
    });
  });
});
