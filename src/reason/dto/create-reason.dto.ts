import { IsNotEmpty, IsString } from 'class-validator';

export class CreateReasonDto {
  @IsNotEmpty()
  @IsString()
  public name: string;
}
