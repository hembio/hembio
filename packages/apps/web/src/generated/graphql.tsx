/***********************************************
 * !!!       THIS FILE IS GENERATED        !!! *
 * !!! DO NOT MODIFY THIS FILE BY YOURSELF !!! *
 ***********************************************/
/* eslint-disable */
import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
export type Maybe<T> = T | null;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
const defaultOptions =  {}
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  /** A date-time string at UTC, such as 2019-12-03T09:54:33Z, compliant with the date-time format. */
  DateTime: any;
};

export type AddLibraryResponse = {
  __typename?: 'AddLibraryResponse';
  library?: Maybe<LibraryEntity>;
};

export type CreditEntity = {
  __typename?: 'CreditEntity';
  id: Scalars['ID'];
  order?: Maybe<Scalars['Int']>;
  job?: Maybe<Scalars['String']>;
  character?: Maybe<Scalars['String']>;
  department: Scalars['String'];
  person: PersonEntity;
  title: TitleEntity;
};


export type DeleteModel = {
  __typename?: 'DeleteModel';
  id?: Maybe<Scalars['String']>;
};

export type FileEntity = {
  __typename?: 'FileEntity';
  id: Scalars['ID'];
  path: Scalars['String'];
  edition: Scalars['String'];
  mediainfo: Scalars['String'];
  library: LibraryEntity;
  title: TitleEntity;
  subtitles: Array<Subtitle>;
  ctime: Scalars['Int'];
  mtime: Scalars['Int'];
  files?: Maybe<Array<FileEntity>>;
};

export type GenreEntity = {
  __typename?: 'GenreEntity';
  id: Scalars['ID'];
  slug: Scalars['String'];
  titles: Array<TitleEntity>;
  name: Scalars['String'];
};

export type IdentityModel = {
  __typename?: 'IdentityModel';
  provider: Scalars['String'];
  externalId: Scalars['String'];
  type: Scalars['String'];
  name: Scalars['String'];
  year: Scalars['String'];
};

export type ImageEntity = {
  __typename?: 'ImageEntity';
  id: Scalars['ID'];
  createdAt: Scalars['DateTime'];
  path: Scalars['String'];
  originalUrl: Scalars['String'];
  title: TitleEntity;
};

export type LibraryEntity = {
  __typename?: 'LibraryEntity';
  id: Scalars['ID'];
  createdAt: Scalars['DateTime'];
  slug: Scalars['String'];
  name: Scalars['String'];
  type: LibraryType;
  path: Scalars['String'];
  watch: Scalars['Boolean'];
  matcher: Scalars['String'];
  titles: PaginatedTitleResponse;
  newlyAdded: PaginatedTitleResponse;
};


export type LibraryEntityTitlesArgs = {
  skip?: Maybe<Scalars['Int']>;
  take?: Maybe<Scalars['Int']>;
  ids?: Maybe<Array<Scalars['String']>>;
  name?: Maybe<Scalars['String']>;
  year?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<Scalars['String']>;
  orderDirection?: Maybe<Scalars['String']>;
};


export type LibraryEntityNewlyAddedArgs = {
  skip?: Maybe<Scalars['Int']>;
  take?: Maybe<Scalars['Int']>;
};

export enum LibraryType {
  Movies = 'MOVIES',
  Tvshows = 'TVSHOWS',
  Music = 'MUSIC',
  Podcasts = 'PODCASTS',
  Photos = 'PHOTOS'
}

export type Mutation = {
  __typename?: 'Mutation';
  addLibrary: AddLibraryResponse;
  updateCredits: UpdateCreditsModel;
  updateMetadata: UpdateMetadataModel;
  checkLibrary: UpdateMetadataModel;
  deleteTitle: DeleteModel;
};


export type MutationAddLibraryArgs = {
  name: Scalars['String'];
  type: LibraryType;
  path: Scalars['String'];
};


export type MutationUpdateCreditsArgs = {
  id: Scalars['String'];
};


export type MutationUpdateMetadataArgs = {
  id: Scalars['String'];
};


export type MutationCheckLibraryArgs = {
  id: Scalars['String'];
};


