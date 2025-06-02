import { Field, ObjectType } from "@nestjs/graphql";
import { TransactionModel } from "src/Transaction/model";

@ObjectType()
export class AccountModel {
  @Field(() => Number)
  id: number;

  @Field(() => String, { description: "은행명" })
  bankName: string;

  @Field(() => Date)
  createdAt: Date;

  @Field(() => Date)
  updatedAt: Date;

  @Field(() => Date, { nullable: true })
  deletedAt: Date | null;

  @Field(() => Number, { description: "계좌 총 금액 (자산)", defaultValue: 0 })
  totalBalance: number;

  @Field(() => Number, { description: "실제 입출금 가능한 금액", defaultValue: 0 })
  availableBalance: number;

  @Field(() => Number, { description: "적금에 묶여 있는 금액", defaultValue: 0 })
  savingBalance: number;

  @Field(() => Number, { description: "예금에 묶여 있는 금액", defaultValue: 0 })
  fixedDepositBalance: number;

  @Field(() => Number, { description: "투자 금액 (예: CMA, 펀드 등)", defaultValue: 0 })
  investmentBalance: number;

  @Field(() => Number, { description: "출금 예약 및 결제 대기 중인 금액", defaultValue: 0 })
  holdBalance: number;

  @Field(() => [TransactionModel], { nullable: "itemsAndList" })
  outgoingTransactions?: TransactionModel[];

  @Field(() => [TransactionModel], { nullable: "itemsAndList" })
  incomingTransactions?: TransactionModel[];
}
