import { Request } from 'express';
import { Device } from 'src/device/entities/device.entity';
import { Vehicle } from 'src/vehicle/entities/vehicle.entity';
import { Employee } from 'src/employee/entities/employee.entity';
import { ValidRoles } from 'src/auth/interfaces/valid-roles.interface';

export interface AuthRecordBody {
  sn: string;
  data: string;
  auth_method: string;
}

export interface CustomRequest extends Request {
  deviceFound: Device;
  vehicleFound: Vehicle;
  entityName: ValidRoles;
  employeeFound: Employee;
  authorizedGroup: string;
  authMethodFound: string;
  entity: Vehicle | Employee;
}
