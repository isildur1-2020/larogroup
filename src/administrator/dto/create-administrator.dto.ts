import {
  IsEmail,
  Matches,
  IsString,
  IsMongoId,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateAdministratorDto {
  @IsEmail()
  public email: string;

  @IsString()
  @MinLength(4)
  @MaxLength(40)
  public username: string;

  @IsString()
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
