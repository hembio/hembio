import {
  CreditEntity,
  FileEntity,
  TitleEntity,
  TitleGenreLiterals,
  TitleGenreSlugs,
  UserRole,
} from "@hembio/core";
import {
  Args,
  Query,
  Resolver,
  Mutation,
  ResolveField,
  Parent,
  Int,
} from "@nestjs/graphql";
import { IdentityModel } from "./models/identity.model";
import { TitleService } from "./title.service";
import { Auth } from "~/auth/auth.decorator";
import { UpdateMutationModel } from "~/common/models/update-mutation.model";
import { CreditService } from "~/credit/credit.service";
import { FileService } from "~/file/file.service";
import { ImageService } from "~/image/image.service";
import { IndexerService } from "~/indexer/indexer.service";
import { GenreModel } from "~/library/models/genre.model";

@Auth(UserRole.USER)
@Resolver(() => TitleEntity)
export class TitleResolver {
  public constructor(
    private readonly titleService: TitleService,
    private readonly fileService: FileService,
    private readonly creditService: CreditService,
    private readonly indexerService: IndexerService,
    private readonly imageService: ImageService,
  ) {}

  @Query(() => TitleEntity, { name: "title", nullable: true })
  public async getTitle(@Args("id") id: string): Promise<TitleEntity | null> {
    const title = await this.titleService.findOneById(id);
    if (!title) {
      return null;
    }
    return title;
  }

  @Query(() => [TitleEntity], { name: "search" })
  public async search(@Args("query") query: string): Promise<TitleEntity[]> {
    return this.titleService.search(query);
  }

  @ResolveField(() => [FileEntity], { name: "files" })
  public async getFiles(@Parent() title: TitleEntity): Promise<FileEntity[]> {
    return await this.fileService.findAllByTitleId(title.id);
  }

  @ResolveField(() => [IdentityModel], { name: "identify" })
  public async identifyTitle(
    @Parent() title: TitleEntity,
  ): Promise<IdentityModel[]> {
    const results = await this.titleService.identify(title.id);
    return results.map((r) => ({
      provider: r.provider,
      externalId: r.ids.imdb as string,
      type: r.type,
      name: r.name,
      year: r.year,
    }));
  }

  private bitwise(val1: number, val2: number): number {
    const maxInt32Bits = 4294967296; // 2^32
    const val1HighBits = val1 / maxInt32Bits;
    const val1LowBits = val1 % maxInt32Bits;
    const val2HighBits = val2 / maxInt32Bits;
    const val2LowBits = val2 % maxInt32Bits;
    return Math.abs(
      (val1HighBits & val2HighBits) * maxInt32Bits +
        (val1LowBits & val2LowBits),
    );
  }

  @ResolveField(() => [GenreModel], { name: "genres" })
  public async getGenres(@Parent() title: TitleEntity): Promise<GenreModel[]> {
    if (!title.genreBits) {
      return [];
    }
    const genreBits = title.genreBits;
    const genres = TitleGenreSlugs.reduce((acc, slug, idx) => {
      const mask = Math.pow(2, idx);
      const check = this.bitwise(genreBits, mask);
      if (check === mask) {
        return [...acc, { id: idx, slug }];
      }
      return acc;
    }, [] as Array<{ id: number; slug: TitleGenreLiterals }>);
    return genres;
  }

  @ResolveField(() => [CreditEntity], { name: "topBilling" })
  public async getTopBilling(
    @Parent() title: TitleEntity,
    @Args({ name: "take", type: () => Int, nullable: true }) take?: number,
  ): Promise<CreditEntity[]> {
    return await this.creditService.getTopBilling(title.id, take);
  }

  @ResolveField(() => [CreditEntity], { name: "cast" })
  public async getCast(@Parent() title: TitleEntity): Promise<CreditEntity[]> {
    return await this.creditService.getCast(title.id);
  }

  @ResolveField(() => [CreditEntity], { name: "crew" })
  public async getCrew(@Parent() title: TitleEntity): Promise<CreditEntity[]> {
    return await this.creditService.getCrew(title.id);
  }

  @Mutation(() => UpdateMutationModel)
  public async updateCredits(
    @Args({ name: "id", type: () => String }) id: string,
  ): Promise<UpdateMutationModel> {
    try {
      await this.indexerService.updateCredits(id);
    } catch {
      return {};
    }
    return { id };
  }

  @Mutation(() => UpdateMutationModel)
  public async updateMetadata(
    @Args({ name: "id", type: () => String }) id: string,
  ): Promise<UpdateMutationModel> {
    try {
      await this.indexerService.updateMetadata(id);
    } catch {
      return {};
    }
    return { id };
  }

  @Mutation(() => UpdateMutationModel)
  public async updateTitleImages(
    @Args({ name: "id", type: () => String }) id: string,
  ): Promise<UpdateMutationModel> {
    try {
      await this.imageService.updateTitleImages(id);
    } catch {
      return {};
    }
    return { id };
  }

  @Mutation(() => UpdateMutationModel)
  public async deleteTitle(
    @Args({ name: "id", type: () => String }) id: string,
  ): Promise<UpdateMutationModel> {
    try {
      await this.titleService.deleteOneById(id);
    } catch {
      return {};
    }
    return { id };
  }
}
