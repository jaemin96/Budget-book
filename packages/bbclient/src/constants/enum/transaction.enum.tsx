// 타입 정의
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

export const TransactionCategoryLabels: Record<TransactionCategory, string> = {
  SALARY: "급여",
  INSURANCE: "보험",
  DRINK: "음료",
  FOOD: "식비",
  SHOPPING: "쇼핑",
  TRANSPORT: "교통비",
  SUBSCRIBE: "구독료",
  PHONE: "통신비",
  DUES: "회비",
  PRESENT: "선물",
  SAVINGS: "저금",
  INVESTMENT: "재테크",
  EMERGENCY_FUND: "비상금",
  ETC: "기타",
};

export const TransactionPaymentTypeLabels: Record<
  TransactionPaymentType,
  string
> = {
  CREDIT_CARD: "신용카드",
  CHECK_CARD: "체크카드",
  KAKAO_PAY: "카카오페이",
  APPLE_PAY: "애플페이",
  NAVER_PAY: "네이버페이",
  TOSS: "토스",
  BANK_TRANSFER: "계좌이체",
  CASH: "현금",
  POINT: "포인트",
  GIFT_CARD: "상품권",
  VIRTUAL_ACCOUNT: "가상계좌",
  CRYPTO: "암호화폐",
  ETC: "기타",
};

export const TransactionTypeLabels: Record<TransactionType, string> = {
  INCOME: "입금",
  EXPENSE: "출금",
  TRANSFER: "내 계좌 거래",
};
