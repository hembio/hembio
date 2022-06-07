/***********************************************
 * !!!       THIS FILE IS GENERATED        !!! *
 * !!! DO NOT MODIFY THIS FILE BY YOURSELF !!! *
 ***********************************************/
/* eslint-disable */
import { gql } from "@apollo/client";
import * as Apollo from "@apollo/client";
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = {
  [K in keyof T]: T[K];
};
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & {
  [SubKey in K]?: Maybe<T[SubKey]>;
};
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & {
  [SubKey in K]: Maybe<T[SubKey]>;
};
const defaultOptions = {} as const;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  /** A date-time string at UTC, such as 2019-12-03T09:54:33Z, compliant with the date-time format. */
  DateTime: any;
  /** The `JSON` scalar type represents JSON values as specified by [ECMA-404](http://www.ecma-international.org/publications/files/ECMA-ST/ECMA-404.pdf). */
  JSON: any;
};

export type AddLibraryResponse = {
  __typename?: "AddLibraryResponse";
  library?: Maybe<LibraryEntity>;
};

export type CreditEntity = {
  __typename?: "CreditEntity";
  character?: Maybe<Scalars["String"]>;
  department: Scalars["String"];
  id: Scalars["ID"];
  job?: Maybe<Scalars["String"]>;
  order?: Maybe<Scalars["Int"]>;
  person: PersonEntity;
  title: TitleEntity;
};

export type CreditsByTitle = {
  __typename?: "CreditsByTitle";
  credits: Array<CreditEntity>;
  id: Scalars["ID"];
  name: Scalars["String"];
  thumb?: Maybe<Scalars["String"]>;
  year: Scalars["Float"];
};

export type FileEntity = {
  __typename?: "FileEntity";
  ctime: Scalars["Int"];
  edition: Scalars["String"];
  files?: Maybe<Array<FileEntity>>;
  id: Scalars["ID"];
  library: LibraryEntity;
  mediainfo: Scalars["String"];
  mtime: Scalars["Int"];
  path: Scalars["String"];
  probe?: Maybe<Scalars["Boolean"]>;
  size: Scalars["Int"];
  subtitles: Array<Subtitle>;
  title: TitleEntity;
};

export type FilterInput = {
  genre?: InputMaybe<Scalars["JSON"]>;
  year?: InputMaybe<Array<Scalars["Int"]>>;
};

export type GenreModel = {
  __typename?: "GenreModel";
  id: Scalars["ID"];
  slug: Scalars["String"];
};

export type IdentityModel = {
  __typename?: "IdentityModel";
  externalId: Scalars["String"];
  name: Scalars["String"];
  provider: Scalars["String"];
  type: Scalars["String"];
  year: Scalars["String"];
};

export type ImageEntity = {
  __typename?: "ImageEntity";
  createdAt: Scalars["DateTime"];
  id: Scalars["ID"];
  originalUrl: Scalars["String"];
  path: Scalars["String"];
  title: TitleEntity;
};

export type LibraryEntity = {
  __typename?: "LibraryEntity";
  createdAt: Scalars["DateTime"];
  id: Scalars["ID"];
  matcher: Scalars["String"];
  name: Scalars["String"];
  newlyAdded: PaginatedTitleResponse;
  path: Scalars["String"];
  slug: Scalars["String"];
  titles: PaginatedTitleResponse;
  type: LibraryType;
  watch: Scalars["Boolean"];
};

export type LibraryEntityNewlyAddedArgs = {
  skip?: InputMaybe<Scalars["Int"]>;
  take?: InputMaybe<Scalars["Int"]>;
};

export type LibraryEntityTitlesArgs = {
  filter?: InputMaybe<FilterInput>;
  ids?: InputMaybe<Array<Scalars["String"]>>;
  name?: InputMaybe<Scalars["String"]>;
  orderBy?: InputMaybe<Scalars["String"]>;
  orderDirection?: InputMaybe<Scalars["String"]>;
  skip?: InputMaybe<Scalars["Int"]>;
  take?: InputMaybe<Scalars["Int"]>;
  year?: InputMaybe<Scalars["Int"]>;
};

export enum LibraryType {
  Movies = "MOVIES",
  Music = "MUSIC",
  Photos = "PHOTOS",
  Podcasts = "PODCASTS",
  Tvshows = "TVSHOWS",
}

export type Mutation = {
  __typename?: "Mutation";
  addLibrary: AddLibraryResponse;
  checkLibrary: UpdateMutationModel;
  deleteTitle: UpdateMutationModel;
  updateCredits: UpdateMutationModel;
  updateMetadata: UpdateMutationModel;
  updatePersonImages: UpdateMutationModel;
  updateTitleImages: UpdateMutationModel;
};

export type MutationAddLibraryArgs = {
  matcher: Scalars["String"];
  name: Scalars["String"];
  path: Scalars["String"];
  type: LibraryType;
};

export type MutationCheckLibraryArgs = {
  id: Scalars["String"];
};

export type MutationDeleteTitleArgs = {
  id: Scalars["String"];
};

export type MutationUpdateCreditsArgs = {
  id: Scalars["String"];
};

export type MutationUpdateMetadataArgs = {
  id: Scalars["String"];
};

export type MutationUpdatePersonImagesArgs = {
  id: Scalars["String"];
};

export type MutationUpdateTitleImagesArgs = {
  id: Scalars["String"];
};

export type PaginatedTitleResponse = {
  __typename?: "PaginatedTitleResponse";
  edges: Array<TitleEntity>;
  totalCount: Scalars["Int"];
};

export type PersonEntity = {
  __typename?: "PersonEntity";
  bio?: Maybe<Scalars["String"]>;
  birthday?: Maybe<Scalars["String"]>;
  createdAt: Scalars["DateTime"];
  credits: Array<CreditEntity>;
  creditsByTitle?: Maybe<Array<CreditsByTitle>>;
  externalIds: PersonExternalIds;
  id: Scalars["ID"];
  idImdb?: Maybe<Scalars["String"]>;
  idTmdb?: Maybe<Scalars["String"]>;
  image?: Maybe<Scalars["String"]>;
  name: Scalars["String"];
  placeOfBirth?: Maybe<Scalars["String"]>;
  updatedAt: Scalars["DateTime"];
};

export type PersonExternalIds = {
  __typename?: "PersonExternalIds";
  imdb?: Maybe<Scalars["String"]>;
  tmdb?: Maybe<Scalars["Int"]>;
};

