"use client";

import { Form, useForm } from "../Form";
import styles from "./styles/transaction.module.scss";
import { Button } from "../Button";
import classNames from "classnames";
import { FormMode } from "@/common/types";
import { CATEGORY_OPTIONS, PAYMENT_OPTIONS } from "@/constants/data";
import { useMutation } from "@apollo/client";
import { CREATE_TRANSACTION } from "@/graphql/mutations/Transaction";

export interface TransactionFormProps {
  mode: FormMode;
  transactionId?: string;
}

const TransactionForm: React.FC<TransactionFormProps> = ({
  mode,
  transactionId,
}) => {
  console.log({ mode, transactionId });
  const { formRef, getValues } = useForm<any>();
  const [createMutation] = useMutation(CREATE_TRANSACTION);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const values = getValues();
      const params = { ...values };

      const res = await createMutation({
        variables: {
          input: { ...params },
        },
      });
      console.log({ values, res });
    } catch (err) {
      console.error({ err });
    }
  };

  return (
    <div className={classNames(styles["transaction-form-wrapper"])}>
      <Form ref={formRef} onSubmit={handleSubmit}>
        <Form.Item label="금액">
          <input style={{ width: "100%" }} type="number" name="amount" />
        </Form.Item>

        <Form.Item label="거래자">
          <input name="depositor" />
        </Form.Item>

        <Form.Item label="거래 유형" name="type">
          <label>
            <input type="radio" name="type" value="EXPENSE" /> 지출
          </label>
          <label>
            <input type="radio" name="type" value="INCOME" /> 수익
          </label>
        </Form.Item>

        <Form.Item label="거래 분류" name="category">
          <select name="category">
            {CATEGORY_OPTIONS.map(({ value, label }) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </Form.Item>

        <Form.Item label="거래 수단" name="paymentType">
          <select name="paymentType">
            {PAYMENT_OPTIONS.map(({ value, label }) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </Form.Item>

        <Form.Item label="거래 설명" name="description">
          <textarea name="description" />
        </Form.Item>

        <div style={{ width: "100%", textAlign: "right" }}>
          <Button className={styles[`transaction-submit-button`]} type="submit">
            Submit
          </Button>
        </div>
      </Form>
    </div>
  );
};

export default TransactionForm;
