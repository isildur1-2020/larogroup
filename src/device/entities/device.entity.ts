import * as mongoose from 'mongoose';
import { Campus } from 'src/campus/entities/campus.entity';
import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';

export type DeviceDocument = mongoose.HydratedDocument<Device>;

@Schema({
  timestamps: true,
  versionKey: false,
})
export class Device {
  public _id: mongoose.Schema.Types.ObjectId;

  @Prop({
    unique: true,
    required: true,
  })
  public name: string;

  @Prop({
    required: true,
  })
  public sn: string;

  @Prop({
    ref: 'Campus',
    required: true,
    type: mongoose.Schema.Types.ObjectId,
  })
  public campus: Campus;
}

export const DeviceSchema = SchemaFactory.createForClass(Device);
