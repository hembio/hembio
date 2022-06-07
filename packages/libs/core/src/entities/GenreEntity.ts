import {
  Entity,
  PrimaryKey,
  Unique,
  Property,
  OnInit,
  ManyToMany,
  Collection,
  LoadStrategy,
} from "@mikro-orm/core";
import { Field, ID, ObjectType } from "@nestjs/graphql";
import { GENRE_NAMESPACE } from "~/namespaces";
import { generateNamespacedUuid } from "~/utils/generateUuid";
import { TitleEntity } from "./TitleEntity";

@ObjectType()
@Entity({ tableName: "genres" })
export class GenreEntity {
  @Field(() => ID)
  @PrimaryKey()
  public id!: string;

  @Field(() => String)
  @Property()
  @Unique()
  public slug!: string;

  @Field(() => [TitleEntity])
  @ManyToMany({
    entity: () => TitleEntity,
    lazy: true,
    strategy: LoadStrategy.JOINED,
  })
  public titles = new Collection<TitleEntity>(this);

  @Field(() => String)
  @Property()
  @Unique()
  public name!: string;

  @OnInit()
  public onInit(): void {
    if (!this.id) {
      this.id = generateNamespacedUuid(GENRE_NAMESPACE, this.slug);
    }
  }
}
