import { secToTimer } from "./parsers";

class FFmpegOption<T> {
  protected value?: T;
  constructor(protected cmd: string, defaultValue?: T) {
    if (defaultValue) {
      this.value = defaultValue;
    }
  }
  set(value: T) {
    this.value = value;
  }
  get() {
    return this.value;
  }
  toArg() {
    if (typeof this.value === "boolean" && this.value) {
      return `${this.cmd}`;
    }
    if (!this.value) {
      return;
    }
    return `${this.cmd} ${this.value}`;
  }
}

class FFmpegPerStreamOption extends FFmpegOption<
  string | number | string[] | number[]
> {
  toArg() {
    if (Array.isArray(this.value)) {
      const lastValue = this.value.pop();
      if (this.value.length > 1) {
        return `${this.cmd}:${this.value.join(":")} ${lastValue}`;
      }
      return `${this.cmd}:${this.value[0]} ${lastValue}`;
    }
    if (!this.value) {
      return;
    }
    return `${this.cmd} ${this.value}`;
  }
}

// https://ffmpeg.org/ffmpeg-utils.html#time-duration-syntax
class FFmpegDurationOption extends FFmpegOption<number | string> {
  toArg() {
    let { value } = this;
    if (typeof value === "number") {
      value = secToTimer(value);
    }
    if (!value) {
      return;
    }
    return `${this.cmd} ${value}`;
  }
}

class FFmpegExtraOptions {
  private value: string[] = [];
  set(cmd: string, value?: string | string[]) {
    if (!value) {
      this.value.push(cmd);
      return;
    }
    if (Array.isArray(value)) {
      this.value = [...this.value, ...value];
      return;
    }
    return this.value.push(`${cmd} ${value}`);
  }
  toArg() {
    return this.value.join(" ");
  }
}

class FFmpegInputOptions {
  extra = new FFmpegExtraOptions();
  // Force input or output file format. The format is normally auto detected for input files and guessed from the file extension for output files, so this option is not needed in most cases.
  format = new FFmpegOption<string>("-f");

  // Time
  duration = new FFmpegOption<number>("-t");
  to = new FFmpegOption<number>("-to");
  seekFromStart = new FFmpegDurationOption("-ss");
  seekFromEnd = new FFmpegDurationOption("-sseof");
  timeOffset = new FFmpegDurationOption("-itoffset");
  // Rescale input timestamps. scale should be a floating point number.
  rescaleTimestamps = new FFmpegOption<number>("-itsscale");

  // Video
  videoCodec = new FFmpegOption<string | string[]>("-c:v");
  frameRate = new FFmpegPerStreamOption("-r");
  discardVideo = new FFmpegOption<boolean>("-vn");

  // Filters, formats and scale
  frameSize = new FFmpegPerStreamOption("-s");
  pixelFormat = new FFmpegPerStreamOption("-pix_fmt");
  swsFlags = new FFmpegOption<string>("-sws_flags");

  // Hardware acceleration
  hwAccel = new FFmpegPerStreamOption("-hwaccel");
  hwAccelDevice = new FFmpegPerStreamOption("-hwaccel_device");

  // Audio
  audioCodec = new FFmpegOption<string | string[]>("-c:a");
  audioSamplingFrequency = new FFmpegOption<string>("-ar");
  discardAudio = new FFmpegOption<boolean>("-an");
}

class FFmpegOutputOptions {
  extra = new FFmpegExtraOptions();
  // Force input or output file format. The format is normally auto detected for input files and guessed from the file extension for output files, so this option is not needed in most cases.
  format = new FFmpegOption<string>("-f");

  // Time
  duration = new FFmpegOption<number>("-t");
  to = new FFmpegOption<number>("-to");
  limitSize = new FFmpegOption<number>("-fs");
  seekFromStart = new FFmpegDurationOption("-ss");
  setTimestamp = new FFmpegOption<string>("-timestamp");

