import path from "path";
import { extensions, releaseGroups, tldSuffixes } from "./lists";
import {
  normalizeAudio,
  Audio,
  normalizeEdition,
  normalizeProviders,
  normalizeResolution,
  normalizeType,
  normalizeCodec,
  normalizeTitle,
} from "./normalizers";

const getMatchGroups = (
  matcher: RegExp,
  subject: string,
): Record<string, string> => {
  const matches = matcher.exec(subject);
  if (matches && matches.groups) {
    return matches.groups;
  }
  return {};
};

export class Matcher {
  private fileName: string;
  private dirName: string;

  public extension?: string;
  public type?: string;
  public title?: string;
  public show?: string;
  public year?: number;
  public season?: number;
  public episode?: number;
  public resolution?: string;
  public edition?: string;
  public releaseGroup?: string;
  public audio?: Audio;
  public codec?: string;
  public provider?: string;
  public sbs?: string;

  public isRepack = false;
  public isDubbed = false;
  public isSubbed = false;
  public isMulti = false;
  public isProper = false;
  public isUnrated = false;
  public isRemux = false;
  public isHDR = false;
  public is3D = false;
  public isDolbyVision = false;

  public constructor(orgName: string, public category = "movie") {
    this.extension = parseExtension(orgName);
    this.fileName = path.basename(
      orgName,
      this.extension ? `.${this.extension}` : undefined,
    );
    this.dirName = path.basename(path.dirname(orgName));
    if (this.dirName.includes("Obfuscated")) {
      this.match(this.dirName);
    } else {
      this.match(this.fileName);
      if (
        (this.category === "movie" && !this.year) ||
        (this.category === "show" && !this.show)
      ) {
        this.match(this.dirName);
      }
    }
  }

