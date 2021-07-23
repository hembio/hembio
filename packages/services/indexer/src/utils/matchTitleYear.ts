const regexp = /(?<title>[\p{L}\-\d.!?'#&+*½@·$%:()<> ]+) \((?<year>\d{4})\)/u;

export function matchTitleYear(str: string): RegExpMatchArray | null {
  return regexp.exec(str);
}
