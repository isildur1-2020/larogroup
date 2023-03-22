import {
  IsMongoId,
  IsNotEmpty,
  IsNumberString,
  IsString,
} from 'class-validator';

export class CreateFingerprintDto {
  @IsMongoId()
  public employee: string;

  @IsNotEmpty()
  @IsString()
  public raw: string;

  @IsNotEmpty()
  @IsNumberString()
  public width: number;

  @IsNotEmpty()
  @IsNumberString()
  public height: number;

  @IsNotEmpty()
  @IsNumberString()
  public dpi: number;
}
