import { Args, Mutation, Query, Resolver } from "@nestjs/graphql";
import { AccountService } from "./account.service";
import { GetAmountSummaryInput, GetAmountSummaryOutput } from './dto/get-amount-summary.dto';
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

@Resolver()
export class AccountResolver {
  constructor(private readonly accountService: AccountService) {}

  /**
   * Resolver - 계좌 추가
   * @param CreateAccountInput
   * @return CreateAccountOutput
   */
  @Mutation(() => CreateAccountOutput)
  async createAccount(@Args("input") input: CreateAccountInput): Promise<CreateAccountOutput> {
    return this.accountService.createAccount(input);
  }

  /**
   * Resolver - 계좌 정보 수정
   * @param UpdateAccountInput
   * @return UpdateAccountOutput
   */
  @Mutation(() => UpdateAccountOutput)
  async updateAccount(@Args("input") input: UpdateAccountInput): Promise<UpdateAccountOutput> {
    return this.accountService.updateAccount(input);
  }

  /**
   * Resolver - 계좌 조회
   * @param GetAccountInput
   * @return GetAccountOutput
   */
  @Query(() => GetAccountOutput)
  async getAccount(@Args("input") input: GetAccountInput): Promise<GetAccountOutput> {
    const { bankName } = input;
    return this.accountService.getAccount({ bankName });
  }

  /**
   * Resolver - 전체 계좌 조회
   * @param GetTransactionListInput
   * @return GetTransactionListOutput
   */
  @Query(() => GetAccountListOutput)
  async getAccountList(@Args("input", { nullable: true }) input?: GetAccountListInput): Promise<GetAccountListOutput> {
    return this.accountService.getAccountList();
  }

  /**
   * Resolver - 자산 현황 조회
   * @param GetAmountSummaryInput
   * @return GetAmountSummaryOutput
   */
  @Query(() => GetAmountSummaryOutput)
  async getAmountSummary(@Args("input", { nullable: true }) input?: GetAmountSummaryInput): Promise<GetAmountSummaryOutput> {
    return this.accountService.getAmountSummary();
  }
}
