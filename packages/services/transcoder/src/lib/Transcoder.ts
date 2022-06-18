import fs from "fs";
import path from "path";
import { FileEntity, getCwd } from "@hembio/core";
import { FFmpeggy, secsToTimer } from "ffmpeggy";
import { action, makeObservable, observable, reaction, when } from "mobx";
import { now } from "mobx-utils";
import { waitForFile } from "../utils/waitForFile";

const logger = console;
const cache: Record<string, Transcoder> = {};
const tmpPath = path.resolve(getCwd(), ".transcoding");

export class Transcoder {
  public static getInstance(
    basePath: string,
    file: FileEntity,
    directVideo?: boolean,
    directAudio?: boolean,
  ): Transcoder {
    cache[file.id] =
      cache[file.id] ||
      new Transcoder(basePath, file, directVideo, directAudio);
    cache[file.id].updateLastAccessed();
    return cache[file.id];
  }

  public isRunning = false;
  public ffmpeg = new FFmpeggy();
  public lastAccessed = Date.now();
  public fullyTranscoded = false;

  // Should be in power of three
  public segmentTime = 9;
  public duration = 0;
  public totalSegments = 0;
  public tmpDir = "";

  public segmentsTranscoded = observable.set<number>();
  public writtenFiles = observable.set<string>();
  public currentSegment = 0;
  public hasTempFiles = false;

  public constructor(
    private basePath: string,
    private file: FileEntity,
    private directVideo = false,
    private directAudio = false,
  ) {
    if (!file.mediainfo) {
      logger.error(new Error("No mediainfo exists"));
      return;
    }

    makeObservable(this, {
      currentSegment: observable,
      hasTempFiles: observable,
      fullyTranscoded: observable,
      ffmpeg: observable.ref,
      isRunning: observable,
      updateLastAccessed: action,
      setRunning: action,
      start: action,
    });

    const mediainfo = JSON.parse(file.mediainfo.toString());
    this.mediainfo = mediainfo;
    this.videoTrack = mediainfo.video[0];
    this.duration = mediainfo.general.duration / 1000;
    this.totalSegments = Math.ceil(this.duration / this.segmentTime);

    this.tmpDir = path.join(tmpPath, file.id);

    process.on("exit", this.cleanUp);

    reaction(
      () =>
        !this.isRunning &&
        this.hasTempFiles &&
        now() > this.lastAccessed + 60000,
      () => {
        this.cleanUp();
        this.hasTempFiles = false;
        this.fullyTranscoded = false;
        this.segmentsTranscoded.replace([]);
        this.lastAccessed = Date.now();
      },
      { delay: 30000 },
    );

    reaction(
      () => this.isRunning && now() > this.lastAccessed + 30000,
      async () => {
        logger.debug("Stopping transcoder due to inactivity", {
          id: this.file.id,
        });
        this.lastAccessed = now();
        await this.stop();
      },
      { delay: 30000 },
    );

    this.ffmpeg.on(
      "start",
      action((args: string[]) => {
        args = args.map((a, i) => {
          if (i !== 0 && a.includes("\\")) {
            a = `"${a}"`;
          }
          return a;
        });
        this.isRunning = true;
        logger.debug("Transcoder running", { id: this.file.id });
        logger.debug(args.join(" "), { id: this.file.id });
      }),
    );

    // this.ffmpeg.on("progress", (_p: any) => {
    //   console.debug(this.file.id, "Progress fps:", p.fps);
    //   const percentage = Math.ceil((p.time / this.duration) * 100);
    //   console.log(this.file.id, 'Progress: ', percentage + '%');
    // });

    this.ffmpeg.on(
      "writing",
      action((file: string) => {
        // logger.debug(`Wrote file: ${file}`, { id: this.file.id });
        if (file.endsWith(".ts")) {
          const segment = Number(file.replace(".ts", ""));
          this.currentSegment = segment;
        }
      }),
    );

    // this.ffmpeg.on(
    //   "error",
    //   action((err) => {
    //     // logger.error(err, { id: this.file.id });
    //   }),
    // );

    this.ffmpeg.on(
      "exit",
      action(() => {
        this.isRunning = false;
        logger.info("Transcoder stopped", { id: this.file.id });
      }),
    );

    this.ffmpeg.on(
      "done",
      action((file: string) => {
        this.writtenFiles.add(file.replace(".tmp", ""));
        if (file.endsWith(".ts")) {
          const segment = Number(file.replace(".ts", ""));
          // logger.debug(`Segment ${segment} done`);
          this.segmentsTranscoded.add(segment);
        }
        if (this.segmentsTranscoded.size === this.totalSegments) {
          logger.debug("All segments transcoded");
          this.isRunning = false;
          this.fullyTranscoded = true;
        }
      }),
    );
  }

  private mediainfo: Record<string, any> = {};
  private videoTrack: Record<string, any> = {};

