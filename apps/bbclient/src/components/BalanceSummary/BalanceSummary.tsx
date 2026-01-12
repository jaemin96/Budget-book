"use client";

import { useEffect, useState } from "react";
import { useQuery } from "@apollo/client";
import { GET_AMOUNT_SUMMARY } from "@/graphql/queries/Account";
import { Wallet, PiggyBank, CircleDollarSign, Clock } from "lucide-react";
import { Spinner } from "@/components";
import classNames from "classnames";
import styles from "./styles/balanceSummary.module.scss";

const BalanceSummary: React.FC = () => {
  const [summary, setSummary] = useState<any>();
  const { data, loading, error } = useQuery(GET_AMOUNT_SUMMARY, {
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

  const renderAmount = (amount?: number) => {
    if (loading) {
      return <Spinner size={16} />;
    }
    if (error || !summary) {
      return "-";
    }
    return amount?.toLocaleString();
  };

  return (
    <>
      {/* 총 금액 - Hero Card */}
      <div className={classNames(styles.heroCard, styles.fadeIn)}>
        <div className={styles.heroContent}>
          <div className={styles.heroHeader}>
            <Wallet className={styles.heroIcon} size={32} />
            <span className={styles.heroLabel}>Total Balance</span>
          </div>
          <div className={styles.heroAmount}>
            {loading ? (
              <Spinner />
            ) : (
              <>
                <span className={styles.currency}>₩</span>
                {renderAmount(summary?.totalBalance)}
              </>
            )}
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
              {renderAmount(summary?.availableBalance)}
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
              {renderAmount(summary?.savingBalance)}
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
              {renderAmount(summary?.holdBalance)}
            </span>
          </div>
        </div>
      </div>
    </>
  );
};

export default BalanceSummary;
