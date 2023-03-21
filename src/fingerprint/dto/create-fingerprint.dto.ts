import { IsMongoId, IsNotEmpty, IsString } from 'class-validator';

export class CreateFingerprintDto {
  @IsMongoId()
  public employee: string;

  @IsNotEmpty()
  @IsString()
  public data: string;
}
