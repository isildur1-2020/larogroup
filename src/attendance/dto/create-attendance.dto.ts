import { Device } from 'src/device/entities/device.entity';
import { Vehicle } from 'src/vehicle/entities/vehicle.entity';
import { Employee } from 'src/employee/entities/employee.entity';
import { IsMongoId, IsOptional, IsString } from 'class-validator';

export class CreateAttendanceDto {
  @IsMongoId()
  public device: Device;

  @IsOptional()
  @IsMongoId()
  public vehicle: Vehicle;

  @IsOptional()
  @IsMongoId()
  public employee: Employee;

  @IsString()
  public entity: string;

  @IsMongoId()
  public zone: string;
}
