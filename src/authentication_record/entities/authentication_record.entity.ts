import * as mongoose from 'mongoose';
import { Device } from 'src/device/entities/device.entity';
import { Vehicle } from 'src/vehicle/entities/vehicle.entity';
import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Employee } from 'src/employee/entities/employee.entity';
import { AccessGroup } from 'src/access_group/entities/access_group.entity';
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
    type: mongoose.Schema.Types.ObjectId,
  })
  public device: Device;

  @Prop({
    ref: 'Vehicle',
    type: mongoose.Schema.Types.ObjectId,
  })
  public vehicle: Vehicle;

  @Prop({
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
    required: true,
  })
  public entity: string;

  @Prop({
    required: true,
    ref: 'AccessGroup',
    type: mongoose.Schema.Types.ObjectId,
  })
  public access_group: AccessGroup;
}

export const AuthenticationRecordSchema =
  SchemaFactory.createForClass(AuthenticationRecord);
