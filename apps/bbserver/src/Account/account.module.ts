import { Module } from "@nestjs/common";
import { AccountService } from "./account.service";
import { AccountResolver } from "./account.resolver";
import { PrismaService } from "src/Prisma/prisma.service";

@Module({
  imports: [],
  providers: [AccountService, AccountResolver, PrismaService],
  exports: [AccountService],
})
export class AccountModule {}
