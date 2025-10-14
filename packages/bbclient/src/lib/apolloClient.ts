import {
  ApolloClient,
  ApolloLink,
  from,
  HttpLink,
  InMemoryCache,
} from "@apollo/client";
import { onError } from "@apollo/client/link/error";
import Router from "next/router";

const httpLink = new HttpLink({
  uri: process.env.NEXT_PUBLIC_GRAPHQL_API,
});

const authLink = new ApolloLink((operation, forward) => {
  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;
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
    // 토큰 만료 또는 인증 실패 시
    localStorage.removeItem("token");
    Router.replace("/authentication");
  }

  // GraphQL 에러 중 인증 실패 처리
  if (graphQLErrors) {
    for (let err of graphQLErrors) {
      console.log({ err });

      if (err.extensions?.code === "UNAUTHENTICATED") {
        localStorage.removeItem("token");
        Router.replace("/authentication");
      }
    }
  }
});

const client = new ApolloClient({
  link: from([errorLink, authLink.concat(httpLink)]),
  cache: new InMemoryCache(),
});

export default client;