  private async cleanUp(): Promise<void> {
    logger.debug("Stopping transcoder");
    await this.stop();
    logger.debug("Removing temp files", { id: this.file.id });
    // for await (const fullPath of pathWalker(this.tmpDir, { yieldDir: true })) {
    //   await fs.promises.unlink(fullPath);
    // }
  }

  public updateLastAccessed(): void {
    this.lastAccessed = Date.now();
  }

  public setRunning(running = true): void {
    this.isRunning = running;
  }

  public getSegmentFile(segment: number): any {
    this.updateLastAccessed();
    return path.join(this.tmpDir, segment.toString() + ".ts");
  }

  public async isSegmentReady(segment: number): Promise<boolean> {
    this.updateLastAccessed();
    if (this.segmentsTranscoded.has(segment)) {
      return true;
    }
    logger.debug(`Waiting for segment ${segment}`);
    await when(() => this.segmentsTranscoded.has(segment));
    return true;
  }

  public async getPlaylistFile(): Promise<any> {
    this.updateLastAccessed();
    const playlistFile = path.join(this.tmpDir, "playlist.m3u8");
    await waitForFile(playlistFile);
    return playlistFile;
  }

  public async start(startSegment = 0): Promise<boolean> {
    if (this.fullyTranscoded) {
      return true;
    }
    if (this.segmentsTranscoded.has(startSegment)) {
      return true;
    }
    const diffSegments = Math.abs(this.currentSegment - startSegment);
    if (this.isRunning && diffSegments < 10) {
      await when(() => this.segmentsTranscoded.has(startSegment));
      return true;
    }
    if (this.isRunning) {
      logger.debug(
        `Requested segment ${startSegment} is out of range. Restarting transcoder...`,
        { id: this.file.id },
      );
      await this.stop();
    }

    try {
      await fs.promises.mkdir(this.tmpDir, { recursive: true });
    } catch {
      // Ignore
    }

    const { output, globalOptions, outputOptions, inputOptions } =
      this.getOptions(startSegment);

    // console.log(inputOptions, outputOptions);

    this.ffmpeg
      .setCwd(this.tmpDir)
      .setGlobalOptions(globalOptions)
      .setInput(path.join(this.basePath, this.file.path))
      .setInputOptions(inputOptions)
      .setOutputOptions(outputOptions)
      .setOutput(output);

    this.hasTempFiles = true;
    this.currentSegment = startSegment;

    logger.debug("Running ffmpeg");
    try {
      this.setRunning();
      await this.ffmpeg.run();
    } catch (e) {
      // logger.error(e);
      // throw e;
      return false;
    }
    await when(() => this.writtenFiles.has("playlist.m3u8"));
    return true;
  }

  public async stop(): Promise<void> {
    if (this.isRunning) {
      try {
        await this.ffmpeg.stop(15);
      } catch {
        // Ignore
      }
      // try {
      //   await fs.promises.unlink(path.join(this.tmpDir, "playlist.m3u8"));
      // } catch (e) {
      //   logger.warn(e);
      // }
    }
    return;
  }

