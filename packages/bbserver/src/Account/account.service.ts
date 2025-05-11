import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { PrismaService } from '../Prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class AccountService {
    constructor(private readonly prisma: PrismaService) {}

  /**
   * 계좌 단건 조회
   */
  async getAccount(input: any): Promise<any> {
    const account = await this.prisma.account.findUnique({
      where: { bankName: input.bankName } as Prisma.AccountWhereUniqueInput,
    });

    if (!account) {
      throw new HttpException('해당 계좌가 존재 하지 않습니다.', HttpStatus.NOT_FOUND);
    }

    return { account };
  }

  /**
   * 전체 계좌 조회
   */
  async getAccountList(input?: any): Promise<any> {
    const where: Prisma.AccountWhereInput = {
    //   type: input?.type ?? undefined,
    };

    const accounts = await this.prisma.account.findMany();

    console.log(accounts);

    if (!accounts || accounts.length === 0) {
      return { accounts: [] };
    }

    return { accounts };
  }

}