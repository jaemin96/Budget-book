import * as bcrypt from "bcrypt";
import { Injectable } from "@nestjs/common";
import { PrismaService } from "../Prisma/prisma.service";
import {
  CreateUserInput,
  CreateUserOutput,
  GetUserInput,
  GetUserListInput,
  GetUserListOutput,
  GetUserOutput,
} from "./dto";

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * 신규 사용자 추가
   */
  async createUser(input: CreateUserInput): Promise<CreateUserOutput> {
    const { password, ...rest } = input;
    const hashedPassword = await bcrypt.hash(input.password, 10);

    const user = await this.prisma.user.create({
      data: {
        ...rest,
        password: hashedPassword,
      },
    });

    return { id: user.id, uuid: user.uuid };
  }

  /**
   * 사용자 단일 조회
   */
  async getUser({ uuid }: GetUserInput): Promise<GetUserOutput> {
    const user = await this.prisma.user.findUnique({
      where: { uuid },
    });

    return {
      user: user
        ? {
            ...user,
            phone: user.phone ?? undefined,
            avatarUrl: user.avatarUrl ?? undefined,
          }
        : undefined,
    };
  }

  /**
   * 사용자 목록 조회
   */
  async getUserList({ role, status }: GetUserListInput): Promise<GetUserListOutput> {
    const where: any = {};

    if (role) where.role = role;
    if (status) where.status = status;

    const users = await this.prisma.user.findMany({
      where,
    });

    if (!users || users.length === 0) {
      return { users: [] };
    }

    return {
      users: users.map((u) => ({
        ...u,
        phone: u.phone ?? undefined,
        avatarUrl: u.avatarUrl ?? undefined,
      })),
    };
  }
}
