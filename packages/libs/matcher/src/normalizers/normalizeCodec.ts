export function normalizeCodec(input: string): string {
  input = input.toLowerCase();
  switch (input) {
    case "avc":
      return "AVC";
    case "xvid":
      return "XviD";
    case "h.264":
    case "h264":
      return "H.264";
    case "h.265":
    case "h265":
    case "hevc":
      return "H.265";
    default:
      return input;
  }
}
