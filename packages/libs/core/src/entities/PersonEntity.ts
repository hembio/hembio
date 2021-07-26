import {
  Entity,
  PrimaryKey,
  Property,
  OnInit,
  OneToMany,
  Collection,
  Index,
  BeforeUpdate,
  Cascade,
  LoadStrategy,
} from "@mikro-orm/core";
import { Field, ID, ObjectType, Int } from "@nestjs/graphql";
import { CreditEntity } from "./CreditEntity";
import { PERSON_NAMESPACE } from "~/namespaces";
import { UnixTimestamp } from "~/types/UnixTimestamp";
import { generateNamespacedUuid } from "~/utils/generateUuid";

@ObjectType()
class PersonExternalIds {
  @Field(() => String, { nullable: true })
  public imdb?: string;

  @Field(() => Int, { nullable: true })
  public tmdb?: number;
}

@ObjectType()
@Entity({ tableName: "people" })
export class PersonEntity {
  @Field(() => ID)
  @PrimaryKey()
  public id!: string;

  @Field(() => Date)
  @Index()
  @Property({ type: UnixTimestamp })
  public createdAt = Date.now();

  @Field(() => Date)
  @Index()
  @Property({ type: UnixTimestamp })
  public updatedAt = 0;

  @Field(() => PersonExternalIds)
  public get externalIds(): PersonExternalIds {
    const externalIds = new PersonExternalIds();
    if (this.idImdb) {
      externalIds.imdb = this.idImdb;
    }
    if (this.idTmdb) {
      externalIds.tmdb = this.idTmdb;
    }
    return externalIds;
  }

  @Field(() => String, { nullable: true })
  @Property({ nullable: true })
  @Index()
  public idImdb?: string;

  @Field(() => String, { nullable: true })
  @Property()
  @Index()
  public idTmdb!: number;

  @Field(() => String)
  @Property()
  public name!: string;

  @Field(() => String, { nullable: true })
  @Property()
  public bio?: string;

  @Field(() => String, { nullable: true })
  @Property()
  public birthday?: string;

  @Field(() => String, { nullable: true })
  @Property()
  public placeOfBirth?: string;

  @Field(() => String, { nullable: true })
  @Index()
  @Property()
  public image?: string;

  @Field(() => [CreditEntity])
  @OneToMany({
    entity: () => CreditEntity,
    mappedBy: "person",
    lazy: true,
    cascade: [Cascade.ALL],
    orphanRemoval: true,
    strategy: LoadStrategy.JOINED,
  })
  public credits = new Collection<CreditEntity>(this);

  @OnInit()
  public onInit(): void {
    if (!this.id) {
      this.id = generateNamespacedUuid(
        PERSON_NAMESPACE,
        this.idTmdb.toString(),
      );
    }
  }

  @BeforeUpdate()
  public async beforeUpdate(): Promise<void> {
    this.updatedAt = Date.now();
  }
}
