import { Args, Context, Field, Mutation, ObjectType, Resolver } from "@nestjs/graphql";
import { AuthService } from "./auth.service";

@ObjectType()
class AuthOutput {
  @Field(() => Boolean)
  result: boolean;

  @Field(() => String)
  token: string;
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

    // 서버에도 쿠키 설정 (서버 -> 서버 요청용)
    context.res.cookie("token", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      path: "/",
    });

    // 클라이언트에서 사용할 token 반환 (클라이언트 middleware용)
    return { result: true, token: accessToken };
  }
}
