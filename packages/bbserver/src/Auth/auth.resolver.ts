import { Args, Field, Mutation, ObjectType, Resolver } from "@nestjs/graphql";
import { UserModel } from "../User/model/user.model";
import { AuthService } from "./auth.service";

@ObjectType()
class AuthOutput {
  @Field(() => String)
  accessToken: string;

  @Field(() => UserModel)
  user: UserModel;
}

@Resolver()
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Mutation(() => AuthOutput)
  async login(@Args("email") email: string, @Args("password") password: string): Promise<AuthOutput> {
    return this.authService.signIn(email, password);
  }
}
