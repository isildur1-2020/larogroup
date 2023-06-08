import { Request } from 'express';
import { Vehicle } from 'src/vehicle/entities/vehicle.entity';
import { Employee } from 'src/employee/entities/employee.entity';
import { ValidRoles } from 'src/auth/interfaces/valid-roles.interface';

export interface AuthRecordBody {
  sn: string;
  auth_method: string;
  data: string;
}

export interface CustomRequest extends Request {
  vehicleFound: Vehicle;
  employeeFound: Employee;
  entity: Vehicle | Employee;
  entityName: ValidRoles;
  authorizedGroup: string;
}
