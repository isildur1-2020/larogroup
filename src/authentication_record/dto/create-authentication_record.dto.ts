import { IsMongoId, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateAuthenticationRecordDto {
  @IsNotEmpty()
  @IsString()
  public sn: string;

  @IsNotEmpty()
  @IsString()
  public data: string;

  @IsMongoId()
  public authentication_method: string;

  @IsOptional()
  @IsMongoId()
  public employee: string;

  @IsMongoId()
  public reason: string;
}
