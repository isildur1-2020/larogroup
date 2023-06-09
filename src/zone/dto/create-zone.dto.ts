import { IsNotEmpty, IsString } from 'class-validator';

export class CreateZoneDto {
  @IsNotEmpty()
  @IsString()
  public name: string;
}
