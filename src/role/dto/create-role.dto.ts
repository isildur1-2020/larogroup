import { IsString, IsEnum } from 'class-validator';

export enum NameEnum {
  superadmin = 'superadmin',
  administrator = 'administrator',
  coordinator = 'coordinator',
  employee = 'employee',
}

export class CreateRoleDto {
  @IsString()
  @IsEnum(NameEnum)
  name: string;
}
