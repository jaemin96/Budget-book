import {
  ApolloClient,
  ApolloLink,
  from,
  HttpLink,
  InMemoryCache,
} from "@apollo/client";
import { onError } from "@apollo/client/link/error";

const httpLink = new HttpLink({
  uri: "/api/graphql", // 프록시 사용
  credentials: "include",
});

// function getTokenFromCookie(): string | null {
//   if (typeof document === "undefined") return null;
//   const match = document.cookie.match(/(?:^|;\s*)token=([^;]*)/);
//   return match ? decodeURIComponent(match[1]) : null;
// }

// const authLink = new ApolloLink((operation, forward) => {
//   const token = getTokenFromCookie();

//   operation.setContext(({ headers = {} }) => ({
//     headers: {
//       ...headers,
//       Authorization: token ? `Bearer ${token}` : "",
//     },
//   }));
//   return forward(operation);
// });

const errorLink = onError(({ networkError, graphQLErrors }) => {
  const clearCookie = () => {
    const isProduction = process.env.NODE_ENV === "production";
    const cookieString = isProduction
      ? "token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; Secure; SameSite=None"
      : "token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax";

    document.cookie = cookieString;
  };

  if (
    networkError &&
    "statusCode" in networkError &&
    networkError.statusCode === 401
  ) {
    clearCookie();
    if (typeof window !== "undefined") {
      window.location.href = "/authentication";
    }
  }

  if (graphQLErrors) {
    for (const err of graphQLErrors) {
      if (err.extensions?.code === "UNAUTHENTICATED") {
        clearCookie();
        if (typeof window !== "undefined") {
          window.location.href = "/authentication";
        }
      }
    }
  }
});

const client = new ApolloClient({
  link: from([errorLink, httpLink]),
  cache: new InMemoryCache(),
});

export default client;
