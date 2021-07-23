import { Entity, ManyToOne, PrimaryKey, Property } from "@mikro-orm/core";
import { ID, Field, ObjectType } from "@nestjs/graphql";
import { UserEntity } from "./UserEntity";

@ObjectType()
@Entity({ tableName: "refresh_tokens" })
export class RefreshTokenEntity {
  @Field(() => ID)
  @PrimaryKey()
  public id!: string;

  @Field(() => Boolean)
  @Property({ nullable: false, default: false })
  public blacklisted!: boolean;

  @Field(() => UserEntity)
  @ManyToOne({ entity: () => UserEntity, nullable: true, lazy: true })
  public user!: UserEntity;

  @Field(() => Number)
  @Property({ nullable: true })
  public expires!: number;

  @Field(() => String)
  @Property({ nullable: false })
  public device!: string;

  @Field(() => String)
  @Property({ nullable: false })
  public ip!: string;
}
