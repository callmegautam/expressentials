# expressentials

Essential Express.js helpers — status codes, errors, logging, validation, and more.

```ts
import { status, NotFound, errorHandler, requestId } from "expressentials";

app.use(requestId());
app.use(errorHandler());

app.get("/users/:id", (req, res) => {
  throw new NotFound("User not found");
});
```

## Install

```sh
npm install expressentials
```

Requires `express` as a peer dependency.

## Features

### status — HTTP status code constants

```ts
import { status } from "expressentials";

status.ok            // 200
status.notFound      // 404
status.internalServerError // 500
// ... all standard HTTP codes
```

### message — Human-readable status messages

```ts
import { message } from "expressentials";

message.created      // "Created successfully"
message.notFound     // "Resource not found"
message.tooManyRequests // "Too many requests, please slow down"
```

### ApiError — Base error class

```ts
import { ApiError } from "expressentials";

throw new ApiError(404, "User not found");
throw new ApiError(400, "Invalid", { field: "email" }); // with details
```

Predefined subclasses:

```ts
import {
  NotFound,         // 404
  BadRequest,       // 400
  Unauthorized,     // 401
  Forbidden,        // 403
  Conflict,         // 409
  TooManyRequests,  // 429
  InternalServerError, // 500
  ServiceUnavailable,  // 503
  GatewayTimeout,      // 504
  ValidationError,     // 422
} from "expressentials";

throw new NotFound("User not found");
throw new GatewayTimeout("Upstream timed out");
```

### errorHandler — Express error-handling middleware

```ts
import { errorHandler } from "expressentials";

app.use(errorHandler());
// Option: app.use(errorHandler({ log: false }))
```

Responds with `{ error: { message, statusCode, details? } }`.

### requestId — Request ID middleware

```ts
import { requestId } from "expressentials";

app.use(requestId());
// Sets req.requestId + x-request-id response header
```

Options: `header` (default `"x-request-id"`), `generator` (default `crypto.randomUUID`), `respectExisting` (default `true`).

### requestContext — Request-scoped logger + AsyncLocalStorage

```ts
import { requestContext } from "expressentials";

app.use(requestContext());
// Attaches req.log, sets up AsyncLocalStorage

// In handlers:
req.log.info("Fetching user");
req.log.error({ error: err }, "Failed");

// In service layer (no req needed):
import { getLogger, getRequestId } from "expressentials";

function findUser(id: string) {
  const log = getLogger();
  log.info({ userId: id }, "Looking up user");
}
```

### httpLogger — HTTP request logging

```ts
import { httpLogger } from "expressentials";

app.use(httpLogger());
// Logs: {"level":"info","requestId":"abc","method":"GET","path":"/api/users","status":200,"durationMs":42}
// Option: app.use(httpLogger({ skip: (req) => req.url === "/health" }))
```

### validate — Request validation (Zod/Yup adapter)

```ts
import { z } from "zod";
import { validate } from "expressentials";

router.post("/users", validate({
  body: z.object({ name: z.string(), email: z.string().email() }),
}), handler);
```

Also supports `params` and `query`. On failure throws `ValidationError` (422).

### asyncHandler — Async route wrapper

```ts
import { asyncHandler } from "expressentials";

router.get("/users", asyncHandler(async (req, res) => {
  const users = await db.findMany();
  res.json(users);
}));
```

Catches rejections and forwards to `next()`.

### timeout — Request timeout

```ts
import { timeout } from "expressentials";

app.use(timeout(5000)); // 5s, throws GatewayTimeout (504)
// Option: app.use(timeout(3000, { message: "Custom" }))
```

### healthCheck — Health endpoint

```ts
import { healthCheck } from "expressentials";

app.get("/health", healthCheck());
// {"status":"ok","uptime":8421,"timestamp":"2026-07-05T12:00:00.000Z"}
// Option: healthCheck({ checks: () => ({ db: "connected" }) })
```

### Logger — Structured JSON logger

```ts
import { Logger } from "expressentials";

const log = new Logger({ level: "debug" });
log.info("message");
log.error({ error: err }, "message");
const child = log.child({ requestId: "abc" });
```

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
} from "expressentials";
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
