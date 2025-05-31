"use client";

import { useEffect, useState } from "react";
import styles from "./styles/transaction.module.scss";
import classNames from "classnames";
import {
  // ACCOUNT_FIELDS,
  ACCOUNTS,
  CATEGORY_OPTIONS,
  PAYMENT_OPTIONS,
} from "@/constants/data";
import { useMutation, useQuery } from "@apollo/client";
import {
  CREATE_TRANSACTION,
  UPDATE_TRANSACTION,
} from "@/graphql/mutations/Transaction";
import { GET_TRANSACTION } from "@/graphql/queries/Transaction";
import LoadingSpinner from "@/components/Loading/Spinner";
import { Form, useForm, Input, Button } from "@/components";
import { FormMode } from "@/common/types";
import { RadioGroup, Radio, Select } from "../Form/fields";

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
  const [selected, setSelected] = useState();

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
          <div className="myTransfer">
            <Form.Item label="보낼 계좌" name="fromAccountId">
              <select
                name="fromAccountId"
                value={init && init.fromAccountId}
                style={{ width: "100%", height: "2.75rem" }}
              >
                {ACCOUNTS.map(({ value, label }) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
            </Form.Item>

            <Form.Item label="받을 계좌" name="toAccountId">
              <select
                name="toAccountId"
                value={init && init.toAccountId}
                style={{ width: "100%", height: "2.75rem" }}
              >
                {ACCOUNTS.map(({ value, label }) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
            </Form.Item>
          </div>
        ) : selected === "INCOME" ? (
          <Form.Item label="수령 계좌" name="accountId">
            <Select name="toAccountId" value={init?.toAccountId}>
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
