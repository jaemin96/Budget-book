"use client";

import {
  Octagon,
  ArrowLeft,
  Pencil,
  CreditCard,
  Calendar,
  Coins,
  ArrowRightLeft,
  Building2,
  Tag,
  RefreshCw,
  FileText,
} from "lucide-react";
import { Card, useForm, Form, Input, RadioGroup, Radio, Select, Textarea } from "@/components";
import Skeleton from "@/components/Skeleton/Skeleton";
import Link from "next/link";
import classNames from "classnames";
import { GET_TRANSACTION } from "@/graphql/queries/Transaction";
import { useMutation, useQuery } from "@apollo/client";
import styles from "./styles/transaction.module.scss";
import { useEffect, useState, useMemo } from "react";
import {
  TransactionTypeLabels,
  TransactionPaymentTypeLabels,
  TransactionCategoryLabels,
} from "@/constants/enum";
import { Transaction } from "@/model/transaction.model";
import { UPDATE_TRANSACTION } from "@/graphql/mutations/Transaction";
import { CATEGORY_OPTIONS, PAYMENT_OPTIONS } from "@/constants/data";
import { useAccounts } from "./hooks/useAccounts";

interface TransactionDetailProps {
  transactionId: number;
}

const convertDate = (date: Date) => {
  const newDate = new Date(date);
  return newDate.toLocaleString("ko-KR", { timeZone: "Asia/Seoul" });
};

