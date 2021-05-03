import { describe, expect, it } from "@jest/globals";
import { mockRequest } from "mock-req-res";
import routeUrl from "../src/utils";

describe("routeUrl", () => {
  it("forces https and removes port if x-forwarded-proto header is https", async () => {
    const options = {
      hostname: "example.com",
      header(headerName: string) {
        if (headerName === "x-forwarded-proto") {
          return "https";
        }
        return null;
      },
    };

    const req = mockRequest(options);
    const url = routeUrl(req, 3000, "some-id");
    expect(url).toEqual("https://example.com/routes/some-id");
  });

  it("returns hostname and port for localhost", async () => {
    const options = {
      hostname: "localhost",
      header(headerName: string) {
        if (headerName === "x-forwarded-proto") {
          return "http";
        }
        return null;
      },
    };

    const req = mockRequest(options);
    const url = routeUrl(req, 3000, "some-id");
    expect(url).toEqual("http://localhost:3000/routes/some-id");
  });

  it("returns IP and port for IP addresses", async () => {
    const options = {
      hostname: "192.168.1.101",
      header(headerName: string) {
        if (headerName === "x-forwarded-proto") {
          return "http";
        }
        return null;
      },
    };

    const req = mockRequest(options);
    const url = routeUrl(req, 3000, "some-id");
    expect(url).toEqual("http://192.168.1.101:3000/routes/some-id");
  });
});
