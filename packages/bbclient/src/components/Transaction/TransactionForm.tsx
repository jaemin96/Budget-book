"use client";

import { Form, useForm } from "../Form";
import styles from "./styles/transaction.module.scss";
import { Button } from "../Button";
import classNames from "classnames";
import { FormMode } from "@/common/types";

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const values = getValues();
    console.log(values);
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
            <input type="radio" name="EXPENSE" value="EXPENSE" /> 지출
          </label>
          <label>
            <input type="radio" name="INCOME" value="INCOME" /> 수익
          </label>
        </Form.Item>

        <Form.Item label="거래 설명">
          <input type="" name="description" />
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