export type MutationDeleteTitleArgs = {
  id: Scalars['String'];
};

export type PaginatedTitleResponse = {
  __typename?: 'PaginatedTitleResponse';
  edges: Array<TitleEntity>;
  totalCount: Scalars['Int'];
};

export type PersonEntity = {
  __typename?: 'PersonEntity';
  id: Scalars['ID'];
  createdAt: Scalars['DateTime'];
  updatedAt: Scalars['DateTime'];
  externalIds: PersonExternalIds;
  idImdb?: Maybe<Scalars['String']>;
  idTmdb?: Maybe<Scalars['String']>;
  name: Scalars['String'];
  bio?: Maybe<Scalars['String']>;
  birthday?: Maybe<Scalars['String']>;
  placeOfBirth?: Maybe<Scalars['String']>;
  image?: Maybe<Scalars['String']>;
  jobs: Array<CreditEntity>;
};

export type PersonExternalIds = {
  __typename?: 'PersonExternalIds';
  imdb?: Maybe<Scalars['String']>;
  tmdb?: Maybe<Scalars['Int']>;
};

export type Query = {
  __typename?: 'Query';
  file?: Maybe<FileEntity>;
  library?: Maybe<LibraryEntity>;
  libraries: Array<LibraryEntity>;
  stats: StatsModel;
  title?: Maybe<TitleEntity>;
  search: Array<TitleEntity>;
  users: Array<UserEntity>;
  user?: Maybe<UserEntity>;
};


export type QueryFileArgs = {
  fileId: Scalars['String'];
};


export type QueryLibraryArgs = {
  id: Scalars['String'];
};


export type QueryTitleArgs = {
  id: Scalars['String'];
};


export type QuerySearchArgs = {
  query: Scalars['String'];
};


export type QueryUserArgs = {
  userId: Scalars['String'];
};

export type RefreshTokenEntity = {
  __typename?: 'RefreshTokenEntity';
  id: Scalars['ID'];
  blacklisted: Scalars['Boolean'];
  user: UserEntity;
  expires: Scalars['Float'];
  device: Scalars['String'];
  ip: Scalars['String'];
};

export type StatsModel = {
  __typename?: 'StatsModel';
  time: Scalars['Int'];
  uptime: Scalars['Int'];
  cpuUsage: Scalars['Int'];
  totalMem: Scalars['Int'];
  freeMem: Scalars['Int'];
  totalFiles: Scalars['Int'];
  totalTitles: Scalars['Int'];
};

export enum Subtitle {
  Swedish = 'Swedish',
  English = 'English'
}

export type TitleEntity = {
  __typename?: 'TitleEntity';
  id: Scalars['ID'];
  type: TitleType;
  createdAt: Scalars['DateTime'];
  updatedAt: Scalars['DateTime'];
  slug: Scalars['String'];
  path: Scalars['String'];
  externalIds: TitleExternalIds;
  ratings: TitleRatings;
  thumb?: Maybe<Scalars['String']>;
  dominantColor?: Maybe<Scalars['String']>;
  name: Scalars['String'];
  tagline?: Maybe<Scalars['String']>;
  overview?: Maybe<Scalars['String']>;
  certification?: Maybe<Scalars['String']>;
  year: Scalars['Int'];
  releaseDate?: Maybe<Scalars['DateTime']>;
  runtime?: Maybe<Scalars['Int']>;
  genres: Array<GenreEntity>;
  credits: Array<CreditEntity>;
  images: Array<ImageEntity>;
  files: Array<FileEntity>;
  identify: Array<IdentityModel>;
  topBilling: Array<CreditEntity>;
  cast: Array<CreditEntity>;
  crew: Array<CreditEntity>;
};

export type TitleExternalIds = {
  __typename?: 'TitleExternalIds';
  imdb?: Maybe<Scalars['String']>;
  trakt?: Maybe<Scalars['Int']>;
  tmdb?: Maybe<Scalars['Int']>;
  omdb?: Maybe<Scalars['Int']>;
  tvrage?: Maybe<Scalars['Int']>;
  tvdb?: Maybe<Scalars['Int']>;
};

