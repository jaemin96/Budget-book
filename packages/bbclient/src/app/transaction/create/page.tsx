import { TransactionForm } from "@/components/Transaction";

interface CreateTransactionPageProps {}

const CreateTransactionPage = (props: CreateTransactionPageProps) => {
  return (
    <>
      <TransactionForm mode="create" />
    </>
  );
};

export default CreateTransactionPage;
