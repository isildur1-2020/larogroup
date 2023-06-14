import { IsString, IsNotEmpty } from 'class-validator';

export class CreateZoneDto {
  @IsNotEmpty()
  @IsString()
  public name: string;
}