export type TitleRatings = {
  __typename?: 'TitleRatings';
  imdb?: Maybe<Scalars['Float']>;
  tmdb?: Maybe<Scalars['Float']>;
  rotten?: Maybe<Scalars['Float']>;
  metacritic?: Maybe<Scalars['Float']>;
  trakt?: Maybe<Scalars['Float']>;
  aggregated?: Maybe<Scalars['Float']>;
};

export enum TitleType {
  Movie = 'MOVIE',
  Tvshow = 'TVSHOW',
  Music = 'MUSIC'
}

export type UpdateCreditsModel = {
  __typename?: 'UpdateCreditsModel';
  id?: Maybe<Scalars['String']>;
};

export type UpdateMetadataModel = {
  __typename?: 'UpdateMetadataModel';
  id?: Maybe<Scalars['String']>;
};

export type UserEntity = {
  __typename?: 'UserEntity';
  id: Scalars['ID'];
  createdAt: Scalars['DateTime'];
  username: Scalars['String'];
  role: UserRole;
  refreshTokens: RefreshTokenEntity;
};

export enum UserRole {
  Admin = 'ADMIN',
  User = 'USER'
}

export type FileWithTitleFragment = (
  { __typename?: 'FileEntity' }
  & Pick<FileEntity, 'id' | 'path' | 'subtitles'>
  & { title: (
    { __typename?: 'TitleEntity' }
    & TitleFragment
  ) }
);

export type FileQueryVariables = Exact<{
  fileId: Scalars['String'];
}>;


export type FileQuery = (
  { __typename?: 'Query' }
  & { file?: Maybe<(
    { __typename?: 'FileEntity' }
    & FileWithTitleFragment
  )> }
);

export type LibraryFragment = (
  { __typename?: 'LibraryEntity' }
  & Pick<LibraryEntity, 'id' | 'type' | 'slug' | 'name' | 'createdAt'>
);

export type LibrariesQueryVariables = Exact<{ [key: string]: never; }>;


export type LibrariesQuery = (
  { __typename?: 'Query' }
  & { libraries: Array<(
    { __typename?: 'LibraryEntity' }
    & LibraryFragment
  )> }
);

export type LibraryQueryVariables = Exact<{
  id: Scalars['String'];
}>;


export type LibraryQuery = (
  { __typename?: 'Query' }
  & { library?: Maybe<(
    { __typename?: 'LibraryEntity' }
    & LibraryFragment
  )> }
);

export type StatsQueryVariables = Exact<{ [key: string]: never; }>;


export type StatsQuery = (
  { __typename?: 'Query' }
  & { stats: (
    { __typename?: 'StatsModel' }
    & Pick<StatsModel, 'time' | 'uptime' | 'cpuUsage' | 'totalMem' | 'freeMem'>
  ) }
);

export type CastFragment = (
  { __typename?: 'CreditEntity' }
  & Pick<CreditEntity, 'id' | 'department' | 'order' | 'character'>
  & { person: (
    { __typename?: 'PersonEntity' }
    & Pick<PersonEntity, 'id' | 'name' | 'image'>
  ) }
);

export type CrewFragment = (
  { __typename?: 'CreditEntity' }
  & Pick<CreditEntity, 'id' | 'department' | 'job'>
  & { person: (
    { __typename?: 'PersonEntity' }
    & Pick<PersonEntity, 'id' | 'name' | 'image'>
  ) }
);

export type TitleWithFilesFragment = (
  { __typename?: 'TitleEntity' }
  & Pick<TitleEntity, 'id' | 'createdAt' | 'updatedAt' | 'type' | 'slug' | 'thumb' | 'dominantColor' | 'name' | 'tagline' | 'overview' | 'certification' | 'year' | 'runtime' | 'releaseDate'>
  & { externalIds: (
    { __typename?: 'TitleExternalIds' }
    & Pick<TitleExternalIds, 'imdb' | 'trakt' | 'omdb' | 'tmdb' | 'tvrage' | 'tvdb'>
  ), ratings: (
    { __typename?: 'TitleRatings' }
    & Pick<TitleRatings, 'imdb' | 'tmdb' | 'trakt' | 'rotten' | 'metacritic' | 'aggregated'>
  ), topBilling: Array<(
    { __typename?: 'CreditEntity' }
    & CastFragment
  )>, genres: Array<(
    { __typename?: 'GenreEntity' }
    & Pick<GenreEntity, 'id' | 'slug' | 'name'>
  )>, files: Array<(
    { __typename?: 'FileEntity' }
    & Pick<FileEntity, 'id' | 'path'>
  )> }
);

