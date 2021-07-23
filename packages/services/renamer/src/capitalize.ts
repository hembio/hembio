const ignoreWordList = [
  "a",
  "after",
  "along",
  "an",
  "and",
  "around",
  "at",
  "but",
  "for",
  "from",
  "in",
  "nor",
  "of",
  "on",
  "or",
  "so",
  "the",
  "to",
  "with",
  "without",
  "yet",
];

export function capitalize(word: string): string {
  if (typeof word !== "string") {
    throw Error("Argument is not a string");
  }
  const splitWord = word.split(" ");
  return splitWord
    .map((str, idx) => {
      if (!str) {
        return str;
      }
      if (
        idx !== 0 &&
        idx !== splitWord.length - 1 &&
        ignoreWordList.includes(str.toLowerCase())
      ) {
        return str.toLowerCase();
      }
      return str[0].toUpperCase() + str.substr(1);
    })
    .join(" ");
}
