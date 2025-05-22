"use client";

import { Form, useForm } from "../Form";
import styles from "./styles/transaction.module.scss";
import { Button } from "../Button";
import classNames from "classnames";
import { FormMode } from "@/common/types";
import { CATEGORY_OPTIONS, PAYMENT_OPTIONS } from "@/constants/data";
import { useMutation, useQuery } from "@apollo/client";
import {
  CREATE_TRANSACTION,
  UPDATE_TRANSACTION,
} from "@/graphql/mutations/Transaction";
import { useEffect, useState } from "react";
import { GET_TRANSACTION } from "@/graphql/queries/Transaction";
import LoadingSpinner from "../Loading/Spinner";

export interface TransactionFormProps {
  mode: FormMode;
  transactionId?: string;
}

const TransactionForm: React.FC<TransactionFormProps> = ({
  mode,
  transactionId,
}) => {
  const { formRef, getValues } = useForm<any>();
  const [init, setInit] = useState<any>();
  const [type, setType] = useState<any>();
  const [createMutation, { loading: createLoading }] =
    useMutation(CREATE_TRANSACTION);
  const [updateMutation, { loading: updateLoading }] =
    useMutation(UPDATE_TRANSACTION);
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
        mode === "create"
          ? { ...values }
          : transactionId && { ...values, id: +transactionId };

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

  return (
    <div className={classNames(styles["transaction-form-wrapper"])}>
      <Form ref={formRef} onSubmit={handleSubmit}>
        <Form.Item label="금액">
          <input
            style={{ width: "100%", height: "2.75rem" }}
            type="number"
            name="amount"
            defaultValue={init && init.amount}
          />
        </Form.Item>

        <Form.Item label="거래자">
          <input
            name="depositor"
            type="text"
            style={{
              width: "100%",
              height: "2.75rem",
            }}
            defaultValue={init && init.depositor}
          />
        </Form.Item>

        <Form.Item label="거래 유형" name="type">
          <label style={{ display: "flex", gap: "0.45rem" }}>
            <input
              type="radio"
              name="type"
              value="EXPENSE"
              checked={type === "EXPENSE"}
              onChange={(e) => setType(e.target.value)}
            />
            지출
          </label>
          <label style={{ display: "flex", gap: "0.45rem" }}>
            <input
              type="radio"
              name="type"
              value="INCOME"
              checked={type === "INCOME"}
              onChange={(e) => setType(e.target.value)}
            />
            수익
          </label>
        </Form.Item>

        <Form.Item label="거래 분류" name="category">
          <select
            name="category"
            defaultValue={init && init.category}
            style={{ width: "100%", height: "2.75rem" }}
          >
            {CATEGORY_OPTIONS.map(({ value, label }) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </Form.Item>

        <Form.Item label="거래 수단" name="paymentType">
          <select
            name="paymentType"
            defaultValue={init && init.paymentType}
            style={{ width: "100%", height: "2.75rem" }}
          >
            {PAYMENT_OPTIONS.map(({ value, label }) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </Form.Item>

        <Form.Item label="거래 설명" name="description">
          <textarea
            name="description"
            style={{ width: "100%" }}
            defaultValue={init && init.description}
          />
        </Form.Item>

        <div style={{ width: "100%", textAlign: "right" }}>
          {createLoading || updateLoading ? (
            <>
              <div style={{ width: "100%", textAlign: "center" }}>
                <LoadingSpinner />
              </div>
            </>
          ) : (
            <>
              <Button
                className={styles[`transaction-submit-button`]}
                type="submit"
              >
                Submit
              </Button>
            </>
          )}
        </div>
      </Form>
    </div>
  );
};

export default TransactionForm;
