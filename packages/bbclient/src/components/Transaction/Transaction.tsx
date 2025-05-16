"use client";

import { useEffect, useState } from "react";
import classNames from "classnames";
import styles from "./styles/transaction.module.scss";
import { useQuery } from "@apollo/client";
import { GET_TRANSACTION_LIST } from "@/graphql/queries/getTransactionList";
import { Card, Button, Table } from "@/components";
import Link from "next/link";
import { Octagon, Plus } from "lucide-react";
import { Spinner } from "@/components";

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

  const columns = [
    { label: "ID", dataIndex: "id" },
    { label: "Type", dataIndex: "type" },
    { label: "Amount", dataIndex: "amount" },
    // { label: "Depositor", dataIndex: "depositor" },
    { label: "Category", dataIndex: "category" },
    // { label: "Description", dataIndex: "description" },
    // { label: "Payment Type", dataIndex: "paymentType" },
  ];

  if (loading)
    return (
      <p>
        <Spinner /> Loading...
      </p>
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
