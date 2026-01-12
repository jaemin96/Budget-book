"use client";

import { useEffect, useState } from "react";
import styles from "./styles/transaction.module.scss";
import {
  // ACCOUNT_FIELDS,
  ACCOUNTS,
  CATEGORY_OPTIONS,
  PAYMENT_OPTIONS,
} from "@/constants/data";
import { useMutation, useQuery } from "@apollo/client";
import { CREATE_TRANSACTION, UPDATE_TRANSACTION } from "@/graphql/mutations/Transaction";
import { GET_TRANSACTION } from "@/graphql/queries/Transaction";
import LoadingSpinner from "@/components/Loading/Spinner";
import { Form, useForm, Input, Card } from "@/components";
import { FormMode } from "@/common/types";
import { RadioGroup, Radio, Select, Textarea } from "../Form/fields";
import Link from "next/link";
import { ArrowLeft, Zap, Octagon } from "lucide-react";
import { useAccounts } from "./hooks/useAccounts";
import {
  TRANSACTION_PRESETS,
  PRESET_CATEGORIES,
  getPresetsByCategory,
  TransactionPreset,
} from "@/constants/presets/transaction.presets";

export interface TransactionFormProps {
  mode: FormMode;
  transactionId?: string;
}

const TransactionForm: React.FC<TransactionFormProps> = ({ mode, transactionId }) => {
  const { formRef, getValues } = useForm<any>();
  const [init, setInit] = useState<any>();
  const [type, setType] = useState<any>();
  const [selected, setSelected] = useState<any>();
  const [showQuickActions, setShowQuickActions] = useState<boolean>(false);
  const { accounts, loading, error } = useAccounts();

  const [createMutation, { loading: createLoading }] = useMutation(CREATE_TRANSACTION);
  const [updateMutation, { loading: updateLoading }] = useMutation(UPDATE_TRANSACTION);
  const { data, refetch } = useQuery(GET_TRANSACTION, {
    variables: {
      input: {
        id: transactionId,
      },
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const values = getValues();
      const params =
        mode === "create" ? { ...values } : transactionId && { ...values, id: +transactionId };

      const res =
        mode === "create"
          ? await createMutation({
              variables: {
                input: { ...params },
              },
            })
          : await updateMutation({
              variables: {
                input: { ...params },
              },
            });

      if (res && res?.data?.createTransaction?.id) {
        formRef?.current?.reset();
      }
    } catch (err) {
      console.error({ err });
    }
  };

  useEffect(() => {
    if (!transactionId) return;

    refetch({
      input: {
        id: +transactionId,
      },
    });
  }, [transactionId]);

  useEffect(() => {
    if (!data) return;

    const { transaction } = data?.getTransaction;
    setInit(transaction);
    setType(transaction?.type);
  }, [data]);

  const handlePresetClick = (preset: TransactionPreset) => {
    // 폼 완전 초기화
    formRef?.current?.reset();

    // 프리셋 값으로 폼 채우기
    const presetData: any = {
      amount: preset.amount || "",
      depositor: preset.depositor || "",
      category: preset.category,
      paymentType: preset.paymentType || "",
      description: preset.description || "",
      type: preset.type,
    };

    // TRANSFER인 경우
    if (preset.type === "TRANSFER") {
      presetData.fromAccountId = preset.fromAccountId || "";
      presetData.toAccountId = preset.toAccountId || "";
    } else {
      // INCOME or EXPENSE
      presetData.accountId = ""; // 사용자가 선택
    }

    setInit(presetData);
    setType(preset.type);
    setSelected(preset.type);
  };

  return (
    <>
      <Card.Header
        icon={Octagon}
        title={mode === "create" ? "Create Transaction" : "Edit Transaction"}
        buttons={
          <>
            {mode === "create" && (
              <button
                type="button"
                className={showQuickActions ? styles.headerToggleButtonActive : styles.headerToggleButton}
                onClick={() => setShowQuickActions(!showQuickActions)}
                title={showQuickActions ? "빠른 입력 닫기" : "빠른 입력 열기"}
              >
                <Zap size={20} />
              </button>
            )}
            <Link href="/transaction">
              <ArrowLeft size={20} />
            </Link>
          </>
        }
      />
      <Card.Body>
        {mode === "create" && showQuickActions && (
          <div className={styles.quickActionsContainer}>
            <div className={styles.quickActionsContent}>
                <div className={styles.quickActionsGroup}>
                  <span className={styles.groupLabel}>{PRESET_CATEGORIES.INCOME}</span>
                  <div className={styles.quickActions}>
                    {getPresetsByCategory("INCOME").map((preset) => (
                      <button
                        key={preset.id}
                        type="button"
                        className={styles.presetButton}
                        onClick={() => handlePresetClick(preset)}
                      >
                        <span className={styles.presetEmoji}>{preset.emoji}</span>
                        <span className={styles.presetName}>{preset.name}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className={styles.quickActionsGroup}>
                  <span className={styles.groupLabel}>{PRESET_CATEGORIES.FIXED_EXPENSE}</span>
                  <div className={styles.quickActions}>
                    {getPresetsByCategory("FIXED_EXPENSE").map((preset) => (
                      <button
                        key={preset.id}
                        type="button"
                        className={styles.presetButton}
                        onClick={() => handlePresetClick(preset)}
                      >
                        <span className={styles.presetEmoji}>{preset.emoji}</span>
                        <span className={styles.presetName}>{preset.name}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className={styles.quickActionsGroup}>
                  <span className={styles.groupLabel}>{PRESET_CATEGORIES.FREQUENT}</span>
                  <div className={styles.quickActions}>
                    {getPresetsByCategory("FREQUENT").map((preset) => (
                      <button
                        key={preset.id}
                        type="button"
                        className={styles.presetButton}
                        onClick={() => handlePresetClick(preset)}
                      >
                        <span className={styles.presetEmoji}>{preset.emoji}</span>
                        <span className={styles.presetName}>{preset.name}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className={styles.quickActionsGroup}>
                  <span className={styles.groupLabel}>{PRESET_CATEGORIES.TRANSFER}</span>
                  <div className={styles.quickActions}>
                    {getPresetsByCategory("TRANSFER").map((preset) => (
                      <button
                        key={preset.id}
                        type="button"
                        className={styles.presetButton}
                        onClick={() => handlePresetClick(preset)}
                      >
                        <span className={styles.presetEmoji}>{preset.emoji}</span>
                        <span className={styles.presetName}>{preset.name}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
          </div>
        )}

        <Form ref={formRef} onSubmit={handleSubmit}>
          <Form.Item label="금액">
            <Input name="amount" type="number" value={init && init.amount} />
          </Form.Item>

          <Form.Item label="거래자">
            <Input name="depositor" type="text" value={init && init.depositor} />
          </Form.Item>

          <Form.Item label="거래 유형" name="type">
            <RadioGroup name="type" value={selected} onChange={setSelected}>
              <Radio value="EXPENSE">지출</Radio>
              <Radio value="INCOME">수익</Radio>
              <Radio value="TRANSFER">내 계좌 간 거래</Radio>
            </RadioGroup>
          </Form.Item>

          {selected === "TRANSFER" ? (
            <div className={styles.transferGroup}>
              <Form.Item label="보낼 계좌" name="fromAccountId">
                <Select name="fromAccountId" value={init?.fromAccountId}>
                  {ACCOUNTS.map(({ value, label }) => (
                    <Select.Option key={value} value={value}>
                      {label}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>

              <Form.Item label="받을 계좌" name="toAccountId">
                <Select name="toAccountId" value={init?.toAccountId}>
                  {ACCOUNTS.map(({ value, label }) => (
                    <Select.Option key={value} value={value}>
                      {label}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </div>
          ) : selected === "INCOME" ? (
            <Form.Item label="수령 계좌" name="accountId">
              <Select name="accountId" value={init?.toAccountId}>
                {ACCOUNTS.map(({ value, label }) => (
                  <Select.Option key={value} value={value}>
                    {label}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          ) : (
            <Form.Item label="사용 계좌" name="accountId">
              <Select name="accountId" value={init?.fromAccountId}>
                {ACCOUNTS.map(({ value, label }) => (
                  <Select.Option key={value} value={value}>
                    {label}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          )}

          {/* <Form.Item label="계좌 항목" name="accountField">
          <select
            name="accountField"
            value={init && init.category}
            style={{ width: "100%", height: "2.75rem" }}
          >
            {ACCOUNT_FIELDS.map(({ value, label }) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </Form.Item> */}

          <Form.Item label="거래 분류" name="category">
            <Select name="category" value={init?.category}>
              {CATEGORY_OPTIONS.map(({ value, label }) => (
                <Select.Option key={value} value={value}>
                  {label}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item label="거래 수단" name="paymentType">
            <Select name="paymentType" value={init?.paymentType}>
              {PAYMENT_OPTIONS.map(({ value, label }) => (
                <Select.Option key={value} value={value}>
                  {label}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item label="거래 설명" name="description">
            <Textarea name="description" value={init && init.description} />
          </Form.Item>

          <div className={styles.formActions}>
            {createLoading || updateLoading ? (
              <div className={styles.loadingWrapper}>
                <LoadingSpinner />
              </div>
            ) : (
              <button className={styles.submitButton} type="submit">
                {mode === "create" ? "등록하기" : "수정하기"}
              </button>
            )}
          </div>
        </Form>
      </Card.Body>
    </>
  );
};

export default TransactionForm;
