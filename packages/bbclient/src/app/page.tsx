"use client";

import styles from "./styles/home.module.scss";
import Link from "next/link";
import { Button, Card } from "@/components";
import { useQuery } from "@apollo/client";
import { GET_AMOUNT_SUMMARY } from "../graphql/queries/Account";
import { useEffect, useState } from "react";

export default function Home() {
  const [summary, setSummary] = useState<any>();
  const { data, loading, error, refetch } = useQuery(GET_AMOUNT_SUMMARY, {
    variables: {
      input: {},
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
      <Card>
        <Link href="/transaction">
          <Button buttonMode="ghost">거래내역 이동</Button>
        </Link>
      </Card>

      {/* 총 금액 */}
      <section>
        <Card>
          <span>{`Total amount ${summary?.totalBalance}`}</span>
        </Card>
      </section>

      {/* 저축 금액 */}
      <section>
        <Card>
          <span>{`Saving amount ${summary?.savingBalance}`}</span>
        </Card>
      </section>

      {/* 바로 출금 가능 금액 */}
      <section>
        <Card>
          <span>{`Available amount ${summary?.availableBalance}`}</span>
        </Card>
      </section>

      {/* 출금 예정 금액  */}
      <section>
        <Card>
          <span>{`Holding amount ${summary?.holdBalance}`}</span>
        </Card>
      </section>
    </div>
  );
}
