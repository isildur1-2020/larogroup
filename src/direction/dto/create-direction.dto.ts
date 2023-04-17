import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class CreateDirectionDto {
  @IsNotEmpty()
  @IsString()
  @MinLength(4)
  public key: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(4)
  public name: string;
}
