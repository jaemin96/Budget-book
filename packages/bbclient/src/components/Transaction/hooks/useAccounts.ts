import { GET_ACCOUNT_LIST } from "@/graphql/queries/Account/getAccountList";
import { useQuery } from "@apollo/client";

export const useAccounts = () => {
  const { data, loading, error } = useQuery(GET_ACCOUNT_LIST, {
    variables: {
      input: {},
    },
  });

  const accounts =
    data?.getAccountList?.accounts?.map((acc: any) => ({
      value: acc.id,
      label: acc.bankName,
    })) ?? [];

  return { accounts, loading, error };
};
