import { IsMongoId } from 'class-validator';

export class CreateAccessDeviceDto {
  @IsMongoId()
  public device: string;

  @IsMongoId()
  public access_group: string;
}
