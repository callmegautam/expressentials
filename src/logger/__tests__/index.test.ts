import { describe, it, expect, vi } from "vitest";
import { Logger } from "../index";

describe("Logger", () => {
  it("should log a string message", () => {
    const dest = vi.fn();
    const log = new Logger({ destination: dest });

    log.info("hello");

    expect(dest).toHaveBeenCalledWith(expect.objectContaining({ level: "info", message: "hello" }));
  });

  it("should log with meta object as first arg", () => {
    const dest = vi.fn();
    const log = new Logger({ destination: dest });

    log.error({ error: new Error("boom") }, "Failed");

    expect(dest).toHaveBeenCalledWith(
      expect.objectContaining({
        level: "error",
        message: "Failed",
        error: expect.any(Error),
      }),
    );
  });

  it("should include bindings in every entry", () => {
    const dest = vi.fn();
    const log = new Logger({ destination: dest }, { requestId: "abc" });

    log.info("test");

    expect(dest).toHaveBeenCalledWith(
      expect.objectContaining({ requestId: "abc", message: "test" }),
    );
  });

  it("should respect log level", () => {
    const dest = vi.fn();
    const log = new Logger({ level: "warn", destination: dest });

    log.debug("debug");
    log.info("info");
    log.warn("warn");
    log.error("error");

    expect(dest).toHaveBeenCalledTimes(2);
    expect(dest).toHaveBeenCalledWith(expect.objectContaining({ level: "warn" }));
    expect(dest).toHaveBeenCalledWith(expect.objectContaining({ level: "error" }));
  });

  it("child should inherit and merge bindings", () => {
    const dest = vi.fn();
    const parent = new Logger({ destination: dest }, { app: "myapp" });
    const child = parent.child({ requestId: "xyz" });

    child.info("child log");

    expect(dest).toHaveBeenCalledWith(
      expect.objectContaining({ app: "myapp", requestId: "xyz", message: "child log" }),
    );
  });

  it("should output JSON string by default", () => {
    const spy = vi.spyOn(console, "log").mockImplementation(() => {});
    const log = new Logger();

    log.info("json output");

    expect(spy).toHaveBeenCalledWith(JSON.stringify({ level: "info", message: "json output" }));
    spy.mockRestore();
  });
});
