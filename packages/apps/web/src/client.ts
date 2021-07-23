import {
  ApolloClient,
  createHttpLink,
  InMemoryCache,
  NormalizedCacheObject,
} from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import { createNetworkStatusNotifier } from "react-apollo-network-status";
import { HEMBIO_API_URL } from "./constants";
import { rootStore } from "./stores";
const { link, useApolloNetworkStatus } = createNetworkStatusNotifier();

const httpLink = createHttpLink({
  uri: `${HEMBIO_API_URL}/graphql`,
});

const authLink = setContext((_, { headers }) => {
  // get the authentication token from authStore
  const token = rootStore.authStore.accessToken;
  // return the headers to the context so httpLink can read them
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
    },
  };
});

export async function createApolloClient(): Promise<
  ApolloClient<NormalizedCacheObject>
> {
  const cache = new InMemoryCache();
  const client = new ApolloClient({
    cache,
    link: link.concat(authLink).concat(httpLink),
  });
  cache.gc();
  return client;
}

export { useApolloNetworkStatus };
