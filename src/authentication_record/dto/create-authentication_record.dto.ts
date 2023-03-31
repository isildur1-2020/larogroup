import { IsMongoId, IsNotEmpty, IsString } from 'class-validator';

export class CreateAuthenticationRecordDto {
  @IsNotEmpty()
  @IsString()
  public sn: string;

  @IsNotEmpty()
  @IsString()
  public data: string;

  @IsMongoId()
  public authentication_method: string;

  @IsMongoId()
  public reason: string;
}
