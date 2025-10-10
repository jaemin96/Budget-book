import { Field, ObjectType, registerEnumType } from "@nestjs/graphql";
import { UserRole, UserStatus } from "@prisma/client";

@ObjectType()
export class UserModel {
  @Field(() => Number)
  id: number;

  @Field(() => String)
  uuid: string;

  @Field(() => String)
  email: string;

  @Field(() => String)
  password: string;

  @Field(() => String)
  name: string;

  @Field(() => String, { nullable: true })
  phone?: string;

  @Field(() => String, { nullable: true })
  avatarUrl?: string;

  @Field(() => UserRole)
  role: UserRole;

  @Field(() => UserStatus)
  status: UserStatus;

  @Field(() => Date)
  createdAt: Date;

  @Field(() => Date)
  updatedAt: Date;
}

registerEnumType(UserRole, { name: "UserRole" });
registerEnumType(UserStatus, { name: "UserStatus" });
