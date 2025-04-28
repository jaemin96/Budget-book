import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { BaseOutput } from 'src/common';
import { Transaction } from '../entities';
import { TransactionCategory, TransactionType } from '../enum';

@InputType()
export class GetTransactionListInput {
  @Field(() => TransactionType, { nullable: true })
  type?: TransactionType;

  @Field(() => TransactionCategory, { nullable: true })
  category?: TransactionCategory;
}

@ObjectType()
export class GetTransactionListOutput extends BaseOutput {
  @Field(() => Transaction, { nullable: true })
  transactions: Transaction[];
}
