import { matchTitleYear } from "../utils/matchTitleYear";

const names = `
π (1998)
61* (2001)
2012 (2009)
Æon Flux (2005)
Blood+ (2005)
Borat! Cultural Learnings of America for Make Benefit Glorious Nation of Kazakhstan (2006)
Don't Be a Menace to South Central While Drinking Your Juice in the Hood (1996)
To Wong Foo, Thanks for Everything! Julie Newmar (1995)
Moulin Rouge! (2001)
The Avengers (2012)
Spider-Man Homecoming (2017)
47 Meters Down (2017)
Atomica (2017)
Wonder Woman (2017)
Baywatch (2017)
Horton Hears a Who! (2008)
Mamma Mia! (2008)
Romeo + Juliet (1996)
Romeo & Julia (1996)
Tristan + Isolde (2006)
8½ (1963)
D@bbe (2006)
M*A*S*H (1972)
WALL·E (2008)
What the #$*! Do We (K)now!? (2004)
Who the #$&% Is Jackson Pollock? (2006)
#highschool (1998)
Patti Cake$ (2017)
Totally F***ed Up (1993)
$5 a Day (2008)
<---> (1969)
I ♥ Huckabees (2004)
Du gör mig galen! (2012)
Mästerskapet (2014)
Miraklet på 8:e gatan (1987)
Восхождение (1977)
אהבה בשחקים (1986)
Y tu mamá también (2001)
Închisoarea Îngerilor (1994)
Πολύ Σκληρός για να Πεθάνει (1988)
Szklana pulapka (1988)
臥虎藏龍 (2000)
卧虎藏龙 (2000)
天気の子 (2019)
`
  .split("\n")
  .filter((e) => !!e)
  .map((e) => e.trim());

describe("matchTitleYear", () => {
  it("should match", () => {
    for (const filename of names) {
      const match = matchTitleYear(filename);
      if (!match || !match.groups) {
        console.debug(match, filename);
      }
      expect(match).toBeDefined();
      expect(match?.groups?.title).toBeDefined();
      expect(match?.groups?.year).toBeDefined();
    }
  });
});
