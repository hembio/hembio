import { UserEntity } from "@hembio/core";
import { Args, Query, Resolver } from "@nestjs/graphql";
import { UserService } from "./user.service";

@Resolver(() => UserEntity)
export class UserResolver {
  public constructor(private readonly userService: UserService) {}

  @Query(() => [UserEntity])
  public async users(): Promise<UserEntity[]> {
    return this.userService.findAll();
  }

  @Query(() => UserEntity, { nullable: true })
  public async user(
    @Args("userId") userId: string,
  ): Promise<UserEntity | null> {
    return this.userService.findById(userId);
  }
}
