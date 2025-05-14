"use client";

import { useEffect, useState } from "react";
import classNames from "classnames";
import styles from "./styles/transaction.module.scss";
import { useQuery } from "@apollo/client";
import { GET_TRANSACTION_LIST } from "@/graphql/queries/getTransactionList";

interface TransactionProps {}

const Transaction: React.FC<TransactionProps> = (props) => {
  const [transactions, setTransactions] = useState<any>([]);
  const { data, loading, error, refetch } = useQuery(GET_TRANSACTION_LIST, {
    variables: {
      input: {},
    },
  });

  useEffect(() => {
    if (!data) return;
    const { transactions } = data?.getTransactionList;
    setTransactions(transactions);
  }, [data]);

  useEffect(() => {
    console.log({ transactions });
  }, [transactions]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error!</p>;

  return (
    <>
      <div className={classNames(styles.transaction)}>hello</div>
    </>
  );
};

export default Transaction;
