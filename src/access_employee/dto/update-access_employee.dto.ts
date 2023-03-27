import { PartialType } from '@nestjs/mapped-types';
import { CreateAccessEmployeeDto } from './create-access_employee.dto';

export class UpdateAccessEmployeeDto extends PartialType(CreateAccessEmployeeDto) {}
