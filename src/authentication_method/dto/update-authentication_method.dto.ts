import { PartialType } from '@nestjs/mapped-types';
import { CreateAuthenticationMethodDto } from './create-authentication_method.dto';

export class UpdateAuthenticationMethodDto extends PartialType(CreateAuthenticationMethodDto) {}
