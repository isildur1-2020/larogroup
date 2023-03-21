import { IsMongoId, IsNotEmpty, IsString } from 'class-validator';

export class CreateBarcodeDto {
  @IsMongoId()
  public employee: string;

  @IsNotEmpty()
  @IsString()
  public data: string;
}
