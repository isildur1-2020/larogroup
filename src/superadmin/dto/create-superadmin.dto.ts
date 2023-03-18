import { IsMongoId, IsNotEmpty, IsString } from 'class-validator';

export class CreateSuperadminDto {
  @IsMongoId()
  public role: string;

  @IsNotEmpty()
  @IsString()
  public username: string;

  @IsNotEmpty()
  @IsString()
  public password: string;

  @IsMongoId()
  public company: string;
}
