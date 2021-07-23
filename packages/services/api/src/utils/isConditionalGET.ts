import { FastifyRequest } from "fastify";

export function isConditionalGET(req: FastifyRequest): boolean {
  return !!(
    req.headers["if-match"] ||
    req.headers["if-unmodified-since"] ||
    req.headers["if-none-match"] ||
    req.headers["if-modified-since"]
  );
}
