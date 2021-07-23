import {
  Entity,
  Property,
  Unique,
  OneToMany,
  Collection,
  PrimaryKey,
  DateType,
  BeforeCreate,
  Enum,
} from "@mikro-orm/core";
import { Field, ID, ObjectType, registerEnumType } from "@nestjs/graphql";
import slug from "slug";
import { Memoize } from "typescript-memoize";
import { FileEntity } from "./FileEntity";
import { TitleEntity } from "./TitleEntity";
import { LIBRARY_NAMESPACE } from "~/namespaces";
import { generateNamespacedUuid } from "~/utils/generateUuid";
import { globToRxp } from "~/utils/globToRxp";

export enum LibraryType {
  MOVIES = "movies",
  TVSHOWS = "tv-shows",
  MUSIC = "music",
  PODCASTS = "podcasts",
  PHOTOS = "photos",
}

registerEnumType(LibraryType, {
  name: "LibraryType",
});

@ObjectType()
@Entity({ tableName: "libraries" })
export class LibraryEntity {
  @Field(() => ID)
  @PrimaryKey()
  public id!: string;

  @Field(() => Date)
  @Property({ type: DateType })
  public createdAt!: Date;

  @Field(() => String)
  @Property()
  @Unique()
  public slug!: string;

  @Field(() => String)
  @Property()
  public name!: string;

  @Field(() => LibraryType)
  @Enum()
  public type!: LibraryType;

  @Field(() => String)
  @Property()
  public path!: string;

  @Field(() => Boolean)
  @Property()
  public watch = true;

  @Field(() => String)
  @Property()
  public matcher!: string;

  @Memoize()
  public get matcherRegEx(): RegExp {
    return globToRxp(this.matcher, { extended: true });
  }

  @OneToMany(() => TitleEntity, (title) => title.library, {
    lazy: true,
    cascade: [],
  })
  public titles = new Collection<TitleEntity>(this);

  @OneToMany(() => FileEntity, (title) => title.library, {
    lazy: true,
    cascade: [],
  })
  public files = new Collection<FileEntity>(this);

  @BeforeCreate()
  public async beforeCreate(): Promise<void> {
    this.createdAt = new Date();
    if (!this.id) {
      this.id = generateNamespacedUuid(LIBRARY_NAMESPACE, this.name);
    }
    if (!this.slug && this.name) {
      this.slug = slug(this.name);
    }
  }
}
