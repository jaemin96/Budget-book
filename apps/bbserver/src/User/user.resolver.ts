import { Resolver, Query, Mutation, Args, Int } from "@nestjs/graphql";
import { UserService } from "./user.service";
import {
  CreateUserInput,
  CreateUserOutput,
  GetUserInput,
  GetUserListInput,
  GetUserListOutput,
  GetUserOutput,
} from "./dto";

@Resolver("User")
export class UserResolver {
  constructor(private readonly userService: UserService) {}

  /**
   * Resolver - 신규 사용자 추가
   * @param CreateTransactionInput
   * @return CreateTransactionOutput
   */
  @Mutation(() => CreateUserOutput)
  async createUser(@Args("input") input: CreateUserInput): Promise<CreateUserOutput> {
    return this.userService.createUser(input);
  }

  /**
   * Resolver - 사용자 조회
   * @param GetUserInput
   * @return GetUserOutput
   */
  @Query(() => GetUserOutput)
  async getUser(@Args("input") input: GetUserInput): Promise<GetUserOutput> {
    const { uuid } = input;
    return this.userService.getUser({ uuid });
  }

  /**
   * Resolver - 사용자 목록 조회
   * @param GetUserListInput
   * @return GetUserListOutput
   */
  @Query(() => GetUserListOutput)
  async getUserList(@Args("input", { nullable: true }) input?: GetUserListInput): Promise<GetUserListOutput> {
    return this.userService.getUserList({ ...input });
  }
}
