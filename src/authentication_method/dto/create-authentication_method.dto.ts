import { IsNotEmpty, IsString } from 'class-validator';

export class CreateAuthenticationMethodDto {
  @IsNotEmpty()
  @IsString()
  public name: string;
}
