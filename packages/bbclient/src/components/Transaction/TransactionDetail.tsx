"use client";

import { Octagon, ArrowLeftIcon } from "lucide-react";
import {
  Card,
  Button,
  Spinner,
  useForm,
  Form,
  Input,
  RadioGroup,
  Radio,
  Select,
  Textarea,
} from "@/components";
import Link from "next/link";
import classNames from "classnames";
import { GET_TRANSACTION } from "@/graphql/queries/Transaction";
import { useMutation, useQuery } from "@apollo/client";
import styles from "./styles/transaction.module.scss";
import { useEffect, useState } from "react";
import {
  TransactionTypeLabels,
  TransactionPaymentTypeLabels,
  TransactionCategoryLabels,
} from "@/constants/enum";
import { Transaction, TransactionType } from "@/model/transaction.model";
import { AccountBank } from "@/model/account.model";
import { UPDATE_TRANSACTION } from "@/graphql/mutations/Transaction";
import { ACCOUNTS, CATEGORY_OPTIONS, PAYMENT_OPTIONS } from "@/constants/data";

interface TransactionDetailProps {
  transactionId: number;
}

const convertDate = (date: Date) => {
  const newDate = new Date(date);
  return newDate.toLocaleString("ko-KR", { timeZone: "Asia/Seoul" });
};

