import Hls from "hls.js";
import { makeObservable, action, computed, flow, observable } from "mobx";
import type { FileWithTitleFragment } from "../generated/graphql";
import { HEMBIO_API_URL } from "~/constants";

// const ve = document.createElement("video");
// const h264 = ve.canPlayType('video/webm; codecs="avc1.640029"') === "probably";
// const hevc =
//   ve.canPlayType('video/webm; codecs="hev1"') === "probably" ||
//   ve.canPlayType('video/webm; codecs="hvc1"') === "probably";
// const ac3 = ve.canPlayType('video/webm; codecs="ac-3"') === "probably";
// const eac3 = ve.canPlayType('video/webm; codecs="eac-3"') === "probably";

interface TextCue {
  text: string;
  startTime: number;
  endTime: number;
  position: number | "auto";
  positionAlign: string;
}

export class PlayerStore {
  public file?: FileWithTitleFragment;
  public duration = 0;
  public volume = 1;
  public currentTime = 0;
  public isReady = false;
  public isPlaying = false;
  public isPending = false;
  public isMuted = false;
  public inFullscreen = false;
  public textCues = new Array<TextCue>();
  public buffers = observable.array<[number, number]>();

  public directAudio = true;
  public directVideo = true;

  public get directPlay(): boolean {
    return this.directAudio && this.directVideo;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public mpv?: any;
  public hls?: Hls;
  public video?: HTMLVideoElement;
  private timer?: number;

  public constructor() {
    makeObservable(this, {
      file: observable.shallow,
      duration: observable,
      volume: observable,
      currentTime: observable,
      isReady: observable,
      isPlaying: observable,
      isMuted: observable,
      inFullscreen: observable,
      textCues: observable.shallow,
      timeLeft: computed,
      endsAt: computed,
      setCurrentTime: action.bound,
      setPending: action.bound,
      setInFullscreen: action.bound,
      setPlaying: action.bound,
      setDuration: action.bound,
      setTextCues: action.bound,
      setVolume: action.bound,
      toggleFullscreen: flow,
      togglePlayback: action.bound,
      toggleMute: action.bound,
      seek: action.bound,
      load: action.bound,
      unload: action.bound,
      init: action.bound,
      setBuffers: action,
    });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const mpv = (window as any).parent.mpv;
    if (mpv) {
      this.mpv = mpv;
    }
  }

  public get timeLeft(): number {
    return Math.ceil(this.duration - this.currentTime);
  }

  public get endsAt(): string {
    const d = new Date(Date.now() + this.timeLeft * 1000);
    return (
      d.getHours().toString().padStart(2, "0") +
      ":" +
      d.getMinutes().toString().padStart(2, "0")
    );
  }

  public setCurrentTime(currentTime: number): void {
    if (this.currentTime !== currentTime) {
      this.currentTime = currentTime;
    }
  }

  public setPending(isPending = true): void {
    this.isPending = isPending;
  }

  public setInFullscreen(inFullscreen = true): void {
    this.inFullscreen = inFullscreen;
  }

  public setPlaying(isPlaying = true): void {
    this.isPlaying = isPlaying;
  }

  public setDuration(duration: number): void {
    this.duration = duration;
  }

  public *toggleFullscreen(this: PlayerStore): Generator<Promise<void>> {
    if (!document.fullscreenElement) {
      yield document.documentElement.requestFullscreen();
      this.inFullscreen = true;
    } else {
      if (document.exitFullscreen) {
        yield document.exitFullscreen();
        this.inFullscreen = false;
      }
    }
  }

  public togglePlayback(): void {
    if (this.mpv) {
      if (this.isPlaying) {
        this.mpv.pause();
      } else {
        this.mpv.play();
      }
    }
    if (!this.video) {
      return;
    }
    if (this.isPlaying) {
      this.video.pause();
    } else {
      this.video.play();
    }
  }

  public seek(time: number): void {
    if (this.mpv) {
      this.mpv.currentTime = time;
    } else if (this.video) {
      this.video.currentTime = time;
    }
    this.setCurrentTime(time);
    clearInterval(this.timer);
  }

  public toggleMute(): void {
    if (this.mpv) {
      this.mpv.muted = !this.mpv.muted;
      this.isMuted = this.mpv.muted;
      this.volume = this.isMuted ? 0 : this.mpv.volume;
    } else if (this.video) {
      this.video.muted = !this.video.muted;
      this.isMuted = this.video.muted;
      this.volume = this.isMuted ? 0 : this.video.volume;
    }
  }

  public setVolume(volume: number): void {
    if (this.mpv) {
      this.mpv.volume = volume;
      this.volume = volume;
    } else if (this.video) {
      this.video.volume = volume;
      this.volume = this.video.volume;
    }
  }

  public load(file: FileWithTitleFragment): void {
    if (this.mpv) {
      setTimeout(() => {
        this.mpv.command("loadfile", `${HEMBIO_API_URL}/stream/${file.id}`);
      }, 500);
      return;
    }

    if (!this.video) {
      return;
    }
    this.file = file;

    if (this.directPlay) {
      this.video.src = `${HEMBIO_API_URL}/stream/${file.id}`;
    } else if (this.hls) {
      this.hls.loadSource(`${HEMBIO_API_URL}/stream/${file.id}/playlist.m3u8`);
    }
  }

  public unload(): void {
    if (this.hls) {
      this.hls.destroy();
    }
    this.currentTime = 0;
    this.duration = 0;
    this.isPlaying = false;
    this.isPending = false;
    this.isReady = false;
    this.file = undefined;
    this.video = undefined;
  }

  public setTextCues(cues: TextCue[]): void {
    this.textCues = cues;
  }

  public setBuffers(buf: Array<[number, number]>): void {
    this.buffers.replace(buf);
  }

  public init(videoRef: HTMLVideoElement | HTMLEmbedElement): void {
    if (!videoRef) {
      return;
    }

    document.documentElement.addEventListener("fullscreenchange", () => {
      this.setInFullscreen(document.fullscreenElement ? true : false);
    });

    if (this.mpv) {
      this.mpv.setRef(videoRef);

      this.mpv.on("play", () => {
        this.setPending(false);
        this.setPlaying(true);
      });

      this.mpv.on("pause", () => {
        this.setPlaying(false);
      });

      this.mpv.on("durationchange", () => {
        this.setDuration(this.mpv.duration);
      });

      this.mpv.on("timeupdate", () => {
        this.setCurrentTime(Math.floor(this.mpv.currentTime));
      });

      // this.mpv.on("volumechange", () => {
      //   this.setVolume(this.mpv.volume);
      // });

      return;
    }

    this.video = videoRef as HTMLVideoElement;

    if (this.video.textTracks) {
      Array.from(this.video.textTracks).forEach((track) => {
        track.mode = "hidden";
        track.addEventListener("cuechange", (_e) => {
          // const track = e.currentTarget as TextTrack;
          if (track.activeCues && track.language === "en") {
            const cues: TextCue[] = [];
            Array.from(track.activeCues).forEach((cue) => {
              const vtt = cue as VTTCue;
              if (vtt.text) {
                const { text, startTime, endTime, position, positionAlign } =
                  vtt;
                cues.push({
                  text,
                  startTime,
                  endTime,
                  position,
                  positionAlign,
                });
              }
            });
            this.setTextCues(cues);
          }

          // if (track.activeCues) {
          //   this.setTextCues(
          //     Array.from<VTTCue>(
          //       track.activeCues as any,
          //     ).map((cue: VTTCue) => ({ ...cue })),
          //   );
          // }
          console.log(track.activeCues);
          // this.setTextCues();
        });
      });
    }

    const urlParams = new URLSearchParams(window.location.search);

    if (urlParams.get("directVideo")) {
      this.directAudio = urlParams.get("directVideo") === "1";
    }
    if (urlParams.get("directAudio")) {
      this.directVideo = urlParams.get("directVideo") === "1";
    }

    if (!this.directPlay) {
      this.hls = new Hls({
        xhrSetup: (xhr, url) => {
          xhr.withCredentials = true;
          xhr.open(
            "GET",
            url +
              `?directVideo=${this.directVideo ? "1" : "0"}&directAudio=${
                this.directAudio ? "1" : "0"
              }`,
          );
        },
      });

      this.hls.on(Hls.Events.MEDIA_ATTACHED, () => {
        console.log("Attached to video");
      });

      this.hls.on(Hls.Events.MANIFEST_PARSED, () => {
        console.log("Manifest parsed");
        if (this.hls && this.video) {
          this.hls.attachMedia(this.video);
        }
      });

      this.hls.on(Hls.Events.ERROR, (e) => {
        console.error(e);
      });
    } else {
      this.video.src = "";
    }

    this.video.addEventListener("canplay", () => {
      if (!this.video) {
        return;
      }
      // console.log("Media can now be played");
      this.setPending(false);
      this.setCurrentTime(this.video.currentTime);
      this.setVolume(this.video.volume);
      this.setDuration(this.video.duration);
      this.video.play();
    });

    this.video.addEventListener("timeupdate", () => {
      if (this.video) {
        this.setCurrentTime(Math.floor(this.video.currentTime));
      }
    });

    this.video.addEventListener("durationchange", () => {
      if (this.video) {
        this.setDuration(this.video.duration);
      }
    });

    this.video.addEventListener("play", () => {
      this.setPending(false);
      this.setPlaying(true);
    });

    this.video.addEventListener("pause", () => {
      this.setPlaying(false);
    });

    this.video.addEventListener("waiting", () => {
      this.setPlaying(true);
      this.setPending(true);
    });

    this.video.addEventListener("seeking", () => {
      this.setPending(true);
      this.setPlaying(true);
    });

    this.video.addEventListener("seeked", () => {
      this.setPending(false);
      this.setPlaying(true);
    });

    this.video.addEventListener("stalled", () => {
      this.setPlaying(false);
      this.setPending(true);
    });

    this.video.addEventListener("ended", () => {
      this.setPlaying(false);
    });

    this.video.addEventListener("progress", () => {
      const buf = this.video?.buffered;
      if (buf) {
        const buffers: Array<[number, number]> = new Array(buf.length)
          .fill(undefined)
          .map((v, i) => [buf.start(i), buf.end(i)]);
        this.setBuffers(buffers);
      }
    });
  }
}
