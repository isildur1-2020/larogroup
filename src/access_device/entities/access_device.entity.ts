import * as mongoose from 'mongoose';
import { Device } from 'src/device/entities/device.entity';
import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { AccessGroup } from '../../access_group/entities/access_group.entity';

export type AccessDeviceDocument = mongoose.HydratedDocument<AccessDevice>;

@Schema({
  timestamps: true,
  versionKey: false,
})
export class AccessDevice {
  @Prop({
    ref: 'Device',
    required: true,
    type: mongoose.Schema.Types.ObjectId,
  })
  public device: Device;

  @Prop({
    required: true,
    ref: 'AccessGroup',
    type: mongoose.Schema.Types.ObjectId,
  })
  public access_group: AccessGroup;
}

export const AccessDeviceSchema = SchemaFactory.createForClass(AccessDevice);
