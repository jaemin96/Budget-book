"use client";

import { Form, useForm } from "../Form";
import styles from "./styles/transaction.module.scss";
import classNames from "classnames";

type CreateTransactionProps = {};

const CreateTransaction: React.FC<CreateTransactionProps> = (props) => {
  const { formRef, getValues } = useForm<any>();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const values = getValues();
    console.log(values);
  };

  return (
    <div className={classNames(styles["create-transaction-form-wrapper"])}>
      <Form ref={formRef} onSubmit={handleSubmit}>
        <Form.Item label="Amount">
          <input type="number" name="amount" />
        </Form.Item>

        <Form.Item label="description">
          <input name="description" />
        </Form.Item>

        <Form.Item label="depositor">
          <input name="depositor" />
        </Form.Item>

        <Form.Item label="Type" name="type">
          <label>
            <input type="radio" name="type" value="option1" /> Option 1
          </label>
          <label>
            <input type="radio" name="type" value="option2" /> Option 2
          </label>
          <label>
            <input type="radio" name="type" value="option3" /> Option 3
          </label>
        </Form.Item>

        <button type="submit">Submit</button>
      </Form>
    </div>
  );
};

export default CreateTransaction;
