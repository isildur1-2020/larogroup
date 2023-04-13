import { IsBooleanString } from 'class-validator';

export class ChangeStatusDto {
  @IsBooleanString()
  public is_online: boolean;
}
