import { IsMongoId, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateAuthenticationRecordDto {
  @IsNotEmpty()
  @IsString()
  public sn: string;

  @IsNotEmpty()
  @IsString()
  public data: string;

  @IsNotEmpty()
  @IsString()
  public auth_method_name: string;

  @IsOptional()
  @IsMongoId()
  public employee: string;

  @IsMongoId()
  public reason: string;
}
