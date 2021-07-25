import MiniSearch from "minisearch";
import { deromanizeText, romanizeText } from "romanizr";
import {
  IMDbProvider,
  OMDbProvider,
  TMDbProvider,
  TraktProvider,
} from "../providers";

// Register all providers
const providers = [
  new TraktProvider(),
  new TMDbProvider(),
  new OMDbProvider(),
  new IMDbProvider(),
];

export interface MetadataResult {
  name: string;
  year: number;
  score?: number;
  ids: {
    trakt?: number;
    imdb?: string;
    tmdb?: number;
    omdb?: number;
    tvdb?: number;
    tvrage?: number;
  };
}

export const aggregatedSearch = async (
  query: string,
  year?: number,
): Promise<MetadataResult | undefined> => {
  const mergedResults: MetadataResult[] = [];
  await Promise.all(
    providers.map(async (provider) => {
      const result = await provider.search(query, year);
      if (result.length > 0) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        result.forEach((res: any) => {
          if (res.year) {
            res.normalizedName = deromanizeText(res.name) + ` (${res.year})`;
            res.romanizedName = romanizeText(res.name) + ` (${res.year})`;
          }
          if (res.type === "movie" && res.year) {
            mergedResults.push(res);
          }
          delete res.ids.slug;
        });
      }
    }),
  );

  if (mergedResults.length === 0) {
    return;
  }

  const miniSearch = new MiniSearch({
    fields: ["normalizedName", "romanizedName", "provider"],
  });

  const docsWithId = mergedResults.map((r, idx) => ({ ...r, id: idx }));
  miniSearch.addAll(docsWithId);

  // TODO: Revisit later
  const results = miniSearch.search(`${query} (${year})`);
  const sortedResults = results
    .map((r) => {
      const entry = mergedResults[r.id];
      const idCount = Object.values(entry.ids).filter((id) => !!id).length;

      return {
        ...entry,
        score: r.score + idCount,
      };
    })
    .sort((a, b) => {
      if (b.score === a.score) {
        if (year && b.year !== a.year) {
          return Math.abs(a.year - year) - Math.abs(b.year - year);
        }
        if (b.ids.imdb && a.ids.imdb) {
          return Number(a.ids.imdb.substr(2)) - Number(b.ids.imdb.substr(2));
        }
      }
      return b.score - a.score;
    });

  const bestResult = sortedResults[0] || mergedResults[0];

  const filteredResult = sortedResults.filter((r) => {
    return (
      r.name.replace(/ /g, "_").replace(/\W/g, "").toLowerCase() ===
        bestResult.name.replace(/ /g, "_").replace(/\W/g, "").toLowerCase() &&
      bestResult.year === r.year
    );
  });

  const mergedResult = filteredResult.reduce(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (acc: any, cur: any) => {
      Object.keys(cur.ids).forEach((id) => {
        // Remove entries with null
        if (cur.ids[id] === null) {
          delete cur.ids[id];
        }
      });

      const newIds = Object.keys(cur.ids)
        .filter((k) => !acc.ids[k])
        .reduce((acc, k) => ({ ...acc, [k]: cur.ids[k] }), {});
      const ids = { ...acc.ids, ...newIds };
      // delete ids.slug;
      return { ...acc, ids };
    },
    {
      ids: {},
      name: bestResult.name,
      year: bestResult.year,
    },
  );

  return mergedResult;
};
