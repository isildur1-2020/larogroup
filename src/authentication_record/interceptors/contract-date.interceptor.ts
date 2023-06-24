import * as moment from 'moment';
import { Observable } from 'rxjs';
import { SpanishRoles } from 'src/common/enums';
import { CustomRequest } from '../interfaces/authRecord.interface';
import { CallHandler, NestInterceptor, ExecutionContext } from '@nestjs/common';

export class ContractActiveInterceptor implements NestInterceptor {
  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> {
    const req: CustomRequest = context.switchToHttp().getRequest();
    if (req.internalError) return next.handle();
    const isInactiveByContract = moment().isAfter(req.entity.contract_end_date);
    if (isInactiveByContract) {
      req.internalError = true;
      req.internalAuthFlowBody = {
        code: '102',
        message: `${SpanishRoles[req.entityName]} BLOQUEADO POR CONTRATO`,
      };
    }
    return next.handle();
  }
}
