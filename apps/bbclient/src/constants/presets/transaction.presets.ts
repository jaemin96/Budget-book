export interface TransactionPreset {
  id: string;
  name: string;
  emoji: string;
  type: "INCOME" | "EXPENSE" | "TRANSFER";
  category: string;
  depositor?: string;
  paymentType?: string;
  amount?: number;
  description?: string;
  // TRANSFER의 경우
  fromAccountId?: number;
  toAccountId?: number;
}

export const TRANSACTION_PRESETS: TransactionPreset[] = [
  // 월급/수입
  {
    id: "salary",
    name: "월급",
    emoji: "💰",
    type: "INCOME",
    category: "SALARY",
    depositor: "회사",
    description: "월급",
  },

  // 고정 지출
  {
    id: "netflix",
    name: "넷플릭스",
    emoji: "🎬",
    type: "EXPENSE",
    category: "SUBSCRIBE",
    depositor: "Netflix",
    amount: 17000,
    paymentType: "CREDIT_CARD",
  },
  {
    id: "youtube-premium",
    name: "유튜브",
    emoji: "📺",
    type: "EXPENSE",
    category: "SUBSCRIBE",
    depositor: "YouTube Premium",
    amount: 14900,
    paymentType: "CREDIT_CARD",
  },
  {
    id: "phone-bill",
    name: "통신비",
    emoji: "📱",
    type: "EXPENSE",
    category: "PHONE",
    depositor: "통신사",
    paymentType: "BANK_TRANSFER",
  },
  {
    id: "insurance",
    name: "보험료",
    emoji: "🏥",
    type: "EXPENSE",
    category: "INSURANCE",
    depositor: "보험사",
    paymentType: "BANK_TRANSFER",
  },

  // 자주 가는 곳
  {
    id: "starbucks",
    name: "스타벅스",
    emoji: "☕",
    type: "EXPENSE",
    category: "DRINK",
    depositor: "스타벅스",
    paymentType: "CREDIT_CARD",
  },
  {
    id: "ediya",
    name: "이디야",
    emoji: "☕",
    type: "EXPENSE",
    category: "DRINK",
    depositor: "이디야커피",
    paymentType: "CREDIT_CARD",
  },
  {
    id: "lunch",
    name: "점심",
    emoji: "🍱",
    type: "EXPENSE",
    category: "FOOD",
    depositor: "식당",
    paymentType: "CREDIT_CARD",
  },
  {
    id: "convenience-store",
    name: "편의점",
    emoji: "🏪",
    type: "EXPENSE",
    category: "SHOPPING",
    depositor: "편의점",
    paymentType: "CREDIT_CARD",
  },

  // 정기 이체
  {
    id: "savings",
    name: "저축",
    emoji: "💸",
    type: "TRANSFER",
    category: "SAVINGS",
    depositor: "저축",
    description: "정기 저축",
  },
  {
    id: "investment",
    name: "투자",
    emoji: "📈",
    type: "TRANSFER",
    category: "INVESTMENT",
    depositor: "투자",
    description: "투자금 이체",
  },
  {
    id: "emergency-fund",
    name: "비상금",
    emoji: "🚨",
    type: "TRANSFER",
    category: "EMERGENCY_FUND",
    depositor: "비상금",
    description: "비상금 적립",
  },
];

export const PRESET_CATEGORIES = {
  INCOME: "수입",
  FIXED_EXPENSE: "고정 지출",
  FREQUENT: "자주 가는 곳",
  TRANSFER: "정기 이체",
} as const;

export const getPresetsByCategory = (category: keyof typeof PRESET_CATEGORIES) => {
  switch (category) {
    case "INCOME":
      return TRANSACTION_PRESETS.filter((p) => p.type === "INCOME");
    case "FIXED_EXPENSE":
      return TRANSACTION_PRESETS.filter(
        (p) => p.type === "EXPENSE" && ["SUBSCRIBE", "PHONE", "INSURANCE"].includes(p.category)
      );
    case "FREQUENT":
      return TRANSACTION_PRESETS.filter(
        (p) => p.type === "EXPENSE" && ["DRINK", "FOOD", "SHOPPING"].includes(p.category)
      );
    case "TRANSFER":
      return TRANSACTION_PRESETS.filter((p) => p.type === "TRANSFER");
    default:
      return [];
  }
};
