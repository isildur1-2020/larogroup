import { IsMongoId, IsOptional, IsString } from 'class-validator';

export class CreateAuthenticationRecordDto {
  @IsMongoId()
  public device: string;

  @IsOptional()
  @IsString()
  public data: string;

  @IsMongoId()
  public authentication_method: string;

  @IsMongoId()
  public reason: string;
}
