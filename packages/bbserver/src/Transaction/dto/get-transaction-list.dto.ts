import { Field, InputType, ObjectType } from "@nestjs/graphql";
import { TransactionCategory, TransactionType } from "@prisma/client";
import { BasePaginationInput } from "../../../src/common";
import { TransactionModel } from "../model";
import { BasePaginationOutput } from "../../../src/common/dto/base.dto";

@InputType()
export class GetTransactionListInput extends BasePaginationInput {
  @Field(() => TransactionType, { nullable: true })
  type?: TransactionType;

  @Field(() => TransactionCategory, { nullable: true })
  category?: TransactionCategory;
}

@ObjectType()
export class GetTransactionListOutput extends BasePaginationOutput {
  @Field(() => [TransactionModel])
  transactions: TransactionModel[];
}
