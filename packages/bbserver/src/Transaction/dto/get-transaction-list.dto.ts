import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { BaseOutput } from 'src/common';
import { TransactionModel } from '../model';
import { TransactionCategory, TransactionType } from '@prisma/client';

@InputType()
export class GetTransactionListInput {
  @Field(() => TransactionType, { nullable: true })
  type?: TransactionType;

  @Field(() => TransactionCategory, { nullable: true })
  category?: TransactionCategory;
}

@ObjectType()
export class GetTransactionListOutput extends BaseOutput {
  @Field(() => [TransactionModel])
  transactions: TransactionModel[];
}
