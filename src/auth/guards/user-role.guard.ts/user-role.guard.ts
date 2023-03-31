import { Observable } from 'rxjs';
import { Reflector } from '@nestjs/core';
import { META_ROLES } from '../../decorators/protected-rol.decorator';
import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';

@Injectable()
export class UserRoleGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const target = context.getHandler();
    const req = context.switchToHttp().getRequest();
    const validRoles: string[] = this.reflector.get(META_ROLES, target);
    // if(!validRoles ) return true
    const isRoleValid = validRoles.some((el) => el === req?.user?.role?.name);
    if (!isRoleValid) {
      throw new ForbiddenException(
        'This endpoint is forbidden for your user role',
      );
    }
    return true;
  }
}
