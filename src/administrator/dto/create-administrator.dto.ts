import {
  IsEmail,
  IsString,
  IsMongoId,
  IsNotEmpty,
  IsOptional,
  IsBooleanString,
  IsStrongPassword,
} from 'class-validator';

export class CreateAdministratorDto {
  @IsOptional()
  @IsBooleanString()
  public is_active: boolean;

  @IsMongoId()
  public role: string;

  @IsEmail()
  public email: string;

  @IsString()
  @IsNotEmpty()
  public username: string;

  @IsStrongPassword()
  public password: string;

  @IsMongoId()
  public company: string;
}
