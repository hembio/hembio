import { MikroORM, RequestContext } from "@hembio/core";
import { Injectable, NestMiddleware } from "@nestjs/common";
import { FastifyRequest, FastifyReply } from "fastify";

@Injectable()
export class MikroORMMiddleware implements NestMiddleware {
  public constructor(private readonly orm: MikroORM) {}

  public use(req: FastifyRequest, res: FastifyReply, next: () => void): void {
    RequestContext.create(this.orm.em, next);
  }
}
