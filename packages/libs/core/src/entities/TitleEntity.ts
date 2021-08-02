import {
  Entity,
  PrimaryKey,
  ManyToOne,
  Property,
  Unique,
  OneToMany,
  Collection,
  Index,
  DateType,
  BeforeUpdate,
  ManyToMany,
  Enum,
  Cascade,
  LoadStrategy,
  OnInit,
} from "@mikro-orm/core";
import {
  Field,
  ID,
  Int,
  ObjectType,
  registerEnumType,
  Float,
} from "@nestjs/graphql";
import slug from "slug";
import { CreditEntity } from "./CreditEntity";
import { FileEntity } from "./FileEntity";
import { GenreEntity } from "./GenreEntity";
import { ImageEntity } from "./ImageEntity";
import { LibraryEntity } from "./LibraryEntity";
import { TITLE_NAMESPACE } from "~/namespaces";
import { UnixTimestamp } from "~/types/UnixTimestamp";
import { generateNamespacedUuid } from "~/utils/generateUuid";

export enum TitleType {
  MOVIE = "movie",
  TVSHOW = "tv_show",
  MUSIC = "music",
}

registerEnumType(TitleType, {
  name: "TitleType",
});

@ObjectType()
class TitleRatings {
  @Field(() => Float, { nullable: true })
  public imdb?: number;

  @Field(() => Float, { nullable: true })
  public tmdb?: number;

  @Field(() => Float, { nullable: true })
  public rotten?: number;

  @Field(() => Float, { nullable: true })
  public metacritic?: number;

  @Field(() => Float, { nullable: true })
  public trakt?: number;

  @Field(() => Float, { nullable: true })
  public get aggregated(): number | undefined {
    const scores: number[] = [
      this.imdb,
      this.tmdb,
      this.rotten,
      this.metacritic,
      this.trakt,
    ].filter((s): s is number => !!s);
    const len = scores.length;
    const aggregated =
      scores.reduce((acc: number, cur: number) => acc + cur, 0) / len;
    return isNaN(aggregated) ? undefined : aggregated;
  }
}

@ObjectType()
class TitleExternalIds {
  @Field(() => String, { nullable: true })
  public imdb?: string;

  @Field(() => Int, { nullable: true })
  public trakt?: number;

  @Field(() => Int, { nullable: true })
  public tmdb?: number;

  @Field(() => Int, { nullable: true })
  public omdb?: number;

  @Field(() => Int, { nullable: true })
  public tvrage?: number;

  @Field(() => Int, { nullable: true })
  public tvdb?: number;
}

@ObjectType()
@Entity({ tableName: "titles" })
export class TitleEntity {
  @Field(() => ID)
  @PrimaryKey()
  public id!: string;

  @Field(() => TitleType)
  @Enum()
  public type!: TitleType;

  @Field(() => Date)
  @Index()
  @Property({ type: UnixTimestamp })
  public createdAt = Date.now();

  @Field(() => Date)
  @Index()
  @Property({ type: UnixTimestamp })
  public updatedAt = 0;

  @Field(() => String)
  @Property()
  @Unique()
  public slug!: string;

  @Field(() => String)
  @Property()
  @Unique()
  public path!: string;

  @Field(() => TitleExternalIds)
  public get externalIds(): TitleExternalIds {
    const externalIds = new TitleExternalIds();
    if (this.idImdb) {
      externalIds.imdb = this.idImdb;
    }
    if (this.idTrakt) {
      externalIds.trakt = this.idTrakt;
    }
    if (this.idTmdb) {
      externalIds.tmdb = this.idTmdb;
    }
    if (this.idOmdb) {
      externalIds.omdb = this.idOmdb;
    }
    if (this.idTvrage) {
      externalIds.tvrage = this.idTvrage;
    }
    if (this.idTvdb) {
      externalIds.tvdb = this.idTvdb;
    }
    return externalIds;
  }

  public set externalIds(arg: TitleExternalIds) {
    throw new Error(
      "You need to set external IDs directly through the id props",
    );
  }

