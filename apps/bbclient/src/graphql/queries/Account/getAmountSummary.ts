import { gql } from "@apollo/client";

export const GET_AMOUNT_SUMMARY = gql`
  query GetAmountSummary($input: GetAmountSummaryInput!) {
    getAmountSummary(input: $input) {
      availableBalance
      fixedDepositBalance
      holdBalance
      investmentBalance
      savingBalance
      totalBalance
    }
  }
`;
