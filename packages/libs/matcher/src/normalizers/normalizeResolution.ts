export function normalizeResolution(input: string): string {
  input = input.toLowerCase();
  switch (input) {
    case "4k":
      return "2160p";
    case "8k":
      return "4320p";
    default:
      return input;
  }
}
