import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateVehicleDto {
  @IsNotEmpty()
  @IsString()
  public type: string;

  @IsNotEmpty()
  @IsString()
  public plate: string;

  @IsNotEmpty()
  @IsString()
  public model: string;

  @IsNotEmpty()
  @IsString()
  public color: string;

  @IsOptional()
  @IsNotEmpty()
  @IsString()
  public description: string;

  @IsNotEmpty()
  @IsString()
  public fabricator: string;

  @IsOptional()
  @IsNotEmpty()
  @IsString()
  public barcode: string;

  @IsOptional()
  @IsNotEmpty()
  @IsString()
  public profile_picture: string;

  @IsNotEmpty()
  @IsString()
  public access_group: string;
}
