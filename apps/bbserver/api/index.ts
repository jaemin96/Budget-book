import express from "express";
import { NestFactory } from "@nestjs/core";
import { AppModule } from "../src/app.module";
import { ExpressAdapter } from "@nestjs/platform-express";
import { validateOrigin } from "../src/common/cors.config";
import * as cookieParser from "cookie-parser";

const expressApp = express();

let isInitialized = false;
let initError: Error | null = null;

async function bootstrap() {
  try {
    const app = await NestFactory.create(AppModule, new ExpressAdapter(expressApp), {
      logger: console,
    });
    app.use(cookieParser());
    app.enableCors({
      origin: (origin, callback) => {
        // origin이 undefined인 경우 (예: Postman, curl 등) 허용
        if (!origin) {
          callback(null, true);
          return;
        }
        validateOrigin(origin) ? callback(null, true) : callback(new Error("CORS"));
      },
      credentials: true,
    });
    await app.init();
    isInitialized = true;
    console.log("[Serverless] NestJS app initialized successfully");
  } catch (error) {
    initError = error as Error;
    console.error("[Serverless] Failed to initialize NestJS app:", error);
    throw error;
  }
}

export default async function handler(req, res) {
  try {
    const origin = req.headers.origin || req.headers.referer;

    console.log(`[${req.method}] ${req.url} - Origin: ${origin || "none"}`);

    // OPTIONS preflight 처리 (CORS)
    if (req.method === "OPTIONS") {
      // origin이 없거나 유효한 경우 허용
      const isOriginValid = !origin || validateOrigin(origin);

      if (isOriginValid) {
        // origin이 있으면 해당 origin을, 없으면 "*" 대신 요청한 origin을 반환
        if (origin) {
          res.setHeader("Access-Control-Allow-Origin", origin);
        }
        res.setHeader("Access-Control-Allow-Credentials", "true");
        res.setHeader("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
        res.setHeader(
          "Access-Control-Allow-Headers",
          "Content-Type, Authorization, Cookie, Accept, Accept-Language, Content-Language"
        );
        res.setHeader("Access-Control-Max-Age", "86400");
        res.status(204).end();
        return;
      } else {
        console.warn(`[CORS] Blocked OPTIONS from origin: ${origin}`);
        res.status(403).json({ error: "CORS policy: Origin not allowed" });
        return;
      }
    }

    // 실제 요청에도 CORS 헤더 설정
    if (origin && validateOrigin(origin)) {
      res.setHeader("Access-Control-Allow-Origin", origin);
      res.setHeader("Access-Control-Allow-Credentials", "true");
      res.setHeader("Vary", "Origin");
    }

    // 초기화 에러가 있으면 에러 반환
    if (initError) {
      console.error("[Serverless] Cannot handle request due to init error");
      res.status(500).json({
        error: "Server initialization failed",
        message: initError.message
      });
      return;
    }

    // 앱이 초기화되지 않았으면 초기화
    if (!isInitialized) {
      console.log("[Serverless] Initializing NestJS app...");
      await bootstrap();
    }

    // GraphQL 경로 확인 - /api/graphql 또는 /graphql 모두 허용
    const url = req.url || "";
    if (!url.includes("/graphql")) {
      console.warn(`[404] Invalid path: ${url}`);
      res.status(404).json({ error: "Not Found", path: url });
      return;
    }

    // Express 앱으로 요청 전달
    return expressApp(req, res);
  } catch (error) {
    console.error("[Serverless] Handler error:", error);
    res.status(500).json({
      error: "Internal Server Error",
      message: error instanceof Error ? error.message : "Unknown error"
    });
  }
}