export type Query = {
  __typename?: "Query";
  file?: Maybe<FileEntity>;
  libraries: Array<LibraryEntity>;
  library?: Maybe<LibraryEntity>;
  person?: Maybe<PersonEntity>;
  search: Array<TitleEntity>;
  stats: StatsModel;
  title?: Maybe<TitleEntity>;
  user?: Maybe<UserEntity>;
  users: Array<UserEntity>;
};

export type QueryFileArgs = {
  fileId: Scalars["String"];
};

export type QueryLibraryArgs = {
  id: Scalars["String"];
};

export type QueryPersonArgs = {
  id: Scalars["String"];
};

export type QuerySearchArgs = {
  query: Scalars["String"];
};

export type QueryTitleArgs = {
  id: Scalars["String"];
};

export type QueryUserArgs = {
  userId: Scalars["String"];
};

export type RefreshTokenEntity = {
  __typename?: "RefreshTokenEntity";
  blacklisted: Scalars["Boolean"];
  device: Scalars["String"];
  expires: Scalars["Float"];
  id: Scalars["ID"];
  ip: Scalars["String"];
  user: UserEntity;
};

export type StatsModel = {
  __typename?: "StatsModel";
  cpuUsage: Scalars["Int"];
  freeMem: Scalars["Int"];
  time: Scalars["Int"];
  totalFiles: Scalars["Int"];
  totalMem: Scalars["Int"];
  totalTitles: Scalars["Int"];
  uptime: Scalars["Int"];
};

export enum Subtitle {
  English = "English",
  Swedish = "Swedish",
}

export type TitleEntity = {
  __typename?: "TitleEntity";
  cast: Array<CreditEntity>;
  certification?: Maybe<Scalars["String"]>;
  createdAt: Scalars["DateTime"];
  credits: Array<CreditEntity>;
  crew: Array<CreditEntity>;
  dominantColor?: Maybe<Scalars["String"]>;
  externalIds: TitleExternalIds;
  files: Array<FileEntity>;
  genres: Array<GenreModel>;
  id: Scalars["ID"];
  identify: Array<IdentityModel>;
  images: Array<ImageEntity>;
  name: Scalars["String"];
  overview?: Maybe<Scalars["String"]>;
  path: Scalars["String"];
  ratings: TitleRatings;
  releaseDate?: Maybe<Scalars["DateTime"]>;
  runtime?: Maybe<Scalars["Int"]>;
  slug: Scalars["String"];
  tagline?: Maybe<Scalars["String"]>;
  thumb?: Maybe<Scalars["String"]>;
  topBilling: Array<CreditEntity>;
  type: TitleType;
  updatedAt: Scalars["DateTime"];
  year: Scalars["Int"];
};

export type TitleEntityTopBillingArgs = {
  take?: InputMaybe<Scalars["Int"]>;
};

export type TitleExternalIds = {
  __typename?: "TitleExternalIds";
  imdb?: Maybe<Scalars["String"]>;
  omdb?: Maybe<Scalars["Int"]>;
  tmdb?: Maybe<Scalars["Int"]>;
  trakt?: Maybe<Scalars["Int"]>;
  tvdb?: Maybe<Scalars["Int"]>;
  tvrage?: Maybe<Scalars["Int"]>;
};

export type TitleRatings = {
  __typename?: "TitleRatings";
  aggregated?: Maybe<Scalars["Float"]>;
  imdb?: Maybe<Scalars["Float"]>;
  metacritic?: Maybe<Scalars["Float"]>;
  rotten?: Maybe<Scalars["Float"]>;
  tmdb?: Maybe<Scalars["Float"]>;
  trakt?: Maybe<Scalars["Float"]>;
};

export enum TitleType {
  Movie = "MOVIE",
  Music = "MUSIC",
  Tvshow = "TVSHOW",
}

export type UpdateMutationModel = {
  __typename?: "UpdateMutationModel";
  id?: Maybe<Scalars["String"]>;
};

export type UserEntity = {
  __typename?: "UserEntity";
  createdAt: Scalars["DateTime"];
  id: Scalars["ID"];
  refreshTokens: RefreshTokenEntity;
  role: UserRole;
  username: Scalars["String"];
};

export enum UserRole {
  Admin = "ADMIN",
  User = "USER",
}

export type FileWithTitleFragment = {
  __typename?: "FileEntity";
  id: string;
  path: string;
  subtitles: Array<Subtitle>;
  title: {
    __typename?: "TitleEntity";
    id: string;
    createdAt: any;
    slug: string;
    thumb?: string | null;
    name: string;
    year: number;
    releaseDate?: any | null;
    topBilling: Array<{
      __typename?: "CreditEntity";
      id: string;
      department: string;
      order?: number | null;
      character?: string | null;
      person: {
        __typename?: "PersonEntity";
        id: string;
        name: string;
        image?: string | null;
      };
    }>;
  };
};

export type FileQueryVariables = Exact<{
  fileId: Scalars["String"];
}>;

export type FileQuery = {
  __typename?: "Query";
  file?: {
    __typename?: "FileEntity";
    id: string;
    path: string;
    subtitles: Array<Subtitle>;
    title: {
      __typename?: "TitleEntity";
      id: string;
      createdAt: any;
      slug: string;
      thumb?: string | null;
      name: string;
      year: number;
      releaseDate?: any | null;
      topBilling: Array<{
        __typename?: "CreditEntity";
        id: string;
        department: string;
        order?: number | null;
        character?: string | null;
        person: {
          __typename?: "PersonEntity";
          id: string;
          name: string;
          image?: string | null;
        };
      }>;
    };
  } | null;
};

export type ProbeFileQueryVariables = Exact<{
  fileId: Scalars["String"];
}>;

export type ProbeFileQuery = {
  __typename?: "Query";
  file?: { __typename?: "FileEntity"; probe?: boolean | null } | null;
};

export type LibraryFragment = {
  __typename?: "LibraryEntity";
  id: string;
  type: LibraryType;
  slug: string;
  name: string;
  createdAt: any;
};

export type LibrariesQueryVariables = Exact<{ [key: string]: never }>;

export type LibrariesQuery = {
  __typename?: "Query";
  libraries: Array<{
    __typename?: "LibraryEntity";
    id: string;
    type: LibraryType;
    slug: string;
    name: string;
    createdAt: any;
  }>;
};

export type LibraryQueryVariables = Exact<{
  id: Scalars["String"];
}>;

export type LibraryQuery = {
  __typename?: "Query";
  library?: {
    __typename?: "LibraryEntity";
    id: string;
    type: LibraryType;
    slug: string;
    name: string;
    createdAt: any;
  } | null;
};

export type CheckLibraryMutationVariables = Exact<{
  id: Scalars["String"];
}>;

