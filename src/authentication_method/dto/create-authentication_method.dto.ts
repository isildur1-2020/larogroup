import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class CreateAuthenticationMethodDto {
  @IsNotEmpty()
  @IsString()
  @MinLength(3)
  public key: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(3)
  public name: string;
}
