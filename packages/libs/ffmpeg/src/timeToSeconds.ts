/**
 * Parse 00:00:00.00 to seconds
 */
export function timeToSeconds(ffmpegTime: string) {
  return ffmpegTime
    .split(":")
    .reverse()
    .reduce((acc, cur, i) => {
      const t = parseFloat(cur.trim()) * Math.pow(60, i);
      return Math.round((acc + t) * 100) / 100;
    }, 0);
}
