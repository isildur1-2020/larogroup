import { Observable } from 'rxjs';
import { VehicleService } from 'src/vehicle/vehicle.service';
import { EmployeeService } from 'src/employee/employee.service';
import { CustomRequest } from '../interfaces/authRecord.interface';
import { ValidRoles } from 'src/auth/interfaces/valid-roles.interface';
import {
  Inject,
  HttpStatus,
  CallHandler,
  HttpException,
  NestInterceptor,
  ExecutionContext,
  BadRequestException,
} from '@nestjs/common';

export class AntiPassbackInterceptor implements NestInterceptor {
  constructor(
    @Inject(EmployeeService)
    private employeeService: EmployeeService,
    @Inject(VehicleService)
    private vehicleService: VehicleService,
  ) {}

  async intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Promise<Observable<any>> {
    const req: CustomRequest = context.switchToHttp().getRequest();
    const { vehicleFound, employeeFound, deviceFound, entityId, entityName } =
      req;
    // VERIFY WHERE IS CURRENTLY ENTITY ZONE
    req.currentEntityZone = employeeFound?.current_zone?.toString() ?? null;
    if (!req.currentEntityZone) {
      throw new BadRequestException('Please allocate a current_zone to entity');
    }
    // VERIFY WHICH ZONE GOING TO ACCESS
    req.accessZone = deviceFound?.access_zone?._id?.toString() ?? null;
    if (!req.accessZone) {
      throw new BadRequestException('Please allocate an access_zone to entity');
    }
    if (req.currentEntityZone === req.accessZone) {
      throw new HttpException(
        {
          code: '103',
          vehicle: vehicleFound ?? null,
          employee: employeeFound ?? null,
          message: 'BLOQUEADO POR DOBLE MARCACIÓN',
        },
        HttpStatus.OK,
      );
    }
    entityName === ValidRoles.employee
      ? await this.employeeService.updateCurrentZone(entityId, req.accessZone)
      : await this.vehicleService.updateCurrentZone(entityId, req.accessZone);
    return next.handle();
  }
}
