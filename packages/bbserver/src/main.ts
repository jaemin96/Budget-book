import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

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
}
// eslint-disable-next-line @typescript-eslint/no-floating-promises
bootstrap();
