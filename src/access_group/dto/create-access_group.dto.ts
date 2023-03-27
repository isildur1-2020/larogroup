import { IsNotEmpty, IsString } from 'class-validator';

export class CreateAccessGroupDto {
  @IsNotEmpty()
  @IsString()
  public name: string;
}