export type TitleQueryVariables = Exact<{
  id: Scalars['String'];
}>;


export type TitleQuery = (
  { __typename?: 'Query' }
  & { title?: Maybe<(
    { __typename?: 'TitleEntity' }
    & TitleWithFilesFragment
  )> }
);

export type TitleCreditsQueryVariables = Exact<{
  id: Scalars['String'];
}>;


export type TitleCreditsQuery = (
  { __typename?: 'Query' }
  & { title?: Maybe<(
    { __typename?: 'TitleEntity' }
    & { cast: Array<(
      { __typename?: 'CreditEntity' }
      & CastFragment
    )>, crew: Array<(
      { __typename?: 'CreditEntity' }
      & CrewFragment
    )> }
  )> }
);

export type SearchTitleFragment = (
  { __typename?: 'TitleEntity' }
  & Pick<TitleEntity, 'id' | 'createdAt' | 'slug' | 'thumb' | 'name' | 'year' | 'releaseDate' | 'runtime'>
  & { genres: Array<(
    { __typename?: 'GenreEntity' }
    & Pick<GenreEntity, 'name'>
  )> }
);

export type SearchTitlesQueryVariables = Exact<{
  query: Scalars['String'];
}>;


export type SearchTitlesQuery = (
  { __typename?: 'Query' }
  & { search: Array<(
    { __typename?: 'TitleEntity' }
    & SearchTitleFragment
  )> }
);

export type IdentifyTitleQueryVariables = Exact<{
  id: Scalars['String'];
}>;


export type IdentifyTitleQuery = (
  { __typename?: 'Query' }
  & { title?: Maybe<(
    { __typename?: 'TitleEntity' }
    & { identify: Array<(
      { __typename?: 'IdentityModel' }
      & Pick<IdentityModel, 'provider' | 'externalId' | 'type' | 'name' | 'year'>
    )> }
  )> }
);

export type TitleFragment = (
  { __typename?: 'TitleEntity' }
  & Pick<TitleEntity, 'id' | 'createdAt' | 'slug' | 'thumb' | 'name' | 'year' | 'releaseDate'>
);

export type TitlesQueryVariables = Exact<{
  libraryId: Scalars['String'];
  skip?: Maybe<Scalars['Int']>;
  take?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<Scalars['String']>;
  orderDirection?: Maybe<Scalars['String']>;
}>;


export type TitlesQuery = (
  { __typename?: 'Query' }
  & { library?: Maybe<(
    { __typename?: 'LibraryEntity' }
    & Pick<LibraryEntity, 'id'>
    & { titles: (
      { __typename?: 'PaginatedTitleResponse' }
      & Pick<PaginatedTitleResponse, 'totalCount'>
      & { edges: Array<(
        { __typename?: 'TitleEntity' }
        & TitleFragment
      )> }
    ) }
  )> }
);

export type NewlyAddedTitlesQueryVariables = Exact<{
  libraryId: Scalars['String'];
  skip?: Maybe<Scalars['Int']>;
  take?: Maybe<Scalars['Int']>;
}>;


export type NewlyAddedTitlesQuery = (
  { __typename?: 'Query' }
  & { library?: Maybe<(
    { __typename?: 'LibraryEntity' }
    & Pick<LibraryEntity, 'id'>
    & { newlyAdded: (
      { __typename?: 'PaginatedTitleResponse' }
      & Pick<PaginatedTitleResponse, 'totalCount'>
      & { edges: Array<(
        { __typename?: 'TitleEntity' }
        & TitleFragment
      )> }
    ) }
  )> }
);

export type DeleteTitleMutationVariables = Exact<{
  id: Scalars['String'];
}>;


