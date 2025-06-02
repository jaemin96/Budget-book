import { Field, InputType, Float, ObjectType } from "@nestjs/graphql";
import { BaseOutput } from "src/common";
import { TransactionType, TransactionCategory, TransactionPaymentType } from "@prisma/client";

@InputType()
export class UpdateTransactionInput {
  @Field(() => Number)
  id: number;

  @Field(() => Float, { nullable: true })
  amount?: number;

  @Field(() => String, { nullable: true })
  depositor?: string;

  @Field(() => String, { nullable: true })
  description?: string;

  @Field(() => TransactionType, { nullable: true })
  type?: TransactionType;

  @Field(() => TransactionCategory, { nullable: true })
  category?: TransactionCategory;

  @Field(() => TransactionPaymentType, { nullable: true })
  paymentType?: TransactionPaymentType;
}

@ObjectType()
export class UpdateTransactionOutput extends BaseOutput {
  @Field(() => Number, { nullable: true })
  id?: number;
}
