import { PartialType } from '@nestjs/mapped-types';
import { CreateDniTypeDto } from './create-dni_type.dto';

export class UpdateDniTypeDto extends PartialType(CreateDniTypeDto) {}
