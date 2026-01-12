import { Module } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { AuthResolver } from "./auth.resolver";
import { UserModule } from "../User/user.module";
import { PassportModule } from "@nestjs/passport";
import { JwtModule } from "@nestjs/jwt";
import { JwtStrategy } from "./jwt.strategy";
import { PrismaService } from "../Prisma/prisma.service";

@Module({
  imports: [
    UserModule,
    PassportModule,
    JwtModule.registerAsync({
      useFactory: () => ({
        secret: process.env.JWT_SECRET || "dev-secret",
        signOptions: { expiresIn: "7d" },
      }),
    }),
  ],
  providers: [AuthService, AuthResolver, JwtStrategy, PrismaService],
  exports: [AuthService],
})
export class AuthModule {}
