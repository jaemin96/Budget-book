import { Field, InputType, Float, ObjectType } from "@nestjs/graphql";
import { BaseOutput } from "../../../src/common";
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

  @Field(() => Number, { nullable: true, description: "거래 발생 계좌" })
  accountId?: number | null;

  @Field(() => Number, { nullable: true, description: "보내는 계좌" })
  fromAccountId?: number | null;

  @Field(() => Number, { nullable: true, description: "받을 계좌" })
  toAccountId?: number | null;

}

@ObjectType()
export class UpdateTransactionOutput extends BaseOutput {
  @Field(() => Number, { nullable: true })
  id?: number;
}
