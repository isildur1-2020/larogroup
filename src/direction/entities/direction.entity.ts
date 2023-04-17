import { HydratedDocument } from 'mongoose';
import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';

export type DirectionDocument = HydratedDocument<Direction>;

@Schema({
  timestamps: true,
  versionKey: false,
})
export class Direction {
  @Prop({
    required: true,
    unique: true,
  })
  public name: string;
}

export const DirectionSchema = SchemaFactory.createForClass(Direction);
