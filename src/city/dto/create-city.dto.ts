import { IsMongoId } from 'class-validator';

export class CreateCityDto {
  @IsMongoId()
  public country: string;
}
