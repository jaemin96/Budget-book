import { Field, InputType, ObjectType } from "@nestjs/graphql";
import { BaseOutput } from "../../../src/common";

@InputType()
export class GetAmountSummaryInput {
  @Field(() => Boolean, { nullable: true, description: "더미 필드 (사용되지 않음)" })
  _?: boolean;
}

@ObjectType()
export class GetAmountSummaryOutput extends BaseOutput {
  @Field(() => Number, { description: "계좌 총 금액 (자산)", defaultValue: 0 })
  totalBalance?: number;

  @Field(() => Number, { description: "실제 입출금 가능한 금액", defaultValue: 0 })
  availableBalance?: number;

  @Field(() => Number, { description: "적금에 묶여 있는 금액", defaultValue: 0 })
  savingBalance?: number;

  @Field(() => Number, { description: "예금에 묶여 있는 금액", defaultValue: 0 })
  fixedDepositBalance?: number;

  @Field(() => Number, { description: "투자 금액 (예: CMA, 펀드 등)", defaultValue: 0 })
  investmentBalance?: number;

  @Field(() => Number, { description: "출금 예약 및 결제 대기 중인 금액", defaultValue: 0 })
  holdBalance?: number;
}
