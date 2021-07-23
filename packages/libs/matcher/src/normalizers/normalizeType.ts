export function normalizeType(input: string): string {
  input = input.toUpperCase();

  if (input.endsWith("RIP")) {
    return input.replace("RIP", "Rip");
  }

  switch (input) {
    case "BLURAY":
    case "BLU-RAY":
      return "BluRay";
    default:
      return input;
  }
}
