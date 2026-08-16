export type LogLevel = "debug" | "info" | "warn" | "error";

const levelPriority: Record<LogLevel, number> = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3,
};

export interface LoggerEntry {
  level: LogLevel;
  message?: string;
  [key: string]: unknown;
}

export type LogDestination = (entry: LoggerEntry) => void;

export interface LoggerOptions {
  level?: LogLevel;
  destination?: LogDestination;
}

const defaultDestination: LogDestination = (entry) => {
  console.log(
    JSON.stringify(entry, (_key, value) => (typeof value === "bigint" ? value.toString() : value)),
  );
};

export class Logger {
  private level: LogLevel;
  private destination: LogDestination;
  private bindings: Record<string, unknown>;

  constructor(options: LoggerOptions = {}, bindings: Record<string, unknown> = {}) {
    this.level = options.level ?? "info";
    this.destination = options.destination ?? defaultDestination;
    this.bindings = bindings;
  }

  private shouldLog(level: LogLevel): boolean {
    return levelPriority[level] >= levelPriority[this.level];
  }

  private log(level: LogLevel, ...args: [unknown, ...unknown[]]) {
    if (!this.shouldLog(level)) return;

    let message: string | undefined;
    let meta: Record<string, unknown> = {};

    if (args.length === 1 && typeof args[0] === "object" && args[0] !== null) {
      meta = { ...(args[0] as Record<string, unknown>) };
    } else if (args.length === 1) {
      message = String(args[0]);
    } else if (typeof args[0] === "object" && args[0] !== null) {
      meta = { ...(args[0] as Record<string, unknown>) };
      message = String(args[1]);
    } else {
      message = String(args[0]);
      if (args[1] !== undefined) {
        meta = args[1] as Record<string, unknown>;
      }
    }

    this.destination({
      ...this.bindings,
      ...meta,
      level,
      ...(message ? { message } : {}),
    });
  }

  debug(...args: [unknown, ...unknown[]]) {
    this.log("debug", ...args);
  }

  info(...args: [unknown, ...unknown[]]) {
    this.log("info", ...args);
  }

  warn(...args: [unknown, ...unknown[]]) {
    this.log("warn", ...args);
  }

  error(...args: [unknown, ...unknown[]]) {
    this.log("error", ...args);
  }

  child(bindings: Record<string, unknown>): Logger {
    return new Logger(
      { level: this.level, destination: this.destination },
      { ...this.bindings, ...bindings },
    );
  }
}

export function createLogger(options?: LoggerOptions): Logger {
  return new Logger(options);
}
