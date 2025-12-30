import {
  TransactionCategory,
  TransactionPaymentType,
  TransactionType,
} from "@/model/transaction.model";


export const TransactionCategoryLabels: Record<TransactionCategory, string> = {
  SALARY: "급여",
  INSURANCE: "보험",
  DRINK: "음료",
  FOOD: "식비",
  CREDIT_CARD_PAYMENT: "카드대금",
  SHOPPING: "쇼핑",
  TRANSPORT: "교통비",
  SUBSCRIBE: "구독료",
  PHONE: "통신비",
  DUES: "회비",
  PRESENT: "선물",
  SAVINGS: "저금",
  INVESTMENT: "재테크",
  EMERGENCY_FUND: "비상금",
  RECHARGE: "충전",
  LOAN_REPAYMENT: "상환",
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
