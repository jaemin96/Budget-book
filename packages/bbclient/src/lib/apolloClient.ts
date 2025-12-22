import {
  ApolloClient,
  ApolloLink,
  from,
  HttpLink,
  InMemoryCache,
} from "@apollo/client";
import { onError } from "@apollo/client/link/error";

const httpLink = new HttpLink({
  uri: process.env.NEXT_PUBLIC_GRAPHQL_API,
  credentials: "include",
});

function getTokenFromCookie(): string | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(/(?:^|;\s*)token=([^;]*)/);
  return match ? decodeURIComponent(match[1]) : null;
}

const authLink = new ApolloLink((operation, forward) => {
  const token = getTokenFromCookie();

  operation.setContext(({ headers = {} }) => ({
    headers: {
      ...headers,
      Authorization: token ? `Bearer ${token}` : "",
    },
  }));
  return forward(operation);
});

const errorLink = onError(({ networkError, graphQLErrors }) => {
  if (
    networkError &&
    "statusCode" in networkError &&
    networkError.statusCode === 401
  ) {
    // 인증 실패 시 쿠키 제거
    document.cookie =
      "token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; Secure; SameSite=Lax";
    if (typeof window !== "undefined") {
      window.location.href = "/authentication";
    }
  }

  if (graphQLErrors) {
    for (const err of graphQLErrors) {
      console.log({ err });
      if (err.extensions?.code === "UNAUTHENTICATED") {
        document.cookie =
          "token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; Secure; SameSite=Lax";
        if (typeof window !== "undefined") {
          window.location.href = "/authentication";
        }
      }
    }
  }
});

const client = new ApolloClient({
  link: from([errorLink, authLink.concat(httpLink)]),
  cache: new InMemoryCache(),
});

export default client;
