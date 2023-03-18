import { IsMongoId, IsNotEmpty, IsString } from 'class-validator';

export class CreateCityDto {
  @IsString()
  @IsNotEmpty()
  public name: string;

  @IsMongoId()
  public country: string;
}
