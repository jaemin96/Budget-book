import express from "express";
import { NestFactory } from "@nestjs/core";
import { AppModule } from "../src/app.module";
import { ExpressAdapter } from "@nestjs/platform-express";
import { validateOrigin } from "../src/common/cors.config";
import * as cookieParser from "cookie-parser";

const expressApp = express();

let isInitialized = false;

async function bootstrap() {
  const app = await NestFactory.create(AppModule, new ExpressAdapter(expressApp));
  app.use(cookieParser());
  app.enableCors({
    origin: (origin, callback) => {
      validateOrigin(origin) ? callback(null, true) : callback(new Error("CORS"));
    },
    credentials: true,
  });
  await app.init();
  isInitialized = true;
}

export default async function handler(req, res) {
  const origin = req.headers.origin;

  // OPTIONS preflight 처리 (CORS)
  if (req.method === "OPTIONS") {
    if (validateOrigin(origin)) {
      res.setHeader("Access-Control-Allow-Origin", origin);
      res.setHeader("Access-Control-Allow-Credentials", "true");
      res.setHeader("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
      res.setHeader(
        "Access-Control-Allow-Headers",
        "Content-Type, Authorization, Cookie"
      );
      res.status(200).end();
      return;
    } else {
      res.status(403).end();
      return;
    }
  }

  // 실제 요청에도 CORS 헤더 설정
  if (validateOrigin(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
    res.setHeader("Access-Control-Allow-Credentials", "true");
  }

  if (!isInitialized) await bootstrap();

  // 만약 api/graphql 경로가 아니면 404
  if (!req.url?.startsWith("/api/graphql")) {
    res.status(404).send("Not Found");
    return;
  }

  return expressApp(req, res);
}
