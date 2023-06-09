import { Observable } from 'rxjs';
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
  ) {}

  async intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Promise<Observable<any>> {
    const req: CustomRequest = context.switchToHttp().getRequest();
    const { authorizedGroup, vehicleFound, employeeFound } = req;

    const devicesCount = await this.accessGroupService.findDevicesCountById(
      authorizedGroup,
    );
    console.log(devicesCount);
    if (devicesCount > 1) {
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
      if (recordFound !== null) {
        const lastDeviceDirectionSaved = recordFound.device.direction.name;
        const currentDeviceDirection = req.deviceFound.direction.name;
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
      }
    }
    return next.handle();
  }
}
