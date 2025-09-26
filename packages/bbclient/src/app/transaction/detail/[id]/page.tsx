import { TransactionDetail } from "@/components/Transaction/TransactionDetail";
import { notFound } from "next/navigation";

interface TransactionDetailPageProps {
  params: Promise<{ id: string }>;
}

const TransactionDetailPage = async ({
  params,
}: TransactionDetailPageProps) => {
  const { id } = await params;

  if (!id) return notFound();

  return (
    <>
      <TransactionDetail transactionId={+id} />
    </>
  );
};

export default TransactionDetailPage;
