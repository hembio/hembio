export function prettyTime(time = new Date(), showSeconds = true): string {
  const HH = time.getHours().toString().padStart(2, "0");
  const MM = time.getMinutes().toString().padStart(2, "0");
  if (!showSeconds) {
    return `${HH}:${MM}`;
  }
  const SS = time.getSeconds().toString().padStart(2, "0");
  return `${HH}:${MM}:${SS}`;
}
