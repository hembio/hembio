export function normalizeProviders(input: string): string {
  input = input.toUpperCase();
  switch (input) {
    case "AMZN":
    case "AMAZON":
      return "Amazon";
    case "NF":
    case "NFLX":
    case "NETFLIX":
      return "Netflix";
    case "HULU":
      return "Hulu";
    case "DSNP":
      return "Disney+";
    case "DSNY":
      return "Disney Networks";
    case "RED":
      return "YouTube Premium";
    case "ATVP":
      return "Apple TV +";
    default:
      return input;
  }
}