export type CheckLibraryMutation = {
  __typename?: "Mutation";
  checkLibrary: { __typename?: "UpdateMutationModel"; id?: string | null };
};

export type PersonFragment = {
  __typename?: "PersonEntity";
  id: string;
  createdAt: any;
  name: string;
  image?: string | null;
  bio?: string | null;
  birthday?: string | null;
  placeOfBirth?: string | null;
  creditsByTitle?: Array<{
    __typename?: "CreditsByTitle";
    id: string;
    name: string;
    year: number;
    thumb?: string | null;
    credits: Array<{
      __typename?: "CreditEntity";
      id: string;
      job?: string | null;
      character?: string | null;
      department: string;
    }>;
  }> | null;
  externalIds: {
    __typename?: "PersonExternalIds";
    imdb?: string | null;
    tmdb?: number | null;
  };
};

export type PersonQueryVariables = Exact<{
  id: Scalars["String"];
}>;

export type PersonQuery = {
  __typename?: "Query";
  person?: {
    __typename?: "PersonEntity";
    id: string;
    createdAt: any;
    name: string;
    image?: string | null;
    bio?: string | null;
    birthday?: string | null;
    placeOfBirth?: string | null;
    creditsByTitle?: Array<{
      __typename?: "CreditsByTitle";
      id: string;
      name: string;
      year: number;
      thumb?: string | null;
      credits: Array<{
        __typename?: "CreditEntity";
        id: string;
        job?: string | null;
        character?: string | null;
        department: string;
      }>;
    }> | null;
    externalIds: {
      __typename?: "PersonExternalIds";
      imdb?: string | null;
      tmdb?: number | null;
    };
  } | null;
};

export type UpdatePersonImagesMutationVariables = Exact<{
  id: Scalars["String"];
}>;

export type UpdatePersonImagesMutation = {
  __typename?: "Mutation";
  updatePersonImages: {
    __typename?: "UpdateMutationModel";
    id?: string | null;
  };
};

export type StatsQueryVariables = Exact<{ [key: string]: never }>;

export type StatsQuery = {
  __typename?: "Query";
  stats: {
    __typename?: "StatsModel";
    time: number;
    uptime: number;
    cpuUsage: number;
    totalMem: number;
    freeMem: number;
  };
};

export type CastFragment = {
  __typename?: "CreditEntity";
  id: string;
  department: string;
  order?: number | null;
  character?: string | null;
  person: {
    __typename?: "PersonEntity";
    id: string;
    name: string;
    image?: string | null;
  };
};

export type CrewFragment = {
  __typename?: "CreditEntity";
  id: string;
  department: string;
  job?: string | null;
  person: {
    __typename?: "PersonEntity";
    id: string;
    name: string;
    image?: string | null;
  };
};

export type TitleWithFilesFragment = {
  __typename?: "TitleEntity";
  id: string;
  createdAt: any;
  updatedAt: any;
  type: TitleType;
  slug: string;
  thumb?: string | null;
  dominantColor?: string | null;
  name: string;
  tagline?: string | null;
  overview?: string | null;
  certification?: string | null;
  year: number;
  runtime?: number | null;
  releaseDate?: any | null;
  externalIds: {
    __typename?: "TitleExternalIds";
    imdb?: string | null;
    trakt?: number | null;
    omdb?: number | null;
    tmdb?: number | null;
    tvrage?: number | null;
    tvdb?: number | null;
  };
  ratings: {
    __typename?: "TitleRatings";
    imdb?: number | null;
    tmdb?: number | null;
    trakt?: number | null;
    rotten?: number | null;
    metacritic?: number | null;
    aggregated?: number | null;
  };
  genres: Array<{ __typename?: "GenreModel"; slug: string }>;
  files: Array<{ __typename?: "FileEntity"; id: string; path: string }>;
};

export type TitleQueryVariables = Exact<{
  id: Scalars["String"];
  take?: InputMaybe<Scalars["Int"]>;
}>;

export type TitleQuery = {
  __typename?: "Query";
  title?: {
    __typename?: "TitleEntity";
    id: string;
    createdAt: any;
    updatedAt: any;
    type: TitleType;
    slug: string;
    thumb?: string | null;
    dominantColor?: string | null;
    name: string;
    tagline?: string | null;
    overview?: string | null;
    certification?: string | null;
    year: number;
    runtime?: number | null;
    releaseDate?: any | null;
    topBilling: Array<{
      __typename?: "CreditEntity";
      id: string;
      department: string;
      order?: number | null;
      character?: string | null;
      person: {
        __typename?: "PersonEntity";
        id: string;
        name: string;
        image?: string | null;
      };
    }>;
    externalIds: {
      __typename?: "TitleExternalIds";
      imdb?: string | null;
      trakt?: number | null;
      omdb?: number | null;
      tmdb?: number | null;
      tvrage?: number | null;
      tvdb?: number | null;
    };
    ratings: {
      __typename?: "TitleRatings";
      imdb?: number | null;
      tmdb?: number | null;
      trakt?: number | null;
      rotten?: number | null;
      metacritic?: number | null;
      aggregated?: number | null;
    };
    genres: Array<{ __typename?: "GenreModel"; slug: string }>;
    files: Array<{ __typename?: "FileEntity"; id: string; path: string }>;
  } | null;
};

export type TitleCreditsQueryVariables = Exact<{
  id: Scalars["String"];
}>;

export type TitleCreditsQuery = {
  __typename?: "Query";
  title?: {
    __typename?: "TitleEntity";
    cast: Array<{
      __typename?: "CreditEntity";
      id: string;
      department: string;
      order?: number | null;
      character?: string | null;
      person: {
        __typename?: "PersonEntity";
        id: string;
        name: string;
        image?: string | null;
      };
    }>;
    crew: Array<{
      __typename?: "CreditEntity";
      id: string;
      department: string;
      job?: string | null;
      person: {
        __typename?: "PersonEntity";
        id: string;
        name: string;
        image?: string | null;
      };
    }>;
  } | null;
};

export type SearchTitleFragment = {
  __typename?: "TitleEntity";
  id: string;
  createdAt: any;
  slug: string;
  thumb?: string | null;
  name: string;
  year: number;
  releaseDate?: any | null;
  runtime?: number | null;
  genres: Array<{ __typename?: "GenreModel"; slug: string }>;
};

export type SearchTitlesQueryVariables = Exact<{
  query: Scalars["String"];
}>;

export type SearchTitlesQuery = {
  __typename?: "Query";
  search: Array<{
    __typename?: "TitleEntity";
    id: string;
    createdAt: any;
    slug: string;
    thumb?: string | null;
    name: string;
    year: number;
    releaseDate?: any | null;
    runtime?: number | null;
    genres: Array<{ __typename?: "GenreModel"; slug: string }>;
  }>;
};

