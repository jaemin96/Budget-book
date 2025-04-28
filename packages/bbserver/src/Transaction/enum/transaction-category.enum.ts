import { registerEnumType } from '@nestjs/graphql';

export enum TransactionCategory {
  'salary' = '급여',
  'insurance' = '보험',
  'drink' = '음료',
  'food' = '식비',
  'shopping' = '쇼핑',
  'transport' = '교통비',
  'subscribe' = '구독료',
  'phone' = '통신비',
  'dues' = '회비',
  'present' = '선물',
  'savings' = '저금',
  'Investment' = '재테크',
  'emergencyFund' = '비상금',
  'etc' = '기타',
}
registerEnumType(TransactionCategory, { name: 'TransactionCategory' });
