import { Observable } from 'rxjs';
import { reverseHex } from '../helpers';
import { VehicleService } from 'src/vehicle/vehicle.service';
import { Vehicle } from 'src/vehicle/entities/vehicle.entity';
import { EmployeeService } from 'src/employee/employee.service';
import { Employee } from 'src/employee/entities/employee.entity';
import { ValidRoles } from 'src/auth/interfaces/valid-roles.interface';
import { AuthMethods } from 'src/authentication_method/enums/auth-methods.enum';
import {
  Inject,
  Injectable,
  CallHandler,
  NestInterceptor,
  ExecutionContext,
  BadRequestException,
} from '@nestjs/common';
import {
  CustomRequest,
  AuthRecordBody,
} from '../interfaces/authRecord.interface';

@Injectable()
export class DiscoverEntityInterceptor implements NestInterceptor {
  constructor(
    @Inject(VehicleService)
    private vehicleService: VehicleService,
    @Inject(EmployeeService)
    private employeeService: EmployeeService,
  ) {}
  async intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Promise<Observable<any>> {
    const req: CustomRequest = context.switchToHttp().getRequest();
    const body: AuthRecordBody = req.body;
    const { auth_method, data } = body;
    let vehicleFound: Vehicle = null;
    let employeeFound: Employee = null;
    switch (auth_method) {
      case AuthMethods.barcode:
        vehicleFound = await this.vehicleService.findOneByBarcode(data);
        if (vehicleFound !== undefined) break;
        employeeFound = await this.employeeService.findOneByBarcode(data);
        if (employeeFound !== undefined) break;
        throw new BadRequestException('Código QR NO existe');
      case AuthMethods.rfid:
        const rfid = reverseHex(data);
        employeeFound = await this.employeeService.findOneByRfid(rfid);
        if (employeeFound !== undefined) break;
        throw new BadRequestException('Tarjeta RFID NO existe');
      case AuthMethods.fingerprint:
        employeeFound = await this.employeeService.findOne(data);
        break;
    }
    req.vehicleFound = vehicleFound;
    req.employeeFound = employeeFound;
    req.entity = vehicleFound ? vehicleFound : employeeFound;
    req.entityName = vehicleFound ? ValidRoles.vehicle : ValidRoles.employee;
    return next.handle();
  }
}
