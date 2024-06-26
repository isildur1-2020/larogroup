import { IsString, IsNotEmpty } from 'class-validator';

export class VerifyTokenDto {
  @IsString()
  @IsNotEmpty()
  public token: string;
}
