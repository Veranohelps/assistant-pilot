import { Request } from "express";

function routeUrl(req: Request, port: number, id: string): string {
  const forwardedProto = req.header("x-forwarded-proto");

  // see: https://www.jhanley.com/google-cloud-run-https-part-2/
  if (forwardedProto === "https") {
    return `https://${req.hostname}/routes/${id}`;
  }

  // this is most likely localhost / local IP
  return `http://${req.hostname}:${port}/routes/${id}`;
}

export { routeUrl as default };
