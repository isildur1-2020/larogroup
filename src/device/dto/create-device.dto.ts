import {
  IsString,
  IsMongoId,
  MinLength,
  IsNotEmpty,
  IsOptional,
  IsBooleanString,
} from 'class-validator';

export class CreateDeviceDto {
  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  public name: string;

  @IsNotEmpty()
  @IsString()
  public sn: string;

  @IsMongoId()
  public campus: string;

  @IsMongoId()
  public direction: string;

  @IsOptional()
  @IsMongoId()
  public zone: string;

  @IsOptional()
  @IsBooleanString()
  public check_attendance: boolean | string;

  @IsOptional()
  @IsBooleanString()
  public uncheck_attendance: boolean | string;
}
