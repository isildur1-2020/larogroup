import { IsMongoId, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class CreateCompanyDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(7)
  public name: string;

  @IsMongoId()
  public city: string;
}
