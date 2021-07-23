import { EntityRepository, InjectRepository, UserEntity } from "@hembio/core";
import { Injectable } from "@nestjs/common";
import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from "class-validator";

@ValidatorConstraint({ name: "isUserAlreadyExist", async: true })
@Injectable()
export class UserExistsValidator implements ValidatorConstraintInterface {
  public constructor(
    @InjectRepository(UserEntity)
    private readonly userRepo: EntityRepository<UserEntity>,
  ) {}

  public async validate(username: string): Promise<boolean> {
    const userCount = await this.userRepo.count({ username });
    return userCount === 0;
  }

  public defaultMessage(): string {
    return "The username «$value» is already registered.";
  }
}
