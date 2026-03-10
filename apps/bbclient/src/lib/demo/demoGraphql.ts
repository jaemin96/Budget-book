import { NextRequest, NextResponse } from "next/server";
import {
  DEMO_LOGIN_EMAIL,
  DEMO_LOGIN_PASSWORD,
  DEMO_SESSION_COOKIE,
  DEMO_TOKEN_COOKIE,
  DEMO_TOKEN_VALUE,
} from "./demoMode";

type DemoAccount = {
  id: number;
  bankName: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  availableBalance: number;
  fixedDepositBalance: number;
  holdBalance: number;
  investmentBalance: number;
  savingBalance: number;
  totalBalance: number;
};

type DemoTransactionType = "INCOME" | "EXPENSE" | "TRANSFER";
type DemoTransactionCategory =
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
type DemoTransactionPaymentType =
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

type DemoTransaction = {
  id: number;
  type: DemoTransactionType;
  amount: number;
  category: DemoTransactionCategory;
  createdAt: string;
  updatedAt: string;
  depositor: string;
  description: string;
  paymentType: DemoTransactionPaymentType;
  fromAccountId?: number | null;
  toAccountId?: number | null;
};

type DemoStore = {
  nextTransactionId: number;
  transactions: DemoTransaction[];
};

type GraphQLBody = {
  operationName?: string;
  query?: string;
  variables?: Record<string, any>;
};

const successMessage = { code: "SUCCESS", message: "OK" };
const unauthorizedError = {
  errors: [{ message: "Unauthenticated", extensions: { code: "UNAUTHENTICATED" } }],
};

const demoSessions = new Map<string, DemoStore>();

const nowIso = () => new Date().toISOString();

const clone = <T,>(value: T): T => JSON.parse(JSON.stringify(value));

const baseAccounts = (): DemoAccount[] => [
  {
    id: 1,
    bankName: "NH",
    createdAt: nowIso(),
    updatedAt: nowIso(),
    deletedAt: null,
    availableBalance: 420000,
    fixedDepositBalance: 0,
    holdBalance: 0,
    investmentBalance: 0,
    savingBalance: 180000,
    totalBalance: 600000,
  },
  {
    id: 4,
    bankName: "kakaoBank",
    createdAt: nowIso(),
    updatedAt: nowIso(),
    deletedAt: null,
    availableBalance: 780000,
    fixedDepositBalance: 0,
    holdBalance: 0,
    investmentBalance: 0,
    savingBalance: 0,
    totalBalance: 780000,
  },
  {
    id: 7,
    bankName: "NAMU",
    createdAt: nowIso(),
    updatedAt: nowIso(),
    deletedAt: null,
    availableBalance: 140000,
    fixedDepositBalance: 0,
    holdBalance: 0,
    investmentBalance: 1260000,
    savingBalance: 0,
    totalBalance: 1400000,
  },
  {
    id: 8,
    bankName: "kakaoPay",
    createdAt: nowIso(),
    updatedAt: nowIso(),
    deletedAt: null,
    availableBalance: 38000,
    fixedDepositBalance: 0,
    holdBalance: 0,
    investmentBalance: 0,
    savingBalance: 0,
    totalBalance: 38000,
  },
  {
    id: 9,
    bankName: "cash",
    createdAt: nowIso(),
    updatedAt: nowIso(),
    deletedAt: null,
    availableBalance: 52000,
    fixedDepositBalance: 0,
    holdBalance: 0,
    investmentBalance: 0,
    savingBalance: 0,
    totalBalance: 52000,
  },
];

