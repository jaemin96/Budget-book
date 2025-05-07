import { Field, ObjectType, registerEnumType } from '@nestjs/graphql';
import { TransactionCategory, TransactionType, TransactionPaymentType } from '@prisma/client';

@ObjectType()
export class TransactionModel {
  @Field(() => Number)
  id: number;

  @Field(() => Number, { nullable: true })
  amount: number | null;

  @Field(() => String, { nullable: true })
  depositor?: string | null;

  @Field(() => String)
  description: string;

  @Field(() => TransactionType)
  type: TransactionType;

  @Field(() => TransactionCategory, { nullable: true })
  category?: TransactionCategory | null;

  @Field(() => TransactionPaymentType, { nullable: true })
  paymentType?: TransactionPaymentType | null;

  @Field(() => Date)
  createdAt: Date;

  @Field(() => Date)
  updatedAt: Date;
}

registerEnumType(TransactionType, { name: 'TransactionType' });
registerEnumType(TransactionCategory, { name: 'TransactionCategory' });
registerEnumType(TransactionPaymentType, { name: 'TransactionPaymentType' });
