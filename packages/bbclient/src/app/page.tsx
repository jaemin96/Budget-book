"use client";

import styles from "./styles/home.module.scss";
import Link from "next/link";
import { Button, Card, Spinner } from "@/components";
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

      {!summary ? (
        <>
          <div style={{ display: "flex", gap: "0.4rem" }}>
            <span style={{ color: "white" }}>{`금액 현황 불러오는중 ...`}</span>
            <Spinner />
          </div>
        </>
      ) : (
        <>
          {/* 총 금액 */}
          <section>
            <Card>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <h3>{`Total amount`}</h3>
                <span>{`${summary?.totalBalance.toLocaleString()}`}</span>
              </div>
            </Card>
          </section>

          {/* 저축 금액 */}
          <section>
            <Card>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <h3>{`Saving amount`}</h3>
                <span>{`${summary?.savingBalance.toLocaleString()}`}</span>
              </div>
            </Card>
          </section>

          {/* 바로 출금 가능 금액 */}
          <section>
            <Card>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <h3>{`Available amount`}</h3>
                <span>{`${summary?.availableBalance.toLocaleString()}`}</span>
              </div>
            </Card>
          </section>

          {/* 출금 예정 금액  */}
          <section>
            <Card>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <h3>{`Holding amount`}</h3>
                <span>{`${summary?.holdBalance.toLocaleString()}`}</span>
              </div>
            </Card>
          </section>
        </>
      )}
    </div>
  );
}
