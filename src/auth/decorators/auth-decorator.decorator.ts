import { AuthGuard } from '@nestjs/passport';
import { ProtectedRol } from './protected-rol.decorator';
import { UseGuards, applyDecorators } from '@nestjs/common';
import { ValidRoles } from '../interfaces/valid-roles.interface';
import { UserRoleGuard } from '../guards/user-role.guard.ts/user-role.guard';

export const Auth = (...roles: ValidRoles[]) => {
  return applyDecorators(
    ProtectedRol(...roles),
    UseGuards(AuthGuard('jwt'), UserRoleGuard),
  );
};
