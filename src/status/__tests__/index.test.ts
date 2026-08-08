import { describe, it, expect } from "vitest";
import { status } from "../index";

describe("status codes", () => {
  // Testing every status code
  const expectedCodes: Record<keyof typeof status, number> = {
    // 1xx
    continue: 100,
    switchingProtocols: 101,
    processing: 102,
    earlyHints: 103,

    // 2xx
    ok: 200,
    created: 201,
    accepted: 202,
    nonAuthoritativeInformation: 203,
    noContent: 204,
    resetContent: 205,
    partialContent: 206,

    // 3xx
    multipleChoices: 300,
    movedPermanently: 301,
    found: 302,
    seeOther: 303,
    notModified: 304,
    useProxy: 305,
    temporaryRedirect: 307,
    permanentRedirect: 308,

    // 4xx
    badRequest: 400,
    unauthorized: 401,
    paymentRequired: 402,
    forbidden: 403,
    notFound: 404,
    methodNotAllowed: 405,
    notAcceptable: 406,
    proxyAuthenticationRequired: 407,
    requestTimeout: 408,
    conflict: 409,
    gone: 410,
    lengthRequired: 411,
    preconditionFailed: 412,
    payloadTooLarge: 413,
    uriTooLong: 414,
    unsupportedMediaType: 415,
    rangeNotSatisfiable: 416,
    expectationFailed: 417,
    imATeapot: 418,
    unprocessableEntity: 422,
    tooEarly: 425,
    upgradeRequired: 426,
    preconditionRequired: 428,
    tooManyRequests: 429,
    requestHeaderFieldsTooLarge: 431,
    unavailableForLegalReasons: 451,

    // 5xx
    internalServerError: 500,
    notImplemented: 501,
    badGateway: 502,
    serviceUnavailable: 503,
    gatewayTimeout: 504,
    httpVersionNotSupported: 505,
    insufficientStorage: 507,
    loopDetected: 508,
    notExtended: 510,
    networkAuthenticationRequired: 511,
  };

  it.each(Object.entries(expectedCodes))("should return %i for status.%s", (key, expectedCode) => {
    expect(status[key as keyof typeof status]).toBe(expectedCode);
  });

  it("should have valid HTTP status code numbers (100–599)", () => {
    Object.values(status).forEach((code) => {
      expect(code).toBeGreaterThanOrEqual(100);
      expect(code).toBeLessThan(600);
      expect(Number.isInteger(code)).toBe(true);
    });
  });
});
