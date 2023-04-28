import {
  IsEmail,
  IsString,
  IsMongoId,
  MinLength,
  IsNotEmpty,
  IsOptional,
  IsDateString,
  IsNumberString,
} from 'class-validator';

export class CreateEmployeeDto {
  public _id: string;

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

  @IsOptional()
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

  @IsDateString()
  public contract_end_date: string;

  @IsOptional()
  @IsMongoId()
  public city: string;

  @IsString()
  @IsNotEmpty()
  public barcode: string;

  @IsString()
  @IsNotEmpty()
  public rfid: string;

  @IsOptional()
  @IsString()
  public profile_picture: string;

  @IsNotEmpty()
  @IsString()
  public access_group: string;
}
