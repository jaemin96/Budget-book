import { Field, InputType, Float, ObjectType } from "@nestjs/graphql";
import { BaseOutput } from "../../../src/common";
import { UserRole, UserStatus } from "@prisma/client";

@InputType()
export class UpdateUserInput {
  @Field(() => String)
  uuid: string; // 사용자 식별용

  @Field(() => String)
  email?: string;

  @Field(() => String)
  name?: string;

  @Field(() => String, { nullable: true, description: "사용자 전화번호" })
  phone?: string;

  @Field(() => String, { nullable: true, description: "사용자 프로필 이미지" })
  avatarUrl?: string;

  @Field(() => UserRole, { defaultValue: UserRole.USER, description: "사용자 권한" })
  role?: UserRole;

  @Field(() => UserStatus, { defaultValue: UserStatus.ACTIVE, description: "사용자 활성화 여부" })
  status?: UserStatus;
}

@ObjectType()
export class UpdateUserOutput extends BaseOutput {
  @Field(() => Number, { nullable: true })
  id?: number;

  @Field(() => String, { nullable: true })
  uuid?: string;
}
