import { IsMongoId } from 'class-validator';

export class CreateAccessEmployeeDto {
  @IsMongoId()
  public access_group: string;

  @IsMongoId()
  public employee: string;
}
