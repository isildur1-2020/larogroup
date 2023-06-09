import { Observable } from 'rxjs';
import { DeviceService } from 'src/device/device.service';
import { CustomRequest } from '../interfaces/authRecord.interface';
import { AuthRecordBody } from '../interfaces/authRecord.interface';
import { AccessGroupService } from 'src/access_group/access_group.service';
import {
  Inject,
  CallHandler,
  HttpException,
  NestInterceptor,
  ExecutionContext,
  HttpStatus,
} from '@nestjs/common';

export class AccessGroupInterceptor implements NestInterceptor {
  constructor(
    @Inject(DeviceService)
    private deviceService: DeviceService,
    @Inject(AccessGroupService)
    private accessGroupService: AccessGroupService,
  ) {}
  async intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Promise<Observable<any>> {
    const req: CustomRequest = context.switchToHttp().getRequest();
    const body: AuthRecordBody = req.body;
    const deviceFound = await this.deviceService.findOneBySN(body.sn);
    const deviceId = deviceFound._id.toString();
    const groupsFound = await this.accessGroupService.findByDevice(deviceId);
    // THE DEVICE DOES NOT BELONGS TO ANY ACCESS GROUP
    if (groupsFound.length === 0) {
      throw new HttpException(
        {
          code: '400',
          vehicle: req.vehicleFound ?? null,
          employee: req.employeeFound ?? null,
          message: 'DISPOSITIVO SIN GRUPO DE ACCESO',
        },
        HttpStatus.OK,
      );
    }
    // DEVICES JUST COULD BELONG TO ONE AN ONLY ONE ACCESS GROUP
    const authorizedGroup = groupsFound[0]._id.toString();
    // EXTRACTING ACCESS GROUPS IDS OF USER
    const userGroups = req.entity.access_group.map((el) => el._id.toString());
    // VERIFYING IF SOME OF THEM ARE THE AUTH GROUP
    const isUserAuthorized = userGroups.some((_id) => _id === authorizedGroup);
    if (!isUserAuthorized) {
      throw new HttpException(
        {
          code: '104',
          vehicle: req.vehicleFound ?? null,
          employee: req.employeeFound ?? null,
          message: 'GRUPO DE ACCESO INVALIDO',
        },
        HttpStatus.OK,
      );
    }
    req.deviceFound = deviceFound;
    req.authorizedGroup = authorizedGroup;
    req.authZone = deviceFound.zone?._id?.toString();
    return next.handle();
  }
}
