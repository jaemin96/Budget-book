import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { BaseOutput } from 'src/common';
import { AccountModel } from '../model';

@InputType()
export class GetAccountInput {
  @Field(() => String)
  bankName: string;
}

@ObjectType()
export class GetAccountOutput extends BaseOutput {
  @Field(() => AccountModel, { nullable: true })
  account: AccountModel;
}
