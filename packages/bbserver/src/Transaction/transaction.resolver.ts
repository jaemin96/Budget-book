import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { TransactionService } from './transaction.service';
import {
  CreateTransactionOutput,
  CreateTransactionInput,
  GetTransactionOutput,
  GetTransactionInput,
  GetTransactionListOutput,
  GetTransactionListInput,
} from './dto';

@Resolver()
export class TransactionResolver {
  constructor(private readonly transactionService: TransactionService) {}

  /**
   * Resolver - 입출금 내역 추가
   * @param CreateTransactionInput
   * @return CreateTransactionOutput
   */
  @Mutation(() => CreateTransactionOutput)
  async createTransaction(@Args('input') input: CreateTransactionInput): Promise<CreateTransactionOutput> {
    return this.transactionService.createTransaction(input);
  }

  // /**
  //  * Resolver - 입출금 내역 조회
  //  * @param GetTransactionInput
  //  * @return GetTransactionOutput
  //  */
  // @Query(() => GetTransactionOutput)
  // async getTransaction(@Args('input') input: GetTransactionInput): Promise<GetTransactionOutput> {
  //   const { id } = input;
  //   return this.transactionService.getTransaction({ id });
  // }

  // /**
  //  * Resolver - 입출금 내역 리스트 조회
  //  * @param GetTransactionListInput
  //  * @return GetTransactionListOutput
  //  */
  // @Query(() => GetTransactionListOutput)
  // async getTransactionList(
  //   @Args('input', { nullable: true }) input?: GetTransactionListInput
  // ): Promise<GetTransactionListOutput> {
  //   return this.transactionService.getTransactionList(input);
  // }

  /**
   * Resolver - 계좌 총액 조회
   */
  @Query(() => Number)
  async getTotalAmount(): Promise<number> {
    return this.transactionService.getTotalAmount();
  }
}
