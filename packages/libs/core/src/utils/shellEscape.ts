// return a shell compatible format
export function shellEscape(a: string[]): string {
  const ret: string[] = [];
  a.forEach((s) => {
    if (/[^A-Za-z0-9_/:=-]/.test(s)) {
      s = "'" + s.replace(/'/g, "'\\''") + "'";
      s = s
        .replace(/^(?:'')+/g, "") // deduplicate single-quote at the beginning
        .replace(/\\'''/g, "\\'"); // remove non-escaped single-quote if there are enclosed between 2 escaped
    }
    ret.push(s);
  });

  return ret.join(" ");
}
