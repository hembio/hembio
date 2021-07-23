import { LibraryEntity, UserRole } from "@hembio/core";
import {
  Query,
  Resolver,
  Args,
  ResolveField,
  Parent,
  Mutation,
} from "@nestjs/graphql";
import { AddLibraryArgs } from "./args/add-library.args";
import { LibraryService } from "./library.service";
import { AddLibraryResponse } from "./models/add-library-response.model";
import { PaginatedTitleResponse } from "./models/paginated-title-response.model";
import { Auth } from "~/auth/auth.decorator";
import { PaginationArgs } from "~/common/args";
import { UpdateMutationModel } from "~/common/models/update-mutation.model";
import { IndexerService } from "~/indexer/indexer.service";
import { GetTitleArgs } from "~/library/args/get-titles.args";
import { TitleService } from "~/title/title.service";

@Auth(UserRole.USER)
@Resolver(() => LibraryEntity)
export class LibraryResolver {
  public constructor(
    private readonly libraryService: LibraryService,
    private readonly titleService: TitleService,
    private readonly indexerService: IndexerService,
  ) {}

  @Query(() => LibraryEntity, { name: "library", nullable: true })
  public getLibrary(@Args("id") id: string): Promise<LibraryEntity | null> {
    return this.libraryService.findOneById(id);
  }

  @Query(() => [LibraryEntity], { name: "libraries" })
  public getLibraries(): Promise<LibraryEntity[]> {
    return this.libraryService.findAll();
  }

  @ResolveField(() => PaginatedTitleResponse, { name: "titles" })
  public async getTitles(
    @Parent() library: LibraryEntity,
    @Args()
    {
      skip,
      take,
      ids,
      name,
      year,
      orderBy = "releaseDate",
      orderDirection = "DESC",
    }: GetTitleArgs,
  ): Promise<PaginatedTitleResponse> {
    const [edges, totalCount] = await this.titleService.findAll({
      ids,
      libraryId: library.id,
      name,
      year,
      skip,
      take,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      orderBy: { [orderBy]: orderDirection } as any,
    });
    return { edges, totalCount };
  }

  @ResolveField(() => PaginatedTitleResponse, { name: "newlyAdded" })
  public async getNewlyAdded(
    @Parent() library: LibraryEntity,
    @Args() { skip, take }: PaginationArgs,
  ): Promise<PaginatedTitleResponse> {
    const [edges, totalCount] = await this.titleService.findAll({
      libraryId: library.id,
      skip,
      take,
      orderBy: { createdAt: "DESC" },
    });
    return { edges, totalCount };
  }

  @Mutation(() => AddLibraryResponse)
  public async addLibrary(
    @Args() { name, type, path }: AddLibraryArgs,
  ): Promise<LibraryEntity | null> {
    const library = await this.libraryService.addLibrary(name, type, path);
    return library;
  }

  @Mutation(() => UpdateMutationModel)
  public async checkLibrary(
    @Args({ name: "id", type: () => String }) id: string,
  ): Promise<UpdateMutationModel> {
    await this.indexerService.checkLibrary(id);
    return { id };
  }
}
