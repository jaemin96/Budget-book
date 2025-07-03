import { TransactionForm } from "@/components/Transaction";

interface UpdateTransactionPageProps {
  params: Promise<{ id: string }>;
}

const UpdateTransactionPage = async ({
  params,
}: UpdateTransactionPageProps) => {
  const { id } = await params;
  return (
    <>
      <TransactionForm mode="edit" transactionId={id} />
    </>
  );
};

export default UpdateTransactionPage;