export type DeleteTitleMutation = (
  { __typename?: 'Mutation' }
  & { deleteTitle: (
    { __typename?: 'DeleteModel' }
    & Pick<DeleteModel, 'id'>
  ) }
);

export type UpdateCreditsMutationVariables = Exact<{
  id: Scalars['String'];
}>;


export type UpdateCreditsMutation = (
  { __typename?: 'Mutation' }
  & { updateCredits: (
    { __typename?: 'UpdateCreditsModel' }
    & Pick<UpdateCreditsModel, 'id'>
  ) }
);

export type UpdateMetadataMutationVariables = Exact<{
  id: Scalars['String'];
}>;


export type UpdateMetadataMutation = (
  { __typename?: 'Mutation' }
  & { updateMetadata: (
    { __typename?: 'UpdateMetadataModel' }
    & Pick<UpdateMetadataModel, 'id'>
  ) }
);

export type UserFragment = (
  { __typename?: 'UserEntity' }
  & Pick<UserEntity, 'id' | 'username' | 'role'>
);

export type UserQueryVariables = Exact<{
  userId: Scalars['String'];
}>;


export type UserQuery = (
  { __typename?: 'Query' }
  & { user?: Maybe<(
    { __typename?: 'UserEntity' }
    & UserFragment
  )> }
);

export type UsersQueryVariables = Exact<{ [key: string]: never; }>;


export type UsersQuery = (
  { __typename?: 'Query' }
  & { users: Array<(
    { __typename?: 'UserEntity' }
    & UserFragment
  )> }
);

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
export const FileWithTitleFragmentDoc = gql`
    fragment FileWithTitle on FileEntity {
  id
  path
  subtitles
  title {
    ...Title
  }
}
    ${TitleFragmentDoc}`;
