import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { BaseOutput } from 'src/common';
import { TransactionCategory, TransactionType } from '../enum';
import { TransactionModel } from '../model';

@InputType()
export class GetTransactionListInput {
  @Field(() => TransactionType, { nullable: true })
  type?: TransactionType;

  @Field(() => TransactionCategory, { nullable: true })
  category?: TransactionCategory;
}

@ObjectType()
export class GetTransactionListOutput extends BaseOutput {
  @Field(() => TransactionModel, { nullable: true })
  transactions: TransactionModel[];
}
