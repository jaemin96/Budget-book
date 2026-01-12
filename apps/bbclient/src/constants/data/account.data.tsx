export const ACCOUNTS = [
  { value: 1, label: "농협은행(NH)" },
  { value: 2, label: "기업은행(IBK)" },
  { value: 3, label: "우리은행(WON)" },
  { value: 4, label: "카카오뱅크(kakaoBank)" },
  { value: 5, label: "새마을금고(MG)" },
  { value: 6, label: "토스뱅크(TOSS)" },
  { value: 7, label: "나무증권(NAMU)" },
  { value: 8, label: "카카오페이(kakaoPay)" },
  { value: 9, label: "현금(cash)" },
];

export const ACCOUNT_FIELDS = [
  { value: "savingBalance", label: "적금" },
  { value: "investmentBalance", label: "예금" },
  { value: "fixedDepositBalance", label: "투자" },
];

export const KAKAOPAY_ACCOUNT_ID = 8;

export const getNonKakaoPayAccounts = () =>
  ACCOUNTS.filter((account) => account.value !== KAKAOPAY_ACCOUNT_ID);
