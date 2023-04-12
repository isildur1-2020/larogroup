import { IsMongoId, IsNotEmpty, IsString } from 'class-validator';

export class CreateSubCompanyDto {
  @IsString()
  @IsNotEmpty()
  public name: string;

  @IsMongoId()
  public city: string;

  @IsMongoId()
  public company: string;
}
