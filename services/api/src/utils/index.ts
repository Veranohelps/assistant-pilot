import { Request } from "express";

function routeUrl(req: Request, port: number, id: string): string {
  if (req.hostname === "localhost") {
    return `${req.protocol}://${req.hostname}:${port}/routes/${id}`;
  }
  return `${req.protocol}://${req.hostname}/routes/${id}`;
}

export { routeUrl as default };
