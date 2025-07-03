import { Field, ObjectType, registerEnumType } from "@nestjs/graphql";
import { TransactionCategory, TransactionType, TransactionPaymentType } from "@prisma/client";
import { AccountModel } from "src/Account/model";

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

  @Field(() => Number, { nullable: true })
  fromAccountId?: number | null;

  @Field(() => Number, { nullable: true })
  toAccountId?: number | null;

  @Field(() => AccountModel, { nullable: true })
  fromAccount?: AccountModel | null;

  @Field(() => AccountModel, { nullable: true })
  toAccount?: AccountModel | null;
}

registerEnumType(TransactionType, { name: "TransactionType" });
registerEnumType(TransactionCategory, { name: "TransactionCategory" });
registerEnumType(TransactionPaymentType, { name: "TransactionPaymentType" });
