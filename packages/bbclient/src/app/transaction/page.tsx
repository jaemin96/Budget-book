"use client";

import React from "react";
import { Card } from "@/components";
import Transaction from "@/components/Transaction/Transaction";
import styles from "../styles/transaction.module.scss";

export default function TransactionListPage() {
  return (
    <div className={styles.container}>
      <Card>
        <Transaction />
      </Card>
    </div>
  );
}