  public getOptions(startSegment: number): {
    output: string;
    globalOptions: string[];
    inputOptions: string[];
    outputOptions: string[];
  } {
    const segmentTime = this.segmentTime;
    const segmentTimeDelta = startSegment * segmentTime;
    const fps = Math.ceil(this.videoTrack.fps);
    const gop = fps * 3;

    console.log({ segmentTime, fps, gop });

    const segmentOptions = [
      "-f ssegment",
      "-forced-idr 1",
      "-flags +cgop",
      "-copyts",
      "-vsync -1",
      "-avoid_negative_ts disabled",
      "-individual_header_trailer 0",
      "-start_at_zero",
      `-segment_time ${segmentTime}`,
      `-segment_time_delta ${segmentTimeDelta}`,
      "-segment_list_type m3u8",
      `-segment_start_number ${startSegment}`,
      "-segment_format mpegts",
      "-segment_list playlist.m3u8",
    ];
    const output = "%d.ts";

    // let segmentOptions = [
    //   "-f hls",
    //   "-hls_list_size 0",
    //   `-hls_init_time ${segmentTime}`,
    //   `-hls_time ${segmentTime}`,
    //   `-start_number ${startSegment}`,
    //   `-hls_segment_filename %d.ts`,
    //   "-hls_segment_type fmp4",
    //   "-hls_fmp4_init_filename init.mp4",
    //   "-hls_flags split_by_time",
    //   "-forced-idr 1",
    //   "-flags +cgop",
    //   "-copyts",
    //   "-vsync -1",
    //   "-avoid_negative_ts disabled",
    //   "-individual_header_trailer 0",
    //   "-start_at_zero",
    // ];
    // const output = "playlist.m3u8";

    let outputOptions = [
      `-r ${fps}`,
      `-g ${gop}`,
      "-sc_threshold 0",
      "-max_delay 5000000",
      "-fflags nobuffer",
      "-movflags frag_keyframe+empty_moov+faststart",
      `-force_key_frames expr:gte(t,n_forced*3)`,
      "-map_chapters -1",
      "-map_metadata -1",
      // "-sn",
      // "-lhls 1",
      "-map 0:v:0",
      "-map 0:a:0",
      "-threads 4",
      ...segmentOptions,
    ];

    let inputVideoCodec = "";
    let outputVideoCodec = "";
    if (this.directVideo) {
      outputVideoCodec = "copy";
      outputOptions.push();
    } else {
      outputVideoCodec = "h264";
      outputOptions.push(
        "-b:v 10M",
        "-maxrate 10M",
        // min_rate != max_rate isn't recommended!
        "-minrate 10M",
        // "-bufsize 8M",
        "-preset fast",
        "-bsf:v h264_mp4toannexb",
      );
      // HDR =>SDR
      if (this.videoTrack.bitDepth > 8) {
        outputOptions.push("-pix_fmt yuv420p");
        outputOptions.push(
          "-vf zscale=t=linear:npl=100,format=gbrpf32le,zscale=p=bt709,tonemap=tonemap=hable:desat=0,zscale=t=bt709:m=bt709:r=tv,format=yuv420p",
        );
      }
    }

    console.log(this.videoTrack);

    switch (this.videoTrack.format) {
      case "AVC":
      case "h264":
        inputVideoCodec = "h264";
        outputOptions.push(
          `-x264-params rc-lookahead=${gop}:keyint=${gop}:min-keyint=${gop}:scenecut=-1`,
        );
        break;
      case "HEVC":
        inputVideoCodec = "hevc";
        outputOptions.push(
          `-look_ahead ${gop}`,
          `-x265-params rc-lookahead=${gop}:keyint=${gop}:min-keyint=${gop}:scenecut=-1`,
        );
        break;
    }

    // console.log(this.videoTrack.format, inputVideoCodec);

    if (this.directAudio) {
      outputOptions.push("-c:a copy");
    } else {
      // outputOptions.push("-c:a eac3");
      // outputOptions.push("-c:a vorbis", "-strict -2");
      // outputOptions.push("-c:a opus", "-strict -2");
      // aac (supports only 2 channels)
      outputOptions.push("-c:a aac", "-ac 2");
      // libfdk_aac
      // outputOptions.push("-c:a libfdk_aac");
    }

    let inputOptions = ["-f matroska,webm"];

    if (startSegment > 0) {
      const ss = secsToTimer(startSegment * 10);
      logger.debug(`Start time: ${ss}`, { id: this.file.id });
      inputOptions.push(`-ss ${ss}`);
    }

    const nvOpts = hwaccelNv({
      inputVideoCodec,
      outputVideoCodec,
      inputOptions,
      outputOptions,
    });

    inputOptions = nvOpts.inputOptions;
    outputOptions = nvOpts.outputOptions;
    inputVideoCodec = nvOpts.inputVideoCodec;
    outputVideoCodec = nvOpts.outputVideoCodec;

    inputOptions.push(`-c:v ${inputVideoCodec}`);
    outputOptions.push(`-c:v ${outputVideoCodec}`);

    const globalOptions = ["-hide_banner"];
    return {
      output,
      globalOptions,
      inputOptions,
      outputOptions,
    };
  }
}

export function hwaccelNv(options: any): any {
  let {
    inputVideoCodec,
    outputVideoCodec,
    inputOptions = [],
    // eslint-disable-next-line prefer-const
    outputOptions = [],
  } = options;

  // For transcoding
  if (inputVideoCodec === outputVideoCodec) {
    inputOptions = ["-hwaccel_output_format cuda", ...inputOptions];
  }

  // Decoding
  let decoding = true;
  if (inputVideoCodec === "h264") {
    inputVideoCodec = "h264_cuvid";
  } else if (inputVideoCodec === "hevc") {
    inputVideoCodec = "hevc_cuvid";
  } else {
    decoding = false;
  }
  if (decoding) {
    inputOptions = ["-hwaccel cuda", ...inputOptions];
  }

  // Encoding
  let encoding = true;
  if (outputVideoCodec === "h264") {
    outputVideoCodec = "h264_nvenc";
    outputOptions.push(
      "-preset llhp", // Low latency high performance
      // "-rc-lookahead 0",
      // "-zerolatency",
      "-rc-lookahead 0",
      // "-rc cbr_hq",
      // "-rc cbr_ld_hq",
      // "-filter:v scale_npp=1920:-1",
    );
    // outputOptions.push(
    //   "-filter:v hwupload_cuda,scale_npp=w=1920:h=1080:format=yuv444p16:interp_algo=lanczos,hwdownload,format=nv12",
    // );
  } else if (outputVideoCodec === "hevc") {
    outputVideoCodec = "hevc_nvenc";
  } else {
    encoding = false;
  }

  return {
    ...options,
    inputOptions,
    outputOptions,
    inputVideoCodec,
    outputVideoCodec,
  };
}