export const TransactionDetail = ({ transactionId }: TransactionDetailProps) => {
  const [tr, setTr] = useState<Transaction>(); // 현재 거래 정보
  const [init, setInit] = useState<any>();
  const [editMode, setEditMode] = useState<boolean>(false);
  const [selectedType, setSelectedType] = useState<any>();
  const { formRef, getValues } = useForm<any>();
  const { accounts } = useAccounts();

  const [updateMutation] = useMutation(UPDATE_TRANSACTION);

  const { data, refetch } = useQuery(GET_TRANSACTION, {
    variables: {
      input: {
        id: transactionId,
      },
    },
  });

  // 계좌 ID -> 계좌명 매핑
  const accountMap = useMemo(() => {
    return accounts.reduce(
      (acc, account) => {
        acc[account.value] = account.label;
        return acc;
      },
      {} as Record<number, string>,
    );
  }, [accounts]);

  const handleEditMode = () => {
    setEditMode(true);
  };

  const handleReadMode = () => {
    setEditMode(false);
  };

  const handleUpdate = async () => {
    if (!transactionId) return;

    try {
      const values = getValues();
      const params = { ...values, id: +transactionId };

      await updateMutation({
        variables: {
          input: { ...params },
        },
      });

      setEditMode(false);
      refetch();
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (!data?.getTransaction?.transaction) return;

    setTr(data?.getTransaction?.transaction);
    setInit(data?.getTransaction?.transaction);
  }, [data]);

  useEffect(() => {
    setSelectedType(init?.type);
  }, [init]);

  const renderSkeletonItems = () => (
    <div className={styles.detailSkeleton}>
      {[...Array(7)].map((_, index) => (
        <div key={index} className={styles.skeletonItem}>
          <Skeleton variant="circular" width={36} height={36} />
          <div className={styles.detailInfo}>
            <Skeleton variant="text" width="30%" height={12} />
            <Skeleton variant="text" width="60%" height={16} />
          </div>
        </div>
      ))}
    </div>
  );

  const renderReadMode = () => {
    if (!tr) return renderSkeletonItems();

    const items = [
      { Icon: CreditCard, label: "결제수단", value: TransactionPaymentTypeLabels[tr.paymentType] },
      { Icon: Calendar, label: "날짜", value: convertDate(tr.createdAt) },
      { Icon: Coins, label: "금액", value: `${tr.amount.toLocaleString()}원`, highlight: true },
      { Icon: ArrowRightLeft, label: "타입", value: TransactionTypeLabels[tr.type] },
      ...(tr.fromAccountId || tr.toAccountId
        ? [
            {
              Icon: Building2,
              label: "거래계좌",
              value:
                tr.fromAccountId && tr.toAccountId
                  ? `${accountMap[tr.fromAccountId] || "알 수 없음"} → ${accountMap[tr.toAccountId] || "알 수 없음"}`
                  : tr.fromAccountId
                    ? accountMap[tr.fromAccountId] || "알 수 없음"
                    : accountMap[tr.toAccountId!] || "계좌 정보 없음",
            },
          ]
        : []),
      { Icon: Tag, label: "카테고리", value: TransactionCategoryLabels[tr.category] },
      { Icon: RefreshCw, label: "거래흐름", value: tr.depositor || "-" },
      { Icon: FileText, label: "설명", value: tr.description || "-" },
    ];

    return (
      <div className={styles.detailList}>
        {items.map((item, index) => (
          <div key={index} className={styles.detailItem}>
            <div className={styles.detailIcon}>
              <item.Icon size={18} />
            </div>
            <div className={styles.detailInfo}>
              <div className={styles.detailLabel}>{item.label}</div>
              <div className={classNames(styles.detailValue, item.highlight && styles.highlight)}>
                {item.value}
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <Card>
      <Card.Header
        icon={<Octagon />}
        title="Transaction Detail"
        buttons={
          <Link href="/transaction">
            <ArrowLeft size={20} />
          </Link>
        }
      />
      <Card.Body>
        <div className={styles.detailHeader}>
          <span className={styles.detailTitle}>거래내역 #{transactionId}</span>
          <div className={styles.detailActions}>
            {editMode ? (
              <>
                <button
                  className={classNames(styles.detailButton, styles.detailButtonPrimary)}
                  onClick={handleUpdate}
                >
                  저장
                </button>
                <button
                  className={classNames(styles.detailButton, styles.detailButtonOutline)}
                  onClick={handleReadMode}
                >
                  취소
                </button>
              </>
            ) : (
              <button
                className={classNames(styles.detailButton, styles.detailButtonPrimary)}
                onClick={handleEditMode}
              >
                <Pencil size={14} style={{ marginRight: 4 }} />
                수정
              </button>
            )}
          </div>
        </div>

        {!editMode ? (
          renderReadMode()
        ) : (
          <div className={styles["detail-edit-wrapper"]}>
            <Form ref={formRef} onSubmit={handleUpdate}>
              <Form.Item label="결제수단" name="paymentType">
                <Select name="paymentType" defaultValue={init?.paymentType}>
                  {PAYMENT_OPTIONS.map(({ value, label }) => (
                    <Select.Option key={value} value={value}>
                      {label}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>

              <Form.Item label="금액">
                <Input name="amount" defaultValue={init?.amount} type="number" />
              </Form.Item>

              <Form.Item label="타입" name="type">
                <RadioGroup name="type" value={selectedType} onChange={setSelectedType}>
                  <Radio value="EXPENSE">지출</Radio>
                  <Radio value="INCOME">수익</Radio>
                  <Radio value="TRANSFER">내 계좌 간 거래</Radio>
                </RadioGroup>
              </Form.Item>

              {selectedType === "TRANSFER" ? (
                <div className={styles.transferGroup}>
                  <Form.Item label="보낼 계좌" name="fromAccountId">
                    <Select name="fromAccountId" defaultValue={init?.fromAccountId}>
                      {accounts.map(({ value, label }) => (
                        <Select.Option key={value} value={value}>
                          {label}
                        </Select.Option>
                      ))}
                    </Select>
                  </Form.Item>

                  <Form.Item label="받을 계좌" name="toAccountId">
                    <Select name="toAccountId" defaultValue={init?.toAccountId}>
                      {accounts.map(({ value, label }) => (
                        <Select.Option key={value} value={value}>
                          {label}
                        </Select.Option>
                      ))}
                    </Select>
                  </Form.Item>
                </div>
              ) : selectedType === "INCOME" ? (
                <Form.Item label="수령 계좌" name="toAccountId">
                  <Select name="toAccountId" defaultValue={init?.toAccountId}>
                    {accounts.map(({ value, label }) => (
                      <Select.Option key={value} value={value}>
                        {label}
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>
              ) : (
                <Form.Item label="사용 계좌" name="fromAccountId">
                  <Select name="fromAccountId" defaultValue={init?.fromAccountId}>
                    {accounts.map(({ value, label }) => (
                      <Select.Option key={value} value={value}>
                        {label}
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>
              )}
              <Form.Item label="카테고리" name="category">
                <Select name="category" defaultValue={init?.category}>
                  {CATEGORY_OPTIONS.map(({ value, label }) => (
                    <Select.Option key={value} value={value}>
                      {label}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
              <Form.Item label="거래흐름">
                <Input name="depositor" type="text" defaultValue={init && init.depositor} />
              </Form.Item>
              <Form.Item label="설명" name="description">
                <Textarea name="description" defaultValue={init && init.description} />
              </Form.Item>
            </Form>
          </div>
        )}
      </Card.Body>
    </Card>
  );
};
