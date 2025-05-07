import { registerEnumType } from '@nestjs/graphql';

export enum TransactionType {
  INCOME = '입금',
  EXPENSE = '출금',
}
registerEnumType(TransactionType, { name: 'TransactionType' });
