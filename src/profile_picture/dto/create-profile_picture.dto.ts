import { IsOptional, IsString } from 'class-validator';

export class CreateProfilePictureDto {
  @IsOptional()
  @IsString()
  public url: string;
}
