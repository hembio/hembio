import type { FastifyReply } from "fastify";

export function removeContentHeaderFields(res: FastifyReply): void {
  for (const header of Object.keys(res.headers)) {
    if (header.substr(0, 8) === "content-" && header !== "content-location") {
      res.removeHeader(header);
    }
  }
}
