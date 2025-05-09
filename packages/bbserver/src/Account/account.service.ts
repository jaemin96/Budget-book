import { Injectable } from '@nestjs/common';
import { PrismaService } from '../Prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class AccountService {
    constructor(private readonly prisma: PrismaService) {}
}