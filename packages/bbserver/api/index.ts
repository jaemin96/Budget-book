import express from "express";
import { NestFactory } from "@nestjs/core";
import { AppModule } from "../src/app.module";
import { ExpressAdapter } from "@nestjs/platform-express";

const expressApp = express();

let isInitialized = false;

const whitelist = ["https://budget-book-bbclient.vercel.app", "https://budget-book-bbclient-git-main.vercel.app"];

async function bootstrap() {
  const app = await NestFactory.create(AppModule, new ExpressAdapter(expressApp));

  app.enableCors({
    origin: (origin, callback) => {
      if (!origin || whitelist.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS",
    allowedHeaders: ["Content-Type", "Authorization"],
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
