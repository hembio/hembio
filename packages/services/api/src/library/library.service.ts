import {
  EntityRepository,
  InjectRepository,
  LibraryEntity,
  LibraryType,
} from "@hembio/core";
import { Injectable } from "@nestjs/common";

@Injectable()
export class LibraryService {
  public constructor(
    @InjectRepository(LibraryEntity)
    private readonly libraryRepo: EntityRepository<LibraryEntity>,
  ) {}

  public async findAll(): Promise<LibraryEntity[]> {
    return this.libraryRepo.findAll();
  }

  public async findOneById(id: string): Promise<LibraryEntity | null> {
    return this.libraryRepo.findOne(id);
  }

  public async addLibrary(
    name: string,
    type: LibraryType,
    path: string,
    matcher: string,
  ): Promise<LibraryEntity | null> {
    const library = this.libraryRepo.create({
      name,
      type,
      path,
      matcher,
    });
    try {
      await this.libraryRepo.persistAndFlush(library);
      return library;
    } catch {
      return null;
    }
  }
}