const baseTransactions = (): DemoTransaction[] => [
  {
    id: 101,
    type: "INCOME",
    amount: 3200000,
    category: "SALARY",
    createdAt: "2026-03-01T00:30:00.000Z",
    updatedAt: "2026-03-01T00:30:00.000Z",
    depositor: "Monthly Salary",
    description: "March payroll",
    paymentType: "BANK_TRANSFER",
    toAccountId: 4,
  },
  {
    id: 102,
    type: "TRANSFER",
    amount: 600000,
    category: "SAVINGS",
    createdAt: "2026-03-02T10:00:00.000Z",
    updatedAt: "2026-03-02T10:00:00.000Z",
    depositor: "Auto savings",
    description: "Transfer to savings bucket",
    paymentType: "BANK_TRANSFER",
    fromAccountId: 4,
    toAccountId: 1,
  },
  {
    id: 103,
    type: "TRANSFER",
    amount: 200000,
    category: "INVESTMENT",
    createdAt: "2026-03-03T09:15:00.000Z",
    updatedAt: "2026-03-03T09:15:00.000Z",
    depositor: "Monthly investing",
    description: "Brokerage deposit",
    paymentType: "BANK_TRANSFER",
    fromAccountId: 4,
    toAccountId: 7,
  },
  {
    id: 104,
    type: "TRANSFER",
    amount: 30000,
    category: "RECHARGE",
    createdAt: "2026-03-04T12:05:00.000Z",
    updatedAt: "2026-03-04T12:05:00.000Z",
    depositor: "KakaoPay top-up",
    description: "Recharge for everyday spending",
    paymentType: "KAKAO_PAY",
    fromAccountId: 4,
    toAccountId: 8,
  },
  {
    id: 105,
    type: "EXPENSE",
    amount: 14500,
    category: "FOOD",
    createdAt: "2026-03-05T03:20:00.000Z",
    updatedAt: "2026-03-05T03:20:00.000Z",
    depositor: "Lunch",
    description: "Office area lunch set",
    paymentType: "CHECK_CARD",
    fromAccountId: 4,
  },
  {
    id: 106,
    type: "EXPENSE",
    amount: 6800,
    category: "DRINK",
    createdAt: "2026-03-06T08:40:00.000Z",
    updatedAt: "2026-03-06T08:40:00.000Z",
    depositor: "Coffee",
    description: "Afternoon coffee",
    paymentType: "KAKAO_PAY",
    fromAccountId: 8,
  },
  {
    id: 107,
    type: "EXPENSE",
    amount: 24000,
    category: "TRANSPORT",
    createdAt: "2026-03-07T01:10:00.000Z",
    updatedAt: "2026-03-07T01:10:00.000Z",
    depositor: "Transit",
    description: "Taxi and subway",
    paymentType: "TOSS",
    fromAccountId: 4,
  },
];

const createInitialStore = (): DemoStore => ({
  nextTransactionId: 1000,
  transactions: baseTransactions(),
});

const inferOperationName = (query?: string) => {
  if (!query) return undefined;
  const match = query.match(/\b(query|mutation)\s+([A-Za-z0-9_]+)/);
  return match?.[2];
};

const getStore = (sessionId: string) => {
  let store = demoSessions.get(sessionId);
  if (!store) {
    store = createInitialStore();
    demoSessions.set(sessionId, store);
  }
  return store;
};

const getBalanceField = (category: DemoTransactionCategory) => {
  switch (category) {
    case "SAVINGS":
      return "savingBalance";
    case "INVESTMENT":
      return "investmentBalance";
    case "EMERGENCY_FUND":
      return "holdBalance";
    default:
      return "availableBalance";
  }
};

