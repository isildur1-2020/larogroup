import * as mongoose from 'mongoose';
import { Device } from 'src/device/entities/device.entity';
import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Direction } from 'src/direction/entities/direction.entity';
import { AuthenticationMethod } from '../../authentication_method/entities/authentication_method.entity';

export type AuthenticationRecordDocument =
  mongoose.HydratedDocument<AuthenticationRecord>;

@Schema({
  timestamps: true,
  versionKey: false,
})
export class AuthenticationRecord {
  @Prop({
    ref: 'Device',
    required: true,
    type: mongoose.Schema.Types.ObjectId,
  })
  public device: Device;

  @Prop({
    required: true,
    type: mongoose.Schema.Types.ObjectId,
  })
  public entity: string;

  @Prop({
    default: null,
  })
  public data: string;

  @Prop({
    required: true,
    ref: 'AuthenticationMethod',
    type: mongoose.Schema.Types.ObjectId,
  })
  public authentication_method: AuthenticationMethod;

  @Prop({
    required: true,
    ref: 'Direction',
    type: mongoose.Schema.Types.ObjectId,
  })
  public direction: Direction;
}

export const AuthenticationRecordSchema =
  SchemaFactory.createForClass(AuthenticationRecord);
