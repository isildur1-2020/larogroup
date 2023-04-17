import { HydratedDocument } from 'mongoose';
import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';

export type DirectionDocument = HydratedDocument<Direction>;

@Schema({
  timestamps: true,
  versionKey: false,
})
export class Direction {
  public _id: string;

  @Prop({
    required: true,
    unique: true,
  })
  public key: string;

  @Prop({
    required: true,
    unique: true,
  })
  public name: string;
}

export const DirectionSchema = SchemaFactory.createForClass(Direction);
