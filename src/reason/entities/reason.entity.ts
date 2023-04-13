import { HydratedDocument } from 'mongoose';
import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';

export type ReasonDocument = HydratedDocument<Reason>;

@Schema({
  timestamps: true,
  versionKey: false,
})
export class Reason {
  @Prop({
    required: true,
    unique: true,
  })
  public name: string;
}

export const ReasonSchema = SchemaFactory.createForClass(Reason);
