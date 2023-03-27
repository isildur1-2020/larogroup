import { PartialType } from '@nestjs/mapped-types';
import { CreateAccessDeviceDto } from './create-access_device.dto';

export class UpdateAccessDeviceDto extends PartialType(CreateAccessDeviceDto) {}
