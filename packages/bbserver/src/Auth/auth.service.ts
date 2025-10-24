import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PrismaService } from "../Prisma/prisma.service";
import { JwtService } from "@nestjs/jwt";
import * as bcrypt from "bcrypt";

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async signIn(email: string, password: string) {
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user) throw new UnauthorizedException("존재하지 않는 사용자입니다.");

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) throw new UnauthorizedException("비밀번호가 일치하지 않습니다.");

    const payload = { sub: user.id, uuid: user.uuid, email: user.email };
    const token = await this.jwtService.signAsync(payload);

    return { accessToken: token, user };
  }
}
