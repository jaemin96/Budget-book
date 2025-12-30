import { Field, InputType, ObjectType } from "@nestjs/graphql";
import { BasePaginationInput } from "../../../src/common";
import { UserModel } from "../model";
import { BasePaginationOutput } from "../../../src/common/dto/base.dto";
import { UserRole, UserStatus } from "@prisma/client";

@InputType()
export class GetUserListInput extends BasePaginationInput {
  @Field(() => UserRole, { nullable: true })
  role?: UserRole;

  @Field(() => UserStatus, { nullable: true })
  status?: UserStatus;
}

@ObjectType()
export class GetUserListOutput extends BasePaginationOutput {
  @Field(() => [UserModel], { nullable: true })
  users?: UserModel[];
}
