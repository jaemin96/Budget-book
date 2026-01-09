"use client";

import styles from "./styles/home.module.scss";
import classNames from "classnames";
import BalanceSummary from "@/components/BalanceSummary/BalanceSummary";
import RecentTransactions from "@/components/RecentTransactions/RecentTransactions";

export default function Home() {
  return (
    <div className={styles.container}>
      <div className={styles.balances}>
        <BalanceSummary />

        {/* 최근 거래 내역 */}
        <div className={classNames(styles.fadeIn, styles.delay4)}>
          <RecentTransactions />
        </div>
      </div>
    </div>
  );
}
