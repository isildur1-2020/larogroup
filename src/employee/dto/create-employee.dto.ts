import {
  IsEmail,
  IsString,
  IsMongoId,
  MinLength,
  IsNotEmpty,
  IsOptional,
  IsDateString,
  IsNumberString,
  IsArray,
} from 'class-validator';

export class CreateEmployeeDto {
  @IsNotEmpty()
  @IsString()
  public employee_id: string;

  @IsMongoId()
  public dni_type: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  public dni: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(4)
  public first_name: string;

  @IsOptional()
  @IsNotEmpty()
  @IsString()
  public second_name: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(4)
  public first_lastname: string;

  @IsOptional()
  @IsNotEmpty()
  @IsString()
  public second_lastname: string;

  @IsEmail()
  public email: string;

  @IsOptional()
  @IsNumberString()
  public phone: string;

  @IsNotEmpty()
  @IsString()
  public categories: string;

  @IsMongoId()
  public campus: string;

  @IsOptional()
  @IsDateString()
  public contract_start_date: string;

  @IsOptional()
  @IsDateString()
  public contract_end_date: string;

  @IsOptional()
  @IsMongoId()
  public city: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  public barcode: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  public rfid: string;

  @IsString()
  public profile_picture: string;
}
