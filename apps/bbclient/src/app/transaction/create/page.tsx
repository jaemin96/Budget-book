import { TransactionForm } from "@/components/Transaction";
import styles from "../../styles/transaction.module.scss";

interface CreateTransactionPageProps {}

const CreateTransactionPage = (props: CreateTransactionPageProps) => {
  return (
    <div className={styles.container}>
      <TransactionForm mode="create" />
    </div>
  );
};

export default CreateTransactionPage;
