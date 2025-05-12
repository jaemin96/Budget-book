import { Field, InputType, Float, ObjectType } from '@nestjs/graphql';
import { BaseOutput } from 'src/common';
import { TransactionType, TransactionCategory, TransactionPaymentType } from '@prisma/client';

@InputType()
export class CreateTransactionInput {
  @Field(() => Float)
  amount: number;

  @Field(() => String, { nullable: true })
  depositor?: string;

  @Field(() => String)
  description: string;

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
