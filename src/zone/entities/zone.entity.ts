import { HydratedDocument } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export type ZoneDocument = HydratedDocument<Zone>;

@Schema({
  timestamps: true,
  versionKey: false,
})
export class Zone {
  @Prop({
    index: true,
    unique: true,
    required: true,
  })
  public name: string;
}

export const ZoneSchema = SchemaFactory.createForClass(Zone);
