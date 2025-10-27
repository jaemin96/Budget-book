import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { CustomLogger } from "./common/log/custom-logger.service";
import * as cookieParser from "cookie-parser";

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bufferLogs: true,
  });

  const logger = new CustomLogger("Main");
  app.useLogger(logger);
  app.use(cookieParser());

  app.enableCors({
    origin:
      process.env.NODE_ENV === "production"
        ? ["https://budget-book-bbclient.vercel.app", "https://budget-book-bbclient-git-main.vercel.app"]
        : true,
    credentials: true,
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS",
    allowedHeaders: ["Content-Type", "Authorization"],
  });

  const port = process.env.PORT ?? 4000;
  await app.listen(port, "0.0.0.0");

  logger.log(`Server running on http://localhost:${port}`, "RUN");
  logger.log(`🧩 GraphQL playground available at http://localhost:${port}/graphql`, "INFO");
}
// eslint-disable-next-line @typescript-eslint/no-floating-promises
bootstrap();
