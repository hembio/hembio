import type { FastifyReply, FastifyRequest } from "fastify";
import { parseHttpDate } from "./parseHttpDate";

export function isRangeFresh(req: FastifyRequest, res: FastifyReply): boolean {
  const ifRange = Array.isArray(req.headers["if-range"])
    ? req.headers["if-range"].join(", ")
    : req.headers["if-range"];

  if (!ifRange) {
    return true;
  }

  // if-range as etag
  if (ifRange.indexOf('"') !== -1) {
    const etag = res.getHeader("ETag");
    return !!(etag && ifRange.indexOf(etag) !== -1);
  }

  // if-range as modified date
  const lastModified = res.getHeader("Last-Modified");
  return parseHttpDate(lastModified) <= parseHttpDate(ifRange);
}
