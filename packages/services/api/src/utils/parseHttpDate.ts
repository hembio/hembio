export function parseHttpDate(date: string | undefined): number {
  const timestamp = date && Date.parse(date);
  return typeof timestamp === "number" ? timestamp : NaN;
}
