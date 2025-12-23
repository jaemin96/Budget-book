import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { CustomLogger } from "./common/log/custom-logger.service";
import * as cookieParser from "cookie-parser";
import { validateOrigin } from "./common/cors.config";

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bufferLogs: true,
  });

  const logger = new CustomLogger("Main");
  app.useLogger(logger);
  app.use(cookieParser());

  app.enableCors({
    origin: (origin, callback) => {
      validateOrigin(origin) ? callback(null, true) : callback(new Error("CORS"));
    },
    credentials: true,
  });

  const port = process.env.PORT ?? 4000;
  await app.listen(port, "0.0.0.0");

  logger.log(`Server running on http://localhost:${port}`, "RUN");
  logger.log(`🧩 GraphQL playground available at http://localhost:${port}/graphql`, "INFO");
}
// eslint-disable-next-line @typescript-eslint/no-floating-promises
bootstrap();
