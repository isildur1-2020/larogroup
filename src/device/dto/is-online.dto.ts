import { IsBooleanString } from 'class-validator';

export class IsOnlineDto {
  @IsBooleanString()
  public is_online: boolean;
}
