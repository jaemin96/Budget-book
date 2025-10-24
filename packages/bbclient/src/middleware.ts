import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const token = req.cookies.get("token")?.value;
  const { pathname } = req.nextUrl;

  // 로그인 안 되어 있는데 보호된 페이지 접근 시 → 로그인 페이지로
  if (!token && pathname === "/") {
    return NextResponse.redirect(new URL("/authentication", req.url));
  }

  // 로그인 되어 있는데 로그인 페이지 접근 시 → 메인으로
  if (token && pathname === "/authentication") {
    return NextResponse.redirect(new URL("/", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/authentication"],
};
