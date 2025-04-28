import { Field, InputType, ObjectType, OmitType } from '@nestjs/graphql';
import { BaseOutput } from 'src/common';
import { Transaction } from '../entities';

@InputType()
export class CreateTransactionInput extends OmitType(Transaction, ['id', 'createdAt', 'updatedAt', 'deletedAt']) {}

@ObjectType()
export class CreateTransactionOutput extends BaseOutput {
  @Field(() => Number, { nullable: true })
  id?: number;
}
