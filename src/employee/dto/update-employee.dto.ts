import { PartialType } from '@nestjs/mapped-types';
import { CreateEmployeeDto } from './create-employee.dto';
import { IsBooleanString, IsNumber, IsOptional } from 'class-validator';

export class UpdateEmployeeDto extends PartialType(CreateEmployeeDto) {
  @IsOptional()
  @IsBooleanString()
  public is_active?: boolean;

  @IsOptional()
  @IsNumber()
  public fingerprints?: number;
}
