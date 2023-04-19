import { IsBooleanString, IsOptional } from 'class-validator';
import { PartialType } from '@nestjs/mapped-types';
import { CreateEmployeeDto } from './create-employee.dto';

export class UpdateEmployeeDto extends PartialType(CreateEmployeeDto) {
  @IsOptional()
  @IsBooleanString()
  public is_active: boolean;
}
