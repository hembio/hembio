import {
  Entity,
  Index,
  LoadStrategy,
  ManyToOne,
  OnInit,
  PrimaryKey,
  Property,
} from "@mikro-orm/core";
import { Field, ID, ObjectType, Int } from "@nestjs/graphql";
import { PersonEntity } from "./PersonEntity";
import { TitleEntity } from "./TitleEntity";
import { CREDIT_NAMESPACE } from "~/namespaces";
import { generateNamespacedUuid } from "~/utils/generateUuid";

@ObjectType()
@Entity({ tableName: "credits" })
@Index({ properties: ["title", "order"] })
export class CreditEntity {
  @Field(() => ID)
  @PrimaryKey()
  public id!: string;

  @Field(() => Int, { nullable: true })
  @Property()
  @Index()
  public order?: number;

  @Field(() => String, { nullable: true })
  @Property()
  public job?: string;

  @Field(() => String, { nullable: true })
  @Property()
  public character?: string;

  @Field(() => String)
  @Property()
  public department!: string;

  @Field(() => PersonEntity)
  @Index()
  @ManyToOne({
    entity: () => PersonEntity,
    lazy: true,
    strategy: LoadStrategy.JOINED,
  })
  public person!: PersonEntity;

  @Field(() => TitleEntity)
  @Index()
  @ManyToOne({
    entity: () => TitleEntity,
    lazy: true,
    strategy: LoadStrategy.JOINED,
  })
  public title!: TitleEntity;

  @OnInit()
  public onInit(): void {
    if (!this.id) {
      this.id = generateNamespacedUuid(
        CREDIT_NAMESPACE,
        this.title.id +
          "-" +
          this.person.id +
          "-" +
          this.job +
          (this.character ? "-" + this.character : ""),
      );
    }
  }
}
