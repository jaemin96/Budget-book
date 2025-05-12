import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export abstract class ErrorOutput {
  @Field(() => String, { nullable: true })
  code?: string;

  @Field(() => String, { nullable: true })
  message?: string;
}

@ObjectType()
export class BaseOutput {
  @Field(() => ErrorOutput, { nullable: true })
  message?: ErrorOutput;
}
