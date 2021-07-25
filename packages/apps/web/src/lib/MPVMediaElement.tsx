import { EventEmitter } from "eventemitter3";

type MPVEmbedElement = HTMLEmbedElement & {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  postMessage(msg: { type: string; data: any }): void;
};

interface MPVEvent extends Event {
  data: {
    type: string;
    data: {
      name: string;
      value: string | number | boolean;
    };
  };
}

export class MPVMediaElement extends EventEmitter {
  private ref?: MPVEmbedElement;

  public autoplay = true;
  public seeking = false;
  public playsInline = false;
  public duration = 0;
  public poster = "";
  public videoHeight = 0;
  public videoWidth = 0;
  public _src?: string;

  private _ended = false;
  public get ended(): boolean {
    return this._ended;
  }

  private _paused = false;
  public get paused(): boolean {
    return this._paused;
  }

  public set paused(paused: boolean) {
    this.setProperty("paused", paused);
  }

  private _volume = 1;
  public get volume(): number {
    return this._volume;
  }

  public set volume(time: number) {
    this.seeking = true;
    this.setProperty("volume", time * 100);
  }

  private _currentTime = 0;
  public get currentTime(): number {
    return this._currentTime;
  }

  public set currentTime(time: number) {
    this.seeking = true;
    this.setProperty("time-pos", time);
  }

  public get src(): string | undefined {
    return this._src;
  }

  public set src(src: string | undefined) {
    if (!src) {
      this._src = src;
      this._ended = false;
      this._paused = true;
    } else if (src !== this._src) {
      this._src = src;
      this._ended = false;
      this._paused = true;
      this.command("loadfile", src);
    }
  }

  public constructor() {
    super();

    this.on("ready", () => {
      this.setProperty("hwdec", "auto");
      this.setProperty("replaygain", "no");
      this.setProperty("volume", 100);
      this.setProperty("pause", !this.autoplay);
      [
        "pause",
        "playback-time",
        "duration",
        "eof-reached",
        "volume",
        "seeking",
        "paused-for-cache",
        "cache-buffering-state",
        "sub-text-ass",
      ].forEach(this.observe.bind(this));
    });
  }

  public getVideoPlaybackQuality(): VideoPlaybackQuality {
    throw new Error("Method not implemented.");
  }

  public get buffered(): void {
    throw new Error("Property not implemented.");
  }

  public controls = false;
  public crossOrigin = "";

  public get currentSrc(): string | undefined {
    return this.src;
  }

  public readonly defaultMuted = false;

  public readonly defaultPlayBackRate = 1;

  private _error?: MediaError;
  public get error(): MediaError | undefined {
    return this._error;
  }

  public readonly loop = false;

  public get mediaKeys(): MediaKeys {
    throw new Error("Property not implemented.");
  }

  public _muted = false;
  public get muted(): boolean {
    return this._muted;
  }

  public set muted(muted: boolean) {
    this.setProperty("muted", muted);
  }

  public networkState = 0;

  public set onencrypted(
    _handler: (this: HTMLMediaElement, _ev: MediaEncryptedEvent) => void,
  ) {
    throw new Error("Method not implemented.");
  }

  public set onwaitingforkey(
    _handler: (this: HTMLMediaElement, _ev: Event) => void,
  ) {
    throw new Error("Method not implemented.");
  }

  public readonly playbackRate = 1;

  public get played(): TimeRanges {
    throw new Error("Property not implemented.");
  }

  public preload = "auto";

  private _readyState = 0;
  public get readyState(): number {
    return this._readyState;
  }

  public get seekable(): TimeRanges {
    throw new Error("Property not implemented.");
  }

  public srcObject?: MediaProvider;
  public textTracks?: TextTrackList;

  public addTextTrack(
    _kind: TextTrackKind,
    _label?: string,
    _language?: string,
  ): TextTrack {
    throw new Error("Method not implemented.");
  }

