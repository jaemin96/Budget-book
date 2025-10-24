import { gql } from "@apollo/client";

export const GET_ACCOUNT_LIST = gql`
  query GetAccountList($input: GetAccountListInput!) {
    getAccountList(input: $input) {
      accounts {
        id
        createdAt
        updatedAt
        deletedAt
        bankName
        availableBalance
        fixedDepositBalance
        holdBalance
        investmentBalance
        savingBalance
        totalBalance
      }
    }
  }
`;
