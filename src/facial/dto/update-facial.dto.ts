import { PartialType } from '@nestjs/mapped-types';
import { CreateFacialDto } from './create-facial.dto';

export class UpdateFacialDto extends PartialType(CreateFacialDto) {}
