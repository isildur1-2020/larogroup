import {
  IsEmail,
  IsString,
  IsMongoId,
  IsNotEmpty,
  IsOptional,
  IsDateString,
  IsNumberString,
} from 'class-validator';

export class CreateEmployeeDto {
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  public employee_id: string;

  @IsMongoId()
  public dni_type: string;

  @IsNotEmpty()
  @IsString()
  public dni: string;

  @IsNotEmpty()
  @IsString()
  public first_name: string;

  @IsOptional()
  @IsNotEmpty()
  @IsString()
  public second_name: string;

  @IsNotEmpty()
  @IsString()
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

  @IsMongoId()
  public first_category: string;

  @IsOptional()
  @IsMongoId()
  public second_category: string;

  @IsMongoId()
  public sub_company: string;

  @IsMongoId()
  public company: string;

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
  public country: string;

  @IsOptional()
  @IsMongoId()
  public city: string;
}
