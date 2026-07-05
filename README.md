# expresset

Essential Express.js helpers — status codes, errors, logging, validation, and more.

```ts
import { status, NotFound, errorHandler, requestId } from "expresset";

app.use(requestId());
app.use(errorHandler());

app.get("/users/:id", (req, res) => {
  throw new NotFound("User not found");
});
```

## Install

```sh
npm install expresset
```

Requires `express` as a peer dependency.

## Features

| Module | Description |
|--------|-------------|
| [status](./FEATURES.md#status--http-status-code-constants) | HTTP status code constants (`status.ok` → `200`) |
| [message](./FEATURES.md#message--human-readable-status-messages) | Human-readable messages (`message.created` → `"Created successfully"`) |
| [ApiError](./FEATURES.md#apierror--base-error-class) | Base error class with HTTP status codes |
| [Http Errors](./FEATURES.md#predefined-error-classes) | `NotFound`, `BadRequest`, `Forbidden`, etc. |
| [errorHandler](./FEATURES.md#errorhandler--express-error-handling-middleware) | Express error-handling middleware |
| [requestId](./FEATURES.md#requestid--request-id-middleware) | Request ID middleware (UUID, configurable header) |
| [requestContext](./FEATURES.md#requestcontext--request-scoped-logger--asynclocalstorage) | Request-scoped logger + AsyncLocalStorage context |
| [httpLogger](./FEATURES.md#httplogger--http-request-logging-middleware) | Auto-log requests with method, path, status, duration |
| [validate](./FEATURES.md#validate--request-validation-middleware-schema-adapter) | Request validation (Zod/Yup/ArkType adapter) |
| [asyncHandler](./FEATURES.md#asynchandler--async-route-handler-wrapper) | Async route handler wrapper |
| [timeout](./FEATURES.md#timeout--request-timeout-middleware) | Request timeout middleware (504 Gateway Timeout) |
| [healthCheck](./FEATURES.md#healthcheck--health-endpoint-helper) | Health check endpoint |
| [Logger](./FEATURES.md#logger--structured-json-logger) | Structured JSON logger |
| [Context](./FEATURES.md#context--asynclocalstorage-accessors) | AsyncLocalStorage accessors (`getLogger`, `getRequestId`) |

See [FEATURES.md](./FEATURES.md) for full documentation with all options and usage examples.

## Quick start

```ts
import express from "express";
import {
  requestId,
  requestContext,
  httpLogger,
  validate,
  asyncHandler,
  errorHandler,
  NotFound,
} from "expresset";
import { z } from "zod";

const app = express();

app.use(express.json());
app.use(requestId());
app.use(requestContext());
app.use(httpLogger({ skip: (req) => req.url === "/health" }));

const createUserSchema = z.object({
  name: z.string(),
  email: z.string().email(),
});

app.post(
  "/users",
  validate({ body: createUserSchema }),
  asyncHandler(async (req, res) => {
    req.log.info({ email: req.body.email }, "Creating user");
    // ...
    res.status(201).json({ id: "abc" });
  }),
);

app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.use("*", () => {
  throw new NotFound("Route not found");
});

app.use(errorHandler());

app.listen(3000);
```

## Scripts

| Script | Description |
|--------|-------------|
| `npm run build` | Build with tsup (ESM + CJS + types) |
| `npm run dev` | Watch mode |
| `npm test` | Run tests |
| `npm run typecheck` | TypeScript check |
| `npm run format` | Check formatting with Prettier |
| `npm run format:fix` | Fix formatting |

## Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md) for development setup, guidelines, and project structure.

## Code of Conduct

This project follows the [Contributor Covenant](CODE_OF_CONDUCT.md). By participating, you agree to uphold its terms.

## License

[MIT](./LICENSE)
