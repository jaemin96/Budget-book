import express from "express";
import { NestFactory } from "@nestjs/core";
import { AppModule } from "../src/app.module";
import { ExpressAdapter } from "@nestjs/platform-express";
import { validateOrigin } from "../src/common/cors.config";

const expressApp = express();

let isInitialized = false;

async function bootstrap() {
  const app = await NestFactory.create(AppModule, new ExpressAdapter(expressApp));
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
  if (!isInitialized) await bootstrap();

  // 만약 api/graphql 경로가 아니면 404
  if (!req.url?.startsWith("/api/graphql")) {
    res.status(404).send("Not Found");
    return;
  }

  return expressApp(req, res);
}
