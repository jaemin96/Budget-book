import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Transaction } from './entities';
import {
  CreateTransactionInput,
  CreateTransactionOutput,
  GetTransactionInput,
  GetTransactionListInput,
  GetTransactionListOutput,
  GetTransactionOutput,
} from './dto';

@Injectable()
export class TransactionService {
  constructor(@InjectRepository(Transaction) private readonly transactionRepo: Repository<Transaction>) {}

  /**
   * Service - 입출금 항목 추가
   * @param CreateTransactionInput
   * @return CreateTransactionOutput
   */
  async createTransaction(input: CreateTransactionInput): Promise<CreateTransactionOutput> {
    const transaction = this.transactionRepo.create({ ...input });

    await this.transactionRepo.save(transaction);

    return { id: transaction.id };
  }

  /**
   * Service - 입출금 내역 조회
   * @param GetTransactionInput
   * @return GetTransactionOutput
   */
  async getTransaction(input: GetTransactionInput): Promise<GetTransactionOutput> {
    const transaction = await this.transactionRepo.findOne({
      where: { id: input.id },
    });

    if (!transaction) {
      throw new HttpException('입출금 내역이 존재 하지 않습니다.', HttpStatus.NOT_FOUND);
    }

    return { transaction };
  }

  /**
   * Service - 입출금 내역 리스트 조회
   * @param GetTransactionListInput
   * @return GetTransactionListOutput
   */
  async getTransactionList(input?: GetTransactionListInput): Promise<GetTransactionListOutput> {
    try {
      let transactions;

      if (!input) {
        transactions = await this.transactionRepo.find({});
      } else {
        transactions = await this.transactionRepo.find({
          where: { ...input },
        });
      }

      return { transactions };
    } catch (error) {
      throw new Error(error);
    }
  }

  /**
   * Service - 계좌 총액 조회
   */
  async getTotalAmount(): Promise<number> {
    const result = await this.transactionRepo
      .createQueryBuilder('transaction')
      .select(
        "SUM(CASE WHEN transaction.type = '입금' THEN transaction.amount WHEN transaction.type = '출금' THEN -transaction.amount ELSE 0 END)",
        'total_balance'
      )
      .getRawOne();

    return result.total_balance;
  }
}
