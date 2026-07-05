import { describe, it, expect } from "vitest";
import { status } from "../index";

describe("status", () => {
  it("should return 200 for status.ok", () => {
    expect(status.ok).toBe(200);
  });

  it("should return 404 for status.notFound", () => {
    expect(status.notFound).toBe(404);
  });

  it("should return 500 for status.internalServerError", () => {
    expect(status.internalServerError).toBe(500);
  });

  it("should return 418 for status.imATeapot", () => {
    expect(status.imATeapot).toBe(418);
  });
});
