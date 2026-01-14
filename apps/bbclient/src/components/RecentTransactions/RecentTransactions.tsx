"use client";

import { useEffect, useState } from "react";
import { useQuery } from "@apollo/client";
import Link from "next/link";
import { GET_TRANSACTION_LIST } from "@/graphql/queries/Transaction";
import { Transaction } from "@/model/transaction.model";
import TransactionItem from "./TransactionItem";
import Skeleton from "@/components/Skeleton/Skeleton";
import { ReceiptText } from "lucide-react";
import styles from "./styles/recentTransactions.module.scss";

const RecentTransactions: React.FC = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  const { data, loading, error } = useQuery(GET_TRANSACTION_LIST, {
    variables: {
      input: {
        size: 5,
      },
    },
    fetchPolicy: "cache-and-network",
    context: {
      fetchOptions: {
        credentials: "include",
      },
    },
  });

  useEffect(() => {
    if (!data?.getTransactionList?.transactions) return;
    setTransactions(data.getTransactionList.transactions);
  }, [data]);

  const renderSkeletonItem = (index: number) => (
    <div key={`skeleton-${index}`} className={styles.transactionItem}>
      <Skeleton variant="circular" width={40} height={40} />
      <div className={styles.itemInfo}>
        <Skeleton variant="text" width="60%" height={16} />
        <Skeleton variant="text" width="80%" height={14} />
      </div>
      <div className={styles.itemRight}>
        <Skeleton variant="text" width={80} height={18} />
        <Skeleton variant="text" width={60} height={12} />
      </div>
    </div>
  );

  const renderContent = () => {
    if (loading) {
      return (
        <div className={styles.transactionList}>
          {[...Array(5)].map((_, index) => renderSkeletonItem(index))}
        </div>
      );
    }

    if (error) {
      return (
        <div className={styles.emptyState}>
          <ReceiptText className={styles.emptyIcon} />
          <span className={styles.emptyText}>거래 내역을 불러오는 중 오류가 발생했습니다.</span>
        </div>
      );
    }

    if (!transactions || transactions.length === 0) {
      return (
        <div className={styles.emptyState}>
          <ReceiptText className={styles.emptyIcon} />
          <span className={styles.emptyText}>아직 거래 내역이 없습니다.</span>
        </div>
      );
    }

    return (
      <div className={styles.transactionList}>
        {transactions.map((transaction) => (
          <TransactionItem key={transaction.id} transaction={transaction} />
        ))}
      </div>
    );
  };

  return (
    <div className={styles.recentTransactions}>
      <div className={styles.header}>
        <h2 className={styles.title}>Recent Transactions</h2>
        <Link href="/transaction" className={styles.viewAllLink}>
          View All
        </Link>
      </div>
      {renderContent()}
    </div>
  );
};

export default RecentTransactions;
