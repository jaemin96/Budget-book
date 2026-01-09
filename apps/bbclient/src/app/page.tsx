"use client";

import styles from "./styles/home.module.scss";
import Link from "next/link";
import { Button, Card, Spinner } from "@/components";
import { useQuery } from "@apollo/client";
import { GET_AMOUNT_SUMMARY } from "../graphql/queries/Account";
import { useEffect, useState } from "react";
import { Wallet, PiggyBank, CircleDollarSign, Clock } from "lucide-react";
import classNames from "classnames";

export default function Home() {
  const [summary, setSummary] = useState<any>();
  const { data, loading, error, refetch } = useQuery(GET_AMOUNT_SUMMARY, {
    variables: {
      input: {},
    },
    context: {
      fetchOptions: {
        credentials: "include",
      },
    },
  });

  useEffect(() => {
    if (!data?.getAmountSummary) return;

    const sm = data.getAmountSummary;
    setSummary(sm);
  }, [data]);

  return (
    <div className={styles.container}>
      {/* 거래내역 페이지 이동 */}
      <div className={styles.quickActions}>
        <Link href="/transaction">
          <Button buttonMode="ghost">거래내역 이동</Button>
        </Link>
      </div>

      {!summary ? (
        <div className={styles.loadingState}>
          <Spinner />
          <span>{`금액 현황 불러오는중 ...`}</span>
        </div>
      ) : (
        <div className={styles.balances}>
          {/* 총 금액 - Hero Card */}
          <div className={classNames(styles.heroCard, styles.fadeIn)}>
            <div className={styles.heroContent}>
              <div className={styles.heroHeader}>
                <Wallet className={styles.heroIcon} size={32} />
                <span className={styles.heroLabel}>Total Balance</span>
              </div>
              <div className={styles.heroAmount}>
                <span className={styles.currency}>₩</span>
                {summary?.totalBalance.toLocaleString()}
              </div>
            </div>
          </div>

          {/* 나머지 카드들 - Grid */}
          <div className={styles.grid}>
            {/* 바로 출금 가능 금액 */}
            <div className={classNames(styles.statCard, styles.fadeIn, styles.delay1)}>
              <div className={styles.statIcon}>
                <CircleDollarSign size={24} />
              </div>
              <div className={styles.statContent}>
                <span className={styles.statLabel}>Available</span>
                <span className={styles.statAmount}>
                  <span className={styles.currency}>₩</span>
                  {summary?.availableBalance.toLocaleString()}
                </span>
              </div>
            </div>

            {/* 저축 금액 */}
            <div className={classNames(styles.statCard, styles.fadeIn, styles.delay2)}>
              <div className={styles.statIcon}>
                <PiggyBank size={24} />
              </div>
              <div className={styles.statContent}>
                <span className={styles.statLabel}>Saving</span>
                <span className={styles.statAmount}>
                  <span className={styles.currency}>₩</span>
                  {summary?.savingBalance.toLocaleString()}
                </span>
              </div>
            </div>

            {/* 출금 예정 금액 */}
            <div className={classNames(styles.statCard, styles.fadeIn, styles.delay3)}>
              <div className={styles.statIcon}>
                <Clock size={24} />
              </div>
              <div className={styles.statContent}>
                <span className={styles.statLabel}>Holding</span>
                <span className={styles.statAmount}>
                  <span className={styles.currency}>₩</span>
                  {summary?.holdBalance.toLocaleString()}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