export type IdentifyTitleQueryVariables = Exact<{
  id: Scalars["String"];
}>;

export type IdentifyTitleQuery = {
  __typename?: "Query";
  title?: {
    __typename?: "TitleEntity";
    identify: Array<{
      __typename?: "IdentityModel";
      provider: string;
      externalId: string;
      type: string;
      name: string;
      year: string;
    }>;
  } | null;
};

export type TitleFragment = {
  __typename?: "TitleEntity";
  id: string;
  createdAt: any;
  slug: string;
  thumb?: string | null;
  name: string;
  year: number;
  releaseDate?: any | null;
};

export type TitlesQueryVariables = Exact<{
  libraryId: Scalars["String"];
  skip?: InputMaybe<Scalars["Int"]>;
  take?: InputMaybe<Scalars["Int"]>;
  orderBy?: InputMaybe<Scalars["String"]>;
  orderDirection?: InputMaybe<Scalars["String"]>;
  filter?: InputMaybe<FilterInput>;
}>;

export type TitlesQuery = {
  __typename?: "Query";
  library?: {
    __typename?: "LibraryEntity";
    id: string;
    titles: {
      __typename?: "PaginatedTitleResponse";
      totalCount: number;
      edges: Array<{
        __typename?: "TitleEntity";
        id: string;
        createdAt: any;
        slug: string;
        thumb?: string | null;
        name: string;
        year: number;
        releaseDate?: any | null;
      }>;
    };
  } | null;
};

export type NewlyAddedTitlesQueryVariables = Exact<{
  libraryId: Scalars["String"];
  skip?: InputMaybe<Scalars["Int"]>;
  take?: InputMaybe<Scalars["Int"]>;
}>;

export type NewlyAddedTitlesQuery = {
  __typename?: "Query";
  library?: {
    __typename?: "LibraryEntity";
    id: string;
    newlyAdded: {
      __typename?: "PaginatedTitleResponse";
      totalCount: number;
      edges: Array<{
        __typename?: "TitleEntity";
        id: string;
        createdAt: any;
        slug: string;
        thumb?: string | null;
        name: string;
        year: number;
        releaseDate?: any | null;
      }>;
    };
  } | null;
};

export type DeleteTitleMutationVariables = Exact<{
  id: Scalars["String"];
}>;

export type DeleteTitleMutation = {
  __typename?: "Mutation";
  deleteTitle: { __typename?: "UpdateMutationModel"; id?: string | null };
};

export type UpdateCreditsMutationVariables = Exact<{
  id: Scalars["String"];
}>;

export type UpdateCreditsMutation = {
  __typename?: "Mutation";
  updateCredits: { __typename?: "UpdateMutationModel"; id?: string | null };
};

export type UpdateMetadataMutationVariables = Exact<{
  id: Scalars["String"];
}>;

export type UpdateMetadataMutation = {
  __typename?: "Mutation";
  updateMetadata: { __typename?: "UpdateMutationModel"; id?: string | null };
};

export type UpdateTitleImagesMutationVariables = Exact<{
  id: Scalars["String"];
}>;

export type UpdateTitleImagesMutation = {
  __typename?: "Mutation";
  updateTitleImages: { __typename?: "UpdateMutationModel"; id?: string | null };
};

export type UserFragment = {
  __typename?: "UserEntity";
  id: string;
  username: string;
  role: UserRole;
};

export type UserQueryVariables = Exact<{
  userId: Scalars["String"];
}>;

export type UserQuery = {
  __typename?: "Query";
  user?: {
    __typename?: "UserEntity";
    id: string;
    username: string;
    role: UserRole;
  } | null;
};

export type UsersQueryVariables = Exact<{ [key: string]: never }>;

export type UsersQuery = {
  __typename?: "Query";
  users: Array<{
    __typename?: "UserEntity";
    id: string;
    username: string;
    role: UserRole;
  }>;
};

export const TitleFragmentDoc = gql`
  fragment Title on TitleEntity {
    id
    createdAt
    slug
    thumb
    name
    year
    releaseDate
  }
`;
export const CastFragmentDoc = gql`
  fragment Cast on CreditEntity {
    id
    department
    order
    character
    person {
      id
      name
      image
    }
  }
`;
export const FileWithTitleFragmentDoc = gql`
  fragment FileWithTitle on FileEntity {
    id
    path
    subtitles
    title {
      ...Title
      topBilling(take: 8) {
        ...Cast
      }
    }
  }
  ${TitleFragmentDoc}
  ${CastFragmentDoc}
`;
export const LibraryFragmentDoc = gql`
  fragment Library on LibraryEntity {
    id
    type
    slug
    name
    createdAt
  }
`;
export const PersonFragmentDoc = gql`
  fragment Person on PersonEntity {
    id
    createdAt
    name
    image
    bio
    birthday
    placeOfBirth
    creditsByTitle {
      id
      name
      year
      thumb
      credits {
        id
        job
        character
        department
      }
    }
    externalIds {
      imdb
      tmdb
    }
  }
`;
export const CrewFragmentDoc = gql`
  fragment Crew on CreditEntity {
    id
    department
    job
    person {
      id
      name
      image
    }
  }
`;
export const TitleWithFilesFragmentDoc = gql`
  fragment TitleWithFiles on TitleEntity {
    id
    createdAt
    updatedAt
    type
    slug
    thumb
    dominantColor
    name
    tagline
    overview
    certification
    year
    runtime
    releaseDate
    externalIds {
      imdb
      trakt
      omdb
      tmdb
      tvrage
      tvdb
    }
    ratings {
      imdb
      tmdb
      trakt
      rotten
      metacritic
      aggregated
    }
    genres {
      slug
    }
    files {
      id
      path
    }
  }
`;
export const SearchTitleFragmentDoc = gql`
  fragment SearchTitle on TitleEntity {
    id
    createdAt
    slug
    thumb
    name
    year
    releaseDate
    runtime
    genres {
      slug
    }
  }
`;
export const UserFragmentDoc = gql`
  fragment User on UserEntity {
    id
    username
    role
  }
`;
export const FileDocument = gql`
  query File($fileId: String!) {
    file(fileId: $fileId) {
      ...FileWithTitle
    }
  }
  ${FileWithTitleFragmentDoc}
`;

/**
 * __useFileQuery__
 *
 * To run a query within a React component, call `useFileQuery` and pass it any options that fit your needs.
 * When your component renders, `useFileQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useFileQuery({
 *   variables: {
 *      fileId: // value for 'fileId'
 *   },
 * });
 */
