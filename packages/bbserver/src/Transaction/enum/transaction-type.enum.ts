import { registerEnumType } from '@nestjs/graphql';

export enum TransactionType {
  'deposit' = '입금',
  'withdraw' = '출금',
  'cash' = '현금',
}
registerEnumType(TransactionType, { name: 'TransactionType' });