export const LibraryFragmentDoc = gql`
    fragment Library on LibraryEntity {
  id
  type
  slug
  name
  createdAt
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
  topBilling {
    ...Cast
  }
  genres {
    id
    slug
    name
  }
  files {
    id
    path
  }
}
    ${CastFragmentDoc}`;
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
    name
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
    ${FileWithTitleFragmentDoc}`;

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
export function useFileQuery(baseOptions: Apollo.QueryHookOptions<FileQuery, FileQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<FileQuery, FileQueryVariables>(FileDocument, options);
      }
export function useFileLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<FileQuery, FileQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<FileQuery, FileQueryVariables>(FileDocument, options);
        }
export type FileQueryHookResult = ReturnType<typeof useFileQuery>;
export type FileLazyQueryHookResult = ReturnType<typeof useFileLazyQuery>;
export type FileQueryResult = Apollo.QueryResult<FileQuery, FileQueryVariables>;
export function refetchFileQuery(variables?: FileQueryVariables) {
      return { query: FileDocument, variables: variables }
    }
export const LibrariesDocument = gql`
    query Libraries {
  libraries {
    ...Library
  }
}
    ${LibraryFragmentDoc}`;

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
export function useLibrariesQuery(baseOptions?: Apollo.QueryHookOptions<LibrariesQuery, LibrariesQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<LibrariesQuery, LibrariesQueryVariables>(LibrariesDocument, options);
      }
export function useLibrariesLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<LibrariesQuery, LibrariesQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<LibrariesQuery, LibrariesQueryVariables>(LibrariesDocument, options);
        }
export type LibrariesQueryHookResult = ReturnType<typeof useLibrariesQuery>;
export type LibrariesLazyQueryHookResult = ReturnType<typeof useLibrariesLazyQuery>;
export type LibrariesQueryResult = Apollo.QueryResult<LibrariesQuery, LibrariesQueryVariables>;
export function refetchLibrariesQuery(variables?: LibrariesQueryVariables) {
      return { query: LibrariesDocument, variables: variables }
    }
export const LibraryDocument = gql`
    query Library($id: String!) {
  library(id: $id) {
    ...Library
  }
}
    ${LibraryFragmentDoc}`;

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
export function useLibraryQuery(baseOptions: Apollo.QueryHookOptions<LibraryQuery, LibraryQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<LibraryQuery, LibraryQueryVariables>(LibraryDocument, options);
      }
export function useLibraryLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<LibraryQuery, LibraryQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<LibraryQuery, LibraryQueryVariables>(LibraryDocument, options);
        }
export type LibraryQueryHookResult = ReturnType<typeof useLibraryQuery>;
export type LibraryLazyQueryHookResult = ReturnType<typeof useLibraryLazyQuery>;
export type LibraryQueryResult = Apollo.QueryResult<LibraryQuery, LibraryQueryVariables>;
export function refetchLibraryQuery(variables?: LibraryQueryVariables) {
      return { query: LibraryDocument, variables: variables }
    }
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
export function useStatsQuery(baseOptions?: Apollo.QueryHookOptions<StatsQuery, StatsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<StatsQuery, StatsQueryVariables>(StatsDocument, options);
      }
export function useStatsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<StatsQuery, StatsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<StatsQuery, StatsQueryVariables>(StatsDocument, options);
        }
export type StatsQueryHookResult = ReturnType<typeof useStatsQuery>;
export type StatsLazyQueryHookResult = ReturnType<typeof useStatsLazyQuery>;
export type StatsQueryResult = Apollo.QueryResult<StatsQuery, StatsQueryVariables>;
export function refetchStatsQuery(variables?: StatsQueryVariables) {
      return { query: StatsDocument, variables: variables }
    }
export const TitleDocument = gql`
    query Title($id: String!) {
  title(id: $id) {
    ...TitleWithFiles
  }
}
    ${TitleWithFilesFragmentDoc}`;

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
 *   },
 * });
 */
export function useTitleQuery(baseOptions: Apollo.QueryHookOptions<TitleQuery, TitleQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<TitleQuery, TitleQueryVariables>(TitleDocument, options);
      }
export function useTitleLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<TitleQuery, TitleQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<TitleQuery, TitleQueryVariables>(TitleDocument, options);
        }
export type TitleQueryHookResult = ReturnType<typeof useTitleQuery>;
export type TitleLazyQueryHookResult = ReturnType<typeof useTitleLazyQuery>;
export type TitleQueryResult = Apollo.QueryResult<TitleQuery, TitleQueryVariables>;
export function refetchTitleQuery(variables?: TitleQueryVariables) {
      return { query: TitleDocument, variables: variables }
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
${CrewFragmentDoc}`;

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
export function useTitleCreditsQuery(baseOptions: Apollo.QueryHookOptions<TitleCreditsQuery, TitleCreditsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<TitleCreditsQuery, TitleCreditsQueryVariables>(TitleCreditsDocument, options);
      }
export function useTitleCreditsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<TitleCreditsQuery, TitleCreditsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<TitleCreditsQuery, TitleCreditsQueryVariables>(TitleCreditsDocument, options);
        }
export type TitleCreditsQueryHookResult = ReturnType<typeof useTitleCreditsQuery>;
export type TitleCreditsLazyQueryHookResult = ReturnType<typeof useTitleCreditsLazyQuery>;
export type TitleCreditsQueryResult = Apollo.QueryResult<TitleCreditsQuery, TitleCreditsQueryVariables>;
export function refetchTitleCreditsQuery(variables?: TitleCreditsQueryVariables) {
      return { query: TitleCreditsDocument, variables: variables }
    }
export const SearchTitlesDocument = gql`
    query SearchTitles($query: String!) {
  search(query: $query) {
    ...SearchTitle
  }
}
    ${SearchTitleFragmentDoc}`;

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
export function useSearchTitlesQuery(baseOptions: Apollo.QueryHookOptions<SearchTitlesQuery, SearchTitlesQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<SearchTitlesQuery, SearchTitlesQueryVariables>(SearchTitlesDocument, options);
      }
export function useSearchTitlesLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<SearchTitlesQuery, SearchTitlesQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<SearchTitlesQuery, SearchTitlesQueryVariables>(SearchTitlesDocument, options);
        }