export function useFileQuery(
  baseOptions: Apollo.QueryHookOptions<FileQuery, FileQueryVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<FileQuery, FileQueryVariables>(FileDocument, options);
}
export function useFileLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<FileQuery, FileQueryVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<FileQuery, FileQueryVariables>(
    FileDocument,
    options,
  );
}
export type FileQueryHookResult = ReturnType<typeof useFileQuery>;
export type FileLazyQueryHookResult = ReturnType<typeof useFileLazyQuery>;
export type FileQueryResult = Apollo.QueryResult<FileQuery, FileQueryVariables>;
export function refetchFileQuery(variables: FileQueryVariables) {
  return { query: FileDocument, variables: variables };
}
export const ProbeFileDocument = gql`
  query ProbeFile($fileId: String!) {
    file(fileId: $fileId) {
      probe
    }
  }
`;

/**
 * __useProbeFileQuery__
 *
 * To run a query within a React component, call `useProbeFileQuery` and pass it any options that fit your needs.
 * When your component renders, `useProbeFileQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useProbeFileQuery({
 *   variables: {
 *      fileId: // value for 'fileId'
 *   },
 * });
 */
export function useProbeFileQuery(
  baseOptions: Apollo.QueryHookOptions<ProbeFileQuery, ProbeFileQueryVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<ProbeFileQuery, ProbeFileQueryVariables>(
    ProbeFileDocument,
    options,
  );
}
export function useProbeFileLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    ProbeFileQuery,
    ProbeFileQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<ProbeFileQuery, ProbeFileQueryVariables>(
    ProbeFileDocument,
    options,
  );
}
export type ProbeFileQueryHookResult = ReturnType<typeof useProbeFileQuery>;
export type ProbeFileLazyQueryHookResult = ReturnType<
  typeof useProbeFileLazyQuery
>;
export type ProbeFileQueryResult = Apollo.QueryResult<
  ProbeFileQuery,
  ProbeFileQueryVariables
>;
export function refetchProbeFileQuery(variables: ProbeFileQueryVariables) {
  return { query: ProbeFileDocument, variables: variables };
}
export const LibrariesDocument = gql`
  query Libraries {
    libraries {
      ...Library
    }
  }
  ${LibraryFragmentDoc}
`;

/**
 * __useLibrariesQuery__
 *
 * To run a query within a React component, call `useLibrariesQuery` and pass it any options that fit your needs.
 * When your component renders, `useLibrariesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useLibrariesQuery({
 *   variables: {
 *   },
 * });
 */
export function useLibrariesQuery(
  baseOptions?: Apollo.QueryHookOptions<
    LibrariesQuery,
    LibrariesQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<LibrariesQuery, LibrariesQueryVariables>(
    LibrariesDocument,
    options,
  );
}
export function useLibrariesLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    LibrariesQuery,
    LibrariesQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<LibrariesQuery, LibrariesQueryVariables>(
    LibrariesDocument,
    options,
  );
}
export type LibrariesQueryHookResult = ReturnType<typeof useLibrariesQuery>;
export type LibrariesLazyQueryHookResult = ReturnType<
  typeof useLibrariesLazyQuery
>;
export type LibrariesQueryResult = Apollo.QueryResult<
  LibrariesQuery,
  LibrariesQueryVariables
>;
export function refetchLibrariesQuery(variables?: LibrariesQueryVariables) {
  return { query: LibrariesDocument, variables: variables };
}
export const LibraryDocument = gql`
  query Library($id: String!) {
    library(id: $id) {
      ...Library
    }
  }
  ${LibraryFragmentDoc}
`;

/**
 * __useLibraryQuery__
 *
 * To run a query within a React component, call `useLibraryQuery` and pass it any options that fit your needs.
 * When your component renders, `useLibraryQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useLibraryQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useLibraryQuery(
  baseOptions: Apollo.QueryHookOptions<LibraryQuery, LibraryQueryVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<LibraryQuery, LibraryQueryVariables>(
    LibraryDocument,
    options,
  );
}
export function useLibraryLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    LibraryQuery,
    LibraryQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<LibraryQuery, LibraryQueryVariables>(
    LibraryDocument,
    options,
  );
}
export type LibraryQueryHookResult = ReturnType<typeof useLibraryQuery>;
export type LibraryLazyQueryHookResult = ReturnType<typeof useLibraryLazyQuery>;
export type LibraryQueryResult = Apollo.QueryResult<
  LibraryQuery,
  LibraryQueryVariables
>;
export function refetchLibraryQuery(variables: LibraryQueryVariables) {
  return { query: LibraryDocument, variables: variables };
}
export const CheckLibraryDocument = gql`
  mutation CheckLibrary($id: String!) {
    checkLibrary(id: $id) {
      id
    }
  }
`;
export type CheckLibraryMutationFn = Apollo.MutationFunction<
  CheckLibraryMutation,
  CheckLibraryMutationVariables
>;

/**
 * __useCheckLibraryMutation__
 *
 * To run a mutation, you first call `useCheckLibraryMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCheckLibraryMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [checkLibraryMutation, { data, loading, error }] = useCheckLibraryMutation({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useCheckLibraryMutation(
  baseOptions?: Apollo.MutationHookOptions<
    CheckLibraryMutation,
    CheckLibraryMutationVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<
    CheckLibraryMutation,
    CheckLibraryMutationVariables
  >(CheckLibraryDocument, options);
}
export type CheckLibraryMutationHookResult = ReturnType<
  typeof useCheckLibraryMutation
>;
export type CheckLibraryMutationResult =
  Apollo.MutationResult<CheckLibraryMutation>;
export type CheckLibraryMutationOptions = Apollo.BaseMutationOptions<
  CheckLibraryMutation,
  CheckLibraryMutationVariables
>;
export const PersonDocument = gql`
  query Person($id: String!) {
    person(id: $id) {
      ...Person
    }
  }
  ${PersonFragmentDoc}
`;

/**
 * __usePersonQuery__
 *
 * To run a query within a React component, call `usePersonQuery` and pass it any options that fit your needs.
 * When your component renders, `usePersonQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = usePersonQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function usePersonQuery(
  baseOptions: Apollo.QueryHookOptions<PersonQuery, PersonQueryVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<PersonQuery, PersonQueryVariables>(
    PersonDocument,
    options,
  );
}
export function usePersonLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<PersonQuery, PersonQueryVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<PersonQuery, PersonQueryVariables>(
    PersonDocument,
    options,
  );
}
export type PersonQueryHookResult = ReturnType<typeof usePersonQuery>;
export type PersonLazyQueryHookResult = ReturnType<typeof usePersonLazyQuery>;
export type PersonQueryResult = Apollo.QueryResult<
  PersonQuery,
  PersonQueryVariables
>;
export function refetchPersonQuery(variables: PersonQueryVariables) {
  return { query: PersonDocument, variables: variables };
}
export const UpdatePersonImagesDocument = gql`
  mutation UpdatePersonImages($id: String!) {
    updatePersonImages(id: $id) {
      id
    }
  }
`;
export type UpdatePersonImagesMutationFn = Apollo.MutationFunction<
  UpdatePersonImagesMutation,
  UpdatePersonImagesMutationVariables
>;

/**
 * __useUpdatePersonImagesMutation__
 *
 * To run a mutation, you first call `useUpdatePersonImagesMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdatePersonImagesMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updatePersonImagesMutation, { data, loading, error }] = useUpdatePersonImagesMutation({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useUpdatePersonImagesMutation(
  baseOptions?: Apollo.MutationHookOptions<
    UpdatePersonImagesMutation,
    UpdatePersonImagesMutationVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<
    UpdatePersonImagesMutation,
    UpdatePersonImagesMutationVariables
  >(UpdatePersonImagesDocument, options);
}
export type UpdatePersonImagesMutationHookResult = ReturnType<
  typeof useUpdatePersonImagesMutation
>;
export type UpdatePersonImagesMutationResult =
  Apollo.MutationResult<UpdatePersonImagesMutation>;
export type UpdatePersonImagesMutationOptions = Apollo.BaseMutationOptions<
  UpdatePersonImagesMutation,
  UpdatePersonImagesMutationVariables
>;
export const StatsDocument = gql`
  query Stats {
    stats {
      time
      uptime
      cpuUsage
      totalMem
      freeMem
    }
  }
`;

/**
 * __useStatsQuery__
 *
 * To run a query within a React component, call `useStatsQuery` and pass it any options that fit your needs.
 * When your component renders, `useStatsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useStatsQuery({
 *   variables: {
 *   },
 * });
 */
