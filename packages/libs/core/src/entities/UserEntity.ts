import {
  Entity,
  PrimaryKey,
  Property,
  BeforeCreate,
  BeforeUpdate,
  Unique,
  Enum,
  OneToMany,
  DateType,
  Cascade,
} from "@mikro-orm/core";
import { ID, Field, ObjectType, registerEnumType } from "@nestjs/graphql";
import * as bcrypt from "bcrypt";
import { RefreshTokenEntity } from "./RefreshTokenEntity";
import { USER_NAMESPACE } from "~/namespaces";
import { generateNamespacedUuid } from "~/utils/generateUuid";

export enum UserRole {
  ADMIN = "admin",
  USER = "user",
}

registerEnumType(UserRole, {
  name: "UserRole",
});

@ObjectType()
@Entity({ tableName: "users" })
export class UserEntity {
  @Field(() => ID)
  @PrimaryKey()
  public id!: string;

  @Field(() => Date)
  @Property({ type: DateType })
  public createdAt!: Date;

  @Field(() => String)
  @Property()
  @Unique()
  public username!: string;

  @Property()
  public password!: string;

  @Field(() => UserRole)
  @Enum()
  public role!: UserRole;

  @Field(() => RefreshTokenEntity)
  @OneToMany({
    entity: () => RefreshTokenEntity,
    mappedBy: "user",
    lazy: true,
    cascade: [Cascade.ALL],
    orphanRemoval: true,
  })
  public refreshTokens!: RefreshTokenEntity[];

  @BeforeCreate()
  public async beforeCreate(): Promise<void> {
    this.id = generateNamespacedUuid(USER_NAMESPACE, this.username);
    this.password = await bcrypt.hash(this.password, 10);
    this.createdAt = new Date();
  }

  @BeforeUpdate()
  public async beforeUpdate(): Promise<void> {
    this.password = await bcrypt.hash(this.password, 10);
  }

  public async verifyPassword(password: string): Promise<boolean> {
    return bcrypt.compare(password, this.password);
  }
}
