import { describe, it, expect, vi } from "vitest";
import type { Request, Response } from "express";
import { validate } from "../validate";
import { ValidationError } from "../../errors/http-error";

function mockReq(body?: unknown, params?: unknown, query?: unknown) {
  return { body, params, query } as Request;
}

function mockRes() {
  return {} as Response;
}

describe("validate", () => {
  it("should parse body and call next on success", () => {
    const schema = { parse: vi.fn((d: unknown) => ({ name: String(d) })) };
    const handler = validate({ body: schema });
    const req = mockReq("Gautam");
    const res = mockRes();
    const next = vi.fn();

    handler(req, res, next);

    expect(schema.parse).toHaveBeenCalledWith("Gautam");
    expect(req.body).toEqual({ name: "Gautam" });
    expect(next).toHaveBeenCalledWith();
  });

  it("should parse params and query", () => {
    const bodySchema = { parse: vi.fn((d: unknown) => d) };
    const paramsSchema = { parse: vi.fn((d: unknown) => d) };
    const querySchema = { parse: vi.fn((d: unknown) => d) };

    const handler = validate({ body: bodySchema, params: paramsSchema, query: querySchema });
    const req = mockReq({}, { id: "1" }, { page: "2" });
    const res = mockRes();
    const next = vi.fn();

    handler(req, res, next);

    expect(bodySchema.parse).toHaveBeenCalled();
    expect(paramsSchema.parse).toHaveBeenCalledWith({ id: "1" });
    expect(querySchema.parse).toHaveBeenCalledWith({ page: "2" });
    expect(next).toHaveBeenCalledWith();
  });

  it("should throw ValidationError on parse failure with Zod-style issues", () => {
    const schema = {
      parse: () => {
        throw { issues: [{ path: ["email"], message: "Invalid email", code: "invalid_string" }] };
      },
    };
    const handler = validate({ body: schema });
    const req = mockReq({ email: "bad" });
    const res = mockRes();
    const next = vi.fn();

    handler(req, res, next);

    expect(next).toHaveBeenCalledWith(
      new ValidationError("Validation failed", [
        { path: ["email"], message: "Invalid email", code: "invalid_string" },
      ]),
    );
  });

  it("should throw ValidationError with generic error message", () => {
    const schema = {
      parse: () => {
        throw new Error("Something went wrong");
      },
    };
    const handler = validate({ body: schema });
    const req = mockReq({});
    const res = mockRes();
    const next = vi.fn();

    handler(req, res, next);

    expect(next).toHaveBeenCalledWith(
      new ValidationError("Validation failed", [{ path: [], message: "Something went wrong" }]),
    );
  });

  it("should use custom issue formatter", () => {
    const schema = {
      parse: () => {
        throw new Error("custom err");
      },
    };
    const formatError = () => [{ path: ["root"], message: "Formatted" }];
    const handler = validate({ body: schema }, { formatError });
    const req = mockReq({});
    const res = mockRes();
    const next = vi.fn();

    handler(req, res, next);

    expect(next).toHaveBeenCalledWith(
      new ValidationError("Validation failed", [{ path: ["root"], message: "Formatted" }]),
    );
  });

  it("should skip schemas that are not provided", () => {
    const handler = validate({});
    const req = mockReq({ data: 1 });
    const res = mockRes();
    const next = vi.fn();

    handler(req, res, next);

    expect(req.body).toEqual({ data: 1 });
    expect(next).toHaveBeenCalledWith();
  });

  it("should validate and replace query with the parsed result", () => {
    const schema = {
      parse: vi.fn((data: unknown) => ({
        ...(data as Record<string, unknown>),
        page: Number((data as Record<string, unknown>).page),
      })),
    };

    const handler = validate({ query: schema });

    const req = {
      get query() {
        return { page: "2" };
      },
    } as unknown as Request;

    const res = mockRes();
    const next = vi.fn();

    handler(req, res, next);

    expect(schema.parse).toHaveBeenCalledWith({ page: "2" });
    expect(req.query).toEqual({ page: 2 });
    expect((req.query as any).page).toBe(2);
    expect(next).toHaveBeenCalledWith();
  });

});
