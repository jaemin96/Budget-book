import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import {
  CreateAccountInput,
  CreateAccountOutput,
  GetAccountInput,
  GetAccountListInput,
  GetAccountListOutput,
  GetAccountOutput,
} from './dto';
import { PrismaService } from '../Prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class AccountService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * 계좌 추가
   */
  async createAccount(input: CreateAccountInput): Promise<CreateAccountOutput> {
    const account = await this.prisma.account.create({
      data: input,
    });

    return { id: account.id };
  }

  /**
   * 계좌 단건 조회
   */
  async getAccount(input: GetAccountInput): Promise<GetAccountOutput> {
    const account = await this.prisma.account.findUnique({
      where: { bankName: input.bankName } as Prisma.AccountWhereUniqueInput,
    });

    if (!account) {
      throw new HttpException('해당 계좌가 존재 하지 않습니다.', HttpStatus.NOT_FOUND);
    }

    const sanitizedAccount = {
      ...account,
      totalBalance: account.totalBalance.toNumber(),
      availableBalance: account.availableBalance.toNumber(),
      savingBalance: account.savingBalance.toNumber(),
      fixedDepositBalance: account.fixedDepositBalance.toNumber(),
      investmentBalance: account.investmentBalance.toNumber(),
      holdBalance: account.holdBalance.toNumber(),
    };

    return { account: sanitizedAccount };
  }

  /**
   * 전체 계좌 조회
   */
  async getAccountList(input?: GetAccountListInput): Promise<GetAccountListOutput> {
    const where: Prisma.AccountWhereInput = {
      //   type: input?.type ?? undefined,
    };

    const accounts = await this.prisma.account.findMany();

    const sanitizedAccounts = accounts.map((account) => ({
      ...account,
      totalBalance: account.totalBalance.toNumber(),
      availableBalance: account.availableBalance.toNumber(),
      savingBalance: account.savingBalance.toNumber(),
      fixedDepositBalance: account.fixedDepositBalance.toNumber(),
      investmentBalance: account.investmentBalance.toNumber(),
      holdBalance: account.holdBalance.toNumber(),
    }));

    if (!accounts || accounts.length === 0) {
      return { accounts: [] };
    }

    return { accounts: sanitizedAccounts };
  }
}
