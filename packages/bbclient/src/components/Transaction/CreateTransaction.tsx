"use client";
import { Form, useForm } from "../Form";

type CreateTransactionProps = {};

const CreateTransaction: React.FC<CreateTransactionProps> = (props) => {
  const { formRef, getValues } = useForm<any>();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const values = getValues();
    console.log(values);
  };

  return (
    <>
      <Form ref={formRef} onSubmit={handleSubmit}>
        <Form.Item label="Amount">
          <input type="number" name="amount" />
        </Form.Item>

        <Form.Item label="description">
          <input name="description" />
        </Form.Item>

        <button type="submit">Submit</button>
      </Form>
    </>
  );
};

export default CreateTransaction;
