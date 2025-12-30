import { Account, AccountValue } from "@/model/account.model";

export type TransactionCategory =
  | "SALARY"
  | "INSURANCE"
  | "DRINK"
  | "FOOD"
  | "SHOPPING"
  | "TRANSPORT"
  | "SUBSCRIBE"
  | "PHONE"
  | "DUES"
  | "PRESENT"
  | "SAVINGS"
  | "INVESTMENT"
  | "EMERGENCY_FUND"
  | "CREDIT_CARD_PAYMENT"
  | "RECHARGE"
  | "LOAN_REPAYMENT"
  | "ETC";

export type TransactionPaymentType =
  | "CREDIT_CARD"
  | "CHECK_CARD"
  | "KAKAO_PAY"
  | "APPLE_PAY"
  | "NAVER_PAY"
  | "TOSS"
  | "BANK_TRANSFER"
  | "CASH"
  | "POINT"
  | "GIFT_CARD"
  | "VIRTUAL_ACCOUNT"
  | "CRYPTO"
  | "ETC";

export type TransactionType = "INCOME" | "EXPENSE" | "TRANSFER";

export type Transaction = {
  amount: number;
  category: TransactionCategory;
  createdAt: Date;
  depositor: string;
  description: string;
  id: number;
  paymentType: TransactionPaymentType;
  fromAccount?: Partial<Account>;
  toAccount?: Partial<Account>;
  fromAccountId?: AccountValue;
  toAccountId?: AccountValue;
  type: TransactionType;
  updatedAt: Date;
};
