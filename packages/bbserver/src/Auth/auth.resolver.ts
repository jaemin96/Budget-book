import { Args, Context, Field, Mutation, ObjectType, Resolver } from "@nestjs/graphql";
import { AuthService } from "./auth.service";
import { serialize } from "cookie";

@ObjectType()
class AuthOutput {
  @Field(() => Boolean)
  result: boolean;
}

@Resolver()
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Mutation(() => AuthOutput)
  async login(
    @Args("email") email: string,
    @Args("password") password: string,
    @Context() context: any,
  ): Promise<AuthOutput> {
    const { accessToken } = await this.authService.signIn(email, password);
    context.res.setHeader(
      "Set-Cookie",
      serialize("token", accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
        path: "/",
        maxAge: 60 * 60 * 24 * 7,
      }),
    );

    return { result: true };
  }
}
