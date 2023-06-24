import { Observable } from 'rxjs';
import { SpanishRoles } from 'src/common/enums';
import { CustomRequest } from '../interfaces/authRecord.interface';
import { CallHandler, NestInterceptor, ExecutionContext } from '@nestjs/common';

export class IsActiveUserInterceptor implements NestInterceptor {
  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> {
    const req: CustomRequest = context.switchToHttp().getRequest();
    if (req.internalError) return next.handle();
    const isUserActive = req.entity.is_active;
    if (!Boolean(isUserActive)) {
      req.internalError = true;
      req.internalAuthFlowBody = {
        code: '101',
        message: `${SpanishRoles[req.entityName]} INACTIVO`,
      };
    }
    return next.handle();
  }
}
