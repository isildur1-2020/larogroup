import { IsMongoId, IsNotEmpty, IsString } from 'class-validator';

export class CreateCompanyDto {
  @IsString()
  @IsNotEmpty()
  public name: string;

  @IsMongoId()
  public city: string;

  @IsMongoId()
  public country: string;
}
