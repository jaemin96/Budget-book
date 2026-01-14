import { Transaction } from "@/model/transaction.model";

export type Account = {
  id: number;
  availableBalance: number;
  bankName: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date;
  fixedDepositBalance: number;
  holdBalance: number;
  incomingTransactions: Partial<Transaction>;
  investmentBalance: number;
  outgoingTransactions: Partial<Transaction>;
  savingBalance: number;
  totalBalance: number;
};

/**
 * @deprecated 하드코딩된 계좌 ID 타입입니다. 동적 계좌 시스템을 사용하세요.
 */
export type AccountValue = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;

export enum AccountBalanceField {
  AVAILABLE = "availableBalance",
  SAVING = "savingBalance",
  INVESTMENT = "investmentBalance",
  FIXED_DEPOSIT = "fixedDepositBalance",
  HOLD = "holdBalance",
}

/**
 * @deprecated 하드코딩된 계좌 ID와 은행명 매핑입니다. useAccounts 훅에서 반환하는 동적 accountMap을 사용하세요.
 */
export enum AccountBank {
  "농협은행(NH)" = 1,
  "기업은행(IBK)" = 2,
  "우리은행(WON)" = 3,
  "카카오뱅크(kakaoBank)" = 4,
  "새마을금고(MG)" = 5,
  "토스뱅크(TOSS)" = 6,
  "나무증권(NAMU)" = 7,
  "카카오페이(kakaoPay)" = 8,
  "현금(cash)" = 9,
}
