import {
  Entity,
  Index,
  LoadStrategy,
  ManyToOne,
  OnInit,
  PrimaryKey,
  Property,
} from "@mikro-orm/core";
import { Field, ID, ObjectType } from "@nestjs/graphql";
import { IMAGE_NAMESPACE } from "~/namespaces";
import { UnixTimestamp } from "~/types/UnixTimestamp";
import { generateNamespacedUuid } from "~/utils/generateUuid";
import { TitleEntity } from "./TitleEntity";

export enum ImageType {
  POSTER = "poster",
  LOGO = "logo",
  BACKGROUND = "background",
  DISC = "disc",
  BANNER = "banner",
  THUMB = "thumb",
}

@ObjectType()
@Entity({ tableName: "images" })
export class ImageEntity {
  @Field(() => ID)
  @PrimaryKey()
  public id!: string;

  @Field(() => Date)
  @Index()
  @Property({ type: UnixTimestamp })
  public createdAt = Date.now();

  @Field(() => String)
  @Property()
  public path!: string;

  @Field(() => String)
  @Property()
  public originalUrl!: string;

  @Field(() => TitleEntity)
  @ManyToOne({
    entity: () => TitleEntity,
    lazy: true,
    strategy: LoadStrategy.JOINED,
  })
  public title!: TitleEntity;

  @OnInit()
  public onInit(): void {
    if (!this.id) {
      this.id = generateNamespacedUuid(IMAGE_NAMESPACE, this.path);
    }
  }
}
