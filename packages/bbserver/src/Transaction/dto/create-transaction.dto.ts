import { Field, InputType, Float, ObjectType } from "@nestjs/graphql";
import { BaseOutput } from "src/common";
import { TransactionType, TransactionCategory, TransactionPaymentType } from "@prisma/client";

@InputType()
export class CreateTransactionInput {
  @Field(() => Float)
  amount: number;

  @Field(() => String, { nullable: true })
  depositor?: string;

  @Field(() => String)
  description: string;

  @Field(() => Number, { nullable: true, description: "거래 발생 계좌" })
  accountId?: number | null;

  @Field(() => Number, { nullable: true, description: "보내는 계좌" })
  fromAccountId?: number | null;

  @Field(() => Number, { nullable: true, description: "받을 계좌" })
  toAccountId?: number | null;

  @Field(() => String, { nullable: true })
  accountField?: "availableBalance" | "savingBalance" | "fixedDepositBalance" | "investmentBalance" | "holdBalance";

  @Field(() => TransactionType)
  type: TransactionType;

  @Field(() => TransactionCategory, { nullable: true })
  category?: TransactionCategory;

  @Field(() => TransactionPaymentType, { nullable: true })
  paymentType?: TransactionPaymentType;
}

@ObjectType()
export class CreateTransactionOutput extends BaseOutput {
  @Field(() => Number, { nullable: true })
  id?: number;
}
