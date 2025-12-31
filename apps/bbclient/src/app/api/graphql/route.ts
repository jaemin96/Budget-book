import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // 백엔드 GraphQL 엔드포인트
    const backendUrl =
      process.env.GRAPHQL_BACKEND_URL ||
      process.env.NEXT_PUBLIC_GRAPHQL_API ||
      "http://localhost:7000/api/graphql";

    // 백엔드로 요청 프록시
    const response = await fetch(backendUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        // 브라우저의 쿠키를 백엔드로 전달 (이후 요청용)
        Cookie: request.headers.get("cookie") || "",
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();

    // 응답 생성
    const nextResponse = NextResponse.json(data, {
      status: response.status,
    });

    // 백엔드의 Set-Cookie 헤더를 프론트엔드 도메인에 설정
    const setCookie = response.headers.get("set-cookie");
    if (setCookie) {
      nextResponse.headers.set("Set-Cookie", setCookie);
    }

    return nextResponse;
  } catch (error) {
    console.error("GraphQL Proxy Error:", error);
    return NextResponse.json(
      { error: "Failed to proxy GraphQL request" },
      { status: 500 }
    );
  }
}

// GET 요청도 지원 (GraphQL Playground 등)
export async function GET(request: NextRequest) {
  const backendUrl =
    process.env.GRAPHQL_BACKEND_URL ||
    process.env.NEXT_PUBLIC_GRAPHQL_API ||
    "http://localhost:7000/api/graphql";

  try {
    const response = await fetch(backendUrl, {
      method: "GET",
      headers: {
        Cookie: request.headers.get("cookie") || "",
      },
    });

    const data = await response.text();

    return new NextResponse(data, {
      status: response.status,
      headers: {
        "Content-Type": response.headers.get("content-type") || "text/html",
      },
    });
  } catch (error) {
    console.error("GraphQL Proxy Error:", error);
    return NextResponse.json(
      { error: "Failed to proxy GraphQL request" },
      { status: 500 }
    );
  }
}
