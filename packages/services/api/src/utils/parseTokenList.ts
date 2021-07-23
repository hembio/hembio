export function parseTokenList(str: string): string[] {
  const list = [];
  let start = 0;
  let end = 0;
  // gather tokens
  for (let i = 0, len = str.length; i < len; i++) {
    switch (str.charCodeAt(i)) {
      case 0x20 /*   */:
        if (start === end) {
          start = end = i + 1;
        }
        break;
      case 0x2c /* , */:
        list.push(str.substring(start, end));
        start = end = i + 1;
        break;
      default:
        end = i + 1;
        break;
    }
  }
  // final token
  list.push(str.substring(start, end));
  return list;
}