  @Field(() => TitleRatings)
  public get ratings(): TitleRatings {
    const ratings = new TitleRatings();
    if (this.ratingImdb) {
      ratings.imdb = this.ratingImdb;
    }
    if (this.ratingTmdb) {
      ratings.tmdb = this.ratingTmdb;
    }
    if (this.ratingRotten) {
      ratings.rotten = this.ratingRotten;
    }
    if (this.ratingMetacritic) {
      ratings.metacritic = this.ratingMetacritic;
    }
    if (this.ratingTrakt) {
      ratings.trakt = this.ratingTrakt;
    }
    return ratings;
  }

  @Property({ nullable: true })
  @Index()
  public idImdb?: string;

  @Property({ nullable: true })
  @Index()
  public idTrakt?: number;

  @Property({ nullable: true })
  @Index()
  public idTmdb?: number;

  @Property({ nullable: true })
  @Index()
  public idOmdb?: number;

  @Property({ nullable: true })
  @Index()
  public idTvrage?: number;

  @Property({ nullable: true })
  @Index()
  public idTvdb?: number;

  @Field(() => String, { nullable: true })
  @Property()
  public thumb?: string;

  @Field(() => String, { nullable: true })
  @Property()
  public dominantColor?: string;

  @Field(() => String)
  @Property()
  public name!: string;

  @Field(() => String, { nullable: true })
  @Property()
  public tagline?: string;

  @Field(() => String, { nullable: true })
  @Property()
  public overview?: string;

  @Field(() => String, { nullable: true })
  @Property()
  public certification?: string;

  @Field(() => Int)
  @Property()
  public year!: number;

  @Field(() => Date, { nullable: true })
  @Index()
  @Property({ type: DateType, nullable: true })
  public releaseDate?: Date;

  @Field(() => Int, { nullable: true })
  @Property()
  public runtime?: number;

  @Property({ nullable: true })
  @Index()
  public ratingImdb?: number;

  @Property({ nullable: true })
  @Index()
  public ratingTmdb?: number;

  @Property({ nullable: true })
  @Index()
  public ratingRotten?: number;

  @Property({ nullable: true })
  @Index()
  public ratingMetacritic?: number;

  @Property({ nullable: true })
  @Index()
  public ratingTrakt?: number;

  @ManyToOne({ entity: () => LibraryEntity, nullable: true, lazy: true })
  public library!: LibraryEntity;

  @Field(() => [GenreEntity])
  @ManyToMany({
    entity: () => GenreEntity,
    lazy: false,
    owner: true,
    // strategy: LoadStrategy.SELECT_IN,
  })
  public genres = new Collection<GenreEntity>(this);

  @Field(() => Int)
  @Property({ nullable: true })
  @Index()
  public genreBits?: number;

  @Field(() => [CreditEntity])
  @OneToMany({
    entity: () => CreditEntity,
    mappedBy: "title",
    lazy: true,
    cascade: [Cascade.ALL],
    orphanRemoval: true,
    strategy: LoadStrategy.JOINED,
  })
  public credits = new Collection<CreditEntity>(this);

  @Field(() => [ImageEntity])
  @OneToMany({
    entity: () => CreditEntity,
    mappedBy: "title",
    lazy: true,
    cascade: [Cascade.ALL],
    orphanRemoval: true,
    strategy: LoadStrategy.JOINED,
  })
  public images = new Collection<ImageEntity>(this);

  @Field(() => [FileEntity])
  @OneToMany({
    entity: () => FileEntity,
    mappedBy: "title",
    lazy: true,
    cascade: [Cascade.ALL],
    orphanRemoval: true,
    strategy: LoadStrategy.JOINED,
  })
  public files = new Collection<FileEntity>(this);

  @Property({ nullable: true, persist: false })
  public genreCount?: number;

  @Property({ nullable: true, persist: false })
  public creditsCount?: number;

  @OnInit()
  public onInit(): void {
    if (!this.slug) {
      this.slug = slug(`${this.name}-${this.year}`);
    }
    if (!this.id) {
      this.id = generateNamespacedUuid(TITLE_NAMESPACE, this.slug);
    }
  }

  @BeforeUpdate()
  public async beforeUpdate(): Promise<void> {
    this.updatedAt = Date.now();
  }
}
