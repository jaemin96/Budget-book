import { TransactionDetail } from "@/components/Transaction/TransactionDetail";
import { notFound } from "next/navigation";
import styles from "../../../styles/transaction.module.scss";

interface TransactionDetailPageProps {
  params: Promise<{ id: string }>;
}

const TransactionDetailPage = async ({
  params,
}: TransactionDetailPageProps) => {
  const { id } = await params;

  if (!id) return notFound();

  return (
    <div className={styles.container}>
      <TransactionDetail transactionId={+id} />
    </div>
  );
};

export default TransactionDetailPage;
