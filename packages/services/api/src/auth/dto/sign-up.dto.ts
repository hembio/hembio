import { IsDefined, IsNotEmpty, MinLength, Validate } from "class-validator";
import { UserExistsValidator } from "~/user/validators/user-exists.validator";

export class SignUpDto {
  @IsDefined()
  @IsNotEmpty()
  @Validate(UserExistsValidator)
  public readonly username!: string;

  @IsDefined()
  @IsNotEmpty()
  @MinLength(8)
  public readonly password!: string;
}