export type SearchTitlesQueryHookResult = ReturnType<typeof useSearchTitlesQuery>;
export type SearchTitlesLazyQueryHookResult = ReturnType<typeof useSearchTitlesLazyQuery>;
export type SearchTitlesQueryResult = Apollo.QueryResult<SearchTitlesQuery, SearchTitlesQueryVariables>;
export function refetchSearchTitlesQuery(variables?: SearchTitlesQueryVariables) {
      return { query: SearchTitlesDocument, variables: variables }
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
export function useIdentifyTitleQuery(baseOptions: Apollo.QueryHookOptions<IdentifyTitleQuery, IdentifyTitleQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<IdentifyTitleQuery, IdentifyTitleQueryVariables>(IdentifyTitleDocument, options);
      }
export function useIdentifyTitleLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<IdentifyTitleQuery, IdentifyTitleQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<IdentifyTitleQuery, IdentifyTitleQueryVariables>(IdentifyTitleDocument, options);
        }
export type IdentifyTitleQueryHookResult = ReturnType<typeof useIdentifyTitleQuery>;
export type IdentifyTitleLazyQueryHookResult = ReturnType<typeof useIdentifyTitleLazyQuery>;
export type IdentifyTitleQueryResult = Apollo.QueryResult<IdentifyTitleQuery, IdentifyTitleQueryVariables>;
export function refetchIdentifyTitleQuery(variables?: IdentifyTitleQueryVariables) {
      return { query: IdentifyTitleDocument, variables: variables }
    }
export const TitlesDocument = gql`
    query Titles($libraryId: String!, $skip: Int, $take: Int, $orderBy: String, $orderDirection: String) {
  library(id: $libraryId) {
    id
    titles(
      skip: $skip
      take: $take
      orderBy: $orderBy
      orderDirection: $orderDirection
    ) {
      edges {
        ...Title
      }
      totalCount
    }
  }
}
    ${TitleFragmentDoc}`;

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
 *   },
 * });
 */
export function useTitlesQuery(baseOptions: Apollo.QueryHookOptions<TitlesQuery, TitlesQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<TitlesQuery, TitlesQueryVariables>(TitlesDocument, options);
      }
export function useTitlesLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<TitlesQuery, TitlesQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<TitlesQuery, TitlesQueryVariables>(TitlesDocument, options);
        }
