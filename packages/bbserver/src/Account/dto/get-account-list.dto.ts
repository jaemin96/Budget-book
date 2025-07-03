import { Field, InputType, ObjectType } from "@nestjs/graphql";
import { BaseOutput } from "../../../src/common";
import { AccountModel } from "../model";

@InputType()
export class GetAccountListInput {
  @Field(() => Number, { nullable: true })
  totalBalance?: number;
}

@ObjectType()
export class GetAccountListOutput extends BaseOutput {
  @Field(() => [AccountModel])
  accounts: AccountModel[];
}
