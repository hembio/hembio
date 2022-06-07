import { FileEntity, FilterQuery, EntityManager } from "@hembio/core";
import { Injectable } from "@nestjs/common";

@Injectable()
export class FileService {
  public constructor(private readonly em: EntityManager) {}

  public async findOneById(id: string): Promise<FileEntity | null> {
    const repo = this.em.fork().getRepository(FileEntity);
    const file = await repo.findOne(id, { populate: ["title"] });
    return file;
  }

  public async findAllByTitleId(titleId: string): Promise<FileEntity[]> {
    const repo = this.em.fork().getRepository(FileEntity);
    return repo.find({ title: titleId });
  }

  public async findAll(where: FilterQuery<FileEntity>): Promise<FileEntity[]> {
    const repo = this.em.fork().getRepository(FileEntity);
    return repo.find(where);
  }
}
