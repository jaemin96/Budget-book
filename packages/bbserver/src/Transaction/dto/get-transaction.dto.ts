import { Field, InputType, ObjectType } from "@nestjs/graphql";
import { BaseOutput } from "src/common";
import { TransactionModel } from "../model";

@InputType()
export class GetTransactionInput {
  @Field(() => Number)
  id: number;
}

@ObjectType()
export class GetTransactionOutput extends BaseOutput {
  @Field(() => TransactionModel, { nullable: true })
  transaction: TransactionModel;
}
