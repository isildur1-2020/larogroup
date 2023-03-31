import * as mongoose from 'mongoose';
import { Device } from 'src/device/entities/device.entity';
import { Reason } from '../../reason/entities/reason.entity';
import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Employee } from 'src/employee/entities/employee.entity';
import { AuthenticationMethod } from '../../authentication_method/entities/authentication_method.entity';

export type AuthenticationRecordDocument =
  mongoose.HydratedDocument<AuthenticationRecord>;

@Schema({
  timestamps: true,
  versionKey: false,
})
export class AuthenticationRecord {
  @Prop({
    required: true,
    ref: 'Device',
    type: mongoose.Schema.Types.ObjectId,
  })
  public device: Device;

  @Prop({
    required: true,
    ref: 'Employee',
    type: mongoose.Schema.Types.ObjectId,
  })
  public employee: Employee;

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
    ref: 'Reason',
    required: true,
    type: mongoose.Schema.Types.ObjectId,
  })
  public reason: Reason;
}

export const AuthenticationRecordSchema =
  SchemaFactory.createForClass(AuthenticationRecord);
