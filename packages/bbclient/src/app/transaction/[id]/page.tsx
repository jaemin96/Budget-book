import { TransactionForm } from "@/components/Transaction";

interface UpdateTransactionPageProps {
  params: { id: string };
}

const UpdateTransactionPage = ({ params }: UpdateTransactionPageProps) => {
  const { id } = params;
  return (
    <>
      <TransactionForm mode="edit" transactionId={id} />
    </>
  );
};

export default UpdateTransactionPage;
