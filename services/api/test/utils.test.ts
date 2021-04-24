import { describe, expect, it } from "@jest/globals";
import { Request } from "express";
import routeUrl from "../src/utils";

describe("routeUrl", () => {
  it("localhost with port", async () => {
    const routeId = "some-id";
    const mockRequest = {
      protocol: "http",
      hostname: "localhost",
    } as Request;
    const port = 3000;
    const url = routeUrl(mockRequest, port, routeId);
    expect(url).toEqual(`http://localhost:3000/routes/${routeId}`);
  });

  it("deployed", async () => {
    const routeId = "some-id";
    const mockRequest = {
      protocol: "https",
      hostname: "some-domain.com",
    } as Request;
    const port = 3000;
    const url = routeUrl(mockRequest, port, routeId);
    expect(url).toEqual(`https://some-domain.com/routes/${routeId}`);
  });
});