  private match(input: string): void {
    let all = input;

    // Try to match only the last occurring year
    const yearRxp = /(?:[[(])?(?<year>(19[0-9]{2}|20[0-9]{2}))(?:[\])])?/g;
    let yearMatches: RegExpExecArray | null = null;
    let nextMatches: RegExpExecArray | null = null;
    let matchIndex = -1;
    while ((nextMatches = yearRxp.exec(all))) {
      if (nextMatches) {
        yearMatches = nextMatches;
      }
    }
    if (yearMatches) {
      matchIndex = yearMatches.index;
      this.year = Number(yearMatches[1]);
      all = all.replace(yearMatches[2], "").replace(/(\[\]|\(\)| )/g, " ");
    }

    // Try to match season and episode
    const seriesMatcher =
      /[. ](S(?<season>[0-9]{1,2}))(E(?<episode>[0-9]{1,3}))?/i.exec(all);
    if (seriesMatcher?.groups) {
      const groups = seriesMatcher?.groups;
      const { season, episode } = groups;
      matchIndex = seriesMatcher.index;
      all = all.replace(seriesMatcher[0], "");
      if (season) {
        this.season = Number(season);
      }
      if (episode) {
        this.episode = Number(episode);
      }
      this.category = "show";
    }

    // Split up title and the rest so we don't
    // match parts of the title by mistake
    let title = all;
    let rest = all;
    if (matchIndex > 0) {
      title = all.slice(0, matchIndex);
      rest = all.slice(matchIndex + 1);
    }

    const { codec } = getMatchGroups(
      /(?<codec>xvid|[hx]\.?26[45]|avc|hevc)/i,
      rest,
    );
    if (codec) {
      this.codec = normalizeCodec(codec.toLowerCase());
      rest = rest.replace(codec, "").replace("  ", " ").trim();
    }

    const audioRxp =
      /(?<audio>MP3|FLAC|DD[P]?[25]\.?[01]|DTS(?:-HD)?\.?(?:MA)?\.?(?:5\.1|6\.1|7\.1|7\.2)|TrueHD\.?(?:5\.1|6\.1|7\.1|7\.2)\.(?:ATMOS)?|ATMOS|AAC[.-]LC|AAC(?:\.?2\.0)?|AC3(?:\.5\.1)?)/i;
    let audioMatches: RegExpExecArray | null = null;
    while ((audioMatches = audioRxp.exec(rest))) {
      if (audioMatches?.groups) {
        const { audio } = audioMatches.groups;
        if (audio) {
          if (!this.audio) {
            this.audio = normalizeAudio(audio);
          }
          rest = rest.replace(audio, "").replace("  ", " ").trim();
        }
      }
    }

    const { resolution } = getMatchGroups(
      /(?<resolution>576p|576i|720p|720i|1080i|1080p|2160p|4320p|4K|8K)/i,
      rest,
    );
    if (resolution) {
      this.resolution = normalizeResolution(resolution);
      rest = rest.replace(resolution, "").replace("  ", " ");
    }

    const { type } = getMatchGroups(
      /(?<type>(?:PPV\.)?[HP]DTV|(?:HD)?CAM|B[DR]Rip|(?:HD-?)?TS|(?:PPV )|WEBRip|WEB-DL|WEB|HDRip|DVDRip|DVDRIP|CamRip|W[EB]BRip|BluRay|DvDScr|hdtv|telesync)/i,
      rest,
    );
    if (type) {
      this.type = normalizeType(type);
      rest = rest.replace(type, "").replace("  ", " ").trim();
    }

    const { provider } = getMatchGroups(
      /(?<provider>AMZN|AMAZON|NF|NFLX|NETFLIX|HULU|DSNP|DSNY|RED|ATVP)/i,
      rest,
    );
    if (provider) {
      this.provider = normalizeProviders(provider);
      rest = rest.replace(provider, "").replace("  ", " ").trim();
    }

    // Look for sbs
    if (rest.includes("Half-SBS")) {
      this.sbs = "half";
      rest = rest.replace("Half-SBS", "").trim();
    } else if (rest.includes("SBS")) {
      this.sbs = "full";
      rest = rest.replace("SBS", "").trim();
    }

    // Look for tags
    const tags = {
      is3D: "3D",
      isDolbyVision: "DV",
      isDubbed: "DUBBED",
      isHDR: "HDR",
      isInternal: "INTERNAL",
      isLimited: "LIMITED",
      isProper: "PROPER",
      isRemux: "REMUX",
      isRepack: "REPACK",
      isUnrated: "UNRATED",
      isSubbed: "SUBBED",
      isMulti: "MULTi",
      _UHD: "UHD",
      _AHDTV: "AHDTV",
    };
    Object.entries(tags).forEach(([key, str]) => {
      const pos = rest.toUpperCase().indexOf(str);
      if (pos !== -1) {
        if (key[0] !== "_") {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          (this as any)[key] = true;
        }
        rest = rest.substr(0, pos) + rest.substr(pos + str.length);
      }
    });

    // Remove ugly prefix
    const uglyPrefix = /^(\[(.+)\])/.exec(title);
    if (uglyPrefix) {
      title = title.replace(uglyPrefix[0], "").replace("  ", " ").trim();
    }

    // Remove ugly suffix
    const uglySuffix = /(\[(.+)\]|( - )|(\[|\]|-))$/.exec(rest);
    if (uglySuffix) {
      rest = rest.replace(uglySuffix[0], "").replace("  ", " ").trim();
    }

    const rlsgrpMatches = new RegExp(
      `(?<rlsgrp>${releaseGroups.join("|")})$`,
      "i",
    ).exec(rest);
    if (rlsgrpMatches) {
      this.releaseGroup = rlsgrpMatches[1];
      rest = rest
        .replace(rlsgrpMatches[0], "")
        .replace("  ", " ")
        .slice(0, -1)
        .trim();
    }

    // Remove any trailing url
    const urlSuffixMatches = new RegExp(
      `(?<url>(https?://)?(www.)?([a-zA-Z]+).(${tldSuffixes.join("|")}))$`,
    ).exec(rest);
    if (urlSuffixMatches) {
      rest = rest.replace(urlSuffixMatches[1], "").replace("  ", " ").trim();
    }

    // Replace all dots and underscore with whitespace
    title = title.replace(/(\.|_)/g, " ").trim();
    rest = rest.replace(/(\.|_)/g, " ").trim();

    const titleMatcher = /^([\p{L}\p{N}\p{No} ]+)/iu.exec(title);
    if (titleMatcher) {
      title = titleMatcher[0];
    }

    // Use what's left as episode title
    if (this.category === "show") {
      if (rest) {
        const episodeTitle = rest.trim();
        if (episodeTitle) {
          rest = rest.replace(episodeTitle, "").trim();
          this.show = normalizeTitle(title);
          this.title = episodeTitle;
          return;
        }
      } else {
        this.show = normalizeTitle(title);
        this.title = "";
        return;
      }
    }

    const editions = [
      "DC",
      "SE",
      "CE",
      "Director[']?s Cut",
      "Special Edition",
      "Collector[']?s Edition",
      "Special Collector[']?s Edition",
      "Extended",
      "Extended Edition",
      "Digitally Remastered",
    ];
    const { edition } = getMatchGroups(
      new RegExp("^(?<edition>" + editions.join("|") + ")", "i"),
      rest,
    );
    if (edition) {
      this.edition = normalizeEdition(edition);
      rest = rest.replace(edition, "");
    }

    this.title = normalizeTitle(title);
  }
}

function parseExtension(input: string): string | undefined {
  const match = new RegExp(`(.${extensions.join("|")})$`, "i").exec(input);
  return match ? match[0] : undefined;
}