export type TitlesQueryHookResult = ReturnType<typeof useTitlesQuery>;
export type TitlesLazyQueryHookResult = ReturnType<typeof useTitlesLazyQuery>;
export type TitlesQueryResult = Apollo.QueryResult<TitlesQuery, TitlesQueryVariables>;
export function refetchTitlesQuery(variables?: TitlesQueryVariables) {
      return { query: TitlesDocument, variables: variables }
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
    ${TitleFragmentDoc}`;

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
export function useNewlyAddedTitlesQuery(baseOptions: Apollo.QueryHookOptions<NewlyAddedTitlesQuery, NewlyAddedTitlesQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<NewlyAddedTitlesQuery, NewlyAddedTitlesQueryVariables>(NewlyAddedTitlesDocument, options);
      }
export function useNewlyAddedTitlesLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<NewlyAddedTitlesQuery, NewlyAddedTitlesQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<NewlyAddedTitlesQuery, NewlyAddedTitlesQueryVariables>(NewlyAddedTitlesDocument, options);
        }
export type NewlyAddedTitlesQueryHookResult = ReturnType<typeof useNewlyAddedTitlesQuery>;
export type NewlyAddedTitlesLazyQueryHookResult = ReturnType<typeof useNewlyAddedTitlesLazyQuery>;
export type NewlyAddedTitlesQueryResult = Apollo.QueryResult<NewlyAddedTitlesQuery, NewlyAddedTitlesQueryVariables>;
export function refetchNewlyAddedTitlesQuery(variables?: NewlyAddedTitlesQueryVariables) {
      return { query: NewlyAddedTitlesDocument, variables: variables }
    }
export const DeleteTitleDocument = gql`
    mutation DeleteTitle($id: String!) {
  deleteTitle(id: $id) {
    id
  }
}
    `;
export type DeleteTitleMutationFn = Apollo.MutationFunction<DeleteTitleMutation, DeleteTitleMutationVariables>;

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
export function useDeleteTitleMutation(baseOptions?: Apollo.MutationHookOptions<DeleteTitleMutation, DeleteTitleMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DeleteTitleMutation, DeleteTitleMutationVariables>(DeleteTitleDocument, options);
      }
export type DeleteTitleMutationHookResult = ReturnType<typeof useDeleteTitleMutation>;
export type DeleteTitleMutationResult = Apollo.MutationResult<DeleteTitleMutation>;
export type DeleteTitleMutationOptions = Apollo.BaseMutationOptions<DeleteTitleMutation, DeleteTitleMutationVariables>;
export const UpdateCreditsDocument = gql`
    mutation UpdateCredits($id: String!) {
  updateCredits(id: $id) {
    id
  }
}
    `;
export type UpdateCreditsMutationFn = Apollo.MutationFunction<UpdateCreditsMutation, UpdateCreditsMutationVariables>;

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
export function useUpdateCreditsMutation(baseOptions?: Apollo.MutationHookOptions<UpdateCreditsMutation, UpdateCreditsMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateCreditsMutation, UpdateCreditsMutationVariables>(UpdateCreditsDocument, options);
      }
export type UpdateCreditsMutationHookResult = ReturnType<typeof useUpdateCreditsMutation>;
export type UpdateCreditsMutationResult = Apollo.MutationResult<UpdateCreditsMutation>;
export type UpdateCreditsMutationOptions = Apollo.BaseMutationOptions<UpdateCreditsMutation, UpdateCreditsMutationVariables>;
export const UpdateMetadataDocument = gql`
    mutation UpdateMetadata($id: String!) {
  updateMetadata(id: $id) {
    id
  }
}
    `;
export type UpdateMetadataMutationFn = Apollo.MutationFunction<UpdateMetadataMutation, UpdateMetadataMutationVariables>;

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
export function useUpdateMetadataMutation(baseOptions?: Apollo.MutationHookOptions<UpdateMetadataMutation, UpdateMetadataMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateMetadataMutation, UpdateMetadataMutationVariables>(UpdateMetadataDocument, options);
      }
export type UpdateMetadataMutationHookResult = ReturnType<typeof useUpdateMetadataMutation>;
export type UpdateMetadataMutationResult = Apollo.MutationResult<UpdateMetadataMutation>;
export type UpdateMetadataMutationOptions = Apollo.BaseMutationOptions<UpdateMetadataMutation, UpdateMetadataMutationVariables>;
export const UserDocument = gql`
    query User($userId: String!) {
  user(userId: $userId) {
    ...User
  }
}
    ${UserFragmentDoc}`;

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
export function useUserQuery(baseOptions: Apollo.QueryHookOptions<UserQuery, UserQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<UserQuery, UserQueryVariables>(UserDocument, options);
      }
export function useUserLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<UserQuery, UserQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<UserQuery, UserQueryVariables>(UserDocument, options);
        }
export type UserQueryHookResult = ReturnType<typeof useUserQuery>;
export type UserLazyQueryHookResult = ReturnType<typeof useUserLazyQuery>;
export type UserQueryResult = Apollo.QueryResult<UserQuery, UserQueryVariables>;
export function refetchUserQuery(variables?: UserQueryVariables) {
      return { query: UserDocument, variables: variables }
    }
export const UsersDocument = gql`
    query Users {
  users {
    ...User
  }
}
    ${UserFragmentDoc}`;

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
export function useUsersQuery(baseOptions?: Apollo.QueryHookOptions<UsersQuery, UsersQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<UsersQuery, UsersQueryVariables>(UsersDocument, options);
      }
export function useUsersLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<UsersQuery, UsersQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<UsersQuery, UsersQueryVariables>(UsersDocument, options);
        }
export type UsersQueryHookResult = ReturnType<typeof useUsersQuery>;
export type UsersLazyQueryHookResult = ReturnType<typeof useUsersLazyQuery>;
export type UsersQueryResult = Apollo.QueryResult<UsersQuery, UsersQueryVariables>;
export function refetchUsersQuery(variables?: UsersQueryVariables) {
      return { query: UsersDocument, variables: variables }
    }