const calculateAccounts = (transactions: DemoTransaction[]) => {
  const accounts = clone(baseAccounts());
  const accountMap = new Map(accounts.map((account) => [account.id, account]));

  for (const transaction of transactions) {
    if (transaction.type === "INCOME" && transaction.toAccountId) {
      const target = accountMap.get(transaction.toAccountId);
      if (target) target.availableBalance += transaction.amount;
    }

    if (transaction.type === "EXPENSE" && transaction.fromAccountId) {
      const source = accountMap.get(transaction.fromAccountId);
      if (source) source.availableBalance -= transaction.amount;
    }

    if (
      transaction.type === "TRANSFER" &&
      transaction.fromAccountId &&
      transaction.toAccountId
    ) {
      const source = accountMap.get(transaction.fromAccountId);
      const target = accountMap.get(transaction.toAccountId);
      const field = getBalanceField(transaction.category);

      if (source) source.availableBalance -= transaction.amount;
      if (target) target[field] += transaction.amount;
    }
  }

  for (const account of accounts) {
    account.totalBalance =
      account.availableBalance +
      account.fixedDepositBalance +
      account.holdBalance +
      account.investmentBalance +
      account.savingBalance;
    account.updatedAt = nowIso();
  }

  return accounts;
};

const getSummary = (accounts: DemoAccount[]) =>
  accounts.reduce(
    (summary, account) => ({
      availableBalance: summary.availableBalance + account.availableBalance,
      fixedDepositBalance: summary.fixedDepositBalance + account.fixedDepositBalance,
      holdBalance: summary.holdBalance + account.holdBalance,
      investmentBalance: summary.investmentBalance + account.investmentBalance,
      savingBalance: summary.savingBalance + account.savingBalance,
      totalBalance: summary.totalBalance + account.totalBalance,
    }),
    {
      availableBalance: 0,
      fixedDepositBalance: 0,
      holdBalance: 0,
      investmentBalance: 0,
      savingBalance: 0,
      totalBalance: 0,
    },
  );

const normalizeTransactionInput = (input: Record<string, any>) => {
  const type = input.type as DemoTransactionType;
  const amount = Number(input.amount);
  const fromAccountId =
    input.fromAccountId != null
      ? Number(input.fromAccountId)
      : type === "EXPENSE" && input.accountId != null
        ? Number(input.accountId)
        : undefined;
  const toAccountId =
    input.toAccountId != null
      ? Number(input.toAccountId)
      : type === "INCOME" && input.accountId != null
        ? Number(input.accountId)
        : undefined;

  return {
    type,
    amount,
    category: input.category as DemoTransactionCategory,
    depositor: input.depositor || "",
    description: input.description || "",
    paymentType: (input.paymentType || "ETC") as DemoTransactionPaymentType,
    fromAccountId,
    toAccountId,
  };
};

const setAuthCookies = (response: NextResponse, sessionId: string) => {
  const secure = process.env.NODE_ENV === "production";

  response.cookies.set(DEMO_TOKEN_COOKIE, DEMO_TOKEN_VALUE, {
    httpOnly: true,
    sameSite: secure ? "none" : "lax",
    secure,
    path: "/",
  });
  response.cookies.set(DEMO_SESSION_COOKIE, sessionId, {
    httpOnly: true,
    sameSite: secure ? "none" : "lax",
    secure,
    path: "/",
  });
};

const clearAuthCookies = (response: NextResponse) => {
  response.cookies.set(DEMO_TOKEN_COOKIE, "", {
    expires: new Date(0),
    path: "/",
  });
  response.cookies.set(DEMO_SESSION_COOKIE, "", {
    expires: new Date(0),
    path: "/",
  });
};

const unauthorizedResponse = () =>
  NextResponse.json(unauthorizedError, {
    status: 200,
  });

