import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateProfilePictureDto {
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  public url: string;
}
