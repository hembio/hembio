import { IsString } from "class-validator";

export class TwoFactorDto {
  @IsString()
  public readonly userId!: string;

  @IsString()
  public readonly tfaCode!: string;
}
