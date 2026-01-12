"use client";

import { useState } from "react";
import styles from "./styles/transaction.module.scss";
import { getNonKakaoPayAccounts, KAKAOPAY_ACCOUNT_ID } from "@/constants/data/account.data";
import { CATEGORY_OPTIONS } from "@/constants/data";
import { useMutation } from "@apollo/client";
import { CREATE_TRANSACTION } from "@/graphql/mutations/Transaction";
import LoadingSpinner from "@/components/Loading/Spinner";
import { Form, useForm, Input, Card } from "@/components";
import { Select, Textarea } from "../Form/fields";
import Link from "next/link";
import { ArrowLeft, Zap } from "lucide-react";
import { useRouter } from "next/navigation";

type TransactionStep = "idle" | "transferring" | "recording-expense" | "success" | "error";

const KakaoPayPresetForm: React.FC = () => {
  const { formRef, getValues } = useForm<any>();
  const router = useRouter();
  const [transactionState, setTransactionState] = useState<{
    step: TransactionStep;
    error: string | null;
  }>({
    step: "idle",
    error: null,
  });

  const [createMutation, { loading }] = useMutation(CREATE_TRANSACTION);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const values = getValues();

    // Validation
    if (!values.expenseAmount || values.expenseAmount <= 0) {
      setTransactionState({
        step: "error",
        error: "지출 금액을 올바르게 입력해주세요.",
      });
      return;
    }

    if (!values.rechargeAmount || values.rechargeAmount <= 0) {
      setTransactionState({
        step: "error",
        error: "충전 금액을 올바르게 입력해주세요.",
      });
      return;
    }

    if (!values.fromAccountId) {
      setTransactionState({
        step: "error",
        error: "충전 계좌를 선택해주세요.",
      });
      return;
    }

    if (!values.depositor || values.depositor.trim() === "") {
      setTransactionState({
        step: "error",
        error: "거래처 이름을 입력해주세요.",
      });
      return;
    }

    if (!values.category) {
      setTransactionState({
        step: "error",
        error: "지출 분류를 선택해주세요.",
      });
      return;
    }

    try {
      // Step 1: 충전 거래 생성 (TRANSFER)
      setTransactionState({ step: "transferring", error: null });

      const transferResult = await createMutation({
        variables: {
          input: {
            type: "TRANSFER",
            amount: Number(values.rechargeAmount),
            fromAccountId: Number(values.fromAccountId),
            toAccountId: KAKAOPAY_ACCOUNT_ID,
            category: "RECHARGE",
            depositor: "카카오페이",
            description: `카카오페이 자동충전 - ${values.depositor} (지출: ${Number(values.expenseAmount).toLocaleString()}원)`,
            paymentType: "KAKAO_PAY",
          },
        },
      });

      if (!transferResult.data?.createTransaction?.id) {
        throw new Error("충전 거래 생성 실패");
      }

      // Step 2: 지출 거래 생성 (EXPENSE)
      setTransactionState({ step: "recording-expense", error: null });

      const expenseResult = await createMutation({
        variables: {
          input: {
            type: "EXPENSE",
            amount: Number(values.expenseAmount),
            accountId: KAKAOPAY_ACCOUNT_ID,
            depositor: values.depositor,
            category: values.category,
            description: values.description || `자동충전: ${Number(values.rechargeAmount).toLocaleString()}원`,
            paymentType: "KAKAO_PAY",
          },
        },
      });

      if (!expenseResult.data?.createTransaction?.id) {
        throw new Error("지출 거래 생성 실패");
      }

      // 성공
      setTransactionState({ step: "success", error: null });
      formRef?.current?.reset();
      router.push("/transaction");
    } catch (err) {
      console.error({ err });
      const errorMessage =
        transactionState.step === "transferring"
          ? "충전 처리 중 오류가 발생했습니다."
          : "충전은 완료되었으나 지출 기록에 실패했습니다. 수동으로 지출 내역을 추가해주세요.";

      setTransactionState({
        step: "error",
        error: errorMessage,
      });
    }
  };

  const getLoadingMessage = () => {
    if (transactionState.step === "transferring") {
      return "1/2 충전 중...";
    }
    if (transactionState.step === "recording-expense") {
      return "2/2 지출 기록 중...";
    }
    return null;
  };

  const nonKakaoPayAccounts = getNonKakaoPayAccounts();

  // 지출 관련 카테고리만 필터링 (충전, 급여, 저축 등 제외)
  const expenseCategories = CATEGORY_OPTIONS.filter(
    (option) =>
      ![
        "RECHARGE",
        "SALARY",
        "SAVINGS",
        "EMERGENCY_FUND",
        "INVESTMENT",
        "LOAN_REPAYMENT",
      ].includes(option.value)
  );

  return (
    <>
      <Card.Header
        icon={Zap}
        title="카카오페이 간편 지출"
        buttons={
          <Link href="/transaction">
            <ArrowLeft size={20} />
          </Link>
        }
      />
      <Card.Body>
        {transactionState.error && (
          <div className={styles.errorMessage}>
            <p>{transactionState.error}</p>
            {transactionState.step === "error" &&
              transactionState.error.includes("충전은 완료") && (
                <Link href="/transaction/create" className={styles.errorAction}>
                  지출 내역 수동 추가
                </Link>
              )}
          </div>
        )}

        <Form ref={formRef} onSubmit={handleSubmit}>
          <Form.Item label="지출 금액 (실제 결제 금액)">
            <Input name="expenseAmount" type="number" placeholder="52000" />
          </Form.Item>

          <Form.Item label="충전 금액 (자동충전된 금액)">
            <Input name="rechargeAmount" type="number" placeholder="10000" />
          </Form.Item>

          <Form.Item label="충전 계좌" name="fromAccountId">
            <Select name="fromAccountId">
              <Select.Option value="">선택하세요</Select.Option>
              {nonKakaoPayAccounts.map(({ value, label }) => (
                <Select.Option key={value} value={value}>
                  {label}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item label="거래처">
            <Input name="depositor" type="text" placeholder="스타벅스" />
          </Form.Item>

          <Form.Item label="지출 분류" name="category">
            <Select name="category">
              <Select.Option value="">선택하세요</Select.Option>
              {expenseCategories.map(({ value, label }) => (
                <Select.Option key={value} value={value}>
                  {label}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item label="거래 설명 (선택)" name="description">
            <Textarea name="description" placeholder="아메리카노" />
          </Form.Item>

          <div className={styles.formActions}>
            {loading || transactionState.step === "transferring" || transactionState.step === "recording-expense" ? (
              <div className={styles.loadingWrapper}>
                <LoadingSpinner />
                {getLoadingMessage() && (
                  <p className={styles.loadingMessage}>{getLoadingMessage()}</p>
                )}
              </div>
            ) : (
              <button className={styles.submitButton} type="submit">
                등록하기
              </button>
            )}
          </div>
        </Form>
      </Card.Body>
    </>
  );
};

export default KakaoPayPresetForm;
