"use client";

import { Octagon, ArrowLeftIcon } from "lucide-react";
import { Card, Button, Spinner } from "@/components";
import Link from "next/link";
import classNames from "classnames";
import { GET_TRANSACTION } from "@/graphql/queries/Transaction";
import { useQuery } from "@apollo/client";
import styles from "./styles/transaction.module.scss";
import { useEffect, useState } from "react";
import { TransactionTypeLabels } from "@/constants/enum";

interface TransactionDetailProps {
  transactionId: number;
}
export const TransactionDetail = ({
  transactionId,
}: TransactionDetailProps) => {
  const [tr, setTr] = useState<any>();
  const { data, loading, error, refetch } = useQuery(GET_TRANSACTION, {
    variables: {
      input: {
        id: transactionId,
      },
    },
  });

  useEffect(() => {
    if (!data?.getTransaction?.transaction) return;

    setTr(data?.getTransaction?.transaction);
  }, [data]);

  return (
    <Card>
      <Card.Header
        icon={Octagon}
        title="Transaction Summary"
        buttons={
          <>
            <Button>
              <Link className={styles.link} href="/transaction">
                <ArrowLeftIcon className={classNames(styles["icon"])} />
              </Link>
            </Button>
          </>
        }
      />
      {/* TODO: tr state에 명확한 타입 매핑작업 진행해야함. any으로 처리 시 데이터 매핑 불가 */}
      <Card.Body>
        <div className={classNames(styles["transaction-summary-wrapper"])}>
          <div className={styles["transaction-header"]}>
            거래내역 번호: {transactionId}
          </div>

          <div className={styles["transaction-content"]}>
            {!tr ? (
              <Spinner />
            ) : (
              <>
                <TransactionItem label="💳 결제 수단" value={tr.paymentType} />
                <TransactionItem label="📅 날짜" value={tr.createdAt} />
                <TransactionItem label="💰 금액" value={tr.amount} highlight />
                <TransactionItem label="📂 타입" value={tr.type} />
                <TransactionItem label="📝 카테고리" value={tr.category} />
                <TransactionItem label="🔁 거래 흐름" value={tr.depositor} />
                <TransactionItem label="🗒️ 설명" value={tr.description} />
              </>
            )}
          </div>

          {/* TODO: 거래내역 추가할 때 거래 발생 후 계좌 정보 업데이트된 내역도 확인 가능하도록 기능 개선 */}
          {/* <div className={styles["transaction-footer"]}>
            <div className={styles["related-account-title"]}>🔗 관련 계좌</div>
            <ul className={styles["related-account-list"]}>
              <li>카카오페이 체크카드</li>
              <li>
                현재 잔액: <strong>1,254,000원</strong>
              </li>
            </ul>
          </div> */}
        </div>
      </Card.Body>
    </Card>
  );
};

interface TransactionItemProps {
  label: string;
  value: string;
  highlight?: boolean;
  alignTop?: boolean;
}

const TransactionItem: React.FC<TransactionItemProps> = ({
  label,
  value,
  highlight = false,
  alignTop = false,
}) => {
  return (
    <div
      className={classNames(styles["items"], alignTop && styles["align-top"])}
    >
      <span className={classNames(styles["item-label"])}>{label}</span>
      <span
        className={classNames(
          styles["item-value"],
          highlight && styles["highlight"]
        )}
      >
        {value}
      </span>
    </div>
  );
};
