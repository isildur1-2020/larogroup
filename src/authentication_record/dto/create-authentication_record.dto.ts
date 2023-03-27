import { IsMongoId } from 'class-validator';

export class CreateAuthenticationRecordDto {
  @IsMongoId()
  public employee: string;

  @IsMongoId()
  public coordinator: string;

  @IsMongoId()
  public device: string;

  @IsMongoId()
  public authentication_method: string;

  @IsMongoId()
  public reason: string;
}
