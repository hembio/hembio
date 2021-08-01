import { matchTitleYear } from "../matchTitleYear";

describe("matchTitleYear", () => {
  it("should match Frankenstein's Monster's Monster, Frankenstein (2019)", () => {
    expect.assertions(2);
    const match = matchTitleYear(
      "Frankenstein's Monster's Monster, Frankenstein (2019)",
    );
    if (!match || !match.groups) {
      return;
    }
    const title = match.groups.title;
    const year = parseInt(match.groups.year, 10);
    expect(title).toBe("Frankenstein's Monster's Monster, Frankenstein");
    expect(year).toBe(2019);
  });

  it("should match Batman The Dark Knight Returns, Part 2 (2013)", () => {
    expect.assertions(2);
    const match = matchTitleYear(
      "Batman The Dark Knight Returns, Part 2 (2013)",
    );
    if (!match || !match.groups) {
      return;
    }
    const title = match.groups.title;
    const year = parseInt(match.groups.year, 10);
    expect(title).toBe("Batman The Dark Knight Returns, Part 2");
    expect(year).toBe(2013);
  });
});
