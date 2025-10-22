import { Module } from "@nestjs/common";
import { ApolloDriver, ApolloDriverConfig } from "@nestjs/apollo";
import { join } from "path";
import * as dotenv from "dotenv";

import { GraphQLModule } from "@nestjs/graphql";
import { TransactionModule } from "./Transaction/transaction.module";
import { PrismaService } from "./Prisma/prisma.service";
import { AccountModule } from "./Account/account.module";
import { readFileSync } from "fs";
import { AccountResolver } from "./Account/account.resolver";
import { TransactionResolver } from "./Transaction/transaction.resolver";
import { UserModule } from "./User/user.module";
import { UserResolver } from "./User/user.resolver";
import { AuthModule } from "./Auth/auth.module";
import { AuthResolver } from "./Auth/auth.resolver";

dotenv.config();

const isProd = process.env.NODE_ENV === "production";
// const schema = readFileSync(join(__dirname, "/schema.gql"), "utf-8"); // 배포할때만 on

@Module({
  imports: [
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      playground: true,
      // path: "/api/graphql", // 배포할떄만 on
      // typeDefs: schema, // 배포할떄만 on
      autoSchemaFile: isProd ? false : join(process.cwd(), "src/schema.gql"),
      sortSchema: true,
      introspection: true,
    }),
    TransactionModule,
    AccountModule,
    UserModule,
    AuthModule,
  ],
  providers: [PrismaService, AccountResolver, TransactionResolver, UserResolver, AuthResolver],
})
export class AppModule {}
