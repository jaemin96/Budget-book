export const isDemoModeEnabled = () =>
  process.env.DEMO_MODE === "true" || process.env.NEXT_PUBLIC_DEMO_MODE === "true";

export const DEMO_LOGIN_EMAIL =
  process.env.NEXT_PUBLIC_DEMO_LOGIN_EMAIL || "demo@budgetbook.app";

export const DEMO_LOGIN_PASSWORD =
  process.env.NEXT_PUBLIC_DEMO_LOGIN_PASSWORD || "demo1234";

export const DEMO_TOKEN_COOKIE = "token";
export const DEMO_TOKEN_VALUE = "budget-book-demo-token";
export const DEMO_SESSION_COOKIE = "bb_demo_session";
