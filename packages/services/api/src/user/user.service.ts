import {
  EntityRepository,
  InjectRepository,
  UserEntity,
  UserRole,
} from "@hembio/core";
import { Injectable } from "@nestjs/common";

@Injectable()
export class UserService {
  public constructor(
    @InjectRepository(UserEntity)
    private readonly userRepo: EntityRepository<UserEntity>,
  ) {}

  public matchRoles(needed: UserRole[], have: UserRole[]): boolean {
    if (needed.includes(UserRole.ADMIN) && have.includes(UserRole.ADMIN)) {
      return true;
    }
    if (needed.includes(UserRole.USER) && have.includes(UserRole.USER)) {
      return true;
    }
    return false;
  }

  public async findAll(): Promise<UserEntity[]> {
    return this.userRepo.findAll();
  }

  public async findById(id: string): Promise<UserEntity | null> {
    return this.userRepo.findOne(id);
  }
}