  public canPlayType(_type: string): string {
    return "probably";
  }

  public fastSeek(_time: number): void {
    throw new Error("Method not implemented.");
  }

  public load(): void {
    throw new Error("Method not implemented.");
  }

  public pause(): void {
    this.setProperty("pause", true);
  }

  public async play(): Promise<void> {
    this.setProperty("pause", false);
  }

  public setMediaKeys(_mediaKeys: MediaKeys): Promise<void> {
    throw new Error("Method not implemented.");
  }

  public command(cmd: string, ...args: Array<string | number | boolean>): void {
    args = args.map((arg) => arg.toString());
    this.postData("command", [cmd, ...args]);
  }

  private setProperty<T>(name: string, value: T) {
    const data = {
      name,
      value,
    };
    this.postData<T>("set_property", data);
  }

  private observe<T>(name: T) {
    this.postData<T>("observe_property", name);
  }

  public keypress({
    key,
    shiftKey,
    ctrlKey,
    altKey,
  }: {
    key: string;
    shiftKey: string;
    ctrlKey: string;
    altKey: string;
  }): void {
    // Don't need modifier events.
    if (
      [
        "Escape",
        "Shift",
        "Control",
        "Alt",
        "Compose",
        "CapsLock",
        "Meta",
      ].includes(key)
    )
      return;

    if (key.startsWith("Arrow")) {
      key = key.slice(5).toUpperCase();
      if (shiftKey) {
        key = `Shift+${key}`;
      }
    }
    if (ctrlKey) {
      key = `Ctrl+${key}`;
    }
    if (altKey) {
      key = `Alt+${key}`;
    }

    // Ignore exit keys for default keybindings settings.
    if (
      [
        "q",
        "Q",
        "ESC",
        "POWER",
        "STOP",
        "CLOSE_WIN",
        "CLOSE_WIN",
        "Ctrl+c",
        "AR_PLAY_HOLD",
        "AR_CENTER_HOLD",
      ].includes(key)
    )
      return;

    this.command("keypress", key);
  }

  public destroy(): void {
    this.ref?.remove();
  }

  private postData<T extends Array<string | number | boolean>>(
    type: "command",
    data: T,
  ): void;
  private postData<T>(
    type: "set_property",
    data: { name: string; value: T },
  ): void;
  private postData<T>(type: "observe_property", name: T): void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private postData(type: string, data: any): void {
    const msg = {
      type,
      data,
    };
    this.ref?.postMessage(msg);
  }

  private handleMessage(e: MPVEvent): void {
    const msg = e.data;
    const { type, data } = msg;
    if (type === "property_change") {
      const { name, value } = data;
      switch (name) {
        case "pause":
          this._paused = Boolean(value);
          this.emit(value === true ? "pause" : "play");
          break;
        case "playback-time":
          this._currentTime = Number(value);
          this.emit("timeupdate", value);
          break;
        case "duration":
          this.duration = Number(value);
          this.emit("durationchange", value);
          break;
        case "eof-reached":
          if (value !== this._ended) {
            this._ended = Boolean(value);
            this.emit("ended");
          }
          break;
        case "seeking":
          if (value !== this.seeking) {
            this.seeking = Boolean(value);
            this.emit("seeking");
          }
          break;
        case "volume":
          this._volume = Number(value) / 100;
          this.emit("volumechange");
          break;
        case "ao-mute":
          // console.log("MUTE", value);
          // this._volume = 1;
          // this.emit("volumechange");
          break;
        default:
          console.log("_handleMessage", msg);
          this.emit(name, value);
      }
    } else if (type === "ready") {
      this._paused = false;
      this.emit("ready", data);
    }
  }

  public setRef(node?: HTMLEmbedElement): void {
    if (node) {
      this.ref = node as MPVEmbedElement;
      this.ref.addEventListener(
        "message",
        this.handleMessage.bind(this) as (e: Event) => void,
      );
    }
  }
}
