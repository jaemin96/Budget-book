import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { PrismaService } from 'src/Prisma/prisma.service';
import {
  CreateTransactionInput,
  CreateTransactionOutput,
  GetTransactionInput,
  GetTransactionListInput,
  GetTransactionListOutput,
  GetTransactionOutput,
} from './dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class TransactionService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * 입출금 항목 추가
   */
  async createTransaction(input: CreateTransactionInput): Promise<CreateTransactionOutput> {
    const transaction = await this.prisma.transaction.create({
      data: input,
    });

    return { id: transaction.id };
  }

  /**
   * 입출금 단건 조회
   */
  async getTransaction(input: GetTransactionInput): Promise<GetTransactionOutput> {
    const transaction = await this.prisma.transaction.findUnique({
      where: { id: input.id },
    });

    if (!transaction) {
      throw new HttpException('입출금 내역이 존재 하지 않습니다.', HttpStatus.NOT_FOUND);
    }

    transaction.amount = transaction.amount ?? 0;

    return { transaction };
  }

  /**
   * 입출금 리스트 조회
   */
  async getTransactionList(input?: GetTransactionListInput): Promise<GetTransactionListOutput> {
    const page = input?.page ?? 1;
    const size = input?.size ?? 10;

    const where: Prisma.TransactionWhereInput = {
      type: input?.type ?? undefined,
      category: input?.category ?? undefined,
    };

    const transactions = await this.prisma.transaction.findMany({
      where,
      orderBy: {
        [input?.sortBy || 'createdAt']: input?.order?.toLowerCase() === 'asc' ? 'asc' : 'desc',
      },
      skip: (page - 1) * size,
      take: size,
    });

    if (!transactions || transactions.length === 0) {
      return { transactions: [] };
    }

    const totalCount = await this.prisma.transaction.count({ where });

    return { transactions, totalCount, totalPages: Math.ceil(totalCount / size) };
  }

  /**
   * 계좌 총액 조회
   */
  async getTotalAmount(): Promise<number> {
    const result = await this.prisma.$queryRawUnsafe<{ total_balance: number }>(`
      SELECT SUM(
        CASE
          WHEN type = '입금' THEN amount
          WHEN type = '출금' THEN -amount
          ELSE 0
        END
      ) AS total_balance
      FROM "Transaction"
    `);

    return result?.[0]?.total_balance ?? 0;
  }
}
