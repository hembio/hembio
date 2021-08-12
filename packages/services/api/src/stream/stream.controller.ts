import { createReadStream, ReadStream } from "fs";
import path from "path";
import { Transform } from "stream";
import { getCwd, getEnv } from "@hembio/core";
import { GDriveFSAdapter } from "@hembio/fs";
import {
  Controller,
  Get,
  HttpException,
  Param,
  Req,
  Res,
} from "@nestjs/common";
import type { FastifyReply, FastifyRequest } from "fastify";
import parseRange from "range-parser";
import { StreamService } from "./stream.service";
import { contentRange } from "~/utils/contentRange";
import { isCachable } from "~/utils/isCachable";
import { isConditionalGET } from "~/utils/isConditionalGET";
import { isFresh } from "~/utils/isFresh";
import { isPreconditionFailure } from "~/utils/isPreconditionFailure";
import { isRangeFresh } from "~/utils/isRangeFresh";
import { removeContentHeaderFields } from "~/utils/removeContentHeaderFields";

const BYTES_RANGE_REGEXP = /^ *bytes=/;

@Controller("stream")
export class StreamController {
  public constructor(private readonly streamService: StreamService) {}

  @Get("/:fileId/video")
  public async videoStream(
    @Param() { fileId }: { fileId: string },
    @Req() req: FastifyRequest,
    @Res({ passthrough: true }) res: FastifyReply,
  ): Promise<unknown> {
    // conditional GET support
    if (isConditionalGET(req)) {
      if (isPreconditionFailure(req, res)) {
        throw new HttpException("Precondition Failure", 412);
      }
      if (isCachable(res) && isFresh(req, res)) {
        removeContentHeaderFields(res);
        // Not-Modified
        res.status(302);
        return;
      }
    }

    const stat = await this.streamService.statFile(fileId);
    const len = stat.size;
    const offset = 0;

    // const rangeHeader = req.headers["range"];
    // if (rangeHeader && BYTES_RANGE_REGEXP.test(rangeHeader)) {
    //   let ranges = parseRange(len, rangeHeader, {
    //     combine: true,
    //   });
    //   // If-Range support
    //   if (!isRangeFresh(req, res)) {
    //     ranges = -2;
    //   }
    //   // Unsatisfiable
    //   if (ranges === -1) {
    //     // Content-Range
    //     res.header("content-range", contentRange("bytes", len));
    //     throw new HttpException("Range Not Satisfiable", 416);
    //   }

    //   // Valid (syntactically invalid/multiple ranges are treated as a regular response)
    //   if (ranges !== -2 && ranges.length === 1) {
    //     // Content-Range
    //     res.statusCode = 206;
    //     res.header("content-range", contentRange("bytes", len, ranges[0]));

    //     // adjust for requested range
    //     offset += ranges[0].start;
    //     len = ranges[0].end - ranges[0].start + 1;
    //   }
    // }

    const start = offset;
    const end = Math.max(offset, offset + len - 1);

    // adjust len to start/end options
    // len = Math.max(0, len - offset);
    // if (end > 0) {
    //   const bytes = end - offset + 1;
    //   if (len > bytes) len = bytes;
    // }

    // res.header("content-length", len);
    res.type("video/mp4");

    // HEAD support
    if (req.method === "HEAD") {
      return;
    }
    const stream = await this.streamService.getVideoStream(fileId, start);
    res.send(stream);
  }

