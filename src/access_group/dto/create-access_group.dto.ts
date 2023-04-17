import { IsMongoId, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class CreateAccessGroupDto {
  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  public name: string;

  @IsMongoId()
  public sub_company: string;

  @IsNotEmpty()
  @IsString()
  public device: string;
}
