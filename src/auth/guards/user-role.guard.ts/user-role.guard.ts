import { Observable } from 'rxjs';
import { Reflector } from '@nestjs/core';
import { META_ROLES } from '../../decorators/protected-rol.decorator';
import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
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

    const isRoleValid = validRoles.some((el) => el === req.user.role.name);
    if (!isRoleValid) {
      throw new UnauthorizedException('No seas veneco');
    }

    return true;
  }
}
