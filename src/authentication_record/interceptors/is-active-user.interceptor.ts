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

export class IsActiveUserInterceptor implements NestInterceptor {
  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> {
    const req: CustomRequest = context.switchToHttp().getRequest();
    const isUserActive = req.entity.is_active;
    if (!Boolean(isUserActive)) {
      throw new HttpException(
        {
          vehicle: req.vehicleFound ?? null,
          employee: req.employeeFound ?? null,
          message: `${SpanishRoles[req.entityName]} INACTIVO`,
          code: '101',
        },
        HttpStatus.OK,
      );
    }
    return next.handle();
  }
}
