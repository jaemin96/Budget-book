"use client";

import { useEffect, useState } from "react";
import classNames from "classnames";
import styles from "./styles/transaction.module.scss";
import { useQuery } from "@apollo/client";
import { GET_TRANSACTION_LIST } from "@/graphql/queries/Transaction";
import { Card, Button, Table } from "@/components";
import Link from "next/link";
import { Octagon, Plus } from "lucide-react";
import { Spinner } from "@/components";
import {
  TransactionCategoryLabels,
  TransactionTypeLabels,
} from "../../constants/enum/transaction.enum";
import {
  TransactionCategory,
  TransactionType,
} from "@/model/transaction.model";

interface TransactionProps {}

const Transaction: React.FC<TransactionProps> = (props) => {
  const [transactions, setTransactions] = useState<any>([]);
  const [total, setTotal] = useState<number>(0);
  const [totalPages, setTotalPages] = useState<number>(0);
  const { data, loading, error, refetch } = useQuery(GET_TRANSACTION_LIST, {
    variables: {
      input: {},
    },
  });

  useEffect(() => {
    refetch();
  }, []);

  useEffect(() => {
    if (!data) return;
    const { transactions, totalCount, totalPages } = data?.getTransactionList;

    setTotal(totalCount);
    setTotalPages(totalPages);
    setTransactions(transactions);
  }, [data]);

  useEffect(() => {
    console.log({ transactions, total, totalPages });
  }, [transactions, total, totalPages]);

  const columns = [
    { label: "ID", dataIndex: "id" },
    {
      label: `Type`,
      dataIndex: "type",
      render: (value: TransactionType) => TransactionTypeLabels[value],
    },
    {
      label: "Amount",
      dataIndex: "amount",
      render: (amount: number) => amount.toLocaleString() + "원",
    },
    // { label: "Depositor", dataIndex: "depositor" },
    {
      label: "Category",
      dataIndex: "category",
      render: (value: TransactionCategory) => TransactionCategoryLabels[value],
    },
    // { label: "Description", dataIndex: "description" },
    // { label: "Payment Type", dataIndex: "paymentType" },
  ];

  if (loading)
    return (
      <div>
        <Spinner /> Loading...
      </div>
    );
  if (error) return <p>Error!</p>;

  return (
    <>
      <Card.Header
        icon={Octagon}
        title="Transactions"
        buttons={
          <>
            <Button>
              <Link className={styles.link} href="/transaction/create">
                <Plus />
              </Link>
            </Button>
          </>
        }
      />
      <Card.Body>
        <div className={classNames(styles.transaction)}>
          <Table columns={columns} data={transactions} />
        </div>
      </Card.Body>
    </>
  );
};

export default Transaction;
