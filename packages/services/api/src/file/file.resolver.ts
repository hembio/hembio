import { FileEntity, TitleEntity } from "@hembio/core";
import { Query, Resolver, Args, ResolveField, Parent } from "@nestjs/graphql";
import { FileService } from "./file.service";

@Resolver(() => FileEntity)
export class FileResolver {
  public constructor(private readonly fileService: FileService) {}

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
}
