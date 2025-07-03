import { gql } from "@apollo/client";

export const UPDATE_TRANSACTION = gql`
  mutation UpdateTransaction($input: UpdateTransactionInput!) {
    updateTransaction(input: $input) {
      message {
        code
        message
      }
      id
    }
  }
`;
