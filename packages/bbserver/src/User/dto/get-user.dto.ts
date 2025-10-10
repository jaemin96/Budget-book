import { Field, InputType, ObjectType } from "@nestjs/graphql";
import { BaseOutput } from "../../../src/common";
import { UserModel } from "../model";

@InputType()
export class GetUserInput {
  @Field(() => String)
  uuid: string;
}

@ObjectType()
export class GetUserOutput extends BaseOutput {
  @Field(() => UserModel, { nullable: true })
  user?: UserModel;
}
