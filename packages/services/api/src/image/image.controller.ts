import { createReadStream } from "fs";
import { stat } from "fs/promises";
import path from "path";
import { encoding } from "@hapi/accept";
import { getCwd } from "@hembio/core";
import {
  BadRequestException,
  Controller,
  Get,
  NotFoundException,
  Param,
  Req,
  Res,
} from "@nestjs/common";
import type { FastifyReply, FastifyRequest } from "fastify";
import { ImageService } from "./image.service";

@Controller("images")
export class ImageController {
  public constructor(private readonly imagesService: ImageService) {}

  @Get("/titles/:id/:type")
  public async titleImage(
    @Param() params: { id: string; type: string },
    @Req() req: FastifyRequest,
    @Res({ passthrough: true }) res: FastifyReply,
  ): Promise<unknown> {
    if (!params.id || !params.type) {
      throw new BadRequestException();
    }

    const result = await this.imagesService.getImage(params.id, params.type);
    if (result.error && result.code) {
      res.code(result.code);
      return;
    }

    if (!result.image) {
      throw new NotFoundException();
    }

    const ifModifiedSince = req.headers["if-modified-since"]
      ? new Date(req.headers["if-modified-since"] as string)
      : undefined;

    res
      .type(result.mime || "image/jpeg")
      .header(
        "Cache-Control",
        "public, s-maxage=3200, max-age=3200, must-revalidate",
      );

    const acceptsEncodingHeader = Array.isArray(req.headers["accept-encoding"])
      ? req.headers["accept-encoding"].join(", ")
      : req.headers["accept-encoding"] || "";

    const acceptsEncoding = encoding(acceptsEncodingHeader, [
      "br",
      "gzip",
      "deflate",
    ]);

    if (result.stats) {
      const { mtime, size } = result.stats;
      // Remove milliseconds from Date since it's not valid in the Last-Modified header
      mtime.setMilliseconds(0);
      res.header("Last-Modified", mtime);
      if (!acceptsEncoding) {
        res.header("Content-Length", size);
      }
      if (ifModifiedSince) {
        const haveBeenModified = mtime > ifModifiedSince;
        if (!haveBeenModified) {
          res.status(304);
          return;
        }
      }
    }

    const readStream = createReadStream(result.image);

    // try {
    //   // Attempt to compress image
    //   switch (acceptsEncoding) {
    //     case "br":
    //       res.header("Content-Encoding", "br");
    //       return readStream.pipe(createBrotliCompress());
    //     case "gzip":
    //       res.header("Content-Encoding", "gzip");
    //       return readStream.pipe(createGzip());
    //     case "deflate":
    //       res.header("Content-Encoding", "deflate");
    //       return readStream.pipe(createDeflate());
    //   }
    // } catch {
    //   // Failed to compress, pipe it as raw
    // }

    return readStream;
  }

  @Get("/people/:id")
  public async personImage(
    @Param() params: { id: string; type: string },
    @Req() req: FastifyRequest,
    @Res({ passthrough: true }) res: FastifyReply,
  ): Promise<unknown> {
    if (!params.id) {
      throw new BadRequestException();
    }

    const imgFile = path.join(getCwd(), ".images/people", params.id);

    const stats = await stat(imgFile);
    if (!stats) {
      throw new NotFoundException();
    }

    const ifModifiedSince = req.headers["if-modified-since"]
      ? new Date(req.headers["if-modified-since"] as string)
      : undefined;

    res
      .type("image/jpeg")
      .header(
        "Cache-Control",
        "public, s-maxage=3200, max-age=3200, must-revalidate",
      );

    const acceptsEncodingHeader = Array.isArray(req.headers["accept-encoding"])
      ? req.headers["accept-encoding"].join(", ")
      : req.headers["accept-encoding"] || "";

    const acceptsEncoding = encoding(acceptsEncodingHeader, [
      "br",
      "gzip",
      "deflate",
    ]);

    const { mtime, size } = stats;
    // Remove milliseconds from Date since it's not valid in the Last-Modified header
    mtime.setMilliseconds(0);
    res.header("Last-Modified", mtime);
    if (!acceptsEncoding) {
      res.header("Content-Length", size);
    }
    if (ifModifiedSince) {
      const haveBeenModified = mtime > ifModifiedSince;
      if (!haveBeenModified) {
        res.status(304);
        return;
      }
    }

    return createReadStream(imgFile);
  }
}
