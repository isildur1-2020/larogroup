import {
  Matches,
  IsString,
  IsMongoId,
  MaxLength,
  MinLength,
  IsOptional,
  IsBooleanString,
} from 'class-validator';

export class CreateSuperadminDto {
  @IsOptional()
  @IsBooleanString()
  public readonly is_active: boolean;

  @IsString()
  @MinLength(4)
  @MaxLength(20)
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
