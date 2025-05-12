import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { AccountService } from './account.service';
import {
  CreateAccountInput,
  CreateAccountOutput,
  GetAccountInput,
  GetAccountListInput,
  GetAccountListOutput,
  GetAccountOutput,
} from './dto';

@Resolver()
export class AccountResolver {
  constructor(private readonly accountService: AccountService) {}

  /**
   * Resolver - 계좌 추가
   * @param CreateAccountInput
   * @return CreateAccountOutput
   */
  @Mutation(() => CreateAccountOutput)
  async createAccount(@Args('input') input: CreateAccountInput): Promise<CreateAccountOutput> {
    return this.accountService.createAccount(input);
  }

  /**
   * Resolver - 계좌 조회
   * @param GetAccountInput
   * @return GetAccountOutput
   */
  @Query(() => GetAccountOutput)
  async getAccount(@Args('input') input: GetAccountInput): Promise<GetAccountOutput> {
    const { bankName } = input;
    return this.accountService.getAccount({ bankName });
  }

  /**
   * Resolver - 전체 계좌 조회
   * @param GetTransactionListInput
   * @return GetTransactionListOutput
   */
  @Query(() => GetAccountListOutput)
  async getAccountList(@Args('input', { nullable: true }) input?: GetAccountListInput): Promise<GetAccountListOutput> {
    return this.accountService.getAccountList();
  }
}
