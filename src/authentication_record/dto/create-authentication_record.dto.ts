import { IsNotEmpty, IsString } from 'class-validator';

export class CreateAuthenticationRecordDto {
  @IsNotEmpty()
  @IsString()
  public sn: string;

  @IsNotEmpty()
  @IsString()
  public data: string;

  @IsNotEmpty()
  @IsString()
  public auth_method: string;
}
