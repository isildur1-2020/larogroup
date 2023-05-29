import {
  IsEnum,
  IsString,
  IsMongoId,
  IsOptional,
  IsNotEmpty,
} from 'class-validator';
import { Vehicle } from 'src/vehicle/entities/vehicle.entity';
import { Employee } from 'src/employee/entities/employee.entity';

export class CreateExpulsionDto {
  @IsNotEmpty()
  @IsString()
  public username: string;

  @IsEnum(['vehicle', 'employee'])
  public entity: string;

  @IsOptional()
  @IsMongoId()
  public vehicle: Vehicle;

  @IsOptional()
  @IsMongoId()
  public employee: Employee;
}
