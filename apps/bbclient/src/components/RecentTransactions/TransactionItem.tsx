"use client";

import { Transaction } from "@/model/transaction.model";
import { categoryIcons } from "@/constants/icons/transaction.icons";
import { TransactionCategoryLabels } from "@/constants/enum/transaction.enum";
import styles from "./styles/recentTransactions.module.scss";
import classNames from "classnames";
import Link from "next/link";

interface TransactionItemProps {
  transaction: Transaction;
}

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

const TransactionItem: React.FC<TransactionItemProps> = ({ transaction }) => {
  const Icon = categoryIcons[transaction.category];
  const categoryLabel = TransactionCategoryLabels[transaction.category];
  const relativeTime = getRelativeTime(transaction.createdAt);

  const getAmountClass = () => {
    switch (transaction.type) {
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

  const formatAmount = () => {
    const prefix = transaction.type === "INCOME" ? "+" : "-";
    return `${prefix}${transaction.amount.toLocaleString()}원`;
  };

  return (
    <Link href={`/transaction/detail/${transaction.id}`} className={styles.transactionItemLink}>
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
          <span className={classNames(styles.itemAmount, getAmountClass())}>
            {formatAmount()}
          </span>
          <span className={styles.itemTime}>{relativeTime}</span>
        </div>
      </div>
    </Link>
  );
};

export default TransactionItem;
