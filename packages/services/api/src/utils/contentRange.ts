export function contentRange(
  type: string,
  size: number,
  range?: { start: number; end: number },
): string {
  return (
    type + " " + (range ? range.start + "-" + range.end : "*") + "/" + size
  );
}
