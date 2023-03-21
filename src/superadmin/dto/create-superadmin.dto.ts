import { IsMongoId, IsNotEmpty, IsString } from 'class-validator';

export class CreateSuperadminDto {
  @IsNotEmpty()
  @IsString()
  public username: string;

  @IsNotEmpty()
  @IsString()
  public password: string;

  @IsMongoId()
  public company: string;
}
