import {
  Entity,
  PrimaryKey,
  ManyToOne,
  Unique,
  Property,
  OnInit,
  Enum,
  LoadStrategy,
} from "@mikro-orm/core";
import { Field, ID, Int, ObjectType, registerEnumType } from "@nestjs/graphql";
import { LibraryEntity } from "./LibraryEntity";
import { TitleEntity } from "./TitleEntity";
import { PERSON_NAMESPACE } from "~/namespaces";
import { generateNamespacedUuid } from "~/utils/generateUuid";

export enum Subtitle {
  Swedish = "se",
  English = "en",
}

registerEnumType(Subtitle, {
  name: "Subtitle",
});

@ObjectType()
@Entity({ tableName: "files" })
export class FileEntity {
  @Field(() => ID)
  @PrimaryKey()
  public id!: string;

  @Field(() => String)
  @Property()
  @Unique()
  public path!: string;

  @Field(() => String)
  @Property({ nullable: true })
  public edition?: string;

  @Field(() => String)
  @Property({ nullable: true })
  public mediainfo?: string;

  @Field(() => LibraryEntity)
  @ManyToOne({
    entity: () => LibraryEntity,
    lazy: true,
    strategy: LoadStrategy.JOINED,
  })
  public library!: LibraryEntity;

  @Field(() => TitleEntity)
  @ManyToOne({
    entity: () => TitleEntity,
    lazy: true,
    strategy: LoadStrategy.JOINED,
  })
  public title!: TitleEntity;

  @Field(() => [Subtitle])
  @Enum({
    items: () => Subtitle,
    array: true,
    default: [],
  })
  public subtitles: Subtitle[] = [];

  @Field(() => Int)
  @Property({ nullable: true })
  public ctime?: number;

  @Field(() => Int)
  @Property({ nullable: true })
  public mtime?: number;

  @OnInit()
  public onInit(): void {
    if (!this.id) {
      this.id = generateNamespacedUuid(PERSON_NAMESPACE, this.path);
    }
    if (!this.subtitles) {
      this.subtitles = [];
    }
  }
}
