export function secondsToTime(seconds: number) {
  const h = Math.floor(seconds / 60 / 60);
  seconds -= h * 60 * 60;
  const m = Math.floor(seconds / 60);
  seconds -= m * 60;
  const s = seconds;
  return (
    h.toString().padStart(2, "0") +
    ":" +
    m.toString().padStart(2, "0") +
    ":" +
    s.toString().padStart(2, "0")
  );
}
