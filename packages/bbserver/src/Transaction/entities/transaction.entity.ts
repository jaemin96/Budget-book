import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { Column, Entity } from 'typeorm';
import { BaseEntity } from 'src/common/entity/base.entity';
import { TransactionCategory, TransactionType, TransactionWithdrawType } from '../enum';

@InputType('UserType', { isAbstract: true, description: '입출금 내역 테이블' })
@ObjectType()
@Entity({ schema: 'budget', name: 'transaction' })
export class Transaction extends BaseEntity {
  @Field(() => Number, { description: '금액', nullable: true })
  @Column('varchar')
  amount: number;

  @Field(() => String, { description: '입금인', nullable: true })
  @Column('varchar', { default: null })
  depositor?: string;

  @Field(() => String, { description: '설명', nullable: true })
  @Column('varchar')
  description: string;

  @Field(() => TransactionType, { description: '타입', nullable: false })
  @Column({ type: 'enum', enum: TransactionType })
  type: TransactionType;

  @Field(() => TransactionCategory, { description: '입출금 유형', nullable: true })
  @Column({ type: 'enum', enum: TransactionCategory, default: TransactionCategory.etc })
  category?: TransactionCategory;

  @Field(() => TransactionWithdrawType, { description: '지출 방식', nullable: true })
  @Column({ type: 'enum', enum: TransactionWithdrawType, default: null })
  withdrawType?: TransactionWithdrawType | null;
}
