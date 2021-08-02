export enum TitleGenre {
  NONE,

  // Based on TMDb
  // https://www.themoviedb.org/bible/movie/59f3b16d9251414f20000006
  ACTION,
  ADVENTURE,
  ANIMATION,
  COMEDY,
  CRIME,
  DOCUMENTARY,
  DRAMA,
  FAMILY,
  FANTASY,
  HISTORY,
  HORROR,
  MUSIC,
  MYSTERY,
  ROMANCE,
  SCI_FI,
  THRILLER,
  TV_MOVIE,
  WAR,
  WESTERN,

  // Additional genres from Trakt
  DISASTER,
  EASTERN,
  FAN_FILM,
  FILM_NOIR,
  HOLIDAY,
  INDIE,
  MUSICAL,
  ROAD,
  SHORT,
  SPORTS,
  SPORTING_EVENT,
  SUSPENSE,

  // Additional genres from IMDb
  GAME_SHOW,
  NEWS,
  REALITY_TV,
  // SPORT, // TODO: Map this to Sports
  TALK_SHOW,
  BIOGRAPHY,
}

// You can generate the below list with
// Object.keys(TitleGenres)
//   .filter((k) => isNaN(Number(k)))
//   .map((k) => k.replace(/_/g, "-").toLowerCase());

export const TitleGenreSlugs = [
  "none",
  "action",
  "adventure",
  "animation",
  "comedy",
  "crime",
  "documentary",
  "drama",
  "family",
  "fantasy",
  "history",
  "horror",
  "music",
  "mystery",
  "romance",
  "sci-fi",
  "thriller",
  "tv-movie",
  "war",
  "western",
  "disaster",
  "eastern",
  "fan-film",
  "film-noir",
  "holiday",
  "indie",
  "musical",
  "road",
  "short",
  "sports",
  "sporting-event",
  "suspense",
  "game-show",
  "news",
  "reality-tv",
  "talk-show",
  "biography",
] as const;

export type TitleGenreLiterals = typeof TitleGenreSlugs[number];
