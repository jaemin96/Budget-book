import { Field, InputType, ObjectType } from "@nestjs/graphql";

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

@InputType()
export class BasePaginationInput {
  @Field(() => Number, { nullable: true, defaultValue: 1 })
  page?: number;

  @Field(() => Number, { nullable: true, defaultValue: 10 })
  size?: number;

  @Field(() => String, { nullable: true })
  sortBy?: string;

  @Field(() => String, { nullable: true })
  order?: "ASC" | "DESC";
}

@ObjectType()
export class BasePaginationOutput {
  @Field(() => ErrorOutput, { nullable: true })
  message?: ErrorOutput;

  @Field(() => Number, { nullable: true })
  totalCount?: number;

  @Field(() => Number, { nullable: true })
  totalPages?: number;
}
