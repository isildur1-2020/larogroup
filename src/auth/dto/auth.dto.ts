import { IsNotEmpty, IsString } from 'class-validator';

export class AuthDto {
  @IsNotEmpty()
  @IsString()
  public readonly username: string;

  @IsNotEmpty()
  @IsString()
  public readonly password: string;
}
