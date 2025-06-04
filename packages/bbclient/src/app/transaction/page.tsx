"use client";

import React from "react";
import { Card } from "@/components";
import Transaction from "@/components/Transaction/Transaction";

export default function TransactionListPage() {
  return (
    <>
      <Card>
        <Transaction />
      </Card>
    </>
  );
}
