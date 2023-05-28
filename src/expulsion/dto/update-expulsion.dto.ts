import { PartialType } from '@nestjs/mapped-types';
import { CreateExpulsionDto } from './create-expulsion.dto';

export class UpdateExpulsionDto extends PartialType(CreateExpulsionDto) {}
