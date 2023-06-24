import { Observable } from 'rxjs';
import { VehicleService } from 'src/vehicle/vehicle.service';
import { EmployeeService } from 'src/employee/employee.service';
import { CustomRequest } from '../interfaces/authRecord.interface';
import { ValidRoles } from 'src/auth/interfaces/valid-roles.interface';
import {
  Inject,
  CallHandler,
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
    if (req.internalError) return next.handle();
    const { entity, entityId, entityName } = req;
    const { vehicleFound, employeeFound, deviceFound } = req;
    // VERIFY WHICH ZONE GOING TO ACCESS
    req.accessZone = deviceFound?.access_zone?._id?.toString() ?? null;
    if (!req.accessZone) {
      throw new BadRequestException('Please allocate an access_zone to device');
    }
    // VERIFY WHERE IS CURRENTLY ENTITY ZONE
    // IF CURRENT_ZONE DOES NOT EXISTS ON ENTITY, CURRENT ZONE IS ACCESS_ZONE
    req.currentEntityZone = entity?.current_zone?.toString();
    if (!req.currentEntityZone) {
      req.currentEntityZone = req.accessZone;
      entityName === ValidRoles.employee
        ? await this.employeeService.updateCurrentZone(entityId, req.accessZone)
        : await this.vehicleService.updateCurrentZone(entityId, req.accessZone);
      return next.handle();
    }
    // IF ZONE DOES NOT ANTIPASSBACK
    if (!deviceFound?.access_zone?.antipassback) return next.handle();
    if (req.currentEntityZone === req.accessZone) {
      req.internalError = true;
      req.internalAuthFlowBody = {
        code: '103',
        message: 'BLOQUEADO POR DOBLE MARCACIÓN',
      };
      return next.handle();
    }
    entityName === ValidRoles.employee
      ? await this.employeeService.updateCurrentZone(entityId, req.accessZone)
      : await this.vehicleService.updateCurrentZone(entityId, req.accessZone);
    return next.handle();
  }
}
