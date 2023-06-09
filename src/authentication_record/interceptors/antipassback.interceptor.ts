import { Observable } from 'rxjs';
import { ZoneService } from 'src/zone/zone.service';
import { DeviceService } from 'src/device/device.service';
import { CustomRequest } from '../interfaces/authRecord.interface';
import { AccessGroupService } from 'src/access_group/access_group.service';
import { AuthenticationRecordService } from '../authentication_record.service';
import {
  Inject,
  HttpStatus,
  CallHandler,
  HttpException,
  NestInterceptor,
  ExecutionContext,
} from '@nestjs/common';

export class AntiPassbackInterceptor implements NestInterceptor {
  constructor(
    @Inject(AccessGroupService)
    private accessGroupService: AccessGroupService,
    @Inject(AuthenticationRecordService)
    private authRecordService: AuthenticationRecordService,
    @Inject(DeviceService)
    private deviceService: DeviceService,
    @Inject(ZoneService)
    private zoneService: ZoneService,
  ) {}

  async intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Promise<Observable<any>> {
    const req: CustomRequest = context.switchToHttp().getRequest();
    const { vehicleFound, employeeFound, authZone } = req;
    const { authorizedGroup, deviceFound, entityId } = req;
    // VERIFYING IF IS ANTIPASSBACK LOCAL OR GLOBAL
    let devicesCount = 0;
    let recordFound = null;
    // ** GLOBAL
    if ('zone' in deviceFound) {
      await this.zoneService.documentExists(authZone);
      devicesCount = await this.deviceService.getDevicesCountByZone(authZone);
      if (devicesCount < 2) return next.handle();
      recordFound = await this.authRecordService.findByEntityIdAndZone(
        entityId,
        authZone,
      );
      // console.log('GLOBAL', { deviceFound, recordFound });
    }
    // ** LOCAL
    else {
      devicesCount = await this.accessGroupService.getDevicesCountById(
        authorizedGroup,
      );
      if (devicesCount < 2) return next.handle();
      // VALIDATE ANTIPASSBACK WITH AUTH RECORDS
      recordFound = await this.authRecordService.findByEntityIdAndAccessGroup(
        entityId,
        authorizedGroup,
      );
      // console.log('LOCAL', { deviceFound, recordFound });
    }
    // IF DOES NOT EXISTS ANY RECORD, THEN NEXT HANDLER
    if (recordFound === null) return next.handle();
    const lastDeviceDirectionSaved = recordFound.device.direction.name;
    const currentDeviceDirection = deviceFound.direction.name;
    if (lastDeviceDirectionSaved === currentDeviceDirection) {
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
    return next.handle();
  }
}
