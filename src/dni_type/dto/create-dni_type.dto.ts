import { IsString } from 'class-validator';

export class CreateDniTypeDto {
  @IsString()
  name: string;
}
