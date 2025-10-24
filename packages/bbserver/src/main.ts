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

  const port = process.env.PORT ?? 4000;
  await app.listen(port, "0.0.0.0");

  logger.log(`Server running on http://localhost:${port}`, "RUN");
  logger.log(`🧩 GraphQL playground available at http://localhost:${port}/graphql`, "INFO");
}
// eslint-disable-next-line @typescript-eslint/no-floating-promises
bootstrap();
