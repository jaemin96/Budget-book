"use client";

import { useEffect, useState } from "react";
import classNames from "classnames";
import styles from "./styles/transaction.module.scss";
import { useQuery } from "@apollo/client";
import { GET_TRANSACTION_LIST } from "@/graphql/queries/getTransactionList";
import { Card, Button } from "@/components";
import Link from "next/link";
import { ArrowLeftRight } from "lucide-react";

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
    "ID",
    "Type",
    "Amount",
    // "Depositor",
    "Category",
    // "Description",
    // "PaymentType",
  ];

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error!</p>;

  return (
    <>
      <Card.Header
        icon={ArrowLeftRight}
        title="Transactions"
        buttons={
          <>
            <Button>
              <Link href="/transaction/create">+</Link>
            </Button>
            <Button>2</Button>
          </>
        }
      />
      <Card.Body>
        <div className={classNames(styles.transaction)}>
          <table>
            <thead>
              <tr>
                {columns.map((col) => (
                  <th key={col}>{col}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {transactions?.map((row) => (
                <tr key={row.id}>
                  <td>{row.id}</td>
                  <td>{row.type}</td>
                  <td>{row.amount}</td>
                  {/* <td>{row.depositor}</td> */}
                  <td>{row.category}</td>
                  {/* <td>{row.description}</td> */}
                  {/* <td>{row.paymentType}</td> */}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card.Body>
    </>
  );
};

export default Transaction;
