import {
  IsEmail,
  Matches,
  IsString,
  IsMongoId,
  MaxLength,
  MinLength,
  IsNotEmpty,
  IsOptional,
  IsBooleanString,
} from 'class-validator';

export class CreateAdministratorDto {
  @IsOptional()
  @IsBooleanString()
  public is_active: boolean;

  @IsEmail()
  public email: string;

  @IsString()
  @IsNotEmpty()
  public username: string;

  @IsString()
  @MinLength(8)
  @MaxLength(30)
  @Matches(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
    {
      message:
        'The password must have minimum eight characters, at least one uppercase letter, one lowercase letter, one number and one special character.',
    },
  )
  public password: string;

  @IsMongoId()
  public company: string;
}
