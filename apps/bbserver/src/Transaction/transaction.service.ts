import { Injectable, HttpException, HttpStatus } from "@nestjs/common";
import { PrismaService } from "src/Prisma/prisma.service";
import {
  CreateTransactionInput,
  CreateTransactionOutput,
  GetTransactionInput,
  GetTransactionListInput,
  GetTransactionListOutput,
  GetTransactionOutput,
  UpdateTransactionInput,
  UpdateTransactionOutput,
} from "./dto";
import { TransactionModel } from "./model";
import { Prisma } from "@prisma/client";

@Injectable()
export class TransactionService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * 입출금 항목 추가
   */
  async createTransaction(userId: number, input: CreateTransactionInput): Promise<CreateTransactionOutput> {
    const validFields = [
      "availableBalance",
      "savingBalance",
      "investmentBalance",
      "fixedDepositBalance",
      "holdBalance",
    ];

    const { type, amount, accountField, fromAccountId, toAccountId, paymentType, accountId, category } = input;

    if (accountField && !validFields.includes(accountField)) {
      throw new Error(`Invalid account field: ${accountField}`);
    }

    /**
     * $transaction 과 transaction 은 다른 개념 (네이밍 이슈...)
     * $transaction - 여러 DB 작업들을 하나의 트랜잭션으로 묶음
     * transaction - 거래 관련 테이블명
     */
    const tx = await this.prisma.$transaction(async (prisma) => {
      const transactionData = { ...input };
      delete transactionData.accountId;

      if ((type === "INCOME" || type === "EXPENSE") && !transactionData.fromAccountId && accountId) {
        transactionData.fromAccountId = accountId;
      }

      const transaction = await prisma.transaction.create({
        data: {
          userId,
          ...transactionData,
        },
      });

      // 1️⃣ 계좌 간 이체 처리
      if (type === "TRANSFER") {
        const updates: { accountId: number; change: number; isTarget: boolean }[] = [];

        if (fromAccountId) updates.push({ accountId: fromAccountId, change: -amount, isTarget: false });
        if (toAccountId) updates.push({ accountId: toAccountId, change: amount, isTarget: true });

        // 카테고리에 따른 타겟 필드 결정
        let targetField: string | undefined;
        if (category === "SAVINGS" || category === "EMERGENCY_FUND") {
          targetField = "savingBalance";
        } else if (category === "INVESTMENT") {
          targetField = "investmentBalance";
        }

        for (const { accountId, change, isTarget } of updates) {
          const updateData: Record<string, any> = {
            totalBalance: { increment: change },
            availableBalance: { increment: change },
          };

          // 받는 계좌이고 특수 카테고리인 경우 해당 필드도 증가
          if (isTarget && targetField) {
            updateData[targetField] = { increment: change };
          }

          await prisma.account.update({
            where: { id: accountId },
            data: updateData,
          });
        }
      }

      // 2️⃣ 입금/출금 처리
      else if (type === "INCOME" || type === "EXPENSE") {
        if (!accountId) throw new Error("accountId is required.");

        const change = type === "INCOME" ? amount : -amount;
        const isCreditCard = paymentType === "CREDIT_CARD";

        const updateData: Record<string, any> = {
          totalBalance: { increment: change },
        };

        if (isCreditCard) {
          updateData["availableBalance"] = { increment: change }; // 사용 가능 금액 차감/증가
          updateData["holdBalance"] = { increment: -change }; // 이체 예약 금액 증가
          delete updateData.totalBalance;
        } else {
          // 2️⃣-1️⃣신용카드 대금 결제인 경우
          if (category === "CREDIT_CARD_PAYMENT") {
            updateData["holdBalance"] = { increment: change };
          } else {
            updateData["availableBalance"] = { increment: change };
          }
        }

        // accountField가 명시적으로 제공된 경우에만 사용
        if (accountField) {
          updateData[accountField] = { increment: change };
        }

        // 먼저 해당 계좌가 이 사용자의 것인지 확인
        const account = await prisma.account.findFirst({
          where: { userId, id: accountId },
        });

        if (!account) {
          throw new HttpException(
            `Account with id ${accountId} not found for user ${userId}`,
            HttpStatus.NOT_FOUND,
          );
        }

        await prisma.account.update({
          where: { userId, id: accountId },
          data: updateData,
        });
      }

      return transaction;
    });

    return { id: tx.id };
  }

  /**
   * 입출금 항목 수정
   */
  async updateTransaction(userId: number, input: UpdateTransactionInput): Promise<UpdateTransactionOutput> {
    const transaction = await this.prisma.transaction.update({
      where: {
        userId,
        id: input.id,
      },
      data: {
        ...input,
      },
    });

    return { id: transaction.id };
  }

  /**
   * 입출금 단건 조회
   */
  async getTransaction(userId: number, input: GetTransactionInput): Promise<GetTransactionOutput> {
    const transactionData = await this.prisma.transaction.findUnique({
      where: { userId, id: input.id },
      include: { fromAccount: true, toAccount: true },
    });

    if (!transactionData) {
      throw new HttpException("입출금 내역이 존재 하지 않습니다.", HttpStatus.NOT_FOUND);
    }

    const transaction: TransactionModel = {
      ...transactionData,
      amount: Number(transactionData.amount),
      fromAccount: transactionData.fromAccount
        ? {
            ...transactionData.fromAccount,
            availableBalance: transactionData.fromAccount.availableBalance.toNumber(),
            savingBalance: transactionData.fromAccount.savingBalance.toNumber(),
            investmentBalance: transactionData.fromAccount.investmentBalance.toNumber(),
            fixedDepositBalance: transactionData.fromAccount.fixedDepositBalance.toNumber(),
            holdBalance: transactionData.fromAccount.holdBalance.toNumber(),
            totalBalance: transactionData.fromAccount.totalBalance.toNumber(),
          }
        : null,
      toAccount: transactionData.toAccount
        ? {
            ...transactionData.toAccount,
            availableBalance: transactionData.toAccount.availableBalance.toNumber(),
            savingBalance: transactionData.toAccount.savingBalance.toNumber(),
            investmentBalance: transactionData.toAccount.investmentBalance.toNumber(),
            fixedDepositBalance: transactionData.toAccount.fixedDepositBalance.toNumber(),
            holdBalance: transactionData.toAccount.holdBalance.toNumber(),
            totalBalance: transactionData.toAccount.totalBalance.toNumber(),
          }
        : null,
    };

    return { transaction };
  }

  /**
   * 입출금 리스트 조회
   */
  async getTransactionList(userId: number, input?: GetTransactionListInput): Promise<GetTransactionListOutput> {
    const page = input?.page ?? 1;
    const size = input?.size ?? 10;

    const where: Prisma.TransactionWhereInput = {
      userId,
      type: input?.type ?? undefined,
      category: input?.category ?? undefined,
    };

    const transactions = await this.prisma.transaction.findMany({
      where,
      orderBy: {
        [input?.sortBy || "createdAt"]: input?.order?.toLowerCase() === "asc" ? "asc" : "desc",
      },
      skip: (page - 1) * size,
      take: size,
    });

    if (!transactions || transactions.length === 0) {
      return { transactions: [] };
    }

    const convertedTransactions = transactions.map((tx) => ({
      ...tx,
      amount: Number(tx.amount),
    }));

    const totalCount = await this.prisma.transaction.count({ where });

    return { transactions: convertedTransactions, totalCount, totalPages: Math.ceil(totalCount / size) };
  }

  /**
   * 계좌 총액 조회
   */
  async getTotalAmount(userId: number): Promise<number> {
    const result = await this.prisma.$queryRawUnsafe<{ total_balance: number }>(`
      SELECT SUM(
        CASE
          WHEN type = '입금' THEN amount
          WHEN type = '출금' THEN -amount
          ELSE 0
        END
      ) AS total_balance
      FROM "Transaction"
      WHERE userId = ${userId}
    `);

    return result?.[0]?.total_balance ?? 0;
  }
}
