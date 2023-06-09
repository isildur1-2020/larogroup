import * as moment from 'moment';
import { Observable } from 'rxjs';
import { SpanishRoles } from 'src/common/enums';
import { CustomRequest } from '../interfaces/authRecord.interface';
import {
  HttpStatus,
  CallHandler,
  HttpException,
  NestInterceptor,
  ExecutionContext,
} from '@nestjs/common';

export class ContractActiveInterceptor implements NestInterceptor {
  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> {
    const req: CustomRequest = context.switchToHttp().getRequest();
    const isInactiveByContract = moment().isAfter(req.entity.contract_end_date);
    if (isInactiveByContract) {
      throw new HttpException(
        {
          code: '102',
          vehicle: req.vehicleFound ?? null,
          employee: req.employeeFound ?? null,
          message: `${SpanishRoles[req.entityName]} BLOQUEADO POR CONTRATO`,
        },
        HttpStatus.OK,
      );
    }
    return next.handle();
  }
}
