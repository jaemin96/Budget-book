const ALLOWED_PATTERNS = [
  /^https:\/\/budget-book-bbclient(-[^\/]+)?\.vercel\.app$/, // 메인+preview 도메인
  /^http:\/\/localhost:\d+$/,
];

export const validateOrigin = (origin: string | undefined) => {
  if (!origin) return true;
  return ALLOWED_PATTERNS.some((pattern) => pattern.test(origin));
};