export function useStatsQuery(
  baseOptions?: Apollo.QueryHookOptions<StatsQuery, StatsQueryVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<StatsQuery, StatsQueryVariables>(
    StatsDocument,
    options,
  );
}
export function useStatsLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<StatsQuery, StatsQueryVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<StatsQuery, StatsQueryVariables>(
    StatsDocument,
    options,
  );
}
export type StatsQueryHookResult = ReturnType<typeof useStatsQuery>;
export type StatsLazyQueryHookResult = ReturnType<typeof useStatsLazyQuery>;
export type StatsQueryResult = Apollo.QueryResult<
  StatsQuery,
  StatsQueryVariables
>;
export function refetchStatsQuery(variables?: StatsQueryVariables) {
  return { query: StatsDocument, variables: variables };
}
export const TitleDocument = gql`
  query Title($id: String!, $take: Int) {
    title(id: $id) {
      ...TitleWithFiles
      topBilling(take: $take) {
        ...Cast
      }
    }
  }
  ${TitleWithFilesFragmentDoc}
  ${CastFragmentDoc}
`;

/**
 * __useTitleQuery__
 *
 * To run a query within a React component, call `useTitleQuery` and pass it any options that fit your needs.
 * When your component renders, `useTitleQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useTitleQuery({
 *   variables: {
 *      id: // value for 'id'
 *      take: // value for 'take'
 *   },
 * });
 */
export function useTitleQuery(
  baseOptions: Apollo.QueryHookOptions<TitleQuery, TitleQueryVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<TitleQuery, TitleQueryVariables>(
    TitleDocument,
    options,
  );
}
export function useTitleLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<TitleQuery, TitleQueryVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<TitleQuery, TitleQueryVariables>(
    TitleDocument,
    options,
  );
}
export type TitleQueryHookResult = ReturnType<typeof useTitleQuery>;
export type TitleLazyQueryHookResult = ReturnType<typeof useTitleLazyQuery>;
export type TitleQueryResult = Apollo.QueryResult<
  TitleQuery,
  TitleQueryVariables
>;
export function refetchTitleQuery(variables: TitleQueryVariables) {
  return { query: TitleDocument, variables: variables };
}
export const TitleCreditsDocument = gql`
  query TitleCredits($id: String!) {
    title(id: $id) {
      cast {
        ...Cast
      }
      crew {
        ...Crew
      }
    }
  }
  ${CastFragmentDoc}
  ${CrewFragmentDoc}
`;

/**
 * __useTitleCreditsQuery__
 *
 * To run a query within a React component, call `useTitleCreditsQuery` and pass it any options that fit your needs.
 * When your component renders, `useTitleCreditsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useTitleCreditsQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useTitleCreditsQuery(
  baseOptions: Apollo.QueryHookOptions<
    TitleCreditsQuery,
    TitleCreditsQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<TitleCreditsQuery, TitleCreditsQueryVariables>(
    TitleCreditsDocument,
    options,
  );
}
export function useTitleCreditsLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    TitleCreditsQuery,
    TitleCreditsQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<TitleCreditsQuery, TitleCreditsQueryVariables>(
    TitleCreditsDocument,
    options,
  );
}
export type TitleCreditsQueryHookResult = ReturnType<
  typeof useTitleCreditsQuery
>;
export type TitleCreditsLazyQueryHookResult = ReturnType<
  typeof useTitleCreditsLazyQuery
>;
export type TitleCreditsQueryResult = Apollo.QueryResult<
  TitleCreditsQuery,
  TitleCreditsQueryVariables
>;
export function refetchTitleCreditsQuery(
  variables: TitleCreditsQueryVariables,
) {
  return { query: TitleCreditsDocument, variables: variables };
}
export const SearchTitlesDocument = gql`
  query SearchTitles($query: String!) {
    search(query: $query) {
      ...SearchTitle
    }
  }
  ${SearchTitleFragmentDoc}
`;

/**
 * __useSearchTitlesQuery__
 *
 * To run a query within a React component, call `useSearchTitlesQuery` and pass it any options that fit your needs.
 * When your component renders, `useSearchTitlesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useSearchTitlesQuery({
 *   variables: {
 *      query: // value for 'query'
 *   },
 * });
 */
export function useSearchTitlesQuery(
  baseOptions: Apollo.QueryHookOptions<
    SearchTitlesQuery,
    SearchTitlesQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<SearchTitlesQuery, SearchTitlesQueryVariables>(
    SearchTitlesDocument,
    options,
  );
}
export function useSearchTitlesLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    SearchTitlesQuery,
    SearchTitlesQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<SearchTitlesQuery, SearchTitlesQueryVariables>(
    SearchTitlesDocument,
    options,
  );
}
export type SearchTitlesQueryHookResult = ReturnType<
  typeof useSearchTitlesQuery
