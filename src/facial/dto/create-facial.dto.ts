import { IsMongoId, IsNotEmpty, IsString } from 'class-validator';

export class CreateFacialDto {
  @IsMongoId()
  public employee: string;

  @IsNotEmpty()
  public data: string;
}
