import { Observable } from 'rxjs';
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
  ) {}

  async intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Promise<Observable<any>> {
    const req: CustomRequest = context.switchToHttp().getRequest();
    const { authorizedGroup, vehicleFound, employeeFound, deviceFound } = req;
    // VERIFYING IF IS ANTIPASSBACK LOCAL OR GLOBAL
    let devicesCount = 0;
    // GLOBAL
    if ('zone' in deviceFound) {
      const zoneId = deviceFound.zone._id.toString();
      devicesCount = await this.deviceService.getDevicesCountByZone(zoneId);
    }
    // LOCAL
    else {
      devicesCount = await this.accessGroupService.findDevicesCountById(
        authorizedGroup,
      );
    }
    // TO VALIDATE ANTIPASSBACK MUST EXISTS MORE THAN ONE DEVICE
    if (devicesCount < 2) return next.handle();
    // VALIDATE ANTIPASSBACK WITH AUTH RECORDS
    let recordFound = null;
    if (vehicleFound) {
      recordFound = await this.authRecordService.findByEntityIdAndAccessGroup(
        vehicleFound._id.toString(),
        authorizedGroup,
      );
    } else {
      recordFound = await this.authRecordService.findByEntityIdAndAccessGroup(
        employeeFound._id.toString(),
        authorizedGroup,
      );
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