  // Video
  videoCodec = new FFmpegOption<string | string[]>("-c:v");
  videoQuality = new FFmpegOption<string>("-q:v");
  discardVideo = new FFmpegOption<boolean>("-vn");
  frameRate = new FFmpegPerStreamOption("-r");
  maxRate = new FFmpegOption<string>("-maxrate");
  minRate = new FFmpegOption<string>("-minrate");

  // Filters, scaling etc
  target = new FFmpegOption<string>("-target");
  qscale = new FFmpegPerStreamOption("-qscale");
  filter = new FFmpegPerStreamOption("-filter");
  preset = new FFmpegPerStreamOption("-pre");
  frameSize = new FFmpegPerStreamOption("-s");
  aspectRatio = new FFmpegPerStreamOption("-aspect");
  noAutoRotate = new FFmpegOption<boolean>("-noautorotate");
  pixelFormat = new FFmpegPerStreamOption("-pix_fmt");
  swsFlags = new FFmpegOption<string>("-sws_flags");
  forceKeyFrames = new FFmpegPerStreamOption("-force_key_frames");

  // Audio
  audioCodec = new FFmpegOption<string | string[]>("-c:a");
  audioSamplingFrequency = new FFmpegOption<string>("-ar");
  audioQuality = new FFmpegOption<string>("-q:a");
  audioChannels = new FFmpegPerStreamOption("-ac");
  audioSampleFormat = new FFmpegPerStreamOption("-sample_fmt");
  discardAudio = new FFmpegOption<boolean>("-an");

  // Mapping
  map = new FFmpegOption<string>("-map");
  mapChannel = new FFmpegOption<string>("-map_channel");
  mapMetaData = new FFmpegOption<string>("-map_metadata");
  mapChapters = new FFmpegOption<string>("-map_chapters");
}

class FFmpegGlobalOptions {
  stdin = new FFmpegOption<boolean>("-stdin");
  // Set number of times input stream shall be looped. Loop 0 means no loop, loop -1 means infinite loop.
  streamLoop = new FFmpegOption<number>("-stream_loop");
  // Overwrite output files without asking.
  overwriteWithoutAsking = new FFmpegOption<boolean>("-y");
  // Do not overwrite output files, and exit immediately if a specified output file already exists.
  doNotOverwrite = new FFmpegOption<boolean>("-n");
  filterThreads = new FFmpegOption<number>("-filter_threads");
  hideBanner = new FFmpegOption<boolean>("-hide_banner", true);
  stats = new FFmpegOption<boolean>("-stats");
  dump = new FFmpegOption<boolean>("-dump");
  hex = new FFmpegOption<boolean>("-hex");
  progress = new FFmpegOption<string>("-progress");
  initHwDevice = new FFmpegOption<string>("-init_hw_device");
  filterHwDevice = new FFmpegOption<string>("-filter_hw_device");
  timelimit = new FFmpegOption<number>("-timelimit");
  vsync = new FFmpegOption<string>("-vsync");
  copyts = new FFmpegOption<boolean>("-copyts");
  copytb = new FFmpegOption<string>("-copyts");
  startAtZero = new FFmpegOption<boolean>("-start_at_zero");
}

export class FFmpegOptions {
  input = "";
  output = "";
  #global = new FFmpegGlobalOptions();
  #inputOptions = new FFmpegInputOptions();
  #outputOptions = new FFmpegOutputOptions();

  toArgs() {
    const args = [];
    Object.values(this.#global).forEach((v) => {
      args.push(v.toArg());
    });
    Object.values(this.#inputOptions).forEach((v) => {
      args.push(v.toArg());
    });
    args.push(this.input);
    Object.values(this.#outputOptions).forEach((v) => {
      args.push(v.toArg());
    });
    args.push(this.output);
    return args.filter((v) => !!v).join(" ");
  }

  globalOption(key: keyof FFmpegGlobalOptions) {
    return this.#global[key];
  }

  inputOption(key: keyof FFmpegInputOptions) {
    return this.#inputOptions[key];
  }

  outputOption(key: keyof FFmpegOutputOptions) {
    return this.#outputOptions[key];
  }
}
