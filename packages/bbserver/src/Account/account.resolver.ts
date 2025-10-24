import { Args, Mutation, Query, Resolver } from "@nestjs/graphql";
import { AccountService } from "./account.service";
import { GetAmountSummaryInput, GetAmountSummaryOutput } from "./dto/get-amount-summary.dto";
import {
  CreateAccountInput,
  CreateAccountOutput,
  GetAccountInput,
  GetAccountListInput,
  GetAccountListOutput,
  GetAccountOutput,
  UpdateAccountInput,
  UpdateAccountOutput,
} from "./dto";
import { UseGuards } from "@nestjs/common";
import { GqlAuthGuard } from "../Auth/gql-auth.guard";
import { CurrentUser, UserPayload } from "../common/decorators/current-user.decorator";

@Resolver()
export class AccountResolver {
  constructor(private readonly accountService: AccountService) {}

  /**
   * Resolver - 계좌 추가
   * @param CreateAccountInput
   * @return CreateAccountOutput
   */
  @Mutation(() => CreateAccountOutput)
  @UseGuards(GqlAuthGuard)
  async createAccount(
    @CurrentUser() user: UserPayload,
    @Args("input") input: CreateAccountInput,
  ): Promise<CreateAccountOutput> {
    return this.accountService.createAccount(user.userId, input);
  }

  /**
   * Resolver - 계좌 정보 수정
   * @param UpdateAccountInput
   * @return UpdateAccountOutput
   */
  @Mutation(() => UpdateAccountOutput)
  @UseGuards(GqlAuthGuard)
  async updateAccount(
    @CurrentUser() user: UserPayload,
    @Args("input") input: UpdateAccountInput,
  ): Promise<UpdateAccountOutput> {
    return this.accountService.updateAccount(user.userId, input);
  }

  /**
   * Resolver - 계좌 조회
   * @param GetAccountInput
   * @return GetAccountOutput
   */
  @Query(() => GetAccountOutput)
  @UseGuards(GqlAuthGuard)
  async getAccount(@CurrentUser() user: UserPayload, @Args("input") input: GetAccountInput): Promise<GetAccountOutput> {
    return this.accountService.getAccount(user.userId, input);
  }

  /**
   * Resolver - 전체 계좌 조회
   * @param GetTransactionListInput
   * @return GetTransactionListOutput
   */
  @Query(() => GetAccountListOutput)
  @UseGuards(GqlAuthGuard)
  async getAccountList(
    @CurrentUser() user: UserPayload,
    @Args("input", { nullable: true }) input?: GetAccountListInput,
  ): Promise<GetAccountListOutput> {
    return this.accountService.getAccountList(user.userId);
  }

  /**
   * Resolver - 자산 현황 조회
   * @param GetAmountSummaryInput
   * @return GetAmountSummaryOutput
   */
  @Query(() => GetAmountSummaryOutput)
  @UseGuards(GqlAuthGuard)
  async getAmountSummary(
    @CurrentUser() user: UserPayload,
    @Args("input", { nullable: true }) input?: GetAmountSummaryInput,
  ): Promise<GetAmountSummaryOutput> {
    return this.accountService.getAmountSummary(user.userId, input);
  }
}
