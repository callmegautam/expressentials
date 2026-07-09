import { describe, it, expect } from "vitest";
import { parseQuery } from "../index";

describe("parseQuery", () => {
  describe("sort", () => {
    it("parses asc sort", () => {
      const result = parseQuery({ sort: "name" });
      expect(result.sort).toEqual([{ field: "name", order: "asc" }]);
    });

    it("parses desc sort with leading minus", () => {
      const result = parseQuery({ sort: "-created_at" });
      expect(result.sort).toEqual([{ field: "created_at", order: "desc" }]);
    });

    it("parses multi-field sort", () => {
      const result = parseQuery({ sort: "-created_at,name" });
      expect(result.sort).toEqual([
        { field: "created_at", order: "desc" },
        { field: "name", order: "asc" },
      ]);
    });

    it("trims whitespace around entries", () => {
      const result = parseQuery({ sort: "  name , -created_at  " });
      expect(result.sort).toEqual([
        { field: "name", order: "asc" },
        { field: "created_at", order: "desc" },
      ]);
    });

    it("skips entries with just a minus sign", () => {
      const result = parseQuery({ sort: "name,-" });
      expect(result.sort).toEqual([{ field: "name", order: "asc" }]);
    });

    it("returns undefined when sort is missing", () => {
      const result = parseQuery({});
      expect(result.sort).toBeUndefined();
    });

    it("returns undefined when sort is empty string", () => {
      const result = parseQuery({ sort: "" });
      expect(result.sort).toBeUndefined();
    });

    it("returns undefined when sort is not a string", () => {
      const result = parseQuery({ sort: ["name"] });
      expect(result.sort).toBeUndefined();
    });
  });

  describe("filter", () => {
    it("parses flat filter object", () => {
      const result = parseQuery({ filter: { status: "active" } });
      expect(result.filter).toEqual({ status: "active" });
    });

    it("parses multiple filter keys", () => {
      const result = parseQuery({ filter: { status: "active", role: "admin" } });
      expect(result.filter).toEqual({ status: "active", role: "admin" });
    });

    it("returns undefined when filter is missing", () => {
      const result = parseQuery({});
      expect(result.filter).toBeUndefined();
    });

    it("returns undefined when filter is not an object", () => {
      const result = parseQuery({ filter: "active" });
      expect(result.filter).toBeUndefined();
    });

    it("passes through nested filter objects (Express qs format)", () => {
      const result = parseQuery({ filter: { user: { name: "alice" } } });
      expect(result.filter).toEqual({ user: { name: "alice" } });
    });

    it("passes through array filter values", () => {
      const result = parseQuery({ filter: { role: ["admin", "editor"] } });
      expect(result.filter).toEqual({ role: ["admin", "editor"] });
    });
  });

  describe("pagination", () => {
    it("returns defaults when page and limit are missing", () => {
      const result = parseQuery({});
      expect(result.pagination).toEqual({ page: 1, limit: 20 });
    });

    it("parses page and limit", () => {
      const result = parseQuery({ page: "2", limit: "10" });
      expect(result.pagination).toEqual({ page: 2, limit: 10 });
    });

    it("uses custom default limit", () => {
      const result = parseQuery({}, { defaultLimit: 50 });
      expect(result.pagination).toEqual({ page: 1, limit: 50 });
    });

    it("clamps limit to maxLimit", () => {
      const result = parseQuery({ limit: "500" }, { maxLimit: 100 });
      expect(result.pagination).toEqual({ page: 1, limit: 100 });
    });

    it("clamps page to minimum of 1", () => {
      const result = parseQuery({ page: "0" });
      expect(result.pagination).toEqual({ page: 1, limit: 20 });
    });

    it("clamps negative page to 1", () => {
      const result = parseQuery({ page: "-5" });
      expect(result.pagination).toEqual({ page: 1, limit: 20 });
    });

    it("handles non-numeric page string", () => {
      const result = parseQuery({ page: "abc" });
      expect(result.pagination).toEqual({ page: 1, limit: 20 });
    });

    it("handles non-numeric limit string", () => {
      const result = parseQuery({ limit: "abc" });
      expect(result.pagination).toEqual({ page: 1, limit: 20 });
    });

    it("clamps limit to 1 minimum", () => {
      const result = parseQuery({ limit: "0" });
      expect(result.pagination).toEqual({ page: 1, limit: 1 });
    });
  });

  describe("empty / edge cases", () => {
    it("returns defaults for empty query", () => {
      const result = parseQuery({});
      expect(result.sort).toBeUndefined();
      expect(result.filter).toBeUndefined();
      expect(result.pagination).toEqual({ page: 1, limit: 20 });
    });

    it("handles null query values", () => {
      const result = parseQuery({ sort: null, filter: null, page: null, limit: null });
      expect(result.sort).toBeUndefined();
      expect(result.filter).toBeUndefined();
      expect(result.pagination).toEqual({ page: 1, limit: 20 });
    });
  });
});
