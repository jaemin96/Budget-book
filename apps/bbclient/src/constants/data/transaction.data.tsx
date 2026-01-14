export const CATEGORY_OPTIONS = [
  { value: "FOOD", label: "식비", types: ["EXPENSE"] },
  { value: "DRINK", label: "음료", types: ["EXPENSE"] },
  { value: "RECHARGE", label: "충전", types: ["EXPENSE"] },
  { value: "CREDIT_CARD_PAYMENT", label: "카드대금", types: ["EXPENSE"] },
  { value: "SALARY", label: "급여", types: ["INCOME"] },
  { value: "SAVINGS", label: "저축", types: ["TRANSFER"] },
  { value: "EMERGENCY_FUND", label: "비상금", types: ["TRANSFER"] },
  { value: "INVESTMENT", label: "재테크", types: ["TRANSFER"] },
  { value: "SHOPPING", label: "쇼핑", types: ["EXPENSE"] },
  { value: "INSURANCE", label: "보험", types: ["EXPENSE"] },
  { value: "TRANSPORT", label: "교통비", types: ["EXPENSE"] },
  { value: "SUBSCRIBE", label: "구독료", types: ["EXPENSE"] },
  { value: "PHONE", label: "통신비", types: ["EXPENSE"] },
  { value: "DUES", label: "회비", types: ["EXPENSE"] },
  { value: "PRESENT", label: "선물", types: ["EXPENSE", "INCOME"] },
  { value: "LOAN_REPAYMENT", label: "상환", types: ["EXPENSE"] },
  { value: "ETC", label: "기타", types: ["INCOME", "EXPENSE", "TRANSFER"] },
];

export const PAYMENT_OPTIONS = [
  { value: "CREDIT_CARD", label: "신용카드", requiresAccount: true, excludeAccounts: ["cash"] },
  { value: "CHECK_CARD", label: "체크카드", requiresAccount: true, excludeAccounts: ["cash"] },
  { value: "KAKAO_PAY", label: "카카오페이", requiresAccount: false },
  { value: "APPLE_PAY", label: "애플페이", requiresAccount: false },
  { value: "NAVER_PAY", label: "네이버페이", requiresAccount: false },
  { value: "TOSS", label: "토스", requiresAccount: false },
  { value: "BANK_TRANSFER", label: "계좌이체", requiresAccount: true, excludeAccounts: ["cash"] },
  { value: "CASH", label: "현금", requiresAccount: false, onlyAccounts: ["cash"] },
  { value: "POINT", label: "포인트", requiresAccount: false },
  { value: "GIFT_CARD", label: "상품권", requiresAccount: false },
  { value: "VIRTUAL_ACCOUNT", label: "가상계좌", requiresAccount: false },
  { value: "CRYPTO", label: "가상자산", requiresAccount: false },
  { value: "ETC", label: "기타", requiresAccount: false },
];

// 헬퍼 함수: 선택된 타입에 맞는 카테고리 필터링
export const getCategoriesByType = (type: string) => {
  if (!type) return CATEGORY_OPTIONS;
  return CATEGORY_OPTIONS.filter((cat) => cat.types.includes(type));
};

// 헬퍼 함수: 선택된 계좌에 맞는 결제수단 필터링
export const getPaymentsByAccount = (accountBankName?: string) => {
  if (!accountBankName) return PAYMENT_OPTIONS;

  return PAYMENT_OPTIONS.filter((payment) => {
    // 현금 계좌인 경우
    if (accountBankName === "cash") {
      return payment.onlyAccounts?.includes("cash") || !payment.requiresAccount;
    }
    // 일반 계좌인 경우
    return !payment.onlyAccounts || !payment.onlyAccounts.includes("cash");
  });
};
