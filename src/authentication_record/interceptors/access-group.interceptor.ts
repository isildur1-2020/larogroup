import { Observable } from 'rxjs';
import { DeviceService } from 'src/device/device.service';
import { CustomRequest } from '../interfaces/authRecord.interface';
import { AuthRecordBody } from '../interfaces/authRecord.interface';
import { AccessGroupService } from 'src/access_group/access_group.service';
import {
  Inject,
  CallHandler,
  NestInterceptor,
  ExecutionContext,
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
    req.deviceFound = await this.deviceService.findOneBySN(body.sn);
    req.deviceFoundId = req.deviceFound._id.toString();
    const groupsFound = await this.accessGroupService.findByDevice(
      req.deviceFoundId,
    );
    // THE DEVICE DOES NOT BELONGS TO ANY ACCESS GROUP
    if (groupsFound.length === 0) {
      req.internalError = true;
      req.internalAuthFlowBody = {
        code: '400',
        message: 'DISPOSITIVO SIN GRUPO DE ACCESO',
      };
      return next.handle();
    }
    // DEVICES JUST COULD BELONG TO ONE AN ONLY ONE ACCESS GROUP
    const authorizedGroup = groupsFound[0]._id.toString();
    // EXTRACTING ACCESS GROUPS IDS OF USER
    const userGroups = req.entity.access_group.map((el) => el._id.toString());
    // VERIFYING IF SOME OF THEM ARE THE AUTH GROUP
    const isUserAuthorized = userGroups.some((_id) => _id === authorizedGroup);
    if (!isUserAuthorized) {
      req.internalError = true;
      req.internalAuthFlowBody = {
        code: '104',
        message: 'GRUPO DE ACCESO INVALIDO',
      };
      return next.handle();
    }
    return next.handle();
  }
}
