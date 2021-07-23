export function capitalize(str: string): string {
  // Using index and substr is fastest
  return str[0].toUpperCase() + str.substr(1);
}
