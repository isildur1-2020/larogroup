import { IsMongoId, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class CreateDeviceDto {
  @IsNotEmpty()
  @IsString()
  public name: string;

  @IsNotEmpty()
  @IsString()
  public sn: string;

  @IsMongoId()
  public campus: string;

  @IsMongoId()
  public direction: string;

  @IsString()
  @MinLength(4)
  public zone: string;
}
