import { PartialType } from '@nestjs/mapped-types';
import { CreateAccessGroupDto } from './create-access_group.dto';
import { IsMongoId, IsOptional } from 'class-validator';

export class UpdateAccessGroupDto extends PartialType(CreateAccessGroupDto) {
  @IsOptional()
  @IsMongoId()
  public access_group_id: string;
}
