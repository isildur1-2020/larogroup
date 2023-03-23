import {
  IsString,
  IsMongoId,
  IsNotEmpty,
  IsBooleanString,
  IsOptional,
} from 'class-validator';

export class CreateCoordinatorDto {
  @IsOptional()
  @IsBooleanString()
  public is_active: boolean;

  @IsOptional()
  @IsMongoId()
  public role: string;

  @IsMongoId()
  public employee: string;

  @IsNotEmpty()
  @IsString()
  public username: string;

  @IsNotEmpty()
  @IsString()
  public password: string;

  @IsMongoId()
  public sub_company: string;

  @IsMongoId()
  public campus: string;
}
