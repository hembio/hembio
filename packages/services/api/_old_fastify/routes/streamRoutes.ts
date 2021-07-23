import fs from "fs";
import path from "path";
import { BASE_PATH, FileEntity } from "@hembio/core";
import { FastifyPluginAsync } from "fastify";

export const streamRoutes: FastifyPluginAsync = async (fastify) => {
  fastify.get<{
    Params: {
      fileId: string;
    };
    Querystring: {
      directVideo: string;
      directAudio: string;
    };
  }>("/:fileId/playlist.m3u8", async (req, reply) => {
    const { fileId } = req.params;
    const { directVideo, directAudio } = req.query;
    if (!fileId) {
      reply.status(400);
      throw Error("Bad Request");
    }

    const fileRepo = req.em.getRepository(FileEntity);
    const file = await fileRepo.findOne(fileId);

    if (!file) {
      reply.status(404).send();
      return;
    }

    if (!file?.mediainfo) {
      try {
        const mediainfo = await readMediaInfo(BASE_PATH, file);
        file.mediainfo = JSON.stringify(mediainfo);
      } catch (e) {
        reply.status(500);
        console.error(e);
        throw new Error("Failed to read mediainfo");
      }
    }

    const transcoder = Transcoder.getInstance(
      BASE_PATH,
      file,
      directVideo === "1",
      directAudio === "1",
    );
    if (!transcoder.isRunning) {
      transcoder.start(0);
    }
    try {
      const playlist = [
        "#EXTM3U",
        "#EXT-X-VERSION:3",
        "#EXT-X-ALLOW-CACHE:YES",
        `#EXT-X-TARGETDURATION:${transcoder.segmentTime}`,
        "#EXT-X-MEDIA-SEQUENCE:0",
        "#EXT-X-PLAYLIST-TYPE:VOD",
        // '#EXT-X-MAP:URI="init.mp4"',
      ];
      const segmentAmount = transcoder.totalSegments;
      let segmentNum = 0;
      while (segmentNum < segmentAmount) {
        playlist.push("#EXTINF:10", `${segmentNum}.ts`);
        segmentNum++;
      }
      playlist.push("#EXT-X-ENDLIST");
      reply.type("application/vnd.apple.mpegurl");
      reply.send(playlist.join("\n"));
      return;
    } catch (e) {
      throw Error("Failed to open playlist");
    }
  });

  fastify.get<{
    Params: {
      fileId: string;
    };
    Querystring: {
      directVideo?: string;
      directAudio?: string;
    };
  }>("/:fileId/init.mp4", async (req, reply) => {
    const { fileId } = req.params;
    if (!fileId) {
      reply.status(400);
      throw new Error("Bad request");
    }

    const fileRepo = req.em.getRepository(FileEntity);

    const file = await fileRepo.findOne(fileId);
    if (!file) {
      reply.status(404);
      return;
    }

    try {
      reply.type("video/mp4");
      const stream = fs.createReadStream(
        path.resolve(
          path.join("../transcoder/.transcoding", fileId, "init.mp4"),
        ),
      );
      reply.send(stream);
      return;
    } catch (e) {
      console.log("Failed!");
      console.error(e);
      throw e;
    }
  });

  fastify.get<{
    Params: {
      fileId: string;
      segmentFile: string;
    };
    Querystring: {
      directVideo: string;
      directAudio: string;
    };
  }>("/:fileId/:segmentFile", async (req, reply) => {
    const { fileId, segmentFile } = req.params;
    const { directVideo, directAudio } = req.query;
    if (!fileId || !segmentFile) {
      reply.status(400);
      throw new Error("Bad request");
    }

    const fileRepo = req.em.getRepository(FileEntity);
    const file = await fileRepo.findOne(fileId);

    if (!file) {
      reply.status(404);
      return;
    }

    if (!file.mediainfo) {
      try {
        const mediainfo = await readMediaInfo(BASE_PATH, file);
        file.mediainfo = JSON.stringify(mediainfo);
      } catch (e) {
        reply.status(500);
        console.error(e);
        throw new Error("Failed to read mediainfo");
      }
    }

    const transcoder = Transcoder.getInstance(
      BASE_PATH,
      file,
      directVideo === "1",
      directAudio === "1",
    );
    const segmentNum = parseInt(segmentFile.replace(".ts", ""), 10);
    const segment = transcoder.getSegmentFile(segmentNum);

    if (!transcoder.segmentsTranscoded.has(segmentNum)) {
      transcoder.start(segmentNum);
    }
    await transcoder.isSegmentReady(segmentNum);

    // const range = req.headers.range;
    try {
      const stat = await fs.promises.stat(segment);
      const fileSize = stat.size;
      reply.header("Content-Length", fileSize);
      reply.type("video/webm");
      const stream = fs.createReadStream(segment);
      reply.send(stream);
      return;
    } catch (e) {
      console.error(e);
      throw e;
    }

    // if (range) {
    //   const parts = range.replace(/bytes=/, '').split('-');
    //   const start = parseInt(parts[0], 10);
    //   const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
    //   const chunkSize = end - start + 1;

    //   const headers = {
    //     // Creating HTTP Headers
    //     'Content-Range': `bytes ${start}-${end}/${fileSize}`,
    //     'Accept-Ranges': 'bytes',
    //     'Content-Length': chunkSize,
    //     'Content-Type': contentType,
    //   };

    //   // Handle invalid range
    //   if (start > end || start > fileSize - 1 || end >= fileSize) {
    //     reply.writeHead(416, {
    //       ...headers,
    //       'Content-Range': `bytes 0-${fileSize}/${fileSize}`,
    //     });
    //     reply.end();
    //     return;
    //   }

    //   reply.writeHead(206, headers);
    //   fs.createReadStream(segmentFile, { start, end }).pipe(res);
    // } else {
    // const head = {
    //   // 'Content-Length': fileSize,
    //   "Content-Type": contentType,
    // };

    // reply.writeHead(200, head);
    // fs.createReadStream(segmentFile).pipe(res);
    // }
    // next();
  });
};
