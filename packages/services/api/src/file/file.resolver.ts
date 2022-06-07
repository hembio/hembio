import { FileEntity, TitleEntity } from "@hembio/core";
import { Query, Resolver, Args, ResolveField, Parent } from "@nestjs/graphql";
import { IndexerService } from "~/indexer/indexer.service";
import { FileService } from "./file.service";

@Resolver(() => FileEntity)
export class FileResolver {
  public constructor(
    private readonly fileService: FileService,
    private readonly indexerService: IndexerService,
  ) {}

  @Query(() => FileEntity, { name: "file", nullable: true })
  public async file(
    @Args("fileId") fileId: string,
  ): Promise<FileEntity | null> {
    return this.fileService.findOneById(fileId);
  }

  @ResolveField(() => [FileEntity], { name: "files", nullable: true })
  public async getFiles(@Parent() title: TitleEntity): Promise<FileEntity[]> {
    return this.fileService.findAll({ title: title.id });
  }

  @ResolveField(() => Boolean, { name: "probe", nullable: true })
  public async probeFile(@Parent() file: FileEntity): Promise<boolean> {
    return this.indexerService.probeFile(file.id);
  }
}
