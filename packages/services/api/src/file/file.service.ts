import { FileEntity, FilterQuery, EntityManager } from "@hembio/core";
import { Injectable } from "@nestjs/common";

@Injectable()
export class FileService {
  public constructor(private readonly em: EntityManager) {}

  public async findOneById(id: string): Promise<FileEntity | null> {
    const em = this.em.fork();
    const file = await em.findOne(FileEntity, id, ["title"]);
    return file;
  }

  public async findAllByTitleId(titleId: string): Promise<FileEntity[]> {
    const em = this.em.fork(true);
    return em.find(FileEntity, { title: titleId });
  }

  public async findAll(where: FilterQuery<FileEntity>): Promise<FileEntity[]> {
    const em = this.em.fork(true);
    return em.find(FileEntity, where);
  }
}