export const handleDemoGraphQL = async (request: NextRequest, body: GraphQLBody) => {
  const operationName = body.operationName || inferOperationName(body.query);

  if (!operationName) {
    return NextResponse.json(
      { errors: [{ message: "Missing GraphQL operation name" }] },
      { status: 400 },
    );
  }

  if (operationName === "Login") {
    const email = String(body.variables?.email || "");
    const password = String(body.variables?.password || "");

    if (email !== DEMO_LOGIN_EMAIL || password !== DEMO_LOGIN_PASSWORD) {
      return NextResponse.json(
        {
          errors: [
            {
              message: "Invalid demo credentials",
              extensions: { code: "UNAUTHENTICATED" },
            },
          ],
        },
        { status: 200 },
      );
    }

    const sessionId = crypto.randomUUID();
    const response = NextResponse.json({
      data: {
        login: {
          result: true,
          token: DEMO_TOKEN_VALUE,
        },
      },
    });

    getStore(sessionId);
    setAuthCookies(response, sessionId);
    return response;
  }

  const token = request.cookies.get(DEMO_TOKEN_COOKIE)?.value;
  if (token !== DEMO_TOKEN_VALUE) {
    return unauthorizedResponse();
  }

  const sessionId =
    request.cookies.get(DEMO_SESSION_COOKIE)?.value || crypto.randomUUID();
  const store = getStore(sessionId);
  const accounts = calculateAccounts(store.transactions);

  let response: NextResponse;

  switch (operationName) {
    case "GetAmountSummary":
      response = NextResponse.json({
        data: {
          getAmountSummary: getSummary(accounts),
        },
      });
      break;

    case "GetAccountList":
      response = NextResponse.json({
        data: {
          getAccountList: {
            accounts,
          },
        },
      });
      break;

    case "GetTransactionList": {
      const input = body.variables?.input || {};
      const size = Number(input.size || store.transactions.length || 10);
      const page = Number(input.page || 1);
      const sorted = [...store.transactions].sort((a, b) =>
        a.createdAt < b.createdAt ? 1 : -1,
      );
      const start = (page - 1) * size;
      const transactions = sorted.slice(start, start + size);
      response = NextResponse.json({
        data: {
          getTransactionList: {
            totalPages: Math.max(1, Math.ceil(sorted.length / size)),
            totalCount: sorted.length,
            message: successMessage,
            transactions,
          },
        },
      });
      break;
    }

    case "GetTransaction": {
      const id = Number(body.variables?.input?.id);
      const transaction = store.transactions.find((item) => item.id === id) || null;
      response = NextResponse.json({
        data: {
          getTransaction: {
            message: transaction
              ? successMessage
              : { code: "NOT_FOUND", message: "Transaction not found" },
            transaction,
          },
        },
      });
      break;
    }

    case "CreateTransaction": {
      const now = nowIso();
      const normalized = normalizeTransactionInput(body.variables?.input || {});
      const transaction: DemoTransaction = {
        id: store.nextTransactionId++,
        createdAt: now,
        updatedAt: now,
        ...normalized,
      };

      store.transactions.push(transaction);
      response = NextResponse.json({
        data: {
          createTransaction: {
            id: transaction.id,
            message: successMessage,
          },
        },
      });
      break;
    }

    case "UpdateTransaction": {
      const id = Number(body.variables?.input?.id);
      const index = store.transactions.findIndex((item) => item.id === id);
      if (index === -1) {
        response = NextResponse.json({
          data: {
            updateTransaction: {
              id,
              message: { code: "NOT_FOUND", message: "Transaction not found" },
            },
          },
        });
        break;
      }

      const existing = store.transactions[index];
      const normalized = normalizeTransactionInput(body.variables?.input || existing);
      store.transactions[index] = {
        ...existing,
        ...normalized,
        updatedAt: nowIso(),
      };

      response = NextResponse.json({
        data: {
          updateTransaction: {
            id,
            message: successMessage,
          },
        },
      });
      break;
    }

    default:
      response = NextResponse.json(
        {
          errors: [
            {
              message: `Unsupported demo operation: ${operationName}`,
            },
          ],
        },
        { status: 400 },
      );
      break;
  }

  setAuthCookies(response, sessionId);
  return response;
};

export const handleDemoGraphQLGet = (request: NextRequest) => {
  const response = NextResponse.json({
    mode: "demo",
    message: "Budget Book demo GraphQL endpoint",
  });

  if (request.cookies.get(DEMO_TOKEN_COOKIE)?.value !== DEMO_TOKEN_VALUE) {
    clearAuthCookies(response);
  }

  return response;
};
