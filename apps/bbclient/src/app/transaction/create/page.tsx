import { TransactionForm } from "@/components/Transaction";
import { Card } from "@/components";
import styles from "../../styles/transaction.module.scss";

interface CreateTransactionPageProps {}

const CreateTransactionPage = (props: CreateTransactionPageProps) => {
  return (
    <div className={styles.container}>
      <Card>
        <TransactionForm mode="create" />
      </Card>
    </div>
  );
};

export default CreateTransactionPage;
