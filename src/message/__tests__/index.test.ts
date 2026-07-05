import { describe, it, expect } from "vitest";
import { message } from "../index";

describe("message", () => {
  it('should return "Success" for message.ok', () => {
    expect(message.ok).toBe("Success");
  });

  it('should return "Created successfully" for message.created', () => {
    expect(message.created).toBe("Created successfully");
  });

  it('should return "Resource not found" for message.notFound', () => {
    expect(message.notFound).toBe("Resource not found");
  });

  it('should return "Invalid request" for message.badRequest', () => {
    expect(message.badRequest).toBe("Invalid request");
  });

  it('should return "Authentication required" for message.unauthorized', () => {
    expect(message.unauthorized).toBe("Authentication required");
  });

  it('should return "Something went wrong on our end" for message.internalServerError', () => {
    expect(message.internalServerError).toBe("Something went wrong on our end");
  });

  it('should return "Too many requests, please slow down" for message.tooManyRequests', () => {
    expect(message.tooManyRequests).toBe("Too many requests, please slow down");
  });
});
