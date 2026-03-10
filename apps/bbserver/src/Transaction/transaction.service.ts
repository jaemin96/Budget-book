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
import { Prisma, Transaction, TransactionType } from "@prisma/client";

const VALID_ACCOUNT_FIELDS = [
  "availableBalance",
  "savingBalance",
  "investmentBalance",
  "fixedDepositBalance",
  "holdBalance",
] as const;

type TransactionAccountField = (typeof VALID_ACCOUNT_FIELDS)[number];

type TransactionCommandInput = {
  type?: TransactionType;
  accountId?: number | null;
  fromAccountId?: number | null;
  toAccountId?: number | null;
  accountField?: string;
};

type NormalizedTransactionCommand = {
  type: TransactionType;
  fromAccountId: number | null;
  toAccountId: number | null;
  accountField?: TransactionAccountField;
};

type AccountUpdateData = Prisma.AccountUpdateInput;

@Injectable()
export class TransactionService {
  constructor(private readonly prisma: PrismaService) {}

  private isValidAccountField(accountField?: string): accountField is TransactionAccountField {
    return accountField == null || VALID_ACCOUNT_FIELDS.includes(accountField as TransactionAccountField);
  }

  private normalizeTransactionCommand(
    input: TransactionCommandInput,
    existing?: Pick<Transaction, "type" | "fromAccountId" | "toAccountId">,
  ): NormalizedTransactionCommand {
    const type = input.type ?? existing?.type;
    if (!type) {
      throw new HttpException("Transaction type is required.", HttpStatus.BAD_REQUEST);
    }

    if (!this.isValidAccountField(input.accountField)) {
      throw new HttpException(`Invalid account field: ${input.accountField}`, HttpStatus.BAD_REQUEST);
    }

    const accountId = input.accountId ?? undefined;
    const fromAccountId =
      input.fromAccountId !== undefined ? input.fromAccountId : (existing?.fromAccountId ?? null);
    const toAccountId =
      input.toAccountId !== undefined ? input.toAccountId : (existing?.toAccountId ?? null);

    switch (type) {
      case "INCOME": {
        if (accountId != null && input.toAccountId != null && input.toAccountId !== accountId) {
          throw new HttpException(
            "INCOME cannot receive both accountId and a different toAccountId.",
            HttpStatus.BAD_REQUEST,
          );
        }

        const normalizedToAccountId = accountId ?? toAccountId;
        if (normalizedToAccountId == null) {
          throw new HttpException("INCOME requires toAccountId or accountId.", HttpStatus.BAD_REQUEST);
        }

        if (input.fromAccountId != null) {
          throw new HttpException("INCOME cannot have fromAccountId.", HttpStatus.BAD_REQUEST);
        }

        return {
          type,
          fromAccountId: null,
          toAccountId: normalizedToAccountId,
          accountField: input.accountField as TransactionAccountField | undefined,
        };
      }

      case "EXPENSE": {
        if (accountId != null && input.fromAccountId != null && input.fromAccountId !== accountId) {
          throw new HttpException(
            "EXPENSE cannot receive both accountId and a different fromAccountId.",
            HttpStatus.BAD_REQUEST,
          );
        }

        const normalizedFromAccountId = accountId ?? fromAccountId;
        if (normalizedFromAccountId == null) {
          throw new HttpException("EXPENSE requires fromAccountId or accountId.", HttpStatus.BAD_REQUEST);
        }

        if (input.toAccountId != null) {
          throw new HttpException("EXPENSE cannot have toAccountId.", HttpStatus.BAD_REQUEST);
        }

        return {
          type,
          fromAccountId: normalizedFromAccountId,
          toAccountId: null,
          accountField: input.accountField as TransactionAccountField | undefined,
        };
      }

      case "TRANSFER": {
        if (accountId != null) {
          throw new HttpException("TRANSFER cannot use accountId.", HttpStatus.BAD_REQUEST);
        }

        if (fromAccountId == null || toAccountId == null) {
          throw new HttpException(
            "TRANSFER requires both fromAccountId and toAccountId.",
            HttpStatus.BAD_REQUEST,
          );
        }

        if (fromAccountId === toAccountId) {
          throw new HttpException(
            "TRANSFER requires different fromAccountId and toAccountId.",
            HttpStatus.BAD_REQUEST,
          );
        }

        return {
          type,
          fromAccountId,
          toAccountId,
          accountField: input.accountField as TransactionAccountField | undefined,
        };
      }
    }
  }

  /**
   * 입출금 항목 추가
   */
  async createTransaction(userId: number, input: CreateTransactionInput): Promise<CreateTransactionOutput> {
    const normalizedCommand = this.normalizeTransactionCommand(input);
    const { type, amount, accountField, fromAccountId, toAccountId, paymentType, category } = {
      ...input,
      ...normalizedCommand,
    };

    /**
     * $transaction 과 transaction 은 다른 개념 (네이밍 이슈...)
     * $transaction - 여러 DB 작업들을 하나의 트랜잭션으로 묶음
     * transaction - 거래 관련 테이블명
     */
    const tx = await this.prisma.$transaction(async (prisma) => {
      const transactionData = {
        ...input,
        ...normalizedCommand,
      };
      delete (transactionData as { id?: number }).id;
      delete transactionData.accountId;

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
          const updateData: AccountUpdateData  = {
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
        const targetAccountId = type === "INCOME" ? toAccountId : fromAccountId;
        if (!targetAccountId) {
          throw new HttpException(`${type} requires a target account.`, HttpStatus.BAD_REQUEST);
        }

        const change = type === "INCOME" ? amount : -amount;
        const isCreditCard = paymentType === "CREDIT_CARD";

        const updateData: AccountUpdateData = {
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
          where: { userId, id: targetAccountId },
        });

        if (!account) {
          throw new HttpException(
            `Account with id ${targetAccountId} not found for user ${userId}`,
            HttpStatus.NOT_FOUND,
          );
        }

        await prisma.account.update({
          where: { userId, id: targetAccountId },
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
    const existingTransaction = await this.prisma.transaction.findUnique({
      where: {
        userId,
        id: input.id,
      },
    });

    if (!existingTransaction) {
      throw new HttpException(`Transaction with id ${input.id} not found.`, HttpStatus.NOT_FOUND);
    }

    const normalizedCommand = this.normalizeTransactionCommand(input, existingTransaction);
    const { accountId: _accountId, ...updateData } = {
      ...input,
      ...normalizedCommand,
    };

    const transaction = await this.prisma.transaction.update({
      where: {
        userId,
        id: input.id,
      },
      data: updateData,
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
    const result = await this.prisma.$queryRaw<{ total_balance: bigint }[]>`
      SELECT SUM(
        CASE
          WHEN type = 'INCOME' THEN amount
          WHEN type = 'EXPENSE' THEN -amount
          ELSE 0
        END
      ) AS total_balance
      FROM "Transaction"
      WHERE "userId" = ${userId}
    `;
    return Number(result?.[0]?.total_balance ?? 0);
  }
}
