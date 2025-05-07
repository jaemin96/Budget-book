import { Field, ObjectType, registerEnumType } from '@nestjs/graphql';
import { TransactionCategory, TransactionType, TransactionPaymentType } from '@prisma/client';

@ObjectType()
export class TransactionModel {
  @Field(() => Number)
  id: number;

  @Field(() => Number, { nullable: true })
  amount: number | null;

  @Field(() => String, { nullable: true })
  depositor?: string;

  @Field(() => String)
  description: string;

  @Field(() => TransactionType)
  type: TransactionType;

  @Field(() => TransactionCategory, { nullable: true })
  category?: TransactionCategory;

  @Field(() => TransactionPaymentType, { nullable: true })
  withdrawType?: TransactionPaymentType;

  @Field(() => Date)
  createdAt: Date;

  @Field(() => Date)
  updatedAt: Date;
}

registerEnumType(TransactionType, { name: 'TransactionType' });
registerEnumType(TransactionCategory, { name: 'TransactionCategory' });
registerEnumType(TransactionPaymentType, { name: 'TransactionPaymentType' });
