import { IsMongoId, IsNotEmpty, IsString } from 'class-validator';

export class CreateCampusDto {
  @IsNotEmpty()
  @IsString()
  public name: string;

  @IsMongoId()
  public sub_company: string;
}
