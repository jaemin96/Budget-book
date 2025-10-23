import { Args, Mutation, Query, Resolver } from "@nestjs/graphql";
import { TransactionService } from "./transaction.service";
import {
  CreateTransactionOutput,
  CreateTransactionInput,
  GetTransactionOutput,
  GetTransactionInput,
  GetTransactionListOutput,
  GetTransactionListInput,
  UpdateTransactionOutput,
  UpdateTransactionInput,
} from "./dto";
import { Logger, UseGuards } from "@nestjs/common";
import { GqlAuthGuard } from "../Auth/gql-auth.guard";
import { CurrentUser, UserPayload } from "../common/decorators/current-user.decorator";

@Resolver()
export class TransactionResolver {
  private readonly logger = new Logger(TransactionResolver.name);

  constructor(private readonly transactionService: TransactionService) {}

  /**
   * Resolver - 입출금 내역 추가
   * @param CreateTransactionInput
   * @return CreateTransactionOutput
   */
  @Mutation(() => CreateTransactionOutput)
  @UseGuards(GqlAuthGuard)
  async createTransaction(
    @CurrentUser() user: UserPayload,
    @Args("input") input: CreateTransactionInput,
  ): Promise<CreateTransactionOutput> {
    return this.transactionService.createTransaction(user.userId, input);
  }

  /**
   * Resolver - 입출금 내역 수정
   * @param UpdateTransactionInput
   * @return UpdateTransactionOutput
   */
  @Mutation(() => UpdateTransactionOutput)
  @UseGuards(GqlAuthGuard)
  async updateTransaction(@Args("input") input: UpdateTransactionInput): Promise<UpdateTransactionOutput> {
    return this.transactionService.updateTransaction(input);
  }

  /**
   * Resolver - 입출금 내역 조회
   * @param GetTransactionInput
   * @return GetTransactionOutput
   */
  @Query(() => GetTransactionOutput)
  @UseGuards(GqlAuthGuard)
  async getTransaction(@Args("input") input: GetTransactionInput): Promise<GetTransactionOutput> {
    const { id } = input;
    return this.transactionService.getTransaction({ id });
  }

  /**
   * Resolver - 입출금 내역 리스트 조회
   * @param GetTransactionListInput
   * @return GetTransactionListOutput
   */
  @Query(() => GetTransactionListOutput)
  @UseGuards(GqlAuthGuard)
  async getTransactionList(
    @CurrentUser() user: UserPayload,
    @Args("input", { nullable: true }) input?: GetTransactionListInput,
  ): Promise<GetTransactionListOutput> {
    this.logger.debug(`👤 Current user: ${JSON.stringify(user, null, 2)}`);
    this.logger.debug(`👤 Current user2: ${user.userId}`);
    this.logger.debug(`👤 Current user id type: ${typeof user.userId}`);

    const result = await this.transactionService.getTransactionList(user.userId, input);
    // this.logger.debug(`📊 Result: ${JSON.stringify(result, null, 2)}`);
    return result;
  }

  /**
   * Resolver - 계좌 총액 조회
   */
  @Query(() => Number)
  @UseGuards(GqlAuthGuard)
  async getTotalAmount(): Promise<number> {
    return this.transactionService.getTotalAmount();
  }
}
