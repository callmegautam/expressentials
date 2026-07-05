import { describe, it, expect } from "vitest";
import { Logger } from "../../logger";
import { getRequestContext, getLogger, getRequestId, runWithContext } from "../index";

describe("request context", () => {
  it("should provide context within runWithContext", () => {
    const log = new Logger();
    const context = { requestId: "abc", log };

    runWithContext(context, () => {
      expect(getRequestContext()).toBe(context);
      expect(getLogger()).toBe(log);
      expect(getRequestId()).toBe("abc");
    });
  });

  it("should return undefined outside runWithContext", () => {
    expect(getRequestContext()).toBeUndefined();
    expect(getLogger()).toBeUndefined();
    expect(getRequestId()).toBeUndefined();
  });

  it("should isolate contexts across concurrent runs", async () => {
    const log1 = new Logger();
    const log2 = new Logger();

    const results: Array<string | undefined> = [];

    await Promise.all([
      new Promise<void>((resolve) => {
        runWithContext({ requestId: "one", log: log1 }, () => {
          setTimeout(() => {
            results.push(getRequestId());
            resolve();
          }, 10);
        });
      }),
      new Promise<void>((resolve) => {
        runWithContext({ requestId: "two", log: log2 }, () => {
          setTimeout(() => {
            results.push(getRequestId());
            resolve();
          }, 10);
        });
      }),
    ]);

    expect(results).toContain("one");
    expect(results).toContain("two");
  });
});
