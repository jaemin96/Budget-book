import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import { GqlExecutionContext } from "@nestjs/graphql";

export interface UserPayload {
  userId: number;
  email: string;
  uuid: string;
}

export const CurrentUser = createParamDecorator((data: unknown, context: ExecutionContext): UserPayload => {
  const ctx = GqlExecutionContext.create(context);
  return ctx.getContext().req.user;
});