>;
export type SearchTitlesLazyQueryHookResult = ReturnType<
  typeof useSearchTitlesLazyQuery
>;
export type SearchTitlesQueryResult = Apollo.QueryResult<
  SearchTitlesQuery,
  SearchTitlesQueryVariables
>;
export function refetchSearchTitlesQuery(
  variables: SearchTitlesQueryVariables,
) {
  return { query: SearchTitlesDocument, variables: variables };
}
export const IdentifyTitleDocument = gql`
  query IdentifyTitle($id: String!) {
    title(id: $id) {
      identify {
        provider
        externalId
        type
        name
        year
      }
    }
  }
`;

/**
 * __useIdentifyTitleQuery__
 *
 * To run a query within a React component, call `useIdentifyTitleQuery` and pass it any options that fit your needs.
 * When your component renders, `useIdentifyTitleQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useIdentifyTitleQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useIdentifyTitleQuery(
  baseOptions: Apollo.QueryHookOptions<
    IdentifyTitleQuery,
    IdentifyTitleQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<IdentifyTitleQuery, IdentifyTitleQueryVariables>(
    IdentifyTitleDocument,
    options,
  );
}
export function useIdentifyTitleLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    IdentifyTitleQuery,
    IdentifyTitleQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<IdentifyTitleQuery, IdentifyTitleQueryVariables>(
    IdentifyTitleDocument,
    options,
  );
}
export type IdentifyTitleQueryHookResult = ReturnType<
  typeof useIdentifyTitleQuery
>;
export type IdentifyTitleLazyQueryHookResult = ReturnType<
  typeof useIdentifyTitleLazyQuery
>;
export type IdentifyTitleQueryResult = Apollo.QueryResult<
  IdentifyTitleQuery,
  IdentifyTitleQueryVariables
>;
export function refetchIdentifyTitleQuery(
  variables: IdentifyTitleQueryVariables,
) {
  return { query: IdentifyTitleDocument, variables: variables };
}
export const TitlesDocument = gql`
  query Titles(
    $libraryId: String!
    $skip: Int
    $take: Int
    $orderBy: String
    $orderDirection: String
    $filter: FilterInput
  ) {
    library(id: $libraryId) {
      id
      titles(
        skip: $skip
        take: $take
        orderBy: $orderBy
        orderDirection: $orderDirection
        filter: $filter
      ) {
        edges {
          ...Title
        }
        totalCount
      }
    }
  }
  ${TitleFragmentDoc}
`;

/**
 * __useTitlesQuery__
 *
 * To run a query within a React component, call `useTitlesQuery` and pass it any options that fit your needs.
 * When your component renders, `useTitlesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useTitlesQuery({
 *   variables: {
 *      libraryId: // value for 'libraryId'
 *      skip: // value for 'skip'
 *      take: // value for 'take'
 *      orderBy: // value for 'orderBy'
 *      orderDirection: // value for 'orderDirection'
 *      filter: // value for 'filter'
 *   },
 * });
 */
export function useTitlesQuery(
  baseOptions: Apollo.QueryHookOptions<TitlesQuery, TitlesQueryVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<TitlesQuery, TitlesQueryVariables>(
    TitlesDocument,
    options,
  );
}
export function useTitlesLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<TitlesQuery, TitlesQueryVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<TitlesQuery, TitlesQueryVariables>(
    TitlesDocument,
    options,
  );
}
export type TitlesQueryHookResult = ReturnType<typeof useTitlesQuery>;
export type TitlesLazyQueryHookResult = ReturnType<typeof useTitlesLazyQuery>;
export type TitlesQueryResult = Apollo.QueryResult<
  TitlesQuery,
  TitlesQueryVariables
>;
export function refetchTitlesQuery(variables: TitlesQueryVariables) {
  return { query: TitlesDocument, variables: variables };
}
export const NewlyAddedTitlesDocument = gql`
  query NewlyAddedTitles($libraryId: String!, $skip: Int, $take: Int) {
    library(id: $libraryId) {
      id
      newlyAdded(skip: $skip, take: $take) {
        edges {
          ...Title
        }
        totalCount
      }
    }
  }
  ${TitleFragmentDoc}
`;

/**
 * __useNewlyAddedTitlesQuery__
 *
 * To run a query within a React component, call `useNewlyAddedTitlesQuery` and pass it any options that fit your needs.
 * When your component renders, `useNewlyAddedTitlesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useNewlyAddedTitlesQuery({
 *   variables: {
 *      libraryId: // value for 'libraryId'
 *      skip: // value for 'skip'
 *      take: // value for 'take'
 *   },
 * });
 */
export function useNewlyAddedTitlesQuery(
  baseOptions: Apollo.QueryHookOptions<
    NewlyAddedTitlesQuery,
    NewlyAddedTitlesQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<NewlyAddedTitlesQuery, NewlyAddedTitlesQueryVariables>(
    NewlyAddedTitlesDocument,
    options,
  );
}
export function useNewlyAddedTitlesLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    NewlyAddedTitlesQuery,
    NewlyAddedTitlesQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<
    NewlyAddedTitlesQuery,
    NewlyAddedTitlesQueryVariables
  >(NewlyAddedTitlesDocument, options);
}
export type NewlyAddedTitlesQueryHookResult = ReturnType<
  typeof useNewlyAddedTitlesQuery
>;
export type NewlyAddedTitlesLazyQueryHookResult = ReturnType<
  typeof useNewlyAddedTitlesLazyQuery
>;
export type NewlyAddedTitlesQueryResult = Apollo.QueryResult<
  NewlyAddedTitlesQuery,
  NewlyAddedTitlesQueryVariables
>;
export function refetchNewlyAddedTitlesQuery(
  variables: NewlyAddedTitlesQueryVariables,
) {
  return { query: NewlyAddedTitlesDocument, variables: variables };
}
export const DeleteTitleDocument = gql`
  mutation DeleteTitle($id: String!) {
    deleteTitle(id: $id) {
      id
    }
  }
`;
export type DeleteTitleMutationFn = Apollo.MutationFunction<
  DeleteTitleMutation,
  DeleteTitleMutationVariables
>;

