export function normalizeTitle(word: string): string {
  const splitWord = word.trim().split(" ");
  return splitWord
    .map((str, idx) => {
      if (!str) {
        return str;
      }
      if (
        idx !== 0 &&
        idx !== splitWord.length - 1 &&
        [
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
        ].includes(str.toLowerCase())
      ) {
        return str.toLowerCase();
      }
      return str[0].toUpperCase() + str.substr(1);
    })
    .join(" ");
}
