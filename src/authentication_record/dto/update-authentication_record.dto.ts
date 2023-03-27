import { PartialType } from '@nestjs/mapped-types';
import { CreateAuthenticationRecordDto } from './create-authentication_record.dto';

export class UpdateAuthenticationRecordDto extends PartialType(CreateAuthenticationRecordDto) {}
