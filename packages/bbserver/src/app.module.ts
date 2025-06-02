import { Module } from "@nestjs/common";
import { ApolloDriver, ApolloDriverConfig } from "@nestjs/apollo";
import { join } from "path";
import * as dotenv from "dotenv";

import { GraphQLModule } from "@nestjs/graphql";
import { TransactionModule } from "./Transaction/transaction.module";
import { PrismaService } from "./Prisma/prisma.service";
import { AccountModule } from "./Account/account.module";

dotenv.config();

@Module({
  imports: [
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      playground: true,
      autoSchemaFile: join(process.cwd(), "src/schema.gql"),
      sortSchema: true,
    }),
    TransactionModule,
    AccountModule,
  ],
  providers: [PrismaService],
})
export class AppModule {}
