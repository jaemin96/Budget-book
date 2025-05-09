import { Resolver } from '@nestjs/graphql';
import { AccountService } from './account.service';

@Resolver()
export class AccountResolver {
    constructor(private readonly accountService: AccountService) {}
}