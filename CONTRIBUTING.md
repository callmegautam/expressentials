# Contributing

Thanks for your interest in contributing to expresset.

## Development

```sh
git clone https://github.com/callmegautam/expresset.git
cd expresset
npm install
```

## Scripts

| Command | Description |
|---------|-------------|
| `npm run build` | Build with tsup |
| `npm run dev` | Watch mode |
| `npm test` | Run tests |
| `npm run typecheck` | TypeScript check |
| `npm run format:fix` | Format code with Prettier |

## Guidelines

- **Code style:** Prettier (ran via `npm run format:fix`)
- **Tests:** Add or update tests in co-located `__tests__` directories. Run with `npm test`.
- **TypeScript:** Ensure `npm run typecheck` passes.
- **Exports:** Add new public APIs to `src/index.ts`.
- **Docs:** Update `FEATURES.md` with usage examples and options for new features.

## Project structure

```
src/
├── status/          # HTTP status code constants
├── message/         # Human-readable status messages
├── errors/          # ApiError base class + predefined HTTP error classes
├── logger/          # Structured JSON logger
├── context/         # AsyncLocalStorage context accessors
├── middleware/      # Express middleware (errorHandler, requestId, validate, etc.)
└── index.ts         # Public exports
```

## Pull requests

1. Fork the repo and create a feature branch from `main`.
2. Make your changes following the guidelines above.
3. Run `npm test && npm run typecheck` to verify.
4. Open a PR with a clear description of what and why.
