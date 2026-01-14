"use client";

import React from "react";
import { Card } from "@/components";
import KakaoPayPresetForm from "@/components/Transaction/KakaoPayPresetForm";
import styles from "../../../styles/transaction.module.scss";

export default function KakaoPayExpensePresetPage() {
  return (
    <div className={styles.container}>
      <Card>
        <KakaoPayPresetForm />
      </Card>
    </div>
  );
}
