import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { BaseOutput } from 'src/common';
import { Transaction } from '../entities';

@InputType()
export class GetTransactionInput {
  @Field(() => Number)
  id: number;
}

@ObjectType()
export class GetTransactionOutput extends BaseOutput {
  @Field(() => Transaction, { nullable: true })
  transaction: Transaction;
}
