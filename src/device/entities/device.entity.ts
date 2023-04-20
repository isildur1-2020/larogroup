import * as mongoose from 'mongoose';
import { Campus } from 'src/campus/entities/campus.entity';
import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Direction } from 'src/direction/entities/direction.entity';

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
    index: true,
    unique: true,
    required: true,
  })
  public sn: string;

  @Prop({
    ref: 'Campus',
    required: true,
    type: mongoose.Schema.Types.ObjectId,
  })
  public campus: Campus;

  @Prop({
    default: false,
  })
  public is_online: boolean;

  @Prop({
    ref: 'Direction',
    required: true,
    type: mongoose.Schema.Types.ObjectId,
  })
  public direction: Direction;

  @Prop({
    required: true,
  })
  public zone: string;
}

export const DeviceSchema = SchemaFactory.createForClass(Device);
