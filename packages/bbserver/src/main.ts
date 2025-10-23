import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { CustomLogger } from "./common/log/custom-logger.service";

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bufferLogs: true,
  });

  const logger = new CustomLogger("Main");
  app.useLogger(logger);

  app.enableCors({
    origin: [
      "http://localhost:3030",
      "https://budget-book-bbclient.vercel.app",
      "/https:\/\/budget-book-bbclient-git-.*\.vercel\.app/",
    ],
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS",
    credentials: true,
  });

  await app.listen(process.env.PORT ?? 4000, "0.0.0.0");
  logger.log(`🚀 Server running on http://localhost:${process.env.PORT ?? 4000}`);
}
// eslint-disable-next-line @typescript-eslint/no-floating-promises
bootstrap();
