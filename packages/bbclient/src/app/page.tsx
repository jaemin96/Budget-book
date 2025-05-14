import Transaction from "@/components/Transaction/Transaction";
import styles from "./styles/home.module.scss";
import { Card } from "@/components";

export default function Home() {
  return (
    <div className={styles.container}>
      {/* Transaction */}
      <section>
        <Card>
          <Transaction />
        </Card>
      </section>
    </div>
  );
}
