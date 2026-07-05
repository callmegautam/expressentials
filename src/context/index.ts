import { AsyncLocalStorage } from "node:async_hooks";
import type { Logger } from "../logger/index.js";

export interface RequestContext {
  requestId: string;
  log: Logger;
}

const storage = new AsyncLocalStorage<RequestContext>();

export function getRequestContext(): RequestContext | undefined {
  return storage.getStore();
}

export function getLogger(): Logger | undefined {
  return storage.getStore()?.log;
}

export function getRequestId(): string | undefined {
  return storage.getStore()?.requestId;
}

export function runWithContext(context: RequestContext, fn: () => void): void {
  storage.run(context, fn);
}

export { storage };
