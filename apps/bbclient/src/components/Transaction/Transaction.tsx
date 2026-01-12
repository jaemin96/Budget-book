"use client";

import { useEffect, useState } from "react";
import styles from "./styles/transaction.module.scss";
import { useQuery } from "@apollo/client";
import { GET_TRANSACTION_LIST } from "@/graphql/queries/Transaction";
import Link from "next/link";
import { Home, Octagon, Plus, ReceiptText } from "lucide-react";
import { Transaction as TransactionModel } from "@/model/transaction.model";
import { categoryIcons } from "@/constants/icons/transaction.icons";
import { TransactionCategoryLabels } from "@/constants/enum/transaction.enum";
import classNames from "classnames";
import Skeleton from "@/components/Skeleton/Skeleton";
import { Card } from "@/components";

interface TransactionProps {}

function getRelativeTime(date: Date): string {
  const now = new Date();
  const transactionDate = new Date(date);
  const diff = now.getTime() - transactionDate.getTime();
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const days = Math.floor(hours / 24);

  if (hours < 1) return "방금 전";
  if (hours < 24) return `${hours}시간 전`;
  if (days < 7) return `${days}일 전`;
  return transactionDate.toLocaleDateString("ko-KR");
}

const Transaction: React.FC<TransactionProps> = () => {
  const [transactions, setTransactions] = useState<TransactionModel[]>([]);
  const { data, loading, error, refetch } = useQuery(GET_TRANSACTION_LIST, {
    variables: {
      input: {},
    },
  });

  useEffect(() => {
    refetch();
  }, []);

  useEffect(() => {
    if (!data?.getTransactionList?.transactions) return;
    setTransactions(data.getTransactionList.transactions);
  }, [data]);

  const getAmountClass = (type: string) => {
    switch (type) {
      case "EXPENSE":
        return styles.amountExpense;
      case "INCOME":
        return styles.amountIncome;
      case "TRANSFER":
        return styles.amountTransfer;
      default:
        return "";
    }
  };

  const formatAmount = (transaction: TransactionModel) => {
    const prefix = transaction.type === "INCOME" ? "+" : "-";
    return `${prefix}${transaction.amount.toLocaleString()}원`;
  };

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
          {[...Array(10)].map((_, index) => renderSkeletonItem(index))}
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
        {transactions.map((transaction) => {
          const Icon = categoryIcons[transaction.category];
          const categoryLabel = TransactionCategoryLabels[transaction.category];
          const relativeTime = getRelativeTime(transaction.createdAt);

          return (
            <Link
              key={transaction.id}
              href={`/transaction/detail/${transaction.id}`}
              className={styles.transactionItemLink}
            >
              <div className={styles.transactionItem}>
                <div className={styles.itemIcon}>
                  <Icon size={20} />
                </div>
                <div className={styles.itemInfo}>
                  <span className={styles.itemCategory}>{categoryLabel}</span>
                  <span className={styles.itemDescription}>
                    {transaction.description || transaction.depositor || "-"}
                  </span>
                </div>
                <div className={styles.itemRight}>
                  <span className={classNames(styles.itemAmount, getAmountClass(transaction.type))}>
                    {formatAmount(transaction)}
                  </span>
                  <span className={styles.itemTime}>{relativeTime}</span>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    );
  };

  return (
    <>
      <Card.Header
        icon={Octagon}
        title="Transactions"
        buttons={
          <>
            <Link href="/">
              <Home size={20} />
            </Link>
            <Link href="/transaction/create">
              <Plus size={20} />
            </Link>
          </>
        }
      />
      <Card.Body>{renderContent()}</Card.Body>
    </>
  );
};

export default Transaction;