/**
 * __useDeleteTitleMutation__
 *
 * To run a mutation, you first call `useDeleteTitleMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteTitleMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteTitleMutation, { data, loading, error }] = useDeleteTitleMutation({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useDeleteTitleMutation(
  baseOptions?: Apollo.MutationHookOptions<
    DeleteTitleMutation,
    DeleteTitleMutationVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<DeleteTitleMutation, DeleteTitleMutationVariables>(
    DeleteTitleDocument,
    options,
  );
}
export type DeleteTitleMutationHookResult = ReturnType<
  typeof useDeleteTitleMutation
>;
export type DeleteTitleMutationResult =
  Apollo.MutationResult<DeleteTitleMutation>;
export type DeleteTitleMutationOptions = Apollo.BaseMutationOptions<
  DeleteTitleMutation,
  DeleteTitleMutationVariables
>;
export const UpdateCreditsDocument = gql`
  mutation UpdateCredits($id: String!) {
    updateCredits(id: $id) {
      id
    }
  }
`;
export type UpdateCreditsMutationFn = Apollo.MutationFunction<
  UpdateCreditsMutation,
  UpdateCreditsMutationVariables
>;

/**
 * __useUpdateCreditsMutation__
 *
 * To run a mutation, you first call `useUpdateCreditsMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateCreditsMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateCreditsMutation, { data, loading, error }] = useUpdateCreditsMutation({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useUpdateCreditsMutation(
  baseOptions?: Apollo.MutationHookOptions<
    UpdateCreditsMutation,
    UpdateCreditsMutationVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<
    UpdateCreditsMutation,
    UpdateCreditsMutationVariables
  >(UpdateCreditsDocument, options);
}
export type UpdateCreditsMutationHookResult = ReturnType<
  typeof useUpdateCreditsMutation
>;
export type UpdateCreditsMutationResult =
  Apollo.MutationResult<UpdateCreditsMutation>;
export type UpdateCreditsMutationOptions = Apollo.BaseMutationOptions<
  UpdateCreditsMutation,
  UpdateCreditsMutationVariables
>;
export const UpdateMetadataDocument = gql`
  mutation UpdateMetadata($id: String!) {
    updateMetadata(id: $id) {
      id
    }
  }
`;
export type UpdateMetadataMutationFn = Apollo.MutationFunction<
  UpdateMetadataMutation,
  UpdateMetadataMutationVariables
>;

/**
 * __useUpdateMetadataMutation__
 *
 * To run a mutation, you first call `useUpdateMetadataMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateMetadataMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateMetadataMutation, { data, loading, error }] = useUpdateMetadataMutation({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useUpdateMetadataMutation(
  baseOptions?: Apollo.MutationHookOptions<
    UpdateMetadataMutation,
    UpdateMetadataMutationVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<
    UpdateMetadataMutation,
    UpdateMetadataMutationVariables
  >(UpdateMetadataDocument, options);
}
export type UpdateMetadataMutationHookResult = ReturnType<
  typeof useUpdateMetadataMutation
>;
export type UpdateMetadataMutationResult =
  Apollo.MutationResult<UpdateMetadataMutation>;
export type UpdateMetadataMutationOptions = Apollo.BaseMutationOptions<
  UpdateMetadataMutation,
  UpdateMetadataMutationVariables
>;
export const UpdateTitleImagesDocument = gql`
  mutation UpdateTitleImages($id: String!) {
    updateTitleImages(id: $id) {
      id
    }
  }
`;
export type UpdateTitleImagesMutationFn = Apollo.MutationFunction<
  UpdateTitleImagesMutation,
  UpdateTitleImagesMutationVariables
>;

/**
 * __useUpdateTitleImagesMutation__
 *
 * To run a mutation, you first call `useUpdateTitleImagesMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateTitleImagesMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateTitleImagesMutation, { data, loading, error }] = useUpdateTitleImagesMutation({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useUpdateTitleImagesMutation(
  baseOptions?: Apollo.MutationHookOptions<
    UpdateTitleImagesMutation,
    UpdateTitleImagesMutationVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<
    UpdateTitleImagesMutation,
    UpdateTitleImagesMutationVariables
  >(UpdateTitleImagesDocument, options);
}
export type UpdateTitleImagesMutationHookResult = ReturnType<
  typeof useUpdateTitleImagesMutation
>;
export type UpdateTitleImagesMutationResult =
  Apollo.MutationResult<UpdateTitleImagesMutation>;
export type UpdateTitleImagesMutationOptions = Apollo.BaseMutationOptions<
  UpdateTitleImagesMutation,
  UpdateTitleImagesMutationVariables
>;
export const UserDocument = gql`
  query User($userId: String!) {
    user(userId: $userId) {
      ...User
    }
  }
  ${UserFragmentDoc}
`;

/**
 * __useUserQuery__
 *
 * To run a query within a React component, call `useUserQuery` and pass it any options that fit your needs.
 * When your component renders, `useUserQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useUserQuery({
 *   variables: {
 *      userId: // value for 'userId'
 *   },
 * });
 */
export function useUserQuery(
  baseOptions: Apollo.QueryHookOptions<UserQuery, UserQueryVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<UserQuery, UserQueryVariables>(UserDocument, options);
}
export function useUserLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<UserQuery, UserQueryVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<UserQuery, UserQueryVariables>(
    UserDocument,
    options,
  );
}
export type UserQueryHookResult = ReturnType<typeof useUserQuery>;
export type UserLazyQueryHookResult = ReturnType<typeof useUserLazyQuery>;
export type UserQueryResult = Apollo.QueryResult<UserQuery, UserQueryVariables>;
export function refetchUserQuery(variables: UserQueryVariables) {
  return { query: UserDocument, variables: variables };
}
export const UsersDocument = gql`
  query Users {
    users {
      ...User
    }
  }
  ${UserFragmentDoc}
`;

/**
 * __useUsersQuery__
 *
 * To run a query within a React component, call `useUsersQuery` and pass it any options that fit your needs.
 * When your component renders, `useUsersQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useUsersQuery({
 *   variables: {
 *   },
 * });
 */
export function useUsersQuery(
  baseOptions?: Apollo.QueryHookOptions<UsersQuery, UsersQueryVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<UsersQuery, UsersQueryVariables>(
    UsersDocument,
    options,
  );
}
export function useUsersLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<UsersQuery, UsersQueryVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<UsersQuery, UsersQueryVariables>(
    UsersDocument,
    options,
  );
}
export type UsersQueryHookResult = ReturnType<typeof useUsersQuery>;
export type UsersLazyQueryHookResult = ReturnType<typeof useUsersLazyQuery>;
export type UsersQueryResult = Apollo.QueryResult<
  UsersQuery,
  UsersQueryVariables
>;
export function refetchUsersQuery(variables?: UsersQueryVariables) {
  return { query: UsersDocument, variables: variables };
}
