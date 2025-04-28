import { registerEnumType } from '@nestjs/graphql';

export enum TransactionWithdrawType {
  'credit' = '신용카드',
  'check' = '체크카드',
  'kakaoPay' = '카카오페이',
  'applePay' = '애플페이',
  'cash' = '현금',
  'etc' = '기타',
}
registerEnumType(TransactionWithdrawType, { name: 'TransactionWithdrawType' });