  @Get("/:fileId/audio")
  public async audioStream(
    @Param() { fileId }: { fileId: string },
    @Req() req: FastifyRequest,
    @Res({ passthrough: true }) res: FastifyReply,
  ): Promise<unknown> {
    // conditional GET support
    if (isConditionalGET(req)) {
      if (isPreconditionFailure(req, res)) {
        throw new HttpException("Precondition Failure", 412);
      }
      if (isCachable(res) && isFresh(req, res)) {
        removeContentHeaderFields(res);
        // Not-Modified
        res.status(302);
        return;
      }
    }

    const stat = await this.streamService.statFile(fileId);
    const len = stat.size;
    const offset = 0;

    // const rangeHeader = req.headers["range"];
    // if (rangeHeader && BYTES_RANGE_REGEXP.test(rangeHeader)) {
    //   let ranges = parseRange(len, rangeHeader, {
    //     combine: true,
    //   });
    //   // If-Range support
    //   if (!isRangeFresh(req, res)) {
    //     ranges = -2;
    //   }
    //   // Unsatisfiable
    //   if (ranges === -1) {
    //     // Content-Range
    //     res.header("content-range", contentRange("bytes", len));
    //     throw new HttpException("Range Not Satisfiable", 416);
    //   }

    //   // Valid (syntactically invalid/multiple ranges are treated as a regular response)
    //   if (ranges !== -2 && ranges.length === 1) {
    //     // Content-Range
    //     res.statusCode = 206;
    //     res.header("content-range", contentRange("bytes", len, ranges[0]));

    //     // adjust for requested range
    //     offset += ranges[0].start;
    //     len = ranges[0].end - ranges[0].start + 1;
    //   }
    // }

    const start = offset;
    const end = Math.max(offset, offset + len - 1);

    // adjust len to start/end options
    // len = Math.max(0, len - offset);
    // if (end > 0) {
    //   const bytes = end - offset + 1;
    //   if (len > bytes) len = bytes;
    // }

    // res.header("content-length", len);
    res.type("audio/mp4");

    // HEAD support
    if (req.method === "HEAD") {
      return;
    }
    const stream = await this.streamService.getAudioStream(fileId, start);
    res.send(stream);
  }

  @Get("/:fileId")
  public async stream(
    @Param() { fileId }: { fileId: string },
    @Req() req: FastifyRequest,
    @Res({ passthrough: true }) res: FastifyReply,
  ): Promise<unknown> {
    // conditional GET support
    if (isConditionalGET(req)) {
      if (isPreconditionFailure(req, res)) {
        throw new HttpException("Precondition Failure", 412);
      }
      if (isCachable(res) && isFresh(req, res)) {
        removeContentHeaderFields(res);
        // Not-Modified
        res.status(302);
        return;
      }
    }

    const [filePath, stat] = await this.streamService.getFile(fileId);

    let len = stat.size;
    let offset = 0;

    const rangeHeader = req.headers["range"];
    if (rangeHeader && BYTES_RANGE_REGEXP.test(rangeHeader)) {
      let ranges = parseRange(len, rangeHeader, {
        combine: true,
      });
      // If-Range support
      if (!isRangeFresh(req, res)) {
        ranges = -2;
      }
      // Unsatisfiable
      if (ranges === -1) {
        // Content-Range
        res.header("content-range", contentRange("bytes", len));
        throw new HttpException("Range Not Satisfiable", 416);
      }

      // Valid (syntactically invalid/multiple ranges are treated as a regular response)
      if (ranges !== -2 && ranges.length === 1) {
        // Content-Range
        res.statusCode = 206;
        res.header("content-range", contentRange("bytes", len, ranges[0]));

        // adjust for requested range
        offset += ranges[0].start;
        len = ranges[0].end - ranges[0].start + 1;
      }
    }

    const start = offset;
    const end = Math.max(offset, offset + len - 1);

    // adjust len to start/end options
    // len = Math.max(0, len - offset);
    // if (end > 0) {
    //   const bytes = end - offset + 1;
    //   if (len > bytes) len = bytes;
    // }

    res.header("content-length", len);
    res.type("video/mp4");

    // HEAD support
    if (req.method === "HEAD") {
      return;
    }

    // Experimental testing of the GDrive FS Adapter
    const useGdrive = false;
    if (useGdrive) {
      const gdrive = await GDriveFSAdapter.create("/", {
        keyFile: path.join(getCwd(), "./credentials.json"),
        impersonate: getEnv().GDRIVE_IMPERSONATE_USER,
      });
      const gdriveLoc = filePath
        .replace("G:\\My Drive", "")
        .replace(/\\/g, "/");
      const readStream = await gdrive.createReadStream(gdriveLoc, {
        start,
        end,
      });
      return readStream;
    }

    const readStream = createReadStream(filePath, {
      start,
      end,
    });

    return readStream;
  }

  @Get("/:fileId/subtitles/:language")
  public async subtitles(
    @Param() { fileId, language }: { fileId: string; language: string },
    @Res({ passthrough: true }) res: FastifyReply,
  ): Promise<Transform | ReadStream> {
    res.header("content-type", "text/vtt");
    return this.streamService.getSubtitle(fileId, language);
  }
}
