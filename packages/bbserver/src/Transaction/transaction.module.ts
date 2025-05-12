import { Module } from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { TransactionResolver } from './transaction.resolver';
import { PrismaService } from 'src/Prisma/prisma.service';

@Module({
  imports: [],
  providers: [TransactionService, TransactionResolver, PrismaService],
  exports: [TransactionService],
})
export class TransactionModule {}
