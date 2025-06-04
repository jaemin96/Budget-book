import styles from "./styles/home.module.scss";
import Link from "next/link";
import { Button, Card } from "@/components";

export default function Home() {
  return (
    <div className={styles.container}>
      {/* 거래내역 페이지 이동 */}
      <Card>
        <Link href="/transaction">
          <Button buttonMode="ghost">거래내역 이동</Button>
        </Link>
      </Card>

      {/* 총 금액 */}
      <section>
        <Card>
          <span>{"Total amount"}</span>
        </Card>
      </section>

      {/* 저축 금액 */}
      <section>
        <Card>
          <span>{"Saving amount"}</span>
        </Card>
      </section>

      {/* 바로 출금 가능 금액 */}
      <section>
        <Card>
          <span>{"Available amount"}</span>
        </Card>
      </section>

      {/* 출금 예정 금액  */}
      <section>
        <Card>
          <span>{"Available amount"}</span>
        </Card>
      </section>
    </div>
  );
}
