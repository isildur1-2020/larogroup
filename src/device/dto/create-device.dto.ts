import {
  IsBooleanString,
  IsMongoId,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
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

  @IsString()
  @MinLength(4)
  public zone: string;

  @IsOptional()
  @IsBooleanString()
  public check_attendance: boolean;

  @IsOptional()
  @IsBooleanString()
  public uncheck_attendance: boolean;
}
