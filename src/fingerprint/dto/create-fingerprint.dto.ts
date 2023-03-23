import { IsMongoId } from 'class-validator';

export class CreateFingerprintDto {
  @IsMongoId()
  public employee: string;
}
