import { gql } from "@apollo/client";

export const GET_TRANSACTION_LIST = gql`
  query GetTransactionList($input: GetTransactionListInput!) {
    getTransactionList(input: $input) {
      message {
        code
        message
      }
      transactions {
        id
        type
        amount
        category
        createdAt
        updatedAt
        depositor
        description
        paymentType
      }
    }
  }
`;
