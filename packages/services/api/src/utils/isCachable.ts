import { FastifyReply } from "fastify";

export function isCachable(res: FastifyReply): boolean {
  const statusCode = res.statusCode;
  return (statusCode >= 200 && statusCode < 300) || statusCode === 304;
}
