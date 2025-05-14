import Transaction from "@/components/Transaction/Transaction";
import styles from "./styles/home.module.scss";
import Card from "@/components/Card/Card";

export default function Home() {
  return (
    <div className={styles.container}>
      {/* Transaction */}
      <section>
        <Card title="Transactions">
          <Transaction />
        </Card>
      </section>
    </div>
  );
}
