import { Field, ObjectType } from "@nestjs/graphql";

@ObjectType()
export class IdentityModel {
  @Field(() => String)
  public provider!: string;

  @Field(() => String)
  public externalId!: string;

  @Field(() => String)
  public type!: string;

  @Field(() => String)
  public name!: string;

  @Field(() => String)
  public year!: number;
}
