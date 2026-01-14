import { GET_ACCOUNT_LIST } from "@/graphql/queries/Account/getAccountList";
import { useQuery } from "@apollo/client";

const BANK_NAME_MAP: Record<string, string> = {
  NH: "농협은행(NH)",
  IBK: "기업은행(IBK)",
  WON: "우리은행(WON)",
  kakaoBank: "카카오뱅크(kakaoBank)",
  MG: "새마을금고(MG)",
  TOSS: "토스뱅크(TOSS)",
  NAMU: "나무증권(NAMU)",
  kakaoPay: "카카오페이(kakaoPay)",
  cash: "현금(cash)",
};

interface AccountOption {
  value: number;
  label: string;
  bankName: string;
}

export const useAccounts = () => {
  const { data, loading, error } = useQuery(GET_ACCOUNT_LIST, {
    variables: {
      input: {},
    },
  });

  const accounts: AccountOption[] =
    data?.getAccountList?.accounts
      ?.map((acc: any) => ({
        value: acc.id,
        label: BANK_NAME_MAP[acc.bankName] || acc.bankName,
        bankName: acc.bankName,
      }))
      .sort((a: any, b: any) => a.value - b.value) ?? [];

  return { accounts, loading, error };
};