export const TransactionDetail = ({
  transactionId,
}: TransactionDetailProps) => {
  const [tr, setTr] = useState<Transaction>(); // 현재 거래 정보
  const [init, setInit] = useState<any>();
  const [editMode, setEditMode] = useState<boolean>(false);
  const [selectedType, setSelectedType] = useState<any>();
  const { formRef, getValues } = useForm<any>();

  const [updateMutation, { loading: updateLoading }] =
    useMutation(UPDATE_TRANSACTION);

  const { data, loading, error, refetch } = useQuery(GET_TRANSACTION, {
    variables: {
      input: {
        id: transactionId,
      },
    },
  });

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
      <Card.Body>
        <div className={classNames(styles["transaction-summary-wrapper"])}>
          <div className={styles["transaction-header"]}>
            <span>거래내역 번호: {transactionId}</span>
            <div className={styles["transaction-header-btn-wrapper"]}>
              {editMode ? (
                <>
                  <Button
                    className={styles["common-btn"]}
                    buttonMode="primary"
                    type="submit"
                    onClick={handleUpdate}
                  >
                    저장
                  </Button>
                  <Button
                    className={styles["common-btn"]}
                    buttonMode="outline"
                    onClick={handleReadMode}
                  >
                    취소
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    className={styles["common-btn"]}
                    buttonMode="primary"
                    onClick={handleEditMode}
                  >
                    수정
                  </Button>
                </>
              )}
            </div>
          </div>

          <div className={styles["transaction-content"]}>
            {!tr ? (
              <Spinner />
            ) : !editMode ? (
              <>
                <TransactionItem
                  label="💳 결제수단"
                  value={TransactionPaymentTypeLabels[tr.paymentType]}
                />
                <TransactionItem
                  label="📅 날짜"
                  value={convertDate(tr.createdAt)}
                />
                <TransactionItem
                  label="💰 금액"
                  value={`${tr.amount.toLocaleString()}원`}
                  highlight
                />
                <TransactionItem
                  label="📂 타입"
                  value={TransactionTypeLabels[tr.type]}
                />
                {(tr.fromAccountId || tr.toAccountId) && (
                  <TransactionItem
                    label="💳 거래계좌"
                    value={
                      tr.fromAccountId && tr.toAccountId
                        ? `${AccountBank[tr.fromAccountId]} ➡ ${
                            AccountBank[tr.toAccountId]
                          }`
                        : tr.fromAccountId
                        ? `${AccountBank[tr.fromAccountId]}`
                        : "계좌 정보 없음"
                    }
                  />
                )}
                <TransactionItem
                  label="📝 카테고리"
                  value={TransactionCategoryLabels[tr.category]}
                />
                <TransactionItem label="🔁 거래흐름" value={tr.depositor} />
                <TransactionItem label="🗒️ 설명" value={tr.description} />
              </>
            ) : (
              <div className={styles["detail-edit-wrapper"]}>
                <Form ref={formRef} onSubmit={handleUpdate}>
                  <Form.Item
                    className={styles["detail"]}
                    label="💳 결제수단"
                    name="paymentType"
                  >
                    <Select name="paymentType" defaultValue={init?.paymentType}>
                      {PAYMENT_OPTIONS.map(({ value, label }) => (
                        <Select.Option key={value} value={value}>
                          {label}
                        </Select.Option>
                      ))}
                    </Select>
                  </Form.Item>

                  <Form.Item className={styles["detail"]} label="💰 금액">
                    <Input
                      name="amount"
                      defaultValue={init?.amount}
                      type="number"
                    />
                  </Form.Item>

                  <Form.Item
                    className={styles["detail"]}
                    label="📂 타입"
                    name="type"
                  >
                    <RadioGroup
                      name="type"
                      value={selectedType}
                      onChange={setSelectedType}
                    >
                      <Radio value="EXPENSE">지출</Radio>
                      <Radio value="INCOME">수익</Radio>
                      <Radio value="TRANSFER">내 계좌 간 거래</Radio>
                    </RadioGroup>
                  </Form.Item>

                  {selectedType === "TRANSFER" ? (
                    <div className="myTransfer">
                      <Form.Item
                        className={styles["detail"]}
                        label="💳 보낼 계좌"
                        name="fromAccountId"
                      >
                        <Select
                          name="fromAccountId"
                          defaultValue={init?.fromAccountId}
                        >
                          {ACCOUNTS.map(({ value, label }) => (
                            <Select.Option key={value} value={value}>
                              {label}
                            </Select.Option>
                          ))}
                        </Select>
                      </Form.Item>

                      <Form.Item
                        className={styles["detail"]}
                        label="💳 받을 계좌"
                        name="toAccountId"
                      >
                        <Select
                          name="toAccountId"
                          defaultValue={init?.toAccountId}
                        >
                          {ACCOUNTS.map(({ value, label }) => (
                            <Select.Option key={value} value={value}>
                              {label}
                            </Select.Option>
                          ))}
                        </Select>
                      </Form.Item>
                    </div>
                  ) : selectedType === "INCOME" ? (
                    <Form.Item
                      className={styles["detail"]}
                      label="💳 수령 계좌"
                      name="toAccountId"
                    >
                      <Select
                        name="toAccountId"
                        defaultValue={init?.toAccountId}
                      >
                        {ACCOUNTS.map(({ value, label }) => (
                          <Select.Option key={value} value={value}>
                            {label}
                          </Select.Option>
                        ))}
                      </Select>
                    </Form.Item>
                  ) : (
                    <Form.Item
                      className={styles["detail"]}
                      label="💳 사용 계좌"
                      name="fromAccountId"
                    >
                      <Select
                        name="fromAccountId"
                        defaultValue={init?.fromAccountId}
                      >
                        {ACCOUNTS.map(({ value, label }) => (
                          <Select.Option key={value} value={value}>
                            {label}
                          </Select.Option>
                        ))}
                      </Select>
                    </Form.Item>
                  )}
                  <Form.Item
                    className={styles["detail"]}
                    label="📝 카테고리"
                    name="category"
                  >
                    <Select name="category" defaultValue={init?.category}>
                      {CATEGORY_OPTIONS.map(({ value, label }) => (
                        <Select.Option key={value} value={value}>
                          {label}
                        </Select.Option>
                      ))}
                    </Select>
                  </Form.Item>
                  <Form.Item className={styles["detail"]} label="🔁 거래흐름">
                    <Input
                      name="depositor"
                      type="text"
                      defaultValue={init && init.depositor}
                    />
                  </Form.Item>
                  <Form.Item
                    className={styles["detail"]}
                    label="🗒️ 설명"
                    name="description"
                  >
                    <Textarea
                      name="description"
                      defaultValue={init && init.description}
                    />
                  </Form.Item>
                </Form>
              </div>
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
