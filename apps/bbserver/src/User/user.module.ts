import { Module } from "@nestjs/common";
import { PrismaService } from "src/Prisma/prisma.service";
import { UserResolver } from "./user.resolver";
import { UserService } from "./user.service";

@Module({
  imports: [],
  providers: [UserService, UserResolver, PrismaService],
  exports: [UserService],
})
export class UserModule {}
