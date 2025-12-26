const ALLOWED_PATTERNS = [
  /^https:\/\/budget-book-bbclient(-[^\/]+)?\.vercel\.app$/, // client production + preview
  /^https:\/\/bbserver-beryl(-[^\/]+)?\.vercel\.app$/, // server preview (필요 시)
  /^http:\/\/localhost:\d+$/, // local dev
];

export const validateOrigin = (origin: string | undefined) => {
  if (!origin) return true;

  const isAllowed = ALLOWED_PATTERNS.some((pattern) => pattern.test(origin));

  // 디버깅용 로그 (production에서 임시로 활성화)
  if (!isAllowed) {
    console.warn(`[CORS] Blocked origin: ${origin}`);
  }

  return isAllowed;
};
