import { FastifyReply, FastifyRequest } from "fastify";
import { parseHttpDate } from "./parseHttpDate";
import { parseTokenList } from "./parseTokenList";

export function isPreconditionFailure(
  req: FastifyRequest,
  res: FastifyReply,
): boolean {
  const match = req.headers["if-match"];
  if (match) {
    const etag = res.getHeader("ETag");
    return (
      !etag ||
      (match !== "*" &&
        parseTokenList(match).every((match) => {
          return (
            match !== etag && match !== "W/" + etag && "W/" + match !== etag
          );
        }))
    );
  }

  const unmodifiedSince = parseHttpDate(req.headers["if-unmodified-since"]);
  if (!isNaN(unmodifiedSince)) {
    const lastModified = parseHttpDate(res.getHeader("Last-Modified"));
    return isNaN(lastModified) || lastModified > unmodifiedSince;
  }
  return false;
}
