import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsBooleanString,
} from 'class-validator';

export class CreateZoneDto {
  @IsNotEmpty()
  @IsString()
  public name: string;

  @IsOptional()
  @IsBooleanString()
  public antipassback: boolean;
}
