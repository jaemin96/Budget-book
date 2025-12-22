const ALLOWED_PATTERNS = [
  /^https:\/\/budget-book-bbclient.*\.vercel\.app$/,
  /^http:\/\/localhost:\d+$/,
];

export const validateOrigin = (origin: string | undefined) => {
  if (!origin) return true;
  return ALLOWED_PATTERNS.some((pattern) => pattern.test(origin));
};
