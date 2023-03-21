import { IsMongoId, IsNotEmpty, IsString } from 'class-validator';

export class CreateRfidDto {
  @IsMongoId()
  public employee: string;

  @IsNotEmpty()
  @IsString()
  public data: string;
}
