export const prettyDuration = (
  totalSeconds: number,
  showHours = false,
): string => {
  if (totalSeconds === 0 || totalSeconds === -1) {
    return !showHours ? "00:00" : "00:00:00";
  }
  totalSeconds = Math.abs(totalSeconds);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = showHours
    ? Math.floor((totalSeconds - hours * 3600) / 60)
    : Math.floor(totalSeconds / 60);
  const seconds = showHours
    ? Math.floor(totalSeconds - hours * 3600 - minutes * 60)
    : Math.floor(totalSeconds - minutes * 60);
  const HH = (hours < 10 ? "0" : "") + hours.toString();
  const MM = (minutes < 10 ? "0" : "") + minutes.toString();
  const SS = (seconds < 10 ? "0" : "") + seconds.toString();
  return !showHours ? `${MM}:${SS}` : `${HH}:${MM}:${SS}`;
};
