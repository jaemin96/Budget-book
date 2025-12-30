import { gql } from "@apollo/client";

export const GET_TRANSACTION = gql`
  query GetTransaction($input: GetTransactionInput!) {
    getTransaction(input: $input) {
      message {
        code
        message
      }
      transaction {
        id
        type
        amount
        category
        createdAt
        updatedAt
        depositor
        description
        paymentType
        fromAccountId
        toAccountId

      }
    }
  }
`;
