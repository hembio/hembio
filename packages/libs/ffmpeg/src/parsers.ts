// Convert HH:MM:SS.MS to seconds
export function timerToSec(timer: string) {
  let vtimer = timer.split(":");
  let vhours = +vtimer[0];
  let vminutes = +vtimer[1];
  let vseconds = parseFloat(vtimer[2]);
  return vhours * 3600 + vminutes * 60 + vseconds;
}

// Convert seconds to HH:MM:SS.MS
export function secToTimer(sec: number) {
  let o = new Date(0);
  let p = new Date(sec * 1000);
  return new Date(p.getTime() - o.getTime())
    .toISOString()
    .split("T")[1]
    .split("Z")[0];
}

const sizeUnits = ["b", "kB", "mB"];
// Converts kB and mB to bytes
function parseSize(size: number, unit: string) {
  const magnitude = sizeUnits.indexOf(unit) * 1024;
  return Number(size) * magnitude;
}

// Converts bit/s and mbit/s to kbit/s
function parseBitrate(bitrate: number, unit: string) {
  if (unit === "bit/s") {
    return bitrate * 1000;
  }
  if (unit === "mbit/s") {
    return bitrate / 1000;
  }
  return bitrate;
}

const shortProgressRxp = /frame=\s*(?<frame>[0-9]+)\s+fps=(?<fps>[\d.]+)\s+q=(?<q>[-.\d]+)\s+size=(?<size>N\/A|[\d]+)(?<sizeunit>[\w]+)?\s+time=(?<time>\d\d:\d\d:\d\d\.\d\d)\s+bitrate=(N\/A|[\d]+)(?<bitrateunit>[\w]+)?\s+speed=\s*(?<speed>[\d.]+)/;
export function parseShortProgress(data: string) {
  const matches = shortProgressRxp.exec(data);
  if (!matches || !matches.groups) {
    return;
  }
  const {
    frame,
    fps,
    q,
    size,
    sizeunit,
    time,
    bitrate,
    bitrateunit,
    speed,
  } = matches.groups;
  return {
    frame: Number(frame),
    fps: Number(fps),
    q: Number(q),
    size: parseSize(Number(size), sizeunit) || 0,
    time: timerToSec(time),
    bitrate: parseBitrate(Number(bitrate), bitrateunit),
    speed: Number(speed),
  };
}

const progressRxp = /frame=\s*(?<nframe>[0-9]+)\s+fps=\s*(?<nfps>[0-9\.]+)\s+q=(?<nq>[0-9\.-]+)\s+(L?)\s*size=\s*(?<nsize>[0-9]+)(?<ssize>kB|mB|b)?\s*time=\s*(?<sduration>[0-9\:\.]+)\s*bitrate=\s*(?<nbitrate>[0-9\.]+)(?<sbitrate>bits\/s|mbits\/s|kbits\/s)?.*(dup=(?<ndup>\d+)\s*)?(drop=(?<ndrop>\d+)\s*)?speed=\s*(?<nspeed>[0-9\.]+)x/;
export function parseProgress(data: string) {
  const matches = progressRxp.exec(data);
  if (!matches) {
    return;
  }
  return {
    frame: Number(matches[1]),
    fps: Number(matches[2]),
    q: Number(matches[3]),
    size: parseSize(Number(matches[5]) || 0, matches[6]),
    time: timerToSec(matches[7]),
    bitrate: parseBitrate(Number(matches[8]), matches[9]),
    duplicates: Number(matches[12] || 0),
    dropped: Number(matches[13] || 0),
    speed: Number(matches[14]),
  };
}

const infoRxp = /Duration\: ([^,]+), start: ([^,]+), bitrate: ([^ ]+) (b\s|kb\/s|mb\s)/;
export function parseInfo(data: string) {
  const matches = infoRxp.exec(data);
  if (!matches) {
    return;
  }
  return {
    duration: timerToSec(matches[1]),
    start: Number(matches[2]),
    bitrate: parseBitrate(Number(matches[3]), matches[4]),
  };
}

const writingRxp = /Opening '(.+)' for writing/;
export function parseWriting(data: string) {
  const matches = writingRxp.exec(data);
  if (!matches) {
    return;
  }
  return matches[1];
}

const statusRxp = /frame=\s*(?<nframe>[0-9]+)\s+fps=\s*(?<nfps>[0-9\.]+)\s+q=(?<nq>[0-9\.-]+)\s+(L?)\s*size=\s*(?<nsize>[0-9]+)(?<ssize>kB|mB|b)?\s*time=\s*(?<sduration>[0-9\:\.]+)\s*bitrate=\s*(?<nbitrate>[0-9\.]+)(?<sbitrate>bits\/s|mbits\/s|kbits\/s)?.*(dup=(?<ndup>\d+)\s*)?(drop=(?<ndrop>\d+)\s*)?speed=\s*(?<nspeed>[0-9\.]+)x/;
