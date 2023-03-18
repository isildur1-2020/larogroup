import { IsEnum, IsString } from 'class-validator';

enum DniTypeEnum {
  'Pasaporte' = 'Pasaporte',
  'Tarjeta de identidad' = 'Tarjeta de identidad',
  'Cédula de ciudadanía' = 'Cédula de ciudadanía',
  'Cédula de extranjería' = 'Cédula de extranjería',
}

export class CreateDniTypeDto {
  @IsString()
  @IsEnum(DniTypeEnum)
  name: string;
}